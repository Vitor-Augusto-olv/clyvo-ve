-- Clyvo Vet - Cancelamento de consulta com prazo mínimo de 24h
-- Rode no SQL Editor do Supabase.

-- 1) O app deixa de poder alterar agendamentos direto: só lê e cria.
--    O cancelamento passa a ser feito exclusivamente pela função abaixo.
drop policy if exists "agend_all_own" on public.agendamentos;

create policy "agend_select_own" on public.agendamentos for select
  using (auth.uid() = user_id);
create policy "agend_insert_own" on public.agendamentos for insert
  with check (auth.uid() = user_id);

-- 2) Função de cancelamento: valida dono, status e antecedência (24h).
create or replace function public.cancelar_agendamento(p_id uuid)
returns void
language plpgsql security definer set search_path = public as $$
declare
  a public.agendamentos%rowtype;
  v_inicio timestamptz;
begin
  select * into a from public.agendamentos
  where id = p_id and user_id = auth.uid();

  if not found then
    raise exception 'agendamento nao encontrado' using errcode = 'P0002';
  end if;

  if a.status <> 'agendado' then
    raise exception 'agendamento nao pode ser cancelado' using errcode = 'P0001';
  end if;

  -- data + horário interpretados no fuso do Brasil
  v_inicio := (a.data_consulta + a.horario::time) at time zone 'America/Sao_Paulo';

  if v_inicio - now() < interval '24 hours' then
    raise exception 'cancelamento so ate 24h antes' using errcode = 'P0001';
  end if;

  update public.agendamentos set status = 'cancelado' where id = p_id;
end $$;

grant execute on function public.cancelar_agendamento(uuid) to authenticated;
