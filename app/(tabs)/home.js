import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';

import { useRouter } from 'expo-router';

import { useEffect, useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() {

  const router = useRouter();

  const [nomeUsuario, setNomeUsuario] = useState('');

  useEffect(() => {

    carregarUsuario();

  }, []);

  const carregarUsuario = async () => {

    try {

      const usuario = await AsyncStorage.getItem('@usuarioLogado');

      if (usuario) {

        const dados = JSON.parse(usuario);

        setNomeUsuario(dados.nome);

      }

    } catch (e) {

      console.log('Erro ao carregar usuário');

    }
  };

  return (

    <ScrollView style={styles.container}>

      <View style={styles.header}>

        <Text style={styles.headerText}>
          Olá, {nomeUsuario}! 👋
        </Text>

        <Text style={styles.headerSubtext}>
          Como está seu pet hoje?
        </Text>

      </View>

      <View style={styles.card}>

        <Text style={styles.cardTitle}>
          🐶 Próximas ações
        </Text>

        <Text style={styles.cardItem}>
          💉 Vacina V10 — vence em 5 dias
        </Text>

        <Text style={styles.cardItem}>
          🩺 Consulta de retorno — 15/05
        </Text>

        <Text style={styles.cardItem}>
          💊 Vermífugo — vence em 10 dias
        </Text>

      </View>

      <View style={styles.card}>

        <Text style={styles.cardTitle}>
          📊 Resumo de Saúde
        </Text>

        <Text style={styles.cardItem}>
          ✅ Vacinas em dia
        </Text>

        <Text style={styles.cardItem}>
          ⚠️ Check-up pendente
        </Text>

        <Text style={styles.cardItem}>
          ✅ Vermífugo em dia
        </Text>

      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/cadastrar')}
      >

        <Text style={styles.buttonText}>
          + Cadastrar novo pet
        </Text>

      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  header: {
    backgroundColor: '#1a3c5e',
    padding: 25,
    paddingTop: 40,
  },

  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },

  headerSubtext: {
    fontSize: 14,
    color: '#a8c8e8',
    marginTop: 5,
  },

  card: {
    backgroundColor: '#fff',
    margin: 15,
    marginBottom: 5,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a3c5e',
    marginBottom: 10,
  },

  cardItem: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },

  button: {
    backgroundColor: '#e8335a',
    margin: 15,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

});