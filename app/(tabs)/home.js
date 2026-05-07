import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Olá, Tutor! 👋</Text>
        <Text style={styles.headerSubtext}>Como está seu pet hoje?</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🐶 Próximas ações</Text>
        <Text style={styles.cardItem}>💉 Vacina V10 — vence em 5 dias</Text>
        <Text style={styles.cardItem}>🩺 Consulta de retorno — 15/05</Text>
        <Text style={styles.cardItem}>💊 Vermífugo — vence em 10 dias</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📊 Resumo de Saúde</Text>
        <Text style={styles.cardItem}>✅ Vacinas em dia</Text>
        <Text style={styles.cardItem}>⚠️ Check-up pendente</Text>
        <Text style={styles.cardItem}>✅ Vermífugo em dia</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/cadastrar')}></TouchableOpacity> 
