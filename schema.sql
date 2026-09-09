-- ============================================================
-- Clyvo Vet - Schema do banco (Supabase / PostgreSQL)
-- Rode este script inteiro no SQL Editor do Supabase
-- ============================================================

-- Extensão para gerar UUIDs automaticamente
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- Tabela: pets
-- ------------------------------------------------------------
create table if not exists public.pets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nome text not null,
  especie text not null,
  raca text not null,
  idade integer not null check (idade >= 0),
  status text not null default 'Saudável',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Tabela: vacinas
-- Cada vacina pertence a um pet específico (não mais global/mockada)
-- ------------------------------------------------------------
create table if not exists public.vacinas (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  nome text not null,
  data_aplicacao date not null,
  proximo_reforco date not null,
  veterinario text,
  lote text,
  status text not null default 'ok', -- 'ok' | 'alerta'
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Índices úteis
-- ------------------------------------------------------------
create index if not exists idx_pets_user_id on public.pets(user_id);
create index if not exists idx_vacinas_pet_id on public.vacinas(pet_id);
create index if not exists idx_vacinas_user_id on public.vacinas(user_id);

-- ------------------------------------------------------------
-- Trigger para manter updated_at sempre atualizado
-- ------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_pets_updated_at on public.pets;
create trigger trg_pets_updated_at
  before update on public.pets
  for each row execute function public.set_updated_at();

drop trigger if exists trg_vacinas_updated_at on public.vacinas;
create trigger trg_vacinas_updated_at
  before update on public.vacinas
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- Row Level Security (RLS)
-- Garante que cada usuário só vê/edita os próprios dados,
-- mesmo que o código do app tenha algum bug.
-- ------------------------------------------------------------
alter table public.pets enable row level security;
alter table public.vacinas enable row level security;

-- Políticas: pets
create policy "Usuários podem ver seus próprios pets"
  on public.pets for select
  using (auth.uid() = user_id);

create policy "Usuários podem inserir seus próprios pets"
  on public.pets for insert
  with check (auth.uid() = user_id);

create policy "Usuários podem atualizar seus próprios pets"
  on public.pets for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Usuários podem deletar seus próprios pets"
  on public.pets for delete
  using (auth.uid() = user_id);

-- Políticas: vacinas
create policy "Usuários podem ver suas próprias vacinas"
  on public.vacinas for select
  using (auth.uid() = user_id);

create policy "Usuários podem inserir suas próprias vacinas"
  on public.vacinas for insert
  with check (auth.uid() = user_id);

create policy "Usuários podem atualizar suas próprias vacinas"
  on public.vacinas for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Usuários podem deletar suas próprias vacinas"
  on public.vacinas for delete
  using (auth.uid() = user_id);

