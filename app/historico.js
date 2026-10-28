import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import COLORS from '../constants/colors';
import { useState } from 'react';
import PetChips from '../components/PetChips';
import { usePets } from '../hooks/usePets';
import { useVacinasByPet } from '../hooks/useVacinas';
import { useAgendamentos } from '../hooks/useAgendamentos';
import { useMedicamentos } from '../hooks/useMedicamentos';
import { useEventos } from '../hooks/useEventos';
import { formatarData } from '../utils/datas';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

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
  const [petSelecionado, setPetSelecionado] = useState(null);
  const { data: pets = [], isLoading: carregandoPets } = usePets();
  const petId = petSelecionado ?? pets[0]?.id;

  const { data: vacinas = [] } = useVacinasByPet(petId);
  const { data: agendamentos = [] } = useAgendamentos();
  const { data: medicamentos = [] } = useMedicamentos();
  const { data: registros = [] } = useEventos(petId);

  // Junta tudo que aconteceu com o pet numa linha do tempo única (mais recente primeiro)
  const eventos = [
    ...vacinas.map((v) => ({
      id: `v-${v.id}`, tipo: 'vacina', chave: v.data_aplicacao,
      titulo: `${v.nome} aplicada`,
      descricao: `Aplicação da vacina ${v.nome}.${v.lote ? ` Lote ${v.lote}.` : ''} Próximo reforço em ${formatarData(v.proximo_reforco)}.`,
      data: formatarData(v.data_aplicacao), hora: '',
      veterinario: v.veterinario, clinica: null,
    })),
    ...medicamentos.filter((m) => m.pet_id === petId).map((m) => ({
      id: `m-${m.id}`, tipo: 'medicamento', chave: m.ultima_aplicacao,
      titulo: `${m.nome} administrado`,
      descricao: `Dosagem: ${m.dosagem}. Próxima dose em ${formatarData(m.proxima_aplicacao)}.`,
      data: formatarData(m.ultima_aplicacao), hora: '',
      veterinario: null, clinica: null,
    })),
    ...agendamentos.filter((a) => a.pet_id === petId && a.status !== 'cancelado').map((a) => ({
      id: `a-${a.id}`, tipo: 'consulta', chave: a.data_consulta,
      titulo: a.tipo,
      descricao: `Consulta agendada na ${a.clinica}.`,
      data: formatarData(a.data_consulta), hora: a.horario,
      veterinario: null, clinica: null,
    })),
    ...registros.map((r) => ({
      id: `e-${r.id}`, tipo: tipoConfig[r.tipo] ? r.tipo : 'consulta',
      chave: r.data_evento.slice(0, 10),
      titulo: r.titulo, descricao: r.descricao || '',
      data: formatarData(r.data_evento.slice(0, 10)),
      hora: new Date(r.data_evento).toTimeString().slice(0, 5),
      veterinario: r.veterinario, clinica: r.clinica,
    })),
  ].sort((x, y) => y.chave.localeCompare(x.chave));

  if (carregandoPets) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

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

      <PetChips pets={pets} selectedId={petId} onSelect={setPetSelecionado} />

      {/* TIMELINE */}
      <View style={styles.timeline}>
        {eventos.length === 0 && (
          <Text style={{ color: COLORS.textLight, textAlign: 'center', padding: 20 }}>
            Nenhum registro de saúde para este pet ainda.
          </Text>
        )}
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
                      <Text style={styles.eventMetaText}>{evento.hora ? `${evento.data} às ${evento.hora}` : evento.data}</Text>
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