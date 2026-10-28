// hooks/useIot.js - leituras da coleira com atualização em tempo real
import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as service from '../services/iot';
import { useAuth } from '../context/AuthContext';

export function useDispositivos() {
  return useQuery({ queryKey: ['dispositivos'], queryFn: service.getDispositivos });
}

export function useCreateDispositivo() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: ({ petId }) => service.createDispositivo({ userId: user.id, petId }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['dispositivos'] }),
  });
}

export function useLeituras(petId) {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ['leituras', petId],
    queryFn: () => service.getLeituras(petId),
    enabled: !!petId,
  });

  // Realtime: cada nova leitura do ESP32 entra no topo da lista sem reload.
  useEffect(() => {
    if (!petId) return;
    return service.subscribeLeituras(petId, (nova) => {
      qc.setQueryData(['leituras', petId], (antigas = []) => [nova, ...antigas].slice(0, 30));
    });
  }, [petId, qc]);

  return query;
}
