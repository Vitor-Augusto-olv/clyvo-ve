// services/iot.js - dispositivos e leituras da coleira
import { supabase } from '../lib/supabase';

export async function getDispositivos() {
  const { data, error } = await supabase.from('dispositivos').select('*');
  if (error) throw error;
  return data;
}

export async function createDispositivo({ userId, petId }) {
  const { data, error } = await supabase
    .from('dispositivos')
    .insert({ user_id: userId, pet_id: petId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getLeituras(petId, limit = 30) {
  const { data, error } = await supabase
    .from('leituras_iot')
    .select('*')
    .eq('pet_id', petId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

// Assinatura Realtime: chama onInsert a cada nova leitura do pet.
export function subscribeLeituras(petId, onInsert) {
  const channel = supabase
    .channel(`leituras-${petId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'leituras_iot', filter: `pet_id=eq.${petId}` },
      (payload) => onInsert(payload.new)
    )
    .subscribe();
  return () => supabase.removeChannel(channel);
}
