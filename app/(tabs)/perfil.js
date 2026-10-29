import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert 
} from 'react-native';

import { useState, useEffect, useMemo } from 'react';

import { router } from 'expo-router';

import { useAuth } from '../../context/AuthContext';
import { usePerfil, useSavePerfil } from '../../hooks/usePerfil';
import COLORS from '../../constants/colors';
import { useTheme } from '../../context/ThemeContext';

export default function Perfil() {
  const { colors: COLORS, mode, setMode } = useTheme();
  const styles = useMemo(() => createStyles(COLORS), [COLORS]);

  const { user, signOut } = useAuth();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');

  // Nome e e-mail vêm da conta autenticada; telefone vem da tabela perfis (Supabase)
  const { data: perfil, isLoading: carregandoPerfil } = usePerfil();
  const salvarMutation = useSavePerfil();

  useEffect(() => {
    setNome(user?.user_metadata?.nome ?? '');
    setEmail(user?.email ?? '');
  }, [user]);

  useEffect(() => {
    if (perfil?.telefone) setTelefone(perfil.telefone);
  }, [perfil]);

  const salvarPerfil = async () => {
    if (!telefone) {
      Alert.alert('Atenção', 'Preencha o telefone!');
      return;
    }
    try {
      await salvarMutation.mutateAsync({ telefone });
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar o perfil.');
    }
  };

  const logout = async () => {

    try {
      await signOut();
      router.replace('/(auth)/login');
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível sair da conta.');
    }

  };

  return (

    <ScrollView style={styles.container}>

      <View style={styles.header}>

        <View style={styles.avatar}>

          <Text style={styles.avatarText}>
            {nome ? nome.charAt(0).toUpperCase() : 'U'}
          </Text>

        </View>

        <Text style={styles.headerTitle}>
          {nome || 'Usuário'}
        </Text>

        <Text style={styles.headerSubtitle}>
          Gerencie suas informações
        </Text>

      </View>

      <View style={styles.form}>

        <View style={styles.card}>

          <Text style={styles.sectionTitle}>
            Informações pessoais
          </Text>

          <Text style={styles.label}>
            Nome completo
          </Text>

          <TextInput
            style={[styles.input, styles.inputDisabled]}
            placeholder="Nome não informado"
            placeholderTextColor={COLORS.subtext}
            value={nome}
            editable={false}
          />

          <Text style={styles.label}>
            E-mail
          </Text>

          <TextInput
            style={[styles.input, styles.inputDisabled]}
            placeholder="E-mail não informado"
            placeholderTextColor={COLORS.subtext}
            value={email}
            editable={false}
            keyboardType="email-address"
          />

          <Text style={styles.label}>
            Telefone
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Digite seu telefone"
            placeholderTextColor={COLORS.subtext}
            value={telefone}
            onChangeText={setTelefone}
            keyboardType="phone-pad"
          />

        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Aparência</Text>
          <View style={styles.themeRow}>
            {[
              { id: 'system', label: 'Sistema' },
              { id: 'light', label: 'Claro' },
              { id: 'dark', label: 'Escuro' },
            ].map((op) => (
              <TouchableOpacity
                key={op.id}
                style={[styles.themeOption, mode === op.id && styles.themeOptionActive]}
                onPress={() => setMode(op.id)}
              >
                <Text style={[styles.themeOptionText, mode === op.id && { color: '#fff' }]}>
                  {op.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.card} onPress={() => router.push('/sobre')}>
          <Text style={styles.sectionTitle}>Sobre o App</Text>
          <Text style={{ color: COLORS.textLight }}>Versão, commit e informações do projeto</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={salvarPerfil}
        >

          <Text style={styles.buttonText}>
            Salvar alterações
          </Text>

        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={logout}
        >

          <Text style={styles.logoutText}>
            Sair da conta
          </Text>

        </TouchableOpacity>

      </View>

    </ScrollView>

  );

}

const createStyles = (COLORS) => StyleSheet.create({

  themeRow: { flexDirection: 'row', gap: 8 },
  themeOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  themeOptionActive: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  themeOptionText: { color: COLORS.text, fontWeight: '600' },

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    backgroundColor: COLORS.primary,

    padding: 30,
    paddingTop: 60,

    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,

    alignItems: 'center',
  },

  avatar: {
    width: 90,
    height: 90,

    borderRadius: 50,

    backgroundColor: COLORS.accent,

    justifyContent: 'center',
    alignItems: 'center',

    marginBottom: 15,
  },

  avatarText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },

  headerSubtitle: {
    fontSize: 15,
    color: '#B6C2CF',
    marginTop: 5,
  },

  form: {
    padding: 20,
  },

  card: {
    backgroundColor: COLORS.card,

    borderRadius: 24,

    padding: 22,

    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.06,
    shadowRadius: 10,

    elevation: 5,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.title,
    marginBottom: 10,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
    marginTop: 15,
  },

  input: {
    backgroundColor: COLORS.card,

    borderWidth: 1,
    borderColor: COLORS.border,

    borderRadius: 16,

    padding: 16,

    fontSize: 15,

    color: COLORS.text,

    marginBottom: 5,
  },

  inputDisabled: {
    backgroundColor: COLORS.border,
    color: COLORS.textLight,
  },

  saveButton: {
    backgroundColor: COLORS.accent,

    padding: 16,

    borderRadius: 16,

    alignItems: 'center',

    marginTop: 25,
  },

  logoutButton: {
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  logoutText: {
    color: COLORS.textLight,
    fontSize: 15,
    fontWeight: '600',
  },

});