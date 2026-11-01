// hooks/useMedicamentos.js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as service from '../services/medicamentos';
import { useAuth } from '../context/AuthContext';
import { notificarMedicamentoRegistrado } from '../services/notificacoes';

export function useMedicamentos() {
  return useQuery({ queryKey: ['medicamentos'], queryFn: service.getTodosMedicamentos });
}

export function useCreateMedicamento() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: (dados) => service.createMedicamento({ userId: user.id, ...dados }),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['medicamentos'] });
      notificarMedicamentoRegistrado(variables);
    },
  });
}

export function useDeleteMedicamento() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => service.deleteMedicamento(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['medicamentos'] }),
  });
}
