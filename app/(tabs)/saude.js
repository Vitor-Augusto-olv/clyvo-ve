import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import { useState } from 'react';
import COLORS from '../../constants/colors';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';

const vacinas = [
  {
    id: 1,
    nome: 'V10 (Múltipla Canina)',
    dataAplicacao: '12/03/2026',
    proximoReforco: '12/03/2027',
    status: 'ok',
    veterinario: 'Dr. Carlos Mendes',
    lote: 'LT2026-04A',
  },
  {
    id: 2,
    nome: 'Antirrábica',
    dataAplicacao: '12/03/2026',
    proximoReforco: '12/03/2027',
    status: 'ok',
    veterinario: 'Dr. Carlos Mendes',
    lote: 'LT2026-07B',
  },
  {
    id: 3,
    nome: 'Gripe Canina (H3N2)',
    dataAplicacao: '01/01/2026',
    proximoReforco: '01/07/2026',
    status: 'alerta',
    veterinario: 'Dra. Fernanda Lima',
    lote: 'LT2025-11C',
  },
];

const consultas = [
  {
    id: 1,
    tipo: 'Check-up Geral',
    data: '10/04/2026',
    veterinario: 'Dr. Carlos Mendes',
    clinica: 'ClyvoVet Unidade Centro',
    observacao: 'Animal saudável, peso ideal de 12,4 kg.',
    status: 'ok',
  },
  {
    id: 2,
    tipo: 'Retorno — Dermatologia',
    data: '28/06/2026',
    veterinario: 'Dra. Fernanda Lima',
    clinica: 'ClyvoVet Unidade Centro',
    observacao: 'Acompanhamento de dermatite atópica.',
    status: 'agendado',
  },
];

const medicamentos = [
  {
    id: 1,
    nome: 'Simparic (antipulgas)',
    dosagem: '1 comprimido/mês',
    ultimaAplicacao: '01/05/2026',
    proximaAplicacao: '01/06/2026',
    status: 'ok',
  },
  {
    id: 2,
    nome: 'Drontal Plus (vermífugo)',
    dosagem: '1 comprimido',
    ultimaAplicacao: '01/03/2026',
    proximaAplicacao: '01/09/2026',
    status: 'ok',
  },
];

function StatusBadge({ status }) {
  const config = {
    ok: { color: '#22C55E', bg: '#F0FDF4', label: 'Em dia' },
    alerta: { color: '#F59E0B', bg: '#FFFBEB', label: 'Atenção' },
    agendado: { color: '#3B82F6', bg: '#EFF6FF', label: 'Agendado' },
  };
  const c = config[status] || config.ok;
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <View style={[styles.badgeDot, { backgroundColor: c.color }]} />
      <Text style={[styles.badgeText, { color: c.color }]}>{c.label}</Text>
    </View>
  );
}

