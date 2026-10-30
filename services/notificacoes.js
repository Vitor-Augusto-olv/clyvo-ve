// services/notificacoes.js
// Notificações locais do Clyvo Vet: confirmações imediatas (disparadas por ações do
// usuário) e lembretes agendados (consulta, vacina, medicamento).
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { formatarData, paraDate } from '../utils/datas';

const CANAL = 'lembretes';

// Mostra a notificação mesmo com o app aberto (em primeiro plano)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function prepararNotificacoes() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CANAL, {
      name: 'Lembretes de saúde',
      importance: Notifications.AndroidImportance.HIGH,
    });
  }
  const atual = await Notifications.getPermissionsAsync();
  if (atual.granted) return true;
  const pedido = await Notifications.requestPermissionsAsync();
  return pedido.granted;
}

// ---------- notificações imediatas (evento real: ação do usuário) ----------

async function notificarAgora(titulo, corpo, destino) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: { title: titulo, body: corpo, data: { destino } },
      trigger: Platform.OS === 'android' ? { channelId: CANAL } : null,
    });
  } catch (e) {
    // notificação nunca deve quebrar o fluxo principal
  }
}

export function notificarConsultaAgendada({ tipo, dataConsulta, horario, clinica }) {
  return notificarAgora(
    'Consulta agendada ✅',
    `${tipo} em ${formatarData(dataConsulta)} às ${horario} - ${clinica}. Avisaremos 24h antes.`,
    'consultas'
  );
}

export function notificarVacinaRegistrada({ nome, proximoReforco }) {
  return notificarAgora(
    'Vacina registrada 💉',
    `${nome} salva. Lembrete do reforço em ${formatarData(proximoReforco)} agendado.`,
    'vacinas'
  );
}

export function notificarMedicamentoRegistrado({ nome, proximaAplicacao }) {
  return notificarAgora(
    'Medicamento registrado 💊',
    `${nome}: próxima aplicação em ${formatarData(proximaAplicacao)}. Vamos lembrar você.`,
    'medicamentos'
  );
}

// ---------- lembretes agendados ----------

async function agendarEm({ id, titulo, corpo, quando, destino }) {
  if (quando.getTime() <= Date.now()) return; // já passou
  await Notifications.scheduleNotificationAsync({
    identifier: id,
    content: { title: titulo, body: corpo, data: { destino } },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: quando,
      channelId: CANAL,
    },
  });
}

function aMeiaManha(iso, diasAntes = 0) {
  const d = paraDate(iso);
  d.setDate(d.getDate() - diasAntes);
  d.setHours(9, 0, 0, 0);
  return d;
}

// Recria todos os lembretes a partir dos dados atuais (idempotente):
// criar, cancelar ou excluir algo no app reflete aqui automaticamente.
export async function sincronizarLembretes({ vacinas = [], agendamentos = [], medicamentos = [] }) {
  const permitido = await prepararNotificacoes();
  if (!permitido) return 0;

  await Notifications.cancelAllScheduledNotificationsAsync();

  for (const a of agendamentos.filter((x) => x.status === 'agendado')) {
    const [ano, mes, dia] = a.data_consulta.split('-').map(Number);
    const [hh, mm] = a.horario.split(':').map(Number);
    const inicio = new Date(ano, mes - 1, dia, hh, mm);
    const corpo = `${a.tipo} às ${a.horario} - ${a.clinica}`;
    await agendarEm({ id: `consulta-24h-${a.id}`, titulo: 'Consulta amanhã', corpo,
      quando: new Date(inicio.getTime() - 24 * 3600000), destino: 'consultas' });
    await agendarEm({ id: `consulta-1h-${a.id}`, titulo: 'Consulta em 1 hora', corpo,
      quando: new Date(inicio.getTime() - 3600000), destino: 'consultas' });
  }

  for (const v of vacinas) {
    await agendarEm({ id: `vacina-3d-${v.id}`, titulo: 'Reforço de vacina em 3 dias',
      corpo: `${v.nome}: reforço em ${formatarData(v.proximo_reforco)}.`,
      quando: aMeiaManha(v.proximo_reforco, 3), destino: 'vacinas' });
    await agendarEm({ id: `vacina-0d-${v.id}`, titulo: 'Reforço de vacina hoje',
      corpo: `${v.nome}: hoje é o dia do reforço.`,
      quando: aMeiaManha(v.proximo_reforco, 0), destino: 'vacinas' });
  }

  for (const m of medicamentos) {
    await agendarEm({ id: `med-0d-${m.id}`, titulo: 'Hora do medicamento',
      corpo: `${m.nome} (${m.dosagem}): próxima aplicação hoje.`,
      quando: aMeiaManha(m.proxima_aplicacao, 0), destino: 'medicamentos' });
  }

  const pendentes = await Notifications.getAllScheduledNotificationsAsync();
  return pendentes.length;
}
