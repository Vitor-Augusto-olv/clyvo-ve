import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { useState, useMemo, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import PetChips from '../../components/PetChips';
import { usePets } from '../../hooks/usePets';
import { useVacinasByPet } from '../../hooks/useVacinas';
import { useAgendamentos, useCancelAgendamento } from '../../hooks/useAgendamentos';
import { useMedicamentos, useCreateMedicamento, useDeleteMedicamento } from '../../hooks/useMedicamentos';
import { brParaISO, diasAte, formatarData, horasAte } from '../../utils/datas';
import COLORS from '../../constants/colors';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';

function StatusBadge({ status }) {
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS), [COLORS]);
  const config = {
    ok: { color: '#22C55E', bg: 'rgba(34,197,94,0.12)', label: 'Realizada' },
    alerta: { color: '#F59E0B', bg: 'rgba(245,158,11,0.14)', label: 'Atenção' },
    agendado: { color: '#3B82F6', bg: 'rgba(59,130,246,0.12)', label: 'Agendado' },
  };
  const c = config[status] || config.agendado;
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <View style={[styles.badgeDot, { backgroundColor: c.color }]} />
      <Text style={[styles.badgeText, { color: c.color }]}>{c.label}</Text>
    </View>
  );
}

export default function Saude() {
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS), [COLORS]);
  const [abaAtiva, setAbaAtiva] = useState('vacinas');

  // Ao tocar numa notificação, abre direto a aba correspondente
  const { aba, t } = useLocalSearchParams();
  useEffect(() => {
    if (['vacinas', 'consultas', 'medicamentos'].includes(aba)) setAbaAtiva(aba);
  }, [aba, t]);
  const [petSelecionado, setPetSelecionado] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [medNome, setMedNome] = useState('');
  const [medDosagem, setMedDosagem] = useState('');
  const [medProxima, setMedProxima] = useState('');

  const { data: pets = [], isLoading: carregandoPets } = usePets();
  const petId = petSelecionado ?? pets[0]?.id;

  const { data: vacinasDb = [], isLoading: carregandoVacinas } = useVacinasByPet(petId);
  const { data: agendamentosDb = [] } = useAgendamentos();
  const { data: medicamentosDb = [] } = useMedicamentos();
  const criarMedicamento = useCreateMedicamento();
  const excluirMedicamento = useDeleteMedicamento();
  const cancelarConsulta = useCancelAgendamento();

  // Adapta os registros do banco para o formato que as telas já usavam
  const vacinas = vacinasDb.map((v) => ({
    id: v.id,
    nome: v.nome,
    dataAplicacao: formatarData(v.data_aplicacao),
    proximoReforco: formatarData(v.proximo_reforco),
    status: diasAte(v.proximo_reforco) <= 30 ? 'alerta' : 'ok',
    veterinario: v.veterinario || '—',
    lote: v.lote || '—',
  }));

  const consultas = agendamentosDb
    .filter((a) => a.pet_id === petId && a.status !== 'cancelado')
    .map((a) => ({
      id: a.id,
      tipo: a.tipo,
      data: formatarData(a.data_consulta),
      horario: a.horario,
      clinica: a.clinica,
      observacao: '—',
      status: 'agendado',
      horas: horasAte(a.data_consulta, a.horario),
    }));

  const medicamentos = medicamentosDb
    .filter((m) => m.pet_id === petId)
    .map((m) => ({
      id: m.id,
      nome: m.nome,
      dosagem: m.dosagem,
      ultimaAplicacao: formatarData(m.ultima_aplicacao),
      proximaAplicacao: formatarData(m.proxima_aplicacao),
      status: diasAte(m.proxima_aplicacao) <= 7 ? 'alerta' : 'ok',
    }));

  const salvarMedicamento = async () => {
    const iso = brParaISO(medProxima);
    if (!medNome.trim() || !medDosagem.trim() || !iso) {
      Alert.alert('Atenção', 'Preencha nome, dosagem e a próxima aplicação no formato dd/mm/aaaa.');
      return;
    }
    try {
      await criarMedicamento.mutateAsync({
        petId, nome: medNome.trim(), dosagem: medDosagem.trim(), proximaAplicacao: iso,
      });
      setMedNome(''); setMedDosagem(''); setMedProxima(''); setMostrarForm(false);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar o medicamento.');
    }
  };

  const confirmarCancelamento = (c) => {
    Alert.alert(
      'Cancelar consulta',
      `${c.tipo} em ${c.data} às ${c.horario}.\nDeseja realmente cancelar?`,
      [
        { text: 'Manter', style: 'cancel' },
        {
          text: 'Cancelar consulta',
          style: 'destructive',
          onPress: () =>
            cancelarConsulta.mutate(c.id, {
              onError: (e) => {
                const prazo = String(e?.message ?? '').includes('24h');
                Alert.alert(
                  prazo ? 'Prazo expirado' : 'Erro',
                  prazo
                    ? 'O cancelamento só é permitido com 24 horas ou mais de antecedência.'
                    : 'Não foi possível cancelar a consulta.'
                );
              },
            }),
        },
      ]
    );
  };

  const confirmarExclusao = (id) => {
    Alert.alert('Excluir medicamento', 'Deseja remover este medicamento?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => excluirMedicamento.mutate(id) },
    ]);
  };

  if (carregandoPets || carregandoVacinas) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

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
            <Text style={styles.statNumber}>{vacinas.length}</Text>
            <Text style={styles.statLabel}>Vacinas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{consultas.length}</Text>
            <Text style={styles.statLabel}>Consultas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{medicamentos.length}</Text>
            <Text style={styles.statLabel}>Remédios</Text>
          </View>
        </View>
      </View>

      <PetChips pets={pets} selectedId={petId} onSelect={setPetSelecionado} />

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
          {vacinas.length === 0 && (
            <View style={styles.emptyContainer}>
              <FontAwesome5 name="syringe" size={40} color={COLORS.textLight} />
              <Text style={styles.emptyText}>Nenhuma vacina registrada para este pet</Text>
            </View>
          )}
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
          {consultas.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="event-busy" size={50} color={COLORS.textLight} />
              <Text style={styles.emptyText}>Nenhuma consulta registrada</Text>
            </View>
          ) : (
            consultas.map((c) => (
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
                  {c.horario && (
                    <View style={styles.infoCol}>
                      <Text style={styles.infoLabel}>Horário</Text>
                      <Text style={styles.infoValue}>{c.horario}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.infoFull}>
                  <Text style={styles.infoLabel}>Clínica</Text>
                  <Text style={styles.infoValue}>{c.clinica}</Text>
                </View>

                {c.observacao && c.observacao !== '—' && (
                  <View style={styles.observacaoBox}>
                    <Ionicons name="document-text-outline" size={14} color={COLORS.textLight} />
                    <Text style={styles.observacaoText}>{c.observacao}</Text>
                  </View>
                )}

                {c.horas >= 24 && (
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => confirmarCancelamento(c)}
                    disabled={cancelarConsulta.isPending}
                  >
                    <Text style={styles.cancelButtonText}>Cancelar consulta</Text>
                  </TouchableOpacity>
                )}
                {c.horas >= 0 && c.horas < 24 && (
                  <Text style={styles.cancelHint}>
                    Cancelamento disponível até 24h antes da consulta
                  </Text>
                )}
              </View>
            ))
          )}
        </View>
      )}

      {/* MEDICAMENTOS */}
      {abaAtiva === 'medicamentos' && (
        <View style={styles.section}>
          <TouchableOpacity
            style={{ backgroundColor: COLORS.accent, padding: 12, borderRadius: 12, alignItems: 'center', marginBottom: 12 }}
            onPress={() => setMostrarForm(!mostrarForm)}
          >
            <Text style={{ color: '#fff', fontWeight: '700' }}>
              {mostrarForm ? 'Fechar' : '+ Adicionar medicamento'}
            </Text>
          </TouchableOpacity>

          {mostrarForm && (
            <View style={styles.card}>
              <TextInput style={styles.formInput} placeholder="Nome (ex: Simparic)" placeholderTextColor={COLORS.subtext} value={medNome} onChangeText={setMedNome} />
              <TextInput style={styles.formInput} placeholder="Dosagem (ex: 1 comprimido/mês)" placeholderTextColor={COLORS.subtext} value={medDosagem} onChangeText={setMedDosagem} />
              <TextInput style={styles.formInput} placeholder="Próxima aplicação (dd/mm/aaaa)" placeholderTextColor={COLORS.subtext} value={medProxima} onChangeText={setMedProxima} keyboardType="numbers-and-punctuation" />
              <TouchableOpacity
                style={{ backgroundColor: COLORS.primary, padding: 12, borderRadius: 12, alignItems: 'center' }}
                onPress={salvarMedicamento}
                disabled={criarMedicamento.isPending}
              >
                {criarMedicamento.isPending
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={{ color: '#fff', fontWeight: '700' }}>Salvar</Text>}
              </TouchableOpacity>
            </View>
          )}

          {medicamentos.length === 0 && !mostrarForm && (
            <View style={styles.emptyContainer}>
              <Ionicons name="medical" size={40} color={COLORS.textLight} />
              <Text style={styles.emptyText}>Nenhum medicamento registrado</Text>
            </View>
          )}
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
                <TouchableOpacity onPress={() => confirmarExclusao(m.id)} style={{ marginLeft: 8 }}>
                  <Ionicons name="trash-outline" size={18} color={COLORS.textLight} />
                </TouchableOpacity>
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

const createStyles = (COLORS) => StyleSheet.create({
  cancelButton: {
    marginTop: 14,
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  cancelButtonText: { color: COLORS.accent, fontWeight: '700' },
  cancelHint: { marginTop: 12, color: COLORS.textLight, fontSize: 12, textAlign: 'center' },
  formInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    color: COLORS.text,
    backgroundColor: COLORS.background,
  },
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
    backgroundColor: COLORS.card,
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
    backgroundColor: COLORS.card,
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
    backgroundColor: 'rgba(230,57,99,0.10)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.title,
  },
  cardDivider: {
    height: 1,
    backgroundColor: COLORS.border,
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
  emptyContainer: {
    marginTop: 60,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 30,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 15,
    color: COLORS.textLight,
  },
});