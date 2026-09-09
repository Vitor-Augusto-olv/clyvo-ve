// hooks/useVacinas.js

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as vacinasService from '../services/vacinas';
import { useAuth } from '../context/AuthContext';

export function useVacinasByPet(petId) {
  return useQuery({
    queryKey: ['vacinas', petId],
    queryFn: () => vacinasService.getVacinasByPet(petId),
    enabled: !!petId,
  });
}

export function useCreateVacina() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({ petId, nome, dataAplicacao, proximoReforco, veterinario, lote }) =>
      vacinasService.createVacina({
        userId: user.id,
        petId,
        nome,
        dataAplicacao,
        proximoReforco,
        veterinario,
        lote,
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vacinas', variables.petId] });
    },
  });
}

export function useUpdateVacina() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, petId, ...dados }) =>
      vacinasService.updateVacina(id, dados),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vacinas', variables.petId] });
    },
  });
}

export function useDeleteVacina() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }) => vacinasService.deleteVacina(id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vacinas', variables.petId] });
    },
  });
}
