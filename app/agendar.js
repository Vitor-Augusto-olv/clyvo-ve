import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { useState } from 'react';
import COLORS from '../constants/colors';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const clinicas = [
  {
    id: 1,
    nome: 'ClyvoVet Unidade Centro',
    endereco: 'Av. Paulista, 1200 — São Paulo, SP',
    avaliacao: '4.9',
    especialidades: ['Clínico Geral', 'Dermatologia', 'Ortopedia'],
  },
  {
    id: 2,
    nome: 'ClyvoVet Unidade Norte',
    endereco: 'R. das Flores, 340 — São Paulo, SP',
    avaliacao: '4.7',
    especialidades: ['Clínico Geral', 'Cardiologia'],
  },
];

const tiposConsulta = [
  { id: 1, nome: 'Check-up Geral', icon: 'favorite', lib: 'material' },
  { id: 2, nome: 'Vacinação', icon: 'syringe', lib: 'fa5' },
  { id: 3, nome: 'Dermatologia', icon: 'leaf', lib: 'ionicon' },
  { id: 4, nome: 'Cirurgia', icon: 'cut', lib: 'ionicon' },
];

const horariosDisponiveis = ['08:00', '09:30', '11:00', '14:00', '15:30', '17:00'];

const diasDisponiveis = [
  { data: '26/05', diaSemana: 'Seg' },
  { data: '27/05', diaSemana: 'Ter' },
  { data: '28/05', diaSemana: 'Qua' },
  { data: '29/05', diaSemana: 'Qui' },
  { data: '30/05', diaSemana: 'Sex' },
];

