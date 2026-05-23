import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { router } from 'expo-router';

import COLORS from '../constants/colors';

import {
  MaterialIcons,
  Ionicons,
} from '@expo/vector-icons';

export default function Login() {

  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const cadastrar = async () => {

    if (!nome || !telefone || !email || !senha) {
      Alert.alert('Campos obrigatórios', 'Preencha todos os campos.');
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

      await AsyncStorage.setItem('@usuarioLogado', JSON.stringify(usuario));
      await AsyncStorage.setItem('@perfil', JSON.stringify(usuario));

      router.replace('/home');

    } catch (e) {
      Alert.alert('Erro', 'Não foi possível realizar o cadastro.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

        <View style={styles.topSection}>
          <View style={styles.logoCircle}>
            <Ionicons name="paw" size={40} color={COLORS.white} />
          </View>
          <Text style={styles.title}>Clyvo Vet</Text>
          <Text style={styles.subtitle}>
            Plataforma inteligente para o cuidado do seu pet
          </Text>
        </View>

        <View style={styles.card}>

          <Text style={styles.cardTitle}>Criar conta</Text>

          <View style={styles.inputContainer}>
            <MaterialIcons name="person" size={22} color={COLORS.accent} />
            <TextInput
              style={styles.input}
              placeholder="Nome completo"
              placeholderTextColor={COLORS.subtext}
              value={nome}
              onChangeText={setNome}
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="phone" size={22} color={COLORS.accent} />
            <TextInput
              style={styles.input}
              placeholder="Telefone"
              placeholderTextColor={COLORS.subtext}
              keyboardType="phone-pad"
              value={telefone}
              onChangeText={setTelefone}
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="email" size={22} color={COLORS.accent} />
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              placeholderTextColor={COLORS.subtext}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="lock" size={22} color={COLORS.accent} />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor={COLORS.subtext}
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
              returnKeyType="done"
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={cadastrar}>
            <Text style={styles.buttonText}>Entrar no App</Text>
          </TouchableOpacity>

        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
  },
  topSection: {
    backgroundColor: COLORS.primary,
    paddingTop: 70,
    paddingBottom: 50,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  subtitle: {
    fontSize: 15,
    color: '#C4D3E1',
    marginTop: 8,
    lineHeight: 22,
  },
  card: {
    backgroundColor: COLORS.card,
    marginHorizontal: 20,
    marginTop: -30,
    borderRadius: 28,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 25,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    paddingHorizontal: 15,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    paddingLeft: 12,
    fontSize: 15,
    color: COLORS.text,
  },
  button: {
    backgroundColor: COLORS.accent,
    padding: 18,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});