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

    <ScrollView style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.headerText}>
          🐾 Meus Pets
        </Text>
      </View>

      {pets.length === 0 ? (

        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Nenhum pet cadastrado ainda.
          </Text>
        </View>

      ) : (

        pets.map((pet) => (

          <TouchableOpacity
            key={pet.id}
            style={styles.card}
            onPress={() => setPetSelecionado(pet)}
          >

            <Text style={styles.petName}>
              {pet.nome}
            </Text>

            <Text style={styles.petInfo}>
              {pet.especie} • {pet.raca} • {pet.idade}
            </Text>

            <View style={styles.statusContainer}>

              <View style={styles.statusDot} />

              <Text style={styles.statusText}>
                {pet.status}
              </Text>

            </View>

          </TouchableOpacity>

        ))

      )}

      {petSelecionado && (

        <View style={styles.detailsCard}>

          <Text style={styles.detailsTitle}>
            📋 Detalhes do Pet
          </Text>

          <Text style={styles.detailsText}>
            Nome: {petSelecionado.nome}
          </Text>

          <Text style={styles.detailsText}>
            Espécie: {petSelecionado.especie}
          </Text>

          <Text style={styles.detailsText}>
            Raça: {petSelecionado.raca}
          </Text>

          <Text style={styles.detailsText}>
            Idade: {petSelecionado.idade}
          </Text>

          <Text style={styles.detailsText}>
            Status: {petSelecionado.status}
          </Text>

          <View style={styles.alertBox}>

            <Text style={styles.alertTitle}>
              ⚠️ Alerta Inteligente
            </Text>

            <Text style={styles.alertText}>
              {petSelecionado.alerta}
            </Text>

          </View>

          <View style={styles.scoreBox}>

            <Text style={styles.scoreTitle}>
              ❤️ Score de Saúde
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
    backgroundColor: '#f5f5f5'
  },

  header: {
    backgroundColor: '#1a3c5e',
    padding: 25
  },

  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff'
  },

  card: {
    backgroundColor: '#fff',
    margin: 15,
    marginBottom: 5,
    padding: 20,
    borderRadius: 12,
    elevation: 2
  },

  petName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a3c5e'
  },

  petInfo: {
    fontSize: 14,
    color: '#555',
    marginTop: 5
  },

  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
  },

  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: '#4CAF50',
    marginRight: 8
  },

  statusText: {
    color: '#4CAF50',
    fontWeight: 'bold'
  },

  detailsCard: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    elevation: 3
  },

  detailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a3c5e',
    marginBottom: 15
  },

  detailsText: {
    fontSize: 16,
    color: '#444',
    marginBottom: 10
  },

  alertBox: {
    backgroundColor: '#fff3cd',
    padding: 15,
    borderRadius: 10,
    marginTop: 15
  },

  alertTitle: {
    fontWeight: 'bold',
    marginBottom: 5
  },

  alertText: {
    color: '#555'
  },

  scoreBox: {
    backgroundColor: '#f0f4ff',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center'
  },

  scoreTitle: {
    fontWeight: 'bold',
    marginBottom: 10
  },

  scoreValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1a3c5e'
  },

  deleteButton: {
    backgroundColor: '#e8335a',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20
  },

  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },

  emptyContainer: {
    marginTop: 50,
    alignItems: 'center'
  },

  emptyText: {
    fontSize: 16,
    color: '#777'
  }

});