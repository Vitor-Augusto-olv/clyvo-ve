import { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { usePets } from '../../hooks/usePets';
import { useTodasVacinas } from '../../hooks/useVacinas';
import { useAgendamentos } from '../../hooks/useAgendamentos';
import { useMedicamentos } from '../../hooks/useMedicamentos';
import { diasAte, formatarData, hojeISO, textoPrazo } from '../../utils/datas';

import COLORS from '../../constants/colors';
import { useTheme } from '../../context/ThemeContext';

import {
  MaterialIcons,
  FontAwesome5,
  Ionicons,
} from '@expo/vector-icons';

const statusConfig = {
  ok: { color: '#22C55E', bg: 'rgba(34,197,94,0.12)', icon: 'checkmark-circle' },
  alerta: { color: '#F59E0B', bg: 'rgba(245,158,11,0.14)', icon: 'warning' },
};

export default function Home() {
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS), [COLORS]);
  const router = useRouter();
  const { user } = useAuth();
  const nomeUsuario = user?.user_metadata?.nome ?? '';

  const { data: pets = [], isLoading: l1 } = usePets();
  const { data: vacinas = [], isLoading: l2 } = useTodasVacinas();
  const { data: agendamentos = [], isLoading: l3 } = useAgendamentos();
  const { data: medicamentos = [], isLoading: l4 } = useMedicamentos();

  if (l1 || l2 || l3 || l4) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  const totalPets = pets.length;
  const totalVacinas = vacinas.length;
  const futuros = agendamentos.filter(
    (a) => a.status === 'agendado' && a.data_consulta >= hojeISO()
  );
  const totalConsultas = futuros.length;

  // Próximas ações: o que vence primeiro entre vacinas, consultas e medicamentos
  const candidatas = [
    ...vacinas.map((v) => ({
      id: `v-${v.id}`, data: v.proximo_reforco, icon: 'syringe', iconLib: 'fa5',
      titulo: `Vacina ${v.nome}`, descricao: textoPrazo(v.proximo_reforco, 'Reforço'),
    })),
    ...futuros.map((a) => ({
      id: `a-${a.id}`, data: a.data_consulta, icon: 'local-hospital', iconLib: 'material',
      titulo: a.tipo, descricao: `Agendada para ${formatarData(a.data_consulta)} às ${a.horario}`,
    })),
    ...medicamentos.map((m) => ({
      id: `m-${m.id}`, data: m.proxima_aplicacao, icon: 'medical', iconLib: 'ionicon',
      titulo: m.nome, descricao: textoPrazo(m.proxima_aplicacao, 'Próxima dose'),
    })),
  ];
  const proximasAcoes = candidatas
    .sort((a, b) => a.data.localeCompare(b.data))
    .slice(0, 3)
    .map((a) => ({ ...a, urgente: diasAte(a.data) <= 7 }));

  // Resumo de saúde calculado a partir dos dados reais
  const vacinaProxima = vacinas.some((v) => diasAte(v.proximo_reforco) <= 30);
  const medicamentoProximo = medicamentos.some((m) => diasAte(m.proxima_aplicacao) <= 7);
  const resumoSaude = [
    totalVacinas === 0
      ? { id: 1, label: 'Nenhuma vacina registrada', status: 'alerta' }
      : { id: 1, label: vacinaProxima ? 'Vacina com reforço próximo' : 'Vacinas em dia', status: vacinaProxima ? 'alerta' : 'ok' },
    { id: 2, label: totalConsultas > 0 ? 'Consulta agendada' : 'Sem consulta agendada', status: totalConsultas > 0 ? 'ok' : 'alerta' },
    ...(medicamentos.length > 0
      ? [{ id: 3, label: medicamentoProximo ? 'Medicamento a aplicar' : 'Medicamentos em dia', status: medicamentoProximo ? 'alerta' : 'ok' }]
      : []),
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerText}>
              Olá, {nomeUsuario || 'Tutor'} 👋
            </Text>
            <Text style={styles.headerSubtext}>
              Acompanhe a saúde do seu pet em tempo real
            </Text>
          </View>
          <View style={styles.headerIconBox}>
            <FontAwesome5 name="dog" size={22} color="#fff" />
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalVacinas}</Text>
            <Text style={styles.statLabel}>Vacinas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalPets}</Text>
            <Text style={styles.statLabel}>Pets</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalConsultas}</Text>
            <Text style={styles.statLabel}>Consultas</Text>
          </View>
        </View>
      </View>

      {/* PRÓXIMAS AÇÕES */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardIconBox}>
            <FontAwesome5 name="dog" size={16} color={COLORS.accent} />
          </View>
          <Text style={styles.cardTitle}>Próximas ações</Text>
        </View>

        <View style={styles.cardDivider} />

        {proximasAcoes.length === 0 && (
          <Text style={{ color: COLORS.textLight, textAlign: 'center', padding: 12 }}>
            Nenhuma ação pendente. Registre vacinas, consultas ou medicamentos.
          </Text>
        )}
        {proximasAcoes.map((acao) => (
          <View key={acao.id} style={styles.acaoRow}>
            <View style={[
              styles.acaoIconBox,
              { backgroundColor: acao.urgente ? 'rgba(230,57,99,0.10)' : COLORS.background },
            ]}>
              {acao.iconLib === 'fa5' && (
                <FontAwesome5
                  name={acao.icon}
                  size={14}
                  color={acao.urgente ? COLORS.accent : COLORS.textLight}
                />
              )}
              {acao.iconLib === 'material' && (
                <MaterialIcons
                  name={acao.icon}
                  size={16}
                  color={acao.urgente ? COLORS.accent : COLORS.textLight}
                />
              )}
              {acao.iconLib === 'ionicon' && (
                <Ionicons
                  name={acao.icon}
                  size={16}
                  color={acao.urgente ? COLORS.accent : COLORS.textLight}
                />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.acaoTitulo}>{acao.titulo}</Text>
              <Text style={styles.acaoDescricao}>{acao.descricao}</Text>
            </View>
            {acao.urgente && (
              <View style={styles.urgenteTag}>
                <Text style={styles.urgenteText}>Urgente</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      {/* RESUMO DE SAÚDE */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardIconBox}>
            <Ionicons name="analytics" size={18} color={COLORS.accent} />
          </View>
          <Text style={styles.cardTitle}>Resumo de Saúde</Text>
        </View>

        <View style={styles.cardDivider} />

        {resumoSaude.map((item) => {
          const s = statusConfig[item.status];
          return (
            <View key={item.id} style={[styles.resumoRow, { backgroundColor: s.bg }]}>
              <Ionicons name={s.icon} size={18} color={s.color} />
              <Text style={[styles.resumoText, { color: s.color }]}>{item.label}</Text>
            </View>
          );
        })}
      </View>

      {/* SERVIÇOS */}
      <View style={styles.servicesContainer}>
        <Text style={styles.servicesTitle}>Serviços</Text>

        <TouchableOpacity
          style={styles.serviceButton}
          onPress={() => router.push('/agendar')}
        >
          <View style={styles.serviceContent}>
            <View style={styles.serviceIconBox}>
              <MaterialIcons name="event" size={20} color={COLORS.accent} />
            </View>
            <Text style={styles.serviceText}>Agendar Consulta</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#C7D7EA" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.serviceButton}
          onPress={() => router.push('/vacinas')}
        >
          <View style={styles.serviceContent}>
            <View style={styles.serviceIconBox}>
              <FontAwesome5 name="syringe" size={16} color={COLORS.accent} />
            </View>
            <Text style={styles.serviceText}>Carteira de Vacinação</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#C7D7EA" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.serviceButton}
          onPress={() => router.push('/historico')}
        >
          <View style={styles.serviceContent}>
            <View style={styles.serviceIconBox}>
              <MaterialIcons name="history" size={20} color={COLORS.accent} />
            </View>
            <Text style={styles.serviceText}>Histórico do Pet</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#C7D7EA" />
        </TouchableOpacity>
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const createStyles = (COLORS) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: 25,
    paddingTop: 55,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtext: {
    fontSize: 14,
    color: '#C7D7EA',
    marginTop: 6,
  },
  headerIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 18,
    padding: 16,
    marginTop: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: '#C7D7EA',
    marginTop: 3,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  card: {
    backgroundColor: COLORS.card,
    marginHorizontal: 16,
    marginTop: 20,
    padding: 18,
    borderRadius: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardIconBox: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: 'rgba(230,57,99,0.10)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.title,
  },
  cardDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 14,
  },
  acaoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  acaoIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acaoTitulo: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  acaoDescricao: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  urgenteTag: {
    backgroundColor: 'rgba(230,57,99,0.10)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
  },
  urgenteText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.accent,
  },
  resumoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  resumoText: {
    fontSize: 14,
    fontWeight: '600',
  },
  servicesContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  servicesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.title,
    marginBottom: 12,
  },
  serviceButton: {
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 18,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  serviceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  serviceIconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: 'rgba(230,57,99,0.10)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.title,
  },
});