export default function Agendar() {
  const [clinicaSelecionada, setClinicaSelecionada] = useState(null);
  const [tipoSelecionado, setTipoSelecionado] = useState(null);
  const [diaSelecionado, setDiaSelecionado] = useState(null);
  const [horarioSelecionado, setHorarioSelecionado] = useState(null);

  const confirmar = () => {
    if (!clinicaSelecionada || !tipoSelecionado || !diaSelecionado || !horarioSelecionado) {
      Alert.alert('Atenção', 'Selecione todos os campos antes de confirmar.');
      return;
    }
    Alert.alert(
      '✅ Agendamento Confirmado!',
      `${tipoSelecionado.nome}\n${clinicaSelecionada.nome}\n${diaSelecionado.data} às ${horarioSelecionado}`
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Agendar Consulta</Text>
            <Text style={styles.headerSubtitle}>Escolha a melhor opção para seu pet</Text>
          </View>
          <View style={styles.headerIconBox}>
            <MaterialIcons name="event" size={22} color="#fff" />
          </View>
        </View>
      </View>

      <View style={styles.content}>

        {/* TIPO DE CONSULTA */}
        <Text style={styles.sectionTitle}>Tipo de Consulta</Text>
        <View style={styles.tiposGrid}>
          {tiposConsulta.map((tipo) => (
            <TouchableOpacity
              key={tipo.id}
              style={[
                styles.tipoCard,
                tipoSelecionado?.id === tipo.id && styles.tipoCardActive,
              ]}
              onPress={() => setTipoSelecionado(tipo)}
            >
              <View style={[
                styles.tipoIconBox,
                tipoSelecionado?.id === tipo.id && { backgroundColor: COLORS.accent },
              ]}>
                {tipo.lib === 'material' && (
                  <MaterialIcons
                    name={tipo.icon}
                    size={20}
                    color={tipoSelecionado?.id === tipo.id ? '#fff' : COLORS.accent}
                  />
                )}
                {tipo.lib === 'fa5' && (
                  <FontAwesome5
                    name={tipo.icon}
                    size={16}
                    color={tipoSelecionado?.id === tipo.id ? '#fff' : COLORS.accent}
                  />
                )}
                {tipo.lib === 'ionicon' && (
                  <Ionicons
                    name={tipo.icon}
                    size={20}
                    color={tipoSelecionado?.id === tipo.id ? '#fff' : COLORS.accent}
                  />
                )}
              </View>
              <Text style={[
                styles.tipoNome,
                tipoSelecionado?.id === tipo.id && { color: COLORS.accent },
              ]}>
                {tipo.nome}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* CLÍNICA */}
        <Text style={styles.sectionTitle}>Clínica</Text>
        {clinicas.map((c) => (
          <TouchableOpacity
            key={c.id}
            style={[
              styles.clinicaCard,
              clinicaSelecionada?.id === c.id && styles.clinicaCardActive,
            ]}
            onPress={() => setClinicaSelecionada(c)}
          >
            <View style={styles.clinicaTop}>
              <View style={styles.clinicaIconBox}>
                <MaterialIcons name="local-hospital" size={20} color={COLORS.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.clinicaNome}>{c.nome}</Text>
                <View style={styles.clinicaEnderecoRow}>
                  <Ionicons name="location-outline" size={12} color={COLORS.textLight} />
                  <Text style={styles.clinicaEndereco}>{c.endereco}</Text>
                </View>
              </View>
              <View style={styles.avaliacaoBox}>
                <Ionicons name="star" size={13} color="#F59E0B" />
                <Text style={styles.avaliacaoText}>{c.avaliacao}</Text>
              </View>
            </View>

            <View style={styles.especialidadesRow}>
              {c.especialidades.map((esp, i) => (
                <View key={i} style={styles.especialidadeTag}>
                  <Text style={styles.especialidadeText}>{esp}</Text>
                </View>
              ))}
            </View>

            {clinicaSelecionada?.id === c.id && (
              <View style={styles.selectedIndicator}>
                <Ionicons name="checkmark-circle" size={16} color={COLORS.accent} />
                <Text style={styles.selectedText}>Selecionada</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        {/* DATA */}
        <Text style={styles.sectionTitle}>Data</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.diasScroll}>
          {diasDisponiveis.map((dia) => (
            <TouchableOpacity
              key={dia.data}
              style={[
                styles.diaCard,
                diaSelecionado?.data === dia.data && styles.diaCardActive,
              ]}
              onPress={() => setDiaSelecionado(dia)}
            >
              <Text style={[
                styles.diaSemana,
                diaSelecionado?.data === dia.data && { color: '#fff' },
              ]}>
                {dia.diaSemana}
              </Text>
              <Text style={[
                styles.diaNumero,
                diaSelecionado?.data === dia.data && { color: '#fff' },
              ]}>
                {dia.data.split('/')[0]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* HORÁRIO */}
        <Text style={styles.sectionTitle}>Horário</Text>
        <View style={styles.horariosGrid}>
          {horariosDisponiveis.map((h) => (
            <TouchableOpacity
              key={h}
              style={[
                styles.horarioCard,
                horarioSelecionado === h && styles.horarioCardActive,
              ]}
              onPress={() => setHorarioSelecionado(h)}
            >
              <Text style={[
                styles.horarioText,
                horarioSelecionado === h && { color: '#fff' },
              ]}>
                {h}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* RESUMO */}
        {(clinicaSelecionada || tipoSelecionado || diaSelecionado || horarioSelecionado) && (
          <View style={styles.resumoCard}>
            <Text style={styles.resumoTitle}>Resumo do Agendamento</Text>
            {tipoSelecionado && (
              <View style={styles.resumoRow}>
                <Ionicons name="medkit-outline" size={15} color={COLORS.textLight} />
                <Text style={styles.resumoText}>{tipoSelecionado.nome}</Text>
              </View>
            )}
            {clinicaSelecionada && (
              <View style={styles.resumoRow}>
                <Ionicons name="business-outline" size={15} color={COLORS.textLight} />
                <Text style={styles.resumoText}>{clinicaSelecionada.nome}</Text>
              </View>
            )}
            {diaSelecionado && horarioSelecionado && (
              <View style={styles.resumoRow}>
                <Ionicons name="calendar-outline" size={15} color={COLORS.textLight} />
                <Text style={styles.resumoText}>{diaSelecionado.data} às {horarioSelecionado}</Text>
              </View>
            )}
          </View>
        )}

        {/* BOTÃO */}
        <TouchableOpacity style={styles.confirmButton} onPress={confirmar}>
          <Text style={styles.confirmText}>Confirmar Agendamento</Text>
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
  content: {
    padding: 16,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 12,
    marginTop: 20,
  },
  tiposGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tipoCard: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    gap: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  tipoCardActive: {
    borderColor: COLORS.accent,
    backgroundColor: '#FFF0F3',
  },
  tipoIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFF0F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipoNome: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    textAlign: 'center',
  },
  clinicaCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  clinicaCardActive: {
    borderColor: COLORS.accent,
  },
  clinicaTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  clinicaIconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#FFF0F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clinicaNome: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  clinicaEnderecoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  clinicaEndereco: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  avaliacaoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  avaliacaoText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  especialidadesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  especialidadeTag: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
  },
  especialidadeText: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  selectedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 12,
  },
  selectedText: {
    fontSize: 13,
    color: COLORS.accent,
    fontWeight: '600',
  },
  diasScroll: {
    marginBottom: 4,
  },
  diaCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    marginRight: 10,
    width: 62,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  diaCardActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  diaSemana: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  diaNumero: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  horariosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  horarioCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  horarioCardActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  horarioText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primary,
  },
  resumoCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginTop: 24,
    gap: 10,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accent,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  resumoTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  resumoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resumoText: {
    fontSize: 14,
    color: COLORS.text,
  },
  confirmButton: {
    backgroundColor: COLORS.accent,
    padding: 18,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});