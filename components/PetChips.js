import { useMemo } from 'react';
// components/PetChips.js
// Seletor de pet reutilizado em Saúde, Agendar e Histórico.
import { ScrollView, TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import COLORS from '../constants/colors';
import { useTheme } from '../context/ThemeContext';

export default function PetChips({ pets = [], selectedId, onSelect }) {
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS), [COLORS]);
  if (pets.length === 0) {
    return (
      <View style={styles.vazio}>
        <Text style={styles.vazioTexto}>Cadastre um pet na aba Cadastrar para começar.</Text>
      </View>
    );
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.lista}>
      {pets.map((pet) => {
        const ativo = pet.id === selectedId;
        return (
          <TouchableOpacity
            key={pet.id}
            style={[styles.chip, ativo && styles.chipAtivo]}
            onPress={() => onSelect(pet.id)}
          >
            <Text style={[styles.chipTexto, ativo && styles.chipTextoAtivo]}>{pet.nome}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const createStyles = (COLORS) => StyleSheet.create({
  lista: { paddingHorizontal: 20, paddingVertical: 14, gap: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipAtivo: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  chipTexto: { color: COLORS.textLight, fontWeight: '600' },
  chipTextoAtivo: { color: '#fff' },
  vazio: { padding: 20 },
  vazioTexto: { color: COLORS.textLight, textAlign: 'center' },
});
