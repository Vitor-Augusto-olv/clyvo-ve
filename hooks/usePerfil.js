// hooks/usePerfil.js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as service from '../services/perfil';
import { useAuth } from '../context/AuthContext';

export function usePerfil() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['perfil', user?.id],
    queryFn: () => service.getPerfil(user.id),
    enabled: !!user?.id,
  });
}

export function useSavePerfil() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: ({ telefone }) => service.savePerfil({ userId: user.id, telefone }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['perfil'] }),
  });
}
