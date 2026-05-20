import {
  View,
  Text,
  StyleSheet,
  ScrollView
} from 'react-native';

import COLORS from '../constants/colors';

export default function Vacinas() {

  return (

    <ScrollView style={styles.container}>

      <Text style={styles.title}>
        Carteira de Vacinação
      </Text>

      <View style={styles.card}>
        <Text style={styles.vacina}>
          💉 V10
        </Text>

        <Text style={styles.status}>
          Aplicada em 02/05/2026
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.vacina}>
          🦠 Antirrábica
        </Text>

        <Text style={styles.status}>
          Reforço em 20 dias
        </Text>
      </View>

    </ScrollView>

  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 20,
    marginTop: 20,
  },

  card: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
    elevation: 4,
  },

  vacina: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },

  status: {
    marginTop: 8,
    color: COLORS.textLight,
    fontSize: 15,
  },

});