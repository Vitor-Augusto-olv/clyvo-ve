// context/ThemeContext.js
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors } from '../constants/colors';

const STORAGE_KEY = '@clyvo:tema';
const ThemeContext = createContext(null);

// mode: 'system' (segue o aparelho) | 'light' | 'dark'
export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState('system');

  // Preferência de tema fica guardada no aparelho (não é dado do usuário no banco)
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((salvo) => {
        if (salvo === 'light' || salvo === 'dark' || salvo === 'system') setModeState(salvo);
      })
      .catch(() => {});
  }, []);

  const setMode = (novo) => {
    setModeState(novo);
    AsyncStorage.setItem(STORAGE_KEY, novo).catch(() => {});
  };

  const isDark = mode === 'dark' || (mode === 'system' && systemScheme === 'dark');
  const colors = isDark ? darkColors : lightColors;

  const value = useMemo(() => ({ colors, mode, setMode, isDark }), [colors, mode, isDark]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme deve ser usado dentro de ThemeProvider');
  return ctx;
}
