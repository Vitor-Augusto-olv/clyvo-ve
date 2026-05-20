import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView
} from 'react-native';

import { useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { router } from 'expo-router';

export default function Login() {

  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const cadastrar = async () => {

    if (!nome || !telefone || !email || !senha) {

      Alert.alert('Erro', 'Preencha todos os campos');
      return;

    }

    try {

      const usuario = {
        nome,
        telefone,
        email,
        senha,
        logado: true,
      };

      await AsyncStorage.setItem(
        '@usuarioLogado',
        JSON.stringify(usuario)
      );

      await AsyncStorage.setItem(
        '@perfil',
        JSON.stringify(usuario)
      );

      router.replace('/home');

    } catch (e) {

      Alert.alert('Erro', 'Não foi possível cadastrar');

    }
  };

  return (

    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.titulo}>🐾 Cadastro</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={styles.input}
        placeholder="Telefone"
        keyboardType="phone-pad"
        value={telefone}
        onChangeText={setTelefone}
      />

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity
        style={styles.botao}
        onPress={cadastrar}
      >
        <Text style={styles.botaoTexto}>Cadastrar</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 25,
    backgroundColor: '#f5f5f5',
  },

  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a3c5e',
    marginBottom: 30,
    textAlign: 'center',
  },

  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 16,
  },

  botao: {
    backgroundColor: '#e8335a',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },

  botaoTexto: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },

});