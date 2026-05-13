import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function Saude() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>🩺 Saúde do Pet</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>💉 Vacinas</Text>
        <Text style={styles.item}>✅ V10 — aplicada em 01/01/2025</Text>
        <Text style={styles.item}>✅ Antirrábica — aplicada em 01/01/2025</Text>
        <Text style={styles.item}>⚠️ V10 — vence em 01/06/2025</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🩻 Consultas</Text>
        <Text style={styles.item}>✅ Check-up geral — 10/03/2025</Text>
        <Text style={styles.item}>⚠️ Retorno dermatologia — 20/05/2025</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>💊 Medicamentos</Text>
        <Text style={styles.item}>✅ Vermífugo — 01/04/2025</Text>
        <Text style={styles.item}>⚠️ Antipulgas — vence em 15/05/2025</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#1a3c5e', padding: 25 },
  headerText: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  card: { backgroundColor: '#fff', margin: 15, marginBottom: 5, padding: 20, borderRadius: 12, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1a3c5e', marginBottom: 10 },
  item: { fontSize: 14, color: '#555', marginBottom: 6 },
}); 
