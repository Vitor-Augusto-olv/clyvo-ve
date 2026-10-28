// hooks/useMedicamentos.js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as service from '../services/medicamentos';
import { useAuth } from '../context/AuthContext';

export function useMedicamentos() {
  return useQuery({ queryKey: ['medicamentos'], queryFn: service.getTodosMedicamentos });
}

export function useCreateMedicamento() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: (dados) => service.createMedicamento({ userId: user.id, ...dados }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['medicamentos'] }),
  });
}

export function useDeleteMedicamento() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => service.deleteMedicamento(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['medicamentos'] }),
  });
}
