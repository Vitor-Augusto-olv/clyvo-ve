import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import COLORS from '../constants/colors';
import { useTheme } from '../context/ThemeContext';

export default function Index() {
  const { colors: COLORS } = useTheme();
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary }}>
        <ActivityIndicator size="large" color={COLORS.white} />
      </View>
    );
  }

  return session
    ? <Redirect href="/(tabs)/home" />
    : <Redirect href="/(auth)/login" />;
}
