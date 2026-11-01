-- Clyvo Vet - Migration Sprint 4 (fase 2): medicamentos
-- Rode no SQL Editor do Supabase DEPOIS do schema_sprint4.sql
create table if not exists public.medicamentos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  pet_id uuid not null references public.pets(id) on delete cascade,
  nome text not null,
  dosagem text not null,
  ultima_aplicacao date not null default current_date,
  proxima_aplicacao date not null,
  created_at timestamptz not null default now()
);
create index if not exists idx_medicamentos_pet on public.medicamentos(pet_id);
alter table public.medicamentos enable row level security;
create policy "medicamentos_all_own" on public.medicamentos for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
