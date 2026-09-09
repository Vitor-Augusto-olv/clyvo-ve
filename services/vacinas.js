// services/vacinas.js
//
// Camada de acesso a dados das vacinas. Cada vacina pertence a um pet
// específico (pet_id), diferente da versão antiga que era uma lista
// fixa igual pra todo mundo.

import { supabase } from '../lib/supabase';

export async function getVacinasByPet(petId) {
  const { data, error } = await supabase
    .from('vacinas')
    .select('*')
    .eq('pet_id', petId)
    .order('data_aplicacao', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createVacina({
  userId,
  petId,
  nome,
  dataAplicacao,
  proximoReforco,
  veterinario,
  lote,
}) {
  const { data, error } = await supabase
    .from('vacinas')
    .insert({
      user_id: userId,
      pet_id: petId,
      nome,
      data_aplicacao: dataAplicacao,
      proximo_reforco: proximoReforco,
      veterinario,
      lote,
      status: calcularStatus(proximoReforco),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateVacina(id, {
  nome,
  dataAplicacao,
  proximoReforco,
  veterinario,
  lote,
}) {
  const { data, error } = await supabase
    .from('vacinas')
    .update({
      nome,
      data_aplicacao: dataAplicacao,
      proximo_reforco: proximoReforco,
      veterinario,
      lote,
      status: calcularStatus(proximoReforco),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteVacina(id) {
  const { error } = await supabase.from('vacinas').delete().eq('id', id);
  if (error) throw error;
}

// Calcula automaticamente se a vacina está "ok" ou em "alerta"
// (reforço vencido ou a menos de 30 dias)
function calcularStatus(proximoReforco) {
  const hoje = new Date();
  const dataReforco = new Date(proximoReforco);
  const diasRestantes = Math.floor((dataReforco - hoje) / (1000 * 60 * 60 * 24));
  return diasRestantes <= 30 ? 'alerta' : 'ok';
}
