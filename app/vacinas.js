import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';

import COLORS from '../constants/colors';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';

const vacinas = [
  {
    id: 1,
    nome: 'V10 (Múltipla Canina)',
    descricao: 'Protege contra 10 doenças, incluindo Parvovirose e Cinomose.',
    dataAplicacao: '12/03/2026',
    proximoReforco: '12/03/2027',
    veterinario: 'Dr. Carlos Mendes',
    clinica: 'ClyvoVet Unidade Centro',
    lote: 'LT2026-04A',
    status: 'ok',
  },
  {
    id: 2,
    nome: 'Antirrábica',
    descricao: 'Vacina obrigatória contra o vírus da raiva.',
    dataAplicacao: '12/03/2026',
    proximoReforco: '12/03/2027',
    veterinario: 'Dr. Carlos Mendes',
    clinica: 'ClyvoVet Unidade Centro',
    lote: 'LT2026-07B',
    status: 'ok',
  },
  {
    id: 3,
    nome: 'Gripe Canina (H3N2)',
    descricao: 'Proteção contra influenza canina.',
    dataAplicacao: '01/01/2026',
    proximoReforco: '01/07/2026',
    veterinario: 'Dra. Fernanda Lima',
    clinica: 'ClyvoVet Unidade Norte',
    lote: 'LT2025-11C',
    status: 'alerta',
  },
];

const statusConfig = {
  ok: { color: '#22C55E', bg: '#F0FDF4', label: 'Em dia', icon: 'checkmark-circle' },
  alerta: { color: '#F59E0B', bg: '#FFFBEB', label: 'Reforço próximo', icon: 'warning' },
  vencida: { color: COLORS.accent, bg: '#FFF0F3', label: 'Vencida', icon: 'alert-circle' },
};

export default function Vacinas() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Carteira de Vacinação</Text>
            <Text style={styles.headerSubtitle}>Registros oficiais do seu pet</Text>
          </View>
          <View style={styles.headerIconBox}>
            <FontAwesome5 name="syringe" size={20} color="#fff" />
          </View>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>3</Text>
            <Text style={styles.summaryLabel}>Total</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryNumber, { color: '#86EFAC' }]}>2</Text>
            <Text style={styles.summaryLabel}>Em dia</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryNumber, { color: '#FDE68A' }]}>1</Text>
            <Text style={styles.summaryLabel}>Atenção</Text>
          </View>
        </View>
      </View>

      {/* CARDS */}
      <View style={styles.section}>
        {vacinas.map((v) => {
          const s = statusConfig[v.status];
          return (
            <View key={v.id} style={styles.card}>

              <View style={styles.cardTop}>
                <View style={styles.cardIconBox}>
                  <FontAwesome5 name="syringe" size={16} color={COLORS.accent} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.vaccineName}>{v.nome}</Text>
                  <Text style={styles.vaccineDesc}>{v.descricao}</Text>
                </View>
              </View>

              <View style={[styles.statusBanner, { backgroundColor: s.bg }]}>
                <Ionicons name={s.icon} size={16} color={s.color} />
                <Text style={[styles.statusText, { color: s.color }]}>{s.label}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Aplicada em</Text>
                  <Text style={styles.infoValue}>{v.dataAplicacao}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Próximo reforço</Text>
                  <Text style={styles.infoValue}>{v.proximoReforco}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Veterinário</Text>
                  <Text style={styles.infoValue}>{v.veterinario}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Lote</Text>
                  <Text style={styles.infoValue}>{v.lote}</Text>
                </View>
              </View>

              <View style={styles.clinicaRow}>
                <Ionicons name="location-outline" size={14} color={COLORS.textLight} />
                <Text style={styles.clinicaText}>{v.clinica}</Text>
              </View>

            </View>
          );
        })}
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
  headerTitle: {
    fontSize: 26,
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
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 18,
    padding: 16,
    marginTop: 20,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#C7D7EA',
    marginTop: 3,
  },
  summaryDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
  },
  cardIconBox: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#FFF0F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vaccineName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 3,
  },
  vaccineDesc: {
    fontSize: 13,
    color: COLORS.textLight,
    lineHeight: 18,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 14,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginBottom: 14,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  infoItem: {
    width: '45%',
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
  clinicaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.background,
    padding: 10,
    borderRadius: 10,
  },
  clinicaText: {
    fontSize: 13,
    color: COLORS.textLight,
  },
});