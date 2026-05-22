import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';

import COLORS from '../constants/colors';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const eventos = [
  {
    id: 1,
    tipo: 'consulta',
    titulo: 'Check-up Geral',
    descricao: 'Animal saudável. Peso: 12,4 kg. Dentição em bom estado. Sem alterações.',
    data: '10/04/2026',
    hora: '14:30',
    veterinario: 'Dr. Carlos Mendes',
    clinica: 'ClyvoVet Unidade Centro',
  },
  {
    id: 2,
    tipo: 'vacina',
    titulo: 'Vacina V10 aplicada',
    descricao: 'Aplicação da vacina múltipla canina. Lote LT2026-04A. Sem reações adversas.',
    data: '12/03/2026',
    hora: '10:00',
    veterinario: 'Dr. Carlos Mendes',
    clinica: 'ClyvoVet Unidade Centro',
  },
  {
    id: 3,
    tipo: 'vacina',
    titulo: 'Antirrábica aplicada',
    descricao: 'Aplicação da vacina antirrábica. Lote LT2026-07B. Documento emitido.',
    data: '12/03/2026',
    hora: '10:15',
    veterinario: 'Dr. Carlos Mendes',
    clinica: 'ClyvoVet Unidade Centro',
  },
  {
    id: 4,
    tipo: 'medicamento',
    titulo: 'Simparic administrado',
    descricao: 'Antiparasitário mensal. Próxima dose em 01/06/2026.',
    data: '01/05/2026',
    hora: '08:00',
    veterinario: null,
    clinica: null,
  },
  {
    id: 5,
    tipo: 'consulta',
    titulo: 'Consulta Dermatologia',
    descricao: 'Avaliação de dermatite atópica. Prescrição de shampoo medicamentoso e dieta hipoalergênica.',
    data: '15/02/2026',
    hora: '16:00',
    veterinario: 'Dra. Fernanda Lima',
    clinica: 'ClyvoVet Unidade Centro',
  },
  {
    id: 6,
    tipo: 'medicamento',
    titulo: 'Drontal Plus (vermífugo)',
    descricao: 'Vermifugação semestral. Próxima dose em 01/09/2026.',
    data: '01/03/2026',
    hora: '09:00',
    veterinario: null,
    clinica: null,
  },
];

const tipoConfig = {
  consulta: {
    icon: 'local-hospital',
    iconLib: 'material',
    color: '#3B82F6',
    bg: '#EFF6FF',
    label: 'Consulta',
  },
  vacina: {
    icon: 'syringe',
    iconLib: 'fa5',
    color: '#22C55E',
    bg: '#F0FDF4',
    label: 'Vacina',
  },
  medicamento: {
    icon: 'medical',
    iconLib: 'ionicon',
    color: COLORS.accent,
    bg: '#FFF0F3',
    label: 'Medicamento',
  },
};

function EventIcon({ tipo }) {
  const c = tipoConfig[tipo];
  return (
    <View style={[styles.eventIconBox, { backgroundColor: c.bg }]}>
      {c.iconLib === 'material' && (
        <MaterialIcons name={c.icon} size={18} color={c.color} />
      )}
      {c.iconLib === 'fa5' && (
        <FontAwesome5 name={c.icon} size={15} color={c.color} />
      )}
      {c.iconLib === 'ionicon' && (
        <Ionicons name={c.icon} size={18} color={c.color} />
      )}
    </View>
  );
}

export default function Historico() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Histórico do Pet</Text>
            <Text style={styles.headerSubtitle}>Todos os registros de saúde</Text>
          </View>
          <View style={styles.headerIconBox}>
            <MaterialIcons name="history" size={24} color="#fff" />
          </View>
        </View>

        <View style={styles.legendRow}>
          {Object.entries(tipoConfig).map(([key, val]) => (
            <View key={key} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: val.color }]} />
              <Text style={styles.legendText}>{val.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* TIMELINE */}
      <View style={styles.timeline}>
        {eventos.map((evento, index) => {
          const config = tipoConfig[evento.tipo];
          return (
            <View key={evento.id} style={styles.eventRow}>

              {/* Linha vertical */}
              <View style={styles.timelineLeft}>
                <EventIcon tipo={evento.tipo} />
                {index < eventos.length - 1 && (
                  <View style={styles.timelineLine} />
                )}
              </View>

              {/* Card */}
              <View style={styles.eventCard}>
                <View style={styles.eventCardHeader}>
                  <View>
                    <Text style={styles.eventTitle}>{evento.titulo}</Text>
                    <View style={styles.eventMeta}>
                      <Ionicons name="time-outline" size={12} color={COLORS.textLight} />
                      <Text style={styles.eventMetaText}>{evento.data} às {evento.hora}</Text>
                    </View>
                  </View>
                  <View style={[styles.typeBadge, { backgroundColor: config.bg }]}>
                    <Text style={[styles.typeBadgeText, { color: config.color }]}>
                      {config.label}
                    </Text>
                  </View>
                </View>

                <Text style={styles.eventDesc}>{evento.descricao}</Text>

                {evento.veterinario && (
                  <View style={styles.eventFooter}>
                    <View style={styles.eventFooterItem}>
                      <Ionicons name="person-outline" size={13} color={COLORS.textLight} />
                      <Text style={styles.eventFooterText}>{evento.veterinario}</Text>
                    </View>
                    <View style={styles.eventFooterItem}>
                      <Ionicons name="location-outline" size={13} color={COLORS.textLight} />
                      <Text style={styles.eventFooterText}>{evento.clinica}</Text>
                    </View>
                  </View>
                )}
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
  legendRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 99,
  },
  legendText: {
    fontSize: 12,
    color: '#C7D7EA',
  },
  timeline: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  eventRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 4,
  },
  timelineLeft: {
    alignItems: 'center',
    width: 42,
  },
  eventIconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E5E7EB',
    marginTop: 6,
    marginBottom: 6,
    minHeight: 20,
  },
  eventCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  eventCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  eventMetaText: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  eventDesc: {
    fontSize: 13,
    color: COLORS.textLight,
    lineHeight: 19,
    marginBottom: 10,
  },
  eventFooter: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 10,
    gap: 5,
  },
  eventFooterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  eventFooterText: {
    fontSize: 12,
    color: COLORS.textLight,
  },
});