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

import { useState } from 'react';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

import COLORS from '../../constants/colors';
import {
  useVacinasByPet,
  useCreateVacina,
  useUpdateVacina,
  useDeleteVacina,
} from '../../hooks/useVacinas';

const FORM_VAZIO = {
  nome: '',
  dataAplicacao: '',
  proximoReforco: '',
  veterinario: '',
  lote: '',
};

export default function VacinasDoPet() {
  const { petId, nome } = useLocalSearchParams();
  const router = useRouter();

  const { data: vacinas, isLoading, isError, refetch } = useVacinasByPet(petId);
  const { mutate: criarVacina, isPending: criando } = useCreateVacina();
  const { mutate: atualizarVacina, isPending: atualizando } = useUpdateVacina();
  const { mutate: removerVacina } = useDeleteVacina();

  const [mostrarForm, setMostrarForm] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState(FORM_VAZIO);

  const abrirNovoForm = () => {
    setForm(FORM_VAZIO);
    setEditandoId(null);
    setMostrarForm(true);
  };

  const abrirEdicao = (vacina) => {
    setForm({
      nome: vacina.nome,
      dataAplicacao: vacina.data_aplicacao,
      proximoReforco: vacina.proximo_reforco,
      veterinario: vacina.veterinario ?? '',
      lote: vacina.lote ?? '',
    });
    setEditandoId(vacina.id);
    setMostrarForm(true);
  };

  const validarForm = () => {
    if (!form.nome || !form.dataAplicacao || !form.proximoReforco) {
      Alert.alert('Campos obrigatórios', 'Preencha nome, data de aplicação e próximo reforço (formato AAAA-MM-DD).');
      return false;
    }
    const regexData = /^\d{4}-\d{2}-\d{2}$/;
    if (!regexData.test(form.dataAplicacao) || !regexData.test(form.proximoReforco)) {
      Alert.alert('Data inválida', 'Use o formato AAAA-MM-DD, ex: 2026-09-10.');
      return false;
    }
    return true;
  };

  const salvar = () => {
    if (!validarForm()) return;

    if (editandoId) {
      atualizarVacina(
        {
          id: editandoId,
          petId,
          nome: form.nome,
          dataAplicacao: form.dataAplicacao,
          proximoReforco: form.proximoReforco,
          veterinario: form.veterinario,
          lote: form.lote,
        },
        {
          onSuccess: () => {
            setMostrarForm(false);
            Alert.alert('Sucesso', 'Vacina atualizada!');
          },
          onError: () => Alert.alert('Erro', 'Não foi possível atualizar a vacina.'),
        }
      );
    } else {
      criarVacina(
        {
          petId,
          nome: form.nome,
          dataAplicacao: form.dataAplicacao,
          proximoReforco: form.proximoReforco,
          veterinario: form.veterinario,
          lote: form.lote,
        },
        {
          onSuccess: () => {
            setMostrarForm(false);
            Alert.alert('Sucesso', 'Vacina registrada!');
          },
          onError: () => Alert.alert('Erro', 'Não foi possível registrar a vacina.'),
        }
      );
    }
  };

  const confirmarRemocao = (vacina) => {
    Alert.alert(
      'Remover vacina',
      `Remover o registro de "${vacina.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => removerVacina({ id: vacina.id, petId }),
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vacinas de {nome}</Text>
        <Text style={styles.headerSubtitle}>Histórico de imunização</Text>
      </View>

      {isLoading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : isError ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cloud-offline-outline" size={50} color={COLORS.subtext} />
          <Text style={styles.emptyText}>Erro ao carregar vacinas</Text>
          <TouchableOpacity onPress={refetch}>
            <Text style={{ color: COLORS.accent, fontWeight: 'bold', marginTop: 8 }}>Tentar de novo</Text>
          </TouchableOpacity>
        </View>
      ) : vacinas.length === 0 && !mostrarForm ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="vaccines" size={50} color={COLORS.subtext} />
          <Text style={styles.emptyText}>Nenhuma vacina registrada ainda</Text>
        </View>
      ) : (
        vacinas.map((vacina) => (
          <View key={vacina.id} style={styles.card}>
            <View style={styles.cardTop}>
              <View style={{ flex: 1 }}>
                <Text style={styles.vacinaNome}>{vacina.nome}</Text>
                <Text style={styles.vacinaInfo}>Aplicada em {formatarData(vacina.data_aplicacao)}</Text>
                <Text style={styles.vacinaInfo}>Próximo reforço: {formatarData(vacina.proximo_reforco)}</Text>
                {!!vacina.veterinario && (
                  <Text style={styles.vacinaInfo}>Vet.: {vacina.veterinario}</Text>
                )}
              </View>
              <View style={[
                styles.statusBadge,
                vacina.status === 'alerta' ? styles.statusAlerta : styles.statusOk,
              ]}>
                <Text style={styles.statusBadgeText}>
                  {vacina.status === 'alerta' ? 'Atenção' : 'Em dia'}
                </Text>
              </View>
            </View>

            <View style={styles.cardActions}>
              <TouchableOpacity onPress={() => abrirEdicao(vacina)} style={styles.actionButton}>
                <Ionicons name="pencil" size={16} color={COLORS.primary} />
                <Text style={styles.actionButtonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => confirmarRemocao(vacina)} style={styles.actionButton}>
                <Ionicons name="trash" size={16} color={COLORS.accent} />
                <Text style={[styles.actionButtonText, { color: COLORS.accent }]}>Remover</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}

      {mostrarForm && (
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>
            {editandoId ? 'Editar vacina' : 'Nova vacina'}
          </Text>

          <Text style={styles.label}>Nome da vacina</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: V10"
            placeholderTextColor={COLORS.subtext}
            value={form.nome}
            onChangeText={(v) => setForm((f) => ({ ...f, nome: v }))}
          />

          <Text style={styles.label}>Data de aplicação (AAAA-MM-DD)</Text>
          <TextInput
            style={styles.input}
            placeholder="2026-09-10"
            placeholderTextColor={COLORS.subtext}
            value={form.dataAplicacao}
            onChangeText={(v) => setForm((f) => ({ ...f, dataAplicacao: v }))}
          />

          <Text style={styles.label}>Próximo reforço (AAAA-MM-DD)</Text>
          <TextInput
            style={styles.input}
            placeholder="2027-09-10"
            placeholderTextColor={COLORS.subtext}
            value={form.proximoReforco}
            onChangeText={(v) => setForm((f) => ({ ...f, proximoReforco: v }))}
          />

          <Text style={styles.label}>Veterinário (opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Dra. Ana"
            placeholderTextColor={COLORS.subtext}
            value={form.veterinario}
            onChangeText={(v) => setForm((f) => ({ ...f, veterinario: v }))}
          />

          <Text style={styles.label}>Lote (opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: L12345"
            placeholderTextColor={COLORS.subtext}
            value={form.lote}
            onChangeText={(v) => setForm((f) => ({ ...f, lote: v }))}
          />

          <View style={styles.editActionsRow}>
            <TouchableOpacity
              style={[styles.smallButton, styles.cancelButton]}
              onPress={() => setMostrarForm(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.smallButton, styles.saveButton]}
              onPress={salvar}
              disabled={criando || atualizando}
            >
              {(criando || atualizando) ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.saveButtonText}>Salvar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      {!mostrarForm && (
        <TouchableOpacity style={styles.addButton} onPress={abrirNovoForm}>
          <Ionicons name="add-circle" size={22} color={COLORS.white} />
          <Text style={styles.addButtonText}>Registrar vacina</Text>
        </TouchableOpacity>
      )}

      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

function formatarData(dataIso) {
  if (!dataIso) return '-';
  const [ano, mes, dia] = dataIso.split('-');
  return `${dia}/${mes}/${ano}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: 24,
    paddingTop: 55,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    marginBottom: 14,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#C7D7EA',
    marginTop: 4,
  },
  card: {
    backgroundColor: COLORS.card,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  vacinaNome: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  vacinaInfo: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusOk: {
    backgroundColor: '#DCFCE7',
  },
  statusAlerta: {
    backgroundColor: '#FFF4D9',
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  formCard: {
    backgroundColor: COLORS.card,
    margin: 16,
    padding: 20,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.text,
  },
  editActionsRow: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 12,
  },
  smallButton: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F4F7FB',
  },
  cancelButtonText: {
    color: COLORS.textLight,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  saveButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.accent,
    margin: 16,
    padding: 18,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyContainer: {
    marginTop: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    marginTop: 14,
    fontSize: 16,
    color: COLORS.subtext,
  },
});
