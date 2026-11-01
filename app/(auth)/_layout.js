import { View, ActivityIndicator } from 'react-native';
import { Stack, Redirect } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import COLORS from '../../constants/colors';
import { useTheme } from '../../context/ThemeContext';

export default function AuthLayout() {
  const { colors: COLORS } = useTheme();
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary }}>
        <ActivityIndicator size="large" color={COLORS.white} />
      </View>
    );
  }

  // Se já está logado, não faz sentido ver a tela de login/cadastro
  if (session) {
    return <Redirect href="/(tabs)/home" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="cadastro" />
    </Stack>
  );
}
