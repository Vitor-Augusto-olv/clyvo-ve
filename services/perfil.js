// services/perfil.js - telefone do tutor (antes no AsyncStorage)
import { supabase } from '../lib/supabase';

export async function getPerfil(userId) {
  const { data, error } = await supabase
    .from('perfis')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function savePerfil({ userId, telefone }) {
  const { data, error } = await supabase
    .from('perfis')
    .upsert({ user_id: userId, telefone, updated_at: new Date().toISOString() })
    .select()
    .single();
  if (error) throw error;
  return data;
}
