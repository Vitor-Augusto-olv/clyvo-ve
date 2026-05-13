import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useState } from 'react';

export default function Cadastrar() {
  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState('');
  const [raca, setRaca] = useState('');
  const [idade, setIdade] = useState('');

  const handleSalvar = () => {
    if (!nome || !especie || !raca || !idade) {
      Alert.alert('Atenção', 'Preencha todos os campos!');
      return;
    }
    Alert.alert('Sucesso', `Pet ${nome} cadastrado com sucesso!`);
    setNome('');
    setEspecie('');
    setRaca('');
    setIdade('');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>➕ Cadastrar Pet</Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.label}>Nome do Pet</Text>
        <TextInput style={styles.input} placeholder="Ex: Rex" value={nome} onChangeText={setNome} />

        <Text style={styles.label}>Espécie</Text>
        <TextInput style={styles.input} placeholder="Ex: Cachorro" value={especie} onChangeText={setEspecie} />

        <Text style={styles.label}>Raça</Text>
        <TextInput style={styles.input} placeholder="Ex: Labrador" value={raca} onChangeText={setRaca} />

        <Text style={styles.label}>Idade</Text>
        <TextInput style={styles.input} placeholder="Ex: 3 anos" value={idade} onChangeText={setIdade} />

        <TouchableOpacity style={styles.button} onPress={handleSalvar}>
          <Text style={styles.buttonText}>Salvar Pet</Text>
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