export default function Saude() {
  const [abaAtiva, setAbaAtiva] = useState('vacinas');

  const abas = [
    { key: 'vacinas', label: 'Vacinas', icon: 'medkit' },
    { key: 'consultas', label: 'Consultas', icon: 'calendar' },
    { key: 'medicamentos', label: 'Medicamentos', icon: 'medical' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Saúde do Pet</Text>
            <Text style={styles.headerSubtitle}>Acompanhe tudo em um só lugar</Text>
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
            <Text style={styles.statNumber}>2</Text>
            <Text style={styles.statLabel}>Consultas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>2</Text>
            <Text style={styles.statLabel}>Remédios</Text>
          </View>
        </View>
      </View>

      {/* ABAS */}
      <View style={styles.tabsContainer}>
        {abas.map((aba) => (
          <TouchableOpacity
            key={aba.key}
            style={[styles.tab, abaAtiva === aba.key && styles.tabActive]}
            onPress={() => setAbaAtiva(aba.key)}
          >
            <Ionicons
              name={aba.icon}
              size={16}
              color={abaAtiva === aba.key ? COLORS.accent : COLORS.textLight}
            />
            <Text style={[styles.tabText, abaAtiva === aba.key && styles.tabTextActive]}>
              {aba.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* VACINAS */}
      {abaAtiva === 'vacinas' && (
        <View style={styles.section}>
          {vacinas.map((v) => (
            <View key={v.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardIconBox}>
                  <FontAwesome5 name="syringe" size={16} color={COLORS.accent} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{v.nome}</Text>
                </View>
                <StatusBadge status={v.status} />
              </View>

              <View style={styles.cardDivider} />

              <View style={styles.infoRow}>
                <View style={styles.infoCol}>
                  <Text style={styles.infoLabel}>Aplicada em</Text>
                  <Text style={styles.infoValue}>{v.dataAplicacao}</Text>
                </View>
                <View style={styles.infoCol}>
                  <Text style={styles.infoLabel}>Próximo reforço</Text>
                  <Text style={styles.infoValue}>{v.proximoReforco}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoCol}>
                  <Text style={styles.infoLabel}>Veterinário</Text>
                  <Text style={styles.infoValue}>{v.veterinario}</Text>
                </View>
                <View style={styles.infoCol}>
                  <Text style={styles.infoLabel}>Lote</Text>
                  <Text style={styles.infoValue}>{v.lote}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* CONSULTAS */}
      {abaAtiva === 'consultas' && (
        <View style={styles.section}>
          {consultas.map((c) => (
            <View key={c.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardIconBox}>
                  <MaterialIcons name="local-hospital" size={18} color={COLORS.accent} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{c.tipo}</Text>
                </View>
                <StatusBadge status={c.status} />
              </View>

              <View style={styles.cardDivider} />

              <View style={styles.infoRow}>
                <View style={styles.infoCol}>
                  <Text style={styles.infoLabel}>Data</Text>
                  <Text style={styles.infoValue}>{c.data}</Text>
                </View>
                <View style={styles.infoCol}>
                  <Text style={styles.infoLabel}>Veterinário</Text>
                  <Text style={styles.infoValue}>{c.veterinario}</Text>
                </View>
              </View>

              <View style={styles.infoFull}>
                <Text style={styles.infoLabel}>Clínica</Text>
                <Text style={styles.infoValue}>{c.clinica}</Text>
              </View>

              <View style={styles.observacaoBox}>
                <Ionicons name="document-text-outline" size={14} color={COLORS.textLight} />
                <Text style={styles.observacaoText}>{c.observacao}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* MEDICAMENTOS */}
      {abaAtiva === 'medicamentos' && (
        <View style={styles.section}>
          {medicamentos.map((m) => (
            <View key={m.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardIconBox}>
                  <Ionicons name="medical" size={18} color={COLORS.accent} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{m.nome}</Text>
                </View>
                <StatusBadge status={m.status} />
              </View>

              <View style={styles.cardDivider} />

              <View style={styles.infoRow}>
                <View style={styles.infoCol}>
                  <Text style={styles.infoLabel}>Última aplicação</Text>
                  <Text style={styles.infoValue}>{m.ultimaAplicacao}</Text>
                </View>
                <View style={styles.infoCol}>
                  <Text style={styles.infoLabel}>Próxima aplicação</Text>
                  <Text style={styles.infoValue}>{m.proximaAplicacao}</Text>
                </View>
              </View>

              <View style={styles.infoFull}>
                <Text style={styles.infoLabel}>Dosagem</Text>
                <Text style={styles.infoValue}>{m.dosagem}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

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
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#C7D7EA',
    marginTop: 5,
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
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 5,
  },
  tabActive: {
    backgroundColor: COLORS.background,
  },
  tabText: {
    fontSize: 13,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  tabTextActive: {
    color: COLORS.accent,
    fontWeight: '700',
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
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
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 14,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoCol: {
    flex: 1,
  },
  infoFull: {
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  observacaoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 12,
    gap: 8,
    marginTop: 4,
  },
  observacaoText: {
    fontSize: 13,
    color: COLORS.textLight,
    flex: 1,
    lineHeight: 18,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 99,
    gap: 5,
  },
  badgeDot: {
    width: 7,
    height: 7,
    borderRadius: 99,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
});