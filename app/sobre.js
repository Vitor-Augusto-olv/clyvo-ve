// app/sobre.js - tela "Sobre o App" com a versão e o hash do commit publicado
import { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import { useTheme } from '../context/ThemeContext';

export default function Sobre() {
  const router = useRouter();
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS), [COLORS]);

  const config = Constants.expoConfig ?? {};
  const versao = config.version ?? '—';
  const commit = config.extra?.commitHash ?? 'desconhecido';
  const commitCurto = commit === 'desconhecido' ? commit : commit.slice(0, 7);

  const linhas = [
    { rotulo: 'Aplicativo', valor: 'Clyvo Vet' },
    { rotulo: 'Versão', valor: versao },
    { rotulo: 'Commit (hash curto)', valor: commitCurto },
    { rotulo: 'Plataforma', valor: Platform.OS },
    { rotulo: 'Projeto', valor: 'Challenge FIAP 2026 – 2º ano ADS' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sobre o App</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.card}>
          {linhas.map((l) => (
            <View key={l.rotulo} style={styles.linha}>
              <Text style={styles.rotulo}>{l.rotulo}</Text>
              <Text style={styles.valor}>{l.valor}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.rotulo}>Hash completo do commit</Text>
          <Text selectable style={styles.hash}>{commit}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const createStyles = (COLORS) => StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  back: { marginBottom: 12 },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: '700' },
  body: { padding: 20, gap: 14 },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  rotulo: { color: COLORS.textLight, fontSize: 13 },
  valor: { color: COLORS.text, fontWeight: '600', fontSize: 14 },
  hash: { color: COLORS.text, marginTop: 8, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
});
