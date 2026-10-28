// services/agendamentos.js
import { supabase } from '../lib/supabase';

export async function getAgendamentos() {
  const { data, error } = await supabase
    .from('agendamentos')
    .select('*')
    .order('data_consulta', { ascending: true });
  if (error) throw error;
  return data;
}

export async function createAgendamento({ userId, petId, tipo, clinica, dataConsulta, horario }) {
  const { data, error } = await supabase
    .from('agendamentos')
    .insert({ user_id: userId, pet_id: petId, tipo, clinica, data_consulta: dataConsulta, horario })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function cancelAgendamento(id) {
  const { error } = await supabase
    .from('agendamentos')
    .update({ status: 'cancelado' })
    .eq('id', id);
  if (error) throw error;
}
