import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';

import { useEffect, useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import COLORS from '../../constants/colors';

import {
  FontAwesome5,
  MaterialIcons,
  Ionicons
} from '@expo/vector-icons';

export default function Pets() {

  const [pets, setPets] = useState([]);

  const [petSelecionado, setPetSelecionado] = useState(null);

  useEffect(() => {
    carregarPets();
  }, []);

  const carregarPets = async () => {

    try {

      const petsSalvos = await AsyncStorage.getItem('pets');

      if (petsSalvos) {
        setPets(JSON.parse(petsSalvos));
      }

    } catch (error) {

      console.log(error);

    }
  };

  const removerPet = async (id) => {

    try {

      const novaLista = pets.filter(
        (pet) => pet.id !== id
      );

      setPets(novaLista);

      await AsyncStorage.setItem(
        'pets',
        JSON.stringify(novaLista)
      );

      setPetSelecionado(null);

      Alert.alert(
        'Sucesso',
        'Pet removido com sucesso!'
      );

    } catch (error) {

      console.log(error);

      Alert.alert(
        'Erro',
        'Não foi possível remover o pet.'
      );
    }
  };

  return (

    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >

      <View style={styles.header}>

        <Text style={styles.headerTitle}>
          Meus Pets
        </Text>

        <Text style={styles.headerSubtitle}>
          Histórico inteligente dos animais
        </Text>

      </View>

      {pets.length === 0 ? (

        <View style={styles.emptyContainer}>

          <Ionicons
            name="paw-outline"
            size={60}
            color={COLORS.subtext}
          />

          <Text style={styles.emptyText}>
            Nenhum pet cadastrado ainda
          </Text>

        </View>

      ) : (

        pets.map((pet) => (

          <TouchableOpacity
            key={pet.id}
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => setPetSelecionado(pet)}
          >

            <View style={styles.petTop}>

              <View style={styles.petIconBox}>

                <FontAwesome5
                  name="dog"
                  size={22}
                  color={COLORS.accent}
                />

              </View>

              <View style={{ flex: 1 }}>

                <Text style={styles.petName}>
                  {pet.nome}
                </Text>

                <Text style={styles.petInfo}>
                  {pet.especie} • {pet.raca}
                </Text>

              </View>

            </View>

            <View style={styles.bottomRow}>

              <View style={styles.statusContainer}>

                <View style={styles.statusDot} />

                <Text style={styles.statusText}>
                  {pet.status}
                </Text>

              </View>

              <Text style={styles.petAge}>
                {pet.idade}
              </Text>

            </View>

          </TouchableOpacity>

        ))

      )}

      {petSelecionado && (

        <View style={styles.detailsCard}>

          <View style={styles.detailsHeader}>

            <MaterialIcons
              name="pets"
              size={24}
              color={COLORS.accent}
            />

            <Text style={styles.detailsTitle}>
              Detalhes do Pet
            </Text>

          </View>

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
            <Text style={styles.bold}>Idade:</Text> {petSelecionado.idade}
          </Text>

          <Text style={styles.detailsText}>
            <Text style={styles.bold}>Status:</Text> {petSelecionado.status}
          </Text>

          <View style={styles.alertBox}>

            <View style={styles.alertHeader}>

              <Ionicons
                name="warning"
                size={20}
                color="#C58B00"
              />

              <Text style={styles.alertTitle}>
                Alerta Inteligente
              </Text>

            </View>

            <Text style={styles.alertText}>
              {petSelecionado.alerta}
            </Text>

          </View>

          <View style={styles.scoreBox}>

            <Text style={styles.scoreTitle}>
              Score de Saúde
            </Text>

            <Text style={styles.scoreValue}>
              {petSelecionado.score}
            </Text>

          </View>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => removerPet(petSelecionado.id)}
          >

            <Text style={styles.deleteButtonText}>
              Remover Pet
            </Text>

          </TouchableOpacity>

        </View>

      )}

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

    shadowOffset: {
      width: 0,
      height: 3,
    },

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

  alertBox: {
    backgroundColor: '#FFF4D9',
    padding: 18,
    borderRadius: 18,
    marginTop: 20,
  },

  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  alertTitle: {
    fontWeight: 'bold',
    color: '#A46B00',
    marginLeft: 8,
  },

  alertText: {
    color: '#6D5A2D',
    lineHeight: 20,
  },

  scoreBox: {
    backgroundColor: '#F4F7FB',

    padding: 25,
    borderRadius: 20,

    marginTop: 20,

    alignItems: 'center',
  },

  scoreTitle: {
    fontSize: 15,
    color: COLORS.textLight,
    marginBottom: 10,
  },

  scoreValue: {
    fontSize: 42,
    fontWeight: 'bold',
    color: COLORS.primary,
  },

  deleteButton: {
    backgroundColor: COLORS.accent,

    padding: 18,
    borderRadius: 18,

    alignItems: 'center',

    marginTop: 24,
  },

  deleteButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
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