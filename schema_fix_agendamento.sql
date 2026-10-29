-- Impede dois agendamentos ativos na mesma clínica, dia e horário.

-- 1) Remove duplicatas de teste já existentes (mantém o mais antigo)
delete from public.agendamentos a
using public.agendamentos b
where a.status = 'agendado' and b.status = 'agendado'
  and a.clinica = b.clinica
  and a.data_consulta = b.data_consulta
  and a.horario = b.horario
  and a.created_at > b.created_at;

-- 2) Garante a regra no banco
create unique index if not exists uq_agendamento_horario_ativo
  on public.agendamentos (clinica, data_consulta, horario)
  where status = 'agendado';