// components/LembretesSync.js
// Componente invisível, montado só com o usuário logado:
//  1) mantém os lembretes agendados em sincronia com os dados do Supabase;
//  2) ao tocar numa notificação, abre a aba correspondente em Saúde.
import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useTodasVacinas } from '../hooks/useVacinas';
import { useAgendamentos } from '../hooks/useAgendamentos';
import { useMedicamentos } from '../hooks/useMedicamentos';
import { sincronizarLembretes } from '../services/notificacoes';

export default function LembretesSync() {
  const router = useRouter();
  const { data: vacinas } = useTodasVacinas();
  const { data: agendamentos } = useAgendamentos();
  const { data: medicamentos } = useMedicamentos();

  useEffect(() => {
    if (!vacinas || !agendamentos || !medicamentos) return;
    sincronizarLembretes({ vacinas, agendamentos, medicamentos }).catch(() => {});
  }, [vacinas, agendamentos, medicamentos]);

  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener((resposta) => {
      const destino = resposta.notification.request.content.data?.destino;
      if (destino) {
        router.push({ pathname: '/saude', params: { aba: destino, t: String(Date.now()) } });
      }
    });
    return () => sub.remove();
  }, [router]);

  return null;
}
