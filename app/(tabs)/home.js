import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import COLORS from '../../constants/colors';

import {
  MaterialIcons,
  FontAwesome5,
  Ionicons,
} from '@expo/vector-icons';

const proximasAcoes = [
  {
    id: 1,
    icon: 'syringe',
    iconLib: 'fa5',
    titulo: 'Vacina V10',
    descricao: 'Reforço em 5 dias',
    urgente: true,
  },
  {
    id: 2,
    icon: 'local-hospital',
    iconLib: 'material',
    titulo: 'Consulta de retorno',
    descricao: 'Agendada para 28/06',
    urgente: false,
  },
  {
    id: 3,
    icon: 'medical',
    iconLib: 'ionicon',
    titulo: 'Vermífugo',
    descricao: 'Próxima dose em 10 dias',
    urgente: false,
  },
];

const resumoSaude = [
  { id: 1, label: 'Vacinas em dia', status: 'ok' },
  { id: 2, label: 'Check-up pendente', status: 'alerta' },
  { id: 3, label: 'Vermífugo em dia', status: 'ok' },
];

const statusConfig = {
  ok: { color: '#22C55E', bg: '#F0FDF4', icon: 'checkmark-circle' },
  alerta: { color: '#F59E0B', bg: '#FFFBEB', icon: 'warning' },
};

export default function Home() {
  const router = useRouter();
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [totalPets, setTotalPets] = useState(0);

  useEffect(() => {
    carregarUsuario();
    carregarPets();
  }, []);

  const carregarUsuario = async () => {
    try {
      const usuario = await AsyncStorage.getItem('@usuarioLogado');
      if (usuario) {
        const dados = JSON.parse(usuario);
        setNomeUsuario(dados.nome);
      }
    } catch (e) {
      console.log('Erro ao carregar usuário');
    }
  };

  const carregarPets = async () => {
    try {
      const petsSalvos = await AsyncStorage.getItem('pets');
      if (petsSalvos) {
        const lista = JSON.parse(petsSalvos);
        setTotalPets(lista.length);
      }
    } catch (e) {
      console.log('Erro ao carregar pets');
    }
  };

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
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Vacinas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalPets}</Text>
            <Text style={styles.statLabel}>Pets</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>2</Text>
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

        {proximasAcoes.map((acao) => (
          <View key={acao.id} style={styles.acaoRow}>
            <View style={[
              styles.acaoIconBox,
              { backgroundColor: acao.urgente ? '#FFF0F3' : COLORS.background },
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

const styles = StyleSheet.create({
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
    backgroundColor: '#fff',
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
    backgroundColor: '#FFF0F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
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
    backgroundColor: '#FFF0F3',
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
    color: COLORS.primary,
    marginBottom: 12,
  },
  serviceButton: {
    backgroundColor: '#fff',
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
    backgroundColor: '#FFF0F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primary,
  },
});