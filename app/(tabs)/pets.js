import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function Pets() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>🐾 Meus Pets</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.petName}>Rex</Text>
        <Text style={styles.petInfo}>🐶 Cachorro • Labrador • 3 anos</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.petName}>Mimi</Text>
        <Text style={styles.petInfo}>🐱 Gato • Siamês • 2 anos</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#1a3c5e', padding: 25 },
  headerText: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  card: { backgroundColor: '#fff', margin: 15, marginBottom: 5, padding: 20, borderRadius: 12, elevation: 2 },
  petName: { fontSize: 18, fontWeight: 'bold', color: '#1a3c5e' },
  petInfo: { fontSize: 14, color: '#555', marginTop: 5 },
});