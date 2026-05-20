import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';

import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import COLORS from '../../constants/colors';

import {
  MaterialIcons,
  FontAwesome5,
  Ionicons
} from '@expo/vector-icons';

export default function Home() {

  const router = useRouter();

  const [nomeUsuario, setNomeUsuario] = useState('');

  useEffect(() => {
    carregarUsuario();
  }, []);

  const carregarUsuario = async () => {

    try {

      const usuario = await AsyncStorage.getItem('@usuarioLogado');

      if (usuario) {

        const dados = JSON.parse(usuario);

        setNomeUsuario(dados.nome);

      }

    } catch (e) {

      console.log('Erro ao carregar usuário');

    }

  };

  return (

    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >

      {/* HEADER */}

      <View style={styles.header}>

        <Text style={styles.headerText}>
          Olá, {nomeUsuario || 'Tutor'} 👋
        </Text>

        <Text style={styles.headerSubtext}>
          Acompanhe a saúde do seu pet em tempo real
        </Text>

      </View>

      {/* STATUS RÁPIDO */}

      <View style={styles.quickStatusContainer}>

        <View style={styles.quickCard}>

          <Ionicons
            name="medkit"
            size={24}
            color={COLORS.accent}
          />

          <Text style={styles.quickNumber}>3</Text>

          <Text style={styles.quickLabel}>
            Vacinas
          </Text>

        </View>

        <View style={styles.quickCard}>

          <MaterialIcons
            name="pets"
            size={24}
            color={COLORS.accent}
          />

          <Text style={styles.quickNumber}>1</Text>

          <Text style={styles.quickLabel}>
            Pets
          </Text>

        </View>

        <View style={styles.quickCard}>

          <Ionicons
            name="calendar"
            size={24}
            color={COLORS.accent}
          />

          <Text style={styles.quickNumber}>2</Text>

          <Text style={styles.quickLabel}>
            Consultas
          </Text>

        </View>

      </View>

      {/* CARD AÇÕES */}

      <View style={styles.card}>

        <View style={styles.titleContainer}>

          <FontAwesome5
            name="dog"
            size={18}
            color={COLORS.accent}
          />

          <Text style={styles.cardTitle}>
            Próximas ações
          </Text>

        </View>

        <Text style={styles.cardItem}>
          💉 Vacina V10 — vence em 5 dias
        </Text>

        <Text style={styles.cardItem}>
          🩺 Consulta de retorno — 15/05
        </Text>

        <Text style={styles.cardItem}>
          💊 Vermífugo — vence em 10 dias
        </Text>

      </View>

      {/* CARD RESUMO */}

      <View style={styles.card}>

        <View style={styles.titleContainer}>

          <Ionicons
            name="analytics"
            size={20}
            color={COLORS.accent}
          />

          <Text style={styles.cardTitle}>
            Resumo de Saúde
          </Text>

        </View>

        <Text style={styles.cardItem}>
          ✅ Vacinas em dia
        </Text>

        <Text style={styles.cardItem}>
          ⚠️ Check-up pendente
        </Text>

        <Text style={styles.cardItem}>
          ✅ Vermífugo em dia
        </Text>

      </View>

      {/* SERVIÇOS */}

      <View style={styles.servicesContainer}>

        <Text style={styles.servicesTitle}>
          Serviços
        </Text>

        {/* AGENDAR */}

        <TouchableOpacity
          style={styles.serviceButton}
          onPress={() => router.push('/agendar')}
        >

          <View style={styles.serviceContent}>

            <MaterialIcons
              name="event"
              size={22}
              color="#fff"
              style={styles.iconSpacing}
            />

            <Text style={styles.serviceText}>
              Agendar Consulta
            </Text>

          </View>

        </TouchableOpacity>

        {/* VACINAS */}

        <TouchableOpacity
          style={styles.serviceButton}
          onPress={() => router.push('/vacinas')}
        >

          <View style={styles.serviceContent}>

            <FontAwesome5
              name="syringe"
              size={18}
              color="#fff"
              style={styles.iconSpacing}
            />

            <Text style={styles.serviceText}>
              Carteira de Vacinação
            </Text>

          </View>

        </TouchableOpacity>

        {/* HISTÓRICO */}

        <TouchableOpacity
          style={styles.serviceButton}
          onPress={() => router.push('/historico')}
        >

          <View style={styles.serviceContent}>

            <MaterialIcons
              name="history"
              size={22}
              color="#fff"
              style={styles.iconSpacing}
            />

            <Text style={styles.serviceText}>
              Histórico do Pet
            </Text>

          </View>

        </TouchableOpacity>

      </View>

      {/* BOTÃO */}

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/cadastrar')}
      >

        <Text style={styles.buttonText}>
          + Cadastrar novo pet
        </Text>

      </TouchableOpacity>

    </ScrollView>

  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    backgroundColor: COLORS.primary,
    padding: 25,
    paddingTop: 55,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
  },

  headerSubtext: {
    fontSize: 15,
    color: '#C7D7EA',
    marginTop: 6,
  },

  quickStatusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: -25,
  },

  quickCard: {
    backgroundColor: COLORS.white,
    width: '31%',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.08,
    shadowRadius: 8,

    elevation: 5,
  },

  quickNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 8,
  },

  quickLabel: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 4,
  },

  card: {
    backgroundColor: COLORS.white,

    marginHorizontal: 16,
    marginTop: 16,

    padding: 20,

    borderRadius: 22,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.08,

    shadowRadius: 10,

    elevation: 5,
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginLeft: 10,
  },

  cardItem: {
    fontSize: 15,
    color: COLORS.textLight,
    marginBottom: 10,
  },

  servicesContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },

  servicesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 15,
  },

  serviceButton: {
    backgroundColor: COLORS.secondary,
    padding: 18,
    borderRadius: 18,
    marginBottom: 12,
  },

  serviceContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconSpacing: {
    marginRight: 12,
  },

  serviceText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },

  button: {
    backgroundColor: COLORS.accent,

    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 30,

    padding: 18,

    borderRadius: 18,

    alignItems: 'center',
  },

  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },

});