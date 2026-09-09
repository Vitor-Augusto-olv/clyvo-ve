import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import { useState } from 'react';
import { router } from 'expo-router';

import COLORS from '../../constants/colors';
import { usePets, useUpdatePet, useDeletePet } from '../../hooks/usePets';

import {
  FontAwesome5,
  MaterialIcons,
  Ionicons,
} from '@expo/vector-icons';

export default function Pets() {

  const { data: pets, isLoading, isRefetching, refetch, isError } = usePets();
  const { mutate: atualizarPet, isPending: salvando } = useUpdatePet();
  const { mutate: removerPet, isPending: removendo } = useDeletePet();

  const [petSelecionado, setPetSelecionado] = useState(null);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({ nome: '', especie: '', raca: '', idade: '' });

  const selecionarPet = (pet) => {
    setPetSelecionado(pet);
    setEditando(false);
    setForm({
      nome: pet.nome,
      especie: pet.especie,
      raca: pet.raca,
      idade: String(pet.idade),
    });
  };

  const iniciarEdicao = () => setEditando(true);

  const salvarEdicao = () => {
    const idadeNumero = parseInt(form.idade, 10);
    if (!form.nome || !form.especie || !form.raca || isNaN(idadeNumero)) {
      Alert.alert('Campos inválidos', 'Preencha todos os campos corretamente.');
      return;
    }

    atualizarPet(
      {
        id: petSelecionado.id,
        nome: form.nome,
        especie: form.especie,
        raca: form.raca,
        idade: idadeNumero,
        status: petSelecionado.status,
      },
      {
        onSuccess: (petAtualizado) => {
          setPetSelecionado(petAtualizado);
          setEditando(false);
          Alert.alert('Sucesso', 'Dados do pet atualizados!');
        },
        onError: () => Alert.alert('Erro', 'Não foi possível atualizar o pet.'),
      }
    );
  };

  const confirmarRemocao = (pet) => {
    Alert.alert(
      'Remover pet',
      `Tem certeza que deseja remover ${pet.nome}? Essa ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            removerPet(pet.id, {
              onSuccess: () => {
                setPetSelecionado(null);
                Alert.alert('Sucesso', 'Pet removido com sucesso!');
              },
              onError: (error) => {
                console.log(error);
                Alert.alert('Erro', error?.message ?? 'Não foi possível remover o pet.');
              },
            });
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={COLORS.primary} />
      }
    >

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meus Pets</Text>
        <Text style={styles.headerSubtitle}>Histórico inteligente dos animais</Text>
      </View>

      {isLoading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : isError ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cloud-offline-outline" size={60} color={COLORS.subtext} />
          <Text style={styles.emptyText}>Não foi possível carregar seus pets</Text>
          <TouchableOpacity onPress={refetch} style={{ marginTop: 12 }}>
            <Text style={{ color: COLORS.accent, fontWeight: 'bold' }}>Tentar de novo</Text>
          </TouchableOpacity>
        </View>
      ) : pets.length === 0 ? (

        <View style={styles.emptyContainer}>
          <Ionicons name="paw-outline" size={60} color={COLORS.subtext} />
          <Text style={styles.emptyText}>Nenhum pet cadastrado ainda</Text>
        </View>

      ) : (

        pets.map((pet) => (
          <TouchableOpacity
            key={pet.id}
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => selecionarPet(pet)}
          >
            <View style={styles.petTop}>
              <View style={styles.petIconBox}>
                <FontAwesome5 name="dog" size={22} color={COLORS.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.petName}>{pet.nome}</Text>
                <Text style={styles.petInfo}>{pet.especie} • {pet.raca}</Text>
              </View>
            </View>

            <View style={styles.bottomRow}>
              <View style={styles.statusContainer}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>{pet.status}</Text>
              </View>
              <Text style={styles.petAge}>{pet.idade} {pet.idade === 1 ? 'ano' : 'anos'}</Text>
            </View>
          </TouchableOpacity>
        ))

      )}

      {petSelecionado && (
        <View style={styles.detailsCard}>

          <View style={styles.detailsHeader}>
            <MaterialIcons name="pets" size={24} color={COLORS.accent} />
            <Text style={styles.detailsTitle}>Detalhes do Pet</Text>
          </View>

          {editando ? (
            <>
              <Text style={styles.inputLabel}>Nome</Text>
              <TextInput
                style={styles.editInput}
                value={form.nome}
                onChangeText={(v) => setForm((f) => ({ ...f, nome: v }))}
              />

              <Text style={styles.inputLabel}>Espécie</Text>
              <TextInput
                style={styles.editInput}
                value={form.especie}
                onChangeText={(v) => setForm((f) => ({ ...f, especie: v }))}
              />

              <Text style={styles.inputLabel}>Raça</Text>
              <TextInput
                style={styles.editInput}
                value={form.raca}
                onChangeText={(v) => setForm((f) => ({ ...f, raca: v }))}
              />

              <Text style={styles.inputLabel}>Idade (anos)</Text>
              <TextInput
                style={styles.editInput}
                value={form.idade}
                onChangeText={(v) => setForm((f) => ({ ...f, idade: v }))}
                keyboardType="numeric"
              />

              <View style={styles.editActionsRow}>
                <TouchableOpacity
                  style={[styles.smallButton, styles.cancelButton]}
                  onPress={() => setEditando(false)}
                  disabled={salvando}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.smallButton, styles.saveButton]}
                  onPress={salvarEdicao}
                  disabled={salvando}
                >
                  {salvando ? (
                    <ActivityIndicator color={COLORS.white} />
                  ) : (
                    <Text style={styles.saveButtonText}>Salvar</Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.detailsText}>
                <Text style={styles.bold}>Nome:</Text> {petSelecionado.nome}
              </Text>
              <Text style={styles.detailsText}>
                <Text style={styles.bold}>Espécie:</Text> {petSelecionado.especie}
              </Text>
              <Text style={styles.detailsText}>
                <Text style={styles.bold}>Raça:</Text> {petSelecionado.raca}
              </Text>
              <Text style={styles.detailsText}>
                <Text style={styles.bold}>Idade:</Text> {petSelecionado.idade} anos
              </Text>
              <Text style={styles.detailsText}>
                <Text style={styles.bold}>Status:</Text> {petSelecionado.status}
              </Text>

              <TouchableOpacity
                style={styles.vacinasButton}
                onPress={() => router.push(`/vacina/${petSelecionado.id}?nome=${petSelecionado.nome}`)}
              >
                <Ionicons name="medkit-outline" size={20} color={COLORS.primary} />
                <Text style={styles.vacinasButtonText}>Gerenciar vacinas</Text>
              </TouchableOpacity>

              <View style={styles.editActionsRow}>
                <TouchableOpacity
                  style={[styles.smallButton, styles.editButton]}
                  onPress={iniciarEdicao}
                >
                  <Text style={styles.editButtonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.smallButton, styles.deleteButton]}
                  onPress={() => confirmarRemocao(petSelecionado)}
                  disabled={removendo}
                >
                  {removendo ? (
                    <ActivityIndicator color={COLORS.white} />
                  ) : (
                    <Text style={styles.deleteButtonText}>Remover</Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}

        </View>
      )}

      <View style={{ height: 40 }} />

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
    padding: 30,
    paddingTop: 55,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#C7D7EA',
    marginTop: 5,
  },
  card: {
    backgroundColor: COLORS.card,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  petTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  petIconBox: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: '#F4F7FB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  petName: {
    fontSize: 19,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  petInfo: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
  },
  petAge: {
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 99,
    backgroundColor: '#42C96B',
    marginRight: 8,
  },
  statusText: {
    color: '#42C96B',
    fontWeight: 'bold',
  },
  detailsCard: {
    backgroundColor: COLORS.card,
    margin: 16,
    padding: 22,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 4,
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  detailsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginLeft: 10,
  },
  detailsText: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 12,
  },
  bold: {
    fontWeight: 'bold',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 10,
    marginBottom: 6,
  },
  editInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.text,
  },
  vacinasButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F7FB',
    padding: 14,
    borderRadius: 16,
    marginTop: 10,
    marginBottom: 4,
    justifyContent: 'center',
  },
  vacinasButtonText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    marginLeft: 8,
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
  editButton: {
    backgroundColor: '#F4F7FB',
  },
  editButtonText: {
    color: COLORS.primary,
    fontWeight: 'bold',
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
  deleteButton: {
    backgroundColor: COLORS.accent,
  },
  deleteButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  emptyContainer: {
    marginTop: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    marginTop: 14,
    fontSize: 16,
    color: COLORS.subtext,
  },
});
