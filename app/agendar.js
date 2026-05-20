import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import COLORS from '../constants/colors';

export default function Agendar() {

  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        Agendar Consulta
      </Text>

      <View style={styles.card}>

        <Text style={styles.label}>
          Clínica disponível
        </Text>

        <Text style={styles.info}>
          Clyvo Vet Premium
        </Text>

        <Text style={styles.label}>
          Próxima data disponível
        </Text>

        <Text style={styles.info}>
          15 de Maio - 14:30
        </Text>

      </View>

      <TouchableOpacity style={styles.button}>

        <Text style={styles.buttonText}>
          Confirmar Agendamento
        </Text>

      </TouchableOpacity>

    </View>

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
    marginBottom: 25,
    marginTop: 20,
  },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    elevation: 4,
  },

  label: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 10,
  },

  info: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 5,
  },

  button: {
    backgroundColor: COLORS.accent,
    marginTop: 30,
    padding: 18,
    borderRadius: 18,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

});