import { View, ActivityIndicator } from 'react-native';
import { Tabs, Redirect } from 'expo-router';

import {
  Ionicons,
  MaterialIcons,
  FontAwesome5
} from '@expo/vector-icons';

import { useAuth } from '../../context/AuthContext';
import COLORS from '../../constants/colors';

export default function TabsLayout() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary }}>
        <ActivityIndicator size="large" color={COLORS.white} />
      </View>
    );
  }

  // Guarda de rota: usuário não autenticado não acessa nenhuma tela interna,
  // nem por navegação direta/deep link.
  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  return (

    <Tabs

      screenOptions={{

        headerShown: false,

        tabBarActiveTintColor: COLORS.accent,

        tabBarInactiveTintColor: '#94A3B8',

        tabBarStyle: {

          position: 'absolute',

          bottom: 15,
          left: 15,
          right: 15,

          height: 75,

          backgroundColor: COLORS.white,

          borderRadius: 25,

          borderTopWidth: 0,

          paddingTop: 10,
          paddingBottom: 10,

          shadowColor: '#000',

          shadowOffset: {
            width: 0,
            height: 4,
          },

          shadowOpacity: 0.08,
          shadowRadius: 10,

          elevation: 10,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 5,
        },

      }}
    >

      {/* HOME */}

      <Tabs.Screen
        name="home"

        options={{

          title: 'Home',

          tabBarIcon: ({ color, focused }) => (

            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              color={color}
              size={24}
            />

          ),
        }}
      />

      {/* PETS */}

      <Tabs.Screen
        name="pets"

        options={{

          title: 'Pets',

          tabBarIcon: ({ color, focused }) => (

            <FontAwesome5
              name="paw"
              color={color}
              size={20}
              solid={focused}
            />

          ),
        }}
      />

      {/* CADASTRAR */}

      <Tabs.Screen
        name="cadastrar"

        options={{

          title: 'Cadastrar',

          tabBarIcon: ({ focused }) => (

            <Ionicons
              name="add-circle"
              color={focused
                ? COLORS.accent
                : '#94A3B8'}
              size={34}
            />

          ),
        }}
      />

      {/* SAÚDE */}

      <Tabs.Screen
        name="saude"

        options={{

          title: 'Saúde',

          tabBarIcon: ({ color, focused }) => (

            <MaterialIcons
              name="medical-services"
              color={color}
              size={24}
            />

          ),
        }}
      />

      {/* PERFIL */}

      <Tabs.Screen
        name="perfil"

        options={{

          title: 'Perfil',

          tabBarIcon: ({ color, focused }) => (

            <Ionicons
              name={focused
                ? 'person'
                : 'person-outline'}
              color={color}
              size={24}
            />

          ),
        }}
      />

    </Tabs>

  );
}
