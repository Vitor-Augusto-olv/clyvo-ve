-- ============================================================
-- Clyvo Vet - Migration Sprint 4 (rode no SQL Editor do Supabase)
-- Adiciona: perfis, agendamentos, eventos clínicos (histórico),
-- dispositivos IoT, leituras IoT e mensagens da IA.
-- Pré-requisito: schema.sql da Sprint 3 já aplicado (pets, vacinas).
-- ============================================================

-- ---------- perfis (telefone, antes salvo no AsyncStorage) ----------
create table if not exists public.perfis (
  user_id uuid primary key references auth.users(id) on delete cascade,
  telefone text,
  updated_at timestamptz not null default now()
);

-- ---------- agendamentos (antes no AsyncStorage) ----------
create table if not exists public.agendamentos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  pet_id uuid references public.pets(id) on delete set null,
  tipo text not null,
  clinica text not null,
  data_consulta date not null,
  horario text not null,
  status text not null default 'agendado', -- agendado | concluido | cancelado
  created_at timestamptz not null default now()
);

-- ---------- eventos clínicos (tela Histórico) ----------
create table if not exists public.eventos_clinicos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  pet_id uuid not null references public.pets(id) on delete cascade,
  tipo text not null, -- consulta | vacina | medicamento
  titulo text not null,
  descricao text,
  data_evento timestamptz not null default now(),
  veterinario text,
  clinica text,
  created_at timestamptz not null default now()
);

-- ---------- dispositivos IoT (coleira ESP32 vinculada a um pet) ----------
create table if not exists public.dispositivos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  pet_id uuid not null references public.pets(id) on delete cascade,
  nome text not null default 'Coleira PetSense',
  token text not null unique default encode(gen_random_bytes(16), 'hex'),
  created_at timestamptz not null default now()
);

-- ---------- leituras IoT ----------
create table if not exists public.leituras_iot (
  id bigint generated always as identity primary key,
  dispositivo_id uuid not null references public.dispositivos(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  pet_id uuid not null references public.pets(id) on delete cascade,
  temperatura numeric(4,1) not null,
  bpm integer not null,
  alerta boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- mensagens da IA (chat + alertas proativos) ----------
create table if not exists public.mensagens_ia (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  pet_id uuid references public.pets(id) on delete cascade,
  papel text not null,   -- user | assistant
  origem text not null default 'chat', -- chat | regra (alerta proativo)
  conteudo text not null,
  lida boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_agend_user on public.agendamentos(user_id);
create index if not exists idx_eventos_pet on public.eventos_clinicos(pet_id);
create index if not exists idx_leituras_pet_data on public.leituras_iot(pet_id, created_at desc);
create index if not exists idx_msgs_user_data on public.mensagens_ia(user_id, created_at);

-- ---------- RLS: cada usuário só enxerga o que é dele ----------
alter table public.perfis enable row level security;
alter table public.agendamentos enable row level security;
alter table public.eventos_clinicos enable row level security;
alter table public.dispositivos enable row level security;
alter table public.leituras_iot enable row level security;
alter table public.mensagens_ia enable row level security;

create policy "perfis_all_own" on public.perfis for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "agend_all_own" on public.agendamentos for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "eventos_all_own" on public.eventos_clinicos for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "disp_all_own" on public.dispositivos for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "msgs_all_own" on public.mensagens_ia for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
-- leituras: o app só lê; quem grava é a função abaixo (ESP32)
create policy "leituras_select_own" on public.leituras_iot for select
  using (auth.uid() = user_id);

-- ---------- Função chamada pelo ESP32 (sem login) ----------
-- O ESP32 envia o token do dispositivo. A função valida o token,
-- aplica as regras de alerta e grava a leitura. Não expõe tabelas.
create or replace function public.registrar_leitura(
  p_token text, p_temperatura numeric, p_bpm integer
) returns json
language plpgsql security definer set search_path = public as $$
declare
  d public.dispositivos%rowtype;
  v_alerta boolean;
begin
  select * into d from public.dispositivos where token = p_token;
  if not found then
    raise exception 'token invalido' using errcode = '28000';
  end if;

  -- Regras de alerta (cães adultos): febre > 39.5 C, BPM fora de 50-180
  v_alerta := p_temperatura > 39.5 or p_bpm < 50 or p_bpm > 180;

  insert into public.leituras_iot(dispositivo_id, user_id, pet_id, temperatura, bpm, alerta)
  values (d.id, d.user_id, d.pet_id, p_temperatura, p_bpm, v_alerta);

  return json_build_object('ok', true, 'alerta', v_alerta);
end $$;

grant execute on function public.registrar_leitura(text, numeric, integer) to anon, authenticated;

-- ---------- Realtime (app recebe leituras e mensagens ao vivo) ----------
alter publication supabase_realtime add table public.leituras_iot;
alter publication supabase_realtime add table public.mensagens_ia;
