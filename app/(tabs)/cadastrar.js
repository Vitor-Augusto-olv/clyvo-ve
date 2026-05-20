import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';

import { useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import COLORS from '../../constants/colors';

import {
  MaterialIcons,
  FontAwesome5,
  Ionicons
} from '@expo/vector-icons';

export default function Cadastrar() {

  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState('');
  const [raca, setRaca] = useState('');
  const [idade, setIdade] = useState('');

  const handleSalvar = async () => {

    if (!nome || !especie || !raca || !idade) {

      Alert.alert(
        'Campos obrigatórios',
        'Preencha todos os campos.'
      );

      return;
    }

    try {

      const novoPet = {

        id: Date.now(),

        nome,
        especie,
        raca,
        idade,

        alerta: 'Check-up recomendado em 30 dias.',

        score: '85%',

        status: 'Saudável'
      };

      const petsSalvos = await AsyncStorage.getItem('pets');

      const listaPets = petsSalvos
        ? JSON.parse(petsSalvos)
        : [];

      listaPets.push(novoPet);

      await AsyncStorage.setItem(
        'pets',
        JSON.stringify(listaPets)
      );

      Alert.alert(
        'Sucesso',
        `${nome} foi cadastrado com sucesso!`
      );

      setNome('');
      setEspecie('');
      setRaca('');
      setIdade('');

    } catch (error) {

      console.log(error);

      Alert.alert(
        'Erro',
        'Não foi possível salvar o pet.'
      );

    }
  };

  return (

    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >

      {/* HEADER */}

      <View style={styles.header}>

        <View style={styles.headerContent}>

          <View style={styles.iconCircle}>

            <Ionicons
              name="paw"
              size={34}
              color={COLORS.white}
            />

          </View>

          <Text style={styles.headerTitle}>
            Cadastro de Pet
          </Text>

          <Text style={styles.headerSubtitle}>
            Adicione um novo animal ao sistema
          </Text>

        </View>

      </View>

      {/* CARD */}

      <View style={styles.card}>

        {/* NOME */}

        <Text style={styles.label}>
          Nome do pet
        </Text>

        <View style={styles.inputContainer}>

          <FontAwesome5
            name="dog"
            size={18}
            color={COLORS.accent}
          />

          <TextInput
            style={styles.input}
            placeholder="Ex: Rex"
            placeholderTextColor={COLORS.subtext}
            value={nome}
            onChangeText={setNome}
          />

        </View>

        {/* ESPÉCIE */}

        <Text style={styles.label}>
          Espécie
        </Text>

        <View style={styles.inputContainer}>

          <MaterialIcons
            name="pets"
            size={22}
            color={COLORS.accent}
          />

          <TextInput
            style={styles.input}
            placeholder="Ex: Cachorro"
            placeholderTextColor={COLORS.subtext}
            value={especie}
            onChangeText={setEspecie}
          />

        </View>

        {/* RAÇA */}

        <Text style={styles.label}>
          Raça
        </Text>

        <View style={styles.inputContainer}>

          <Ionicons
            name="ribbon"
            size={20}
            color={COLORS.accent}
          />

          <TextInput
            style={styles.input}
            placeholder="Ex: Labrador"
            placeholderTextColor={COLORS.subtext}
            value={raca}
            onChangeText={setRaca}
          />

        </View>

        {/* IDADE */}

        <Text style={styles.label}>
          Idade
        </Text>

        <View style={styles.inputContainer}>

          <MaterialIcons
            name="cake"
            size={22}
            color={COLORS.accent}
          />

          <TextInput
            style={styles.input}
            placeholder="Ex: 3 anos"
            placeholderTextColor={COLORS.subtext}
            value={idade}
            onChangeText={setIdade}
          />

        </View>

        {/* INFO CARD */}

        <View style={styles.infoCard}>

          <Ionicons
            name="information-circle"
            size={24}
            color={COLORS.accent}
          />

          <Text style={styles.infoText}>
            Após o cadastro, o sistema poderá gerar alertas inteligentes de saúde e acompanhamento contínuo do pet.
          </Text>

        </View>

        {/* BOTÃO */}

        <TouchableOpacity
          style={styles.button}
          onPress={handleSalvar}
        >

          <Text style={styles.buttonText}>
            Salvar Pet
          </Text>

        </TouchableOpacity>

      </View>

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

    paddingTop: 60,
    paddingBottom: 45,
    paddingHorizontal: 25,

    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },

  headerContent: {
    alignItems: 'flex-start',
  },

  iconCircle: {
    width: 80,
    height: 80,

    borderRadius: 40,

    backgroundColor: COLORS.accent,

    justifyContent: 'center',
    alignItems: 'center',

    marginBottom: 20,
  },

  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: COLORS.white,
  },

  headerSubtitle: {
    fontSize: 15,
    color: '#C6D4E2',
    marginTop: 8,
    lineHeight: 22,
  },

  card: {
    backgroundColor: COLORS.card,

    marginHorizontal: 20,
    marginTop: -25,
    marginBottom: 30,

    borderRadius: 28,

    padding: 22,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.08,
    shadowRadius: 10,

    elevation: 5,
  },

  label: {
    fontSize: 15,
    fontWeight: '600',

    color: COLORS.text,

    marginBottom: 10,
    marginTop: 14,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: COLORS.white,

    borderWidth: 1,
    borderColor: COLORS.border,

    borderRadius: 18,

    paddingHorizontal: 15,
  },

  input: {
    flex: 1,

    paddingVertical: 15,
    paddingLeft: 12,

    fontSize: 15,
    color: COLORS.text,
  },

  infoCard: {
    flexDirection: 'row',

    backgroundColor: '#F4F7FB',

    borderRadius: 18,

    padding: 16,

    marginTop: 25,

    alignItems: 'flex-start',
  },

  infoText: {
    flex: 1,

    color: COLORS.textLight,

    marginLeft: 10,

    lineHeight: 22,
    fontSize: 14,
  },

  button: {
    backgroundColor: COLORS.accent,

    padding: 18,

    borderRadius: 18,

    alignItems: 'center',

    marginTop: 25,
  },

  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },

});