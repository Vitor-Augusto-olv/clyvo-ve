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
  ActivityIndicator,
} from 'react-native';

import { useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

import { useAuth } from '../../context/AuthContext';
import COLORS from '../../constants/colors';

export default function Cadastro() {
  const { signUp } = useAuth();
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCadastrar = async () => {
    if (!nome || !email || !senha || !confirmarSenha) {
      Alert.alert('Campos obrigatórios', 'Preencha todos os campos.');
      return;
    }

    if (senha.length < 6) {
      Alert.alert('Senha muito curta', 'A senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Senhas diferentes', 'A confirmação de senha não bate com a senha.');
      return;
    }

    setLoading(true);
    try {
      const data = await signUp(email.trim(), senha, nome.trim());

      // Se o projeto exigir confirmação de e-mail, ainda não haverá sessão aqui
      if (!data.session) {
        Alert.alert(
          'Confirme seu e-mail',
          'Enviamos um link de confirmação para o seu e-mail. Confirme antes de entrar.'
        );
        router.replace('/(auth)/login');
        return;
      }

      router.replace('/(tabs)/home');
    } catch (error) {
      Alert.alert('Erro ao cadastrar', traduzErro(error?.message) || 'Tente novamente.');
    } finally {
      setLoading(false);
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
          <Text style={styles.subtitle}>Crie sua conta para começar</Text>
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
              placeholder="Senha (mín. 6 caracteres)"
              placeholderTextColor={COLORS.subtext}
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="lock-outline" size={22} color={COLORS.accent} />
            <TextInput
              style={styles.input}
              placeholder="Confirmar senha"
              placeholderTextColor={COLORS.subtext}
              secureTextEntry
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              returnKeyType="done"
              onSubmitEditing={handleCadastrar}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleCadastrar}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.buttonText}>Criar conta</Text>
            )}
          </TouchableOpacity>

          <Link href="/(auth)/login" asChild>
            <TouchableOpacity style={styles.linkButton}>
              <Text style={styles.linkText}>
                Já tem conta? <Text style={styles.linkBold}>Entrar</Text>
              </Text>
            </TouchableOpacity>
          </Link>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function traduzErro(mensagem) {
  if (!mensagem) return null;
  if (mensagem.includes('already registered') || mensagem.includes('already exists')) {
    return 'Já existe uma conta com esse e-mail.';
  }
  if (mensagem.includes('Password should be')) {
    return 'A senha não atende aos requisitos mínimos de segurança.';
  }
  return mensagem;
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
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 18,
    alignItems: 'center',
  },
  linkText: {
    color: COLORS.textLight,
    fontSize: 14,
  },
  linkBold: {
    color: COLORS.accent,
    fontWeight: 'bold',
  },
});
