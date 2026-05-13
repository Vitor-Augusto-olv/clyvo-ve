import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Perfil() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');

  useEffect(() => {
    carregarPerfil();
  }, []);

  const carregarPerfil = async () => {
    try {
      const dados = await AsyncStorage.getItem('@perfil');
      if (dados) {
        const perfil = JSON.parse(dados);
        setNome(perfil.nome);
        setEmail(perfil.email);
        setTelefone(perfil.telefone);
      }
    } catch (e) {
      console.log('Erro ao carregar perfil', e);
    }
  };

  const salvarPerfil = async () => {
    if (!nome || !email || !telefone) {
      Alert.alert('Atenção', 'Preencha todos os campos!');
      return;
    }
    try {
      const perfil = { nome, email, telefone };
      await AsyncStorage.setItem('@perfil', JSON.stringify(perfil));
      Alert.alert('Sucesso', 'Perfil salvo com sucesso!');
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar o perfil.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>👤 Meu Perfil</Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.label}>Nome</Text>
        <TextInput style={styles.input} placeholder="Seu nome" value={nome} onChangeText={setNome} />

        <Text style={styles.label}>E-mail</Text>
        <TextInput style={styles.input} placeholder="Seu e-mail" value={email} onChangeText={setEmail} keyboardType="email-address" />

        <Text style={styles.label}>Telefone</Text>
        <TextInput style={styles.input} placeholder="Seu telefone" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />

        <TouchableOpacity style={styles.button} onPress={salvarPerfil}>
          <Text style={styles.buttonText}>Salvar Perfil</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#1a3c5e', padding: 25 },
  headerText: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  form: { padding: 20 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#1a3c5e', marginBottom: 5, marginTop: 15 },
  input: { backgroundColor: '#fff', padding: 12, borderRadius: 10, fontSize: 15, elevation: 1 },
  button: { backgroundColor: '#e8335a', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 30 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
}); 
