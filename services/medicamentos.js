// services/medicamentos.js
import { supabase } from '../lib/supabase';

export async function getTodosMedicamentos() {
  const { data, error } = await supabase
    .from('medicamentos')
    .select('*')
    .order('proxima_aplicacao', { ascending: true });
  if (error) throw error;
  return data;
}

export async function createMedicamento({ userId, petId, nome, dosagem, proximaAplicacao }) {
  const { data, error } = await supabase
    .from('medicamentos')
    .insert({ user_id: userId, pet_id: petId, nome, dosagem, proxima_aplicacao: proximaAplicacao })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteMedicamento(id) {
  const { error } = await supabase.from('medicamentos').delete().eq('id', id);
  if (error) throw error;
}
