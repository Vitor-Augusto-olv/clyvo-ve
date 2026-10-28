// services/eventos.js - histórico clínico do pet
import { supabase } from '../lib/supabase';

export async function getEventos(petId) {
  let query = supabase
    .from('eventos_clinicos')
    .select('*')
    .order('data_evento', { ascending: false });
  if (petId) query = query.eq('pet_id', petId);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createEvento({ userId, petId, tipo, titulo, descricao, veterinario, clinica }) {
  const { data, error } = await supabase
    .from('eventos_clinicos')
    .insert({ user_id: userId, pet_id: petId, tipo, titulo, descricao, veterinario, clinica })
    .select()
    .single();
  if (error) throw error;
  return data;
}
