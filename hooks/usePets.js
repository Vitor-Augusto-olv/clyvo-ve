// hooks/usePets.js
//
// Hooks do TanStack Query para pets. As telas usam só isso,
// nunca chamam o Supabase ou o services/pets.js diretamente.

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as petsService from '../services/pets';
import { useAuth } from '../context/AuthContext';

export function usePets() {
  return useQuery({
    queryKey: ['pets'],
    queryFn: petsService.getPets,
  });
}

export function usePet(id) {
  return useQuery({
    queryKey: ['pets', id],
    queryFn: () => petsService.getPetById(id),
    enabled: !!id,
  });
}

export function useCreatePet() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({ nome, especie, raca, idade }) =>
      petsService.createPet({ userId: user.id, nome, especie, raca, idade }),
    onSuccess: () => {
      // Invalida a lista de pets -> qualquer tela que estiver usando
      // usePets() re-busca os dados automaticamente, sem precisar
      // de reload manual nem setState espalhado.
      queryClient.invalidateQueries({ queryKey: ['pets'] });
    },
  });
}

export function useUpdatePet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...dados }) => petsService.updatePet(id, dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
    },
  });
}

export function useDeletePet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => petsService.deletePet(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
    },
  });
}
