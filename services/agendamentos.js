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

// O prazo de 24h é validado no banco (função cancelar_agendamento).
export async function cancelAgendamento(id) {
  const { error } = await supabase.rpc('cancelar_agendamento', { p_id: id });
  if (error) throw error;
}
