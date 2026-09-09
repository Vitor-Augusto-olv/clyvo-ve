// services/pets.js
//
// Camada de acesso a dados: só fala com o Supabase.
// Nenhuma tela deve chamar o Supabase diretamente — sempre passa por aqui.

import { supabase } from '../lib/supabase';

export async function getPets() {
  const { data, error } = await supabase
    .from('pets')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getPetById(id) {
  const { data, error } = await supabase
    .from('pets')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createPet({ userId, nome, especie, raca, idade }) {
  const { data, error } = await supabase
    .from('pets')
    .insert({
      user_id: userId,
      nome,
      especie,
      raca,
      idade,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updatePet(id, { nome, especie, raca, idade, status }) {
  const { data, error } = await supabase
    .from('pets')
    .update({ nome, especie, raca, idade, status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deletePet(id) {
  const { data, error } = await supabase
    .from('pets')
    .delete()
    .eq('id', id)
    .select();

  if (error) throw error;
  if (!data || data.length === 0) {
    throw new Error(
      'Nenhum pet foi removido. Verifique se você é o dono deste registro (RLS).'
    );
  }
}
