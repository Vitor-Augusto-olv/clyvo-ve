// hooks/useAgendamentos.js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as service from '../services/agendamentos';
import { useAuth } from '../context/AuthContext';
import { notificarConsultaAgendada } from '../services/notificacoes';

export function useAgendamentos() {
  return useQuery({ queryKey: ['agendamentos'], queryFn: service.getAgendamentos });
}

export function useCreateAgendamento() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: (dados) => service.createAgendamento({ userId: user.id, ...dados }),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['agendamentos'] });
      notificarConsultaAgendada(variables);
    },
  });
}

export function useCancelAgendamento() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => service.cancelAgendamento(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['agendamentos'] }),
  });
}
