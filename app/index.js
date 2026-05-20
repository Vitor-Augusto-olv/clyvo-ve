import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import COLORS from '../constants/colors';

export default function Index() {

  const router = useRouter();

  const verificarLogin = async () => {

    try {

      const usuario = await AsyncStorage.getItem('@usuarioLogado');

      if (usuario) {

        router.push('/home');

      } else {

        router.push('/login');

      }

    } catch (e) {

      Alert.alert('Erro', 'Não foi possível verificar login');

    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.logo}>🐾 Clyvo Vet</Text>

      <Text style={styles.subtitle}>
        Cuide do seu pet com carinho
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={verificarLogin}
      >
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logo: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    color: '#a8c8e8',
    marginBottom: 60,
  },

  button: {
    backgroundColor: COLORS.accent,
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },

});