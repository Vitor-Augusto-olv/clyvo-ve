// hooks/useEventos.js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as service from '../services/eventos';
import { useAuth } from '../context/AuthContext';

export function useEventos(petId) {
  return useQuery({
    queryKey: ['eventos', petId ?? 'all'],
    queryFn: () => service.getEventos(petId),
  });
}

export function useCreateEvento() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: (dados) => service.createEvento({ userId: user.id, ...dados }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['eventos'] }),
  });
}
