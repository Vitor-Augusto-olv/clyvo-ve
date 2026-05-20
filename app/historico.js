import {
  View,
  Text,
  StyleSheet,
  ScrollView
} from 'react-native';

import COLORS from '../constants/colors';

export default function Historico() {

  return (

    <ScrollView style={styles.container}>

      <Text style={styles.title}>
        Histórico do Pet
      </Text>

      <View style={styles.card}>

        <Text style={styles.date}>
          12/04/2026
        </Text>

        <Text style={styles.event}>
          Consulta de rotina realizada
        </Text>

      </View>

      <View style={styles.card}>

        <Text style={styles.date}>
          01/03/2026
        </Text>

        <Text style={styles.event}>
          Aplicação da vacina V10
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

  date: {
    color: COLORS.accent,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  event: {
    fontSize: 16,
    color: COLORS.primary,
  },

});