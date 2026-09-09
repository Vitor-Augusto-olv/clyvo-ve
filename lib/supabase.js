// lib/supabase.js
//
// Client do Supabase configurado para persistir a sessão do usuário
// usando AsyncStorage, para que ele não precise logar de novo toda
// vez que abrir o app.
//
// IMPORTANTE: substitua as duas constantes abaixo pela URL e pela
// chave "anon public" do seu projeto (Settings -> API no painel do
// Supabase). Não use a "service_role" key aqui — essa é só para
// código de servidor, nunca deve ir para o app.

import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://dybsrpiiibzigekcpxff.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_CV0LVXgcWA7KAkm1bMKpRg_ZGbGEi_z';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
