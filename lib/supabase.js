
// Client do Supabase configurado para persistir a sessão do usuário
// usando AsyncStorage, para que ele não precise logar de novo toda
// vez que abrir o app.


import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://dybsrpiiibzigekcpxff.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5YnNycGlpaWJ6aWdla2NweGZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4NDQ4MDgsImV4cCI6MjEwNDQyMDgwOH0.ARq__ONTZxglQxaF7MXfMo9IfR2VtQmjl4tezTf02N0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});