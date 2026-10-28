// utils/datas.js
// Datas do Supabase (tipo date) chegam como 'AAAA-MM-DD'.

export function paraDate(iso) {
  const [a, m, d] = iso.split('-').map(Number);
  return new Date(a, m - 1, d);
}

export function formatarData(iso) {
  if (!iso) return '';
  const [a, m, d] = iso.split('-');
  return `${d}/${m}/${a}`;
}

export function hojeISO() {
  return paraISO(new Date());
}

export function paraISO(date) {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${m}-${d}`;
}

// 'dd/mm/aaaa' -> 'AAAA-MM-DD' (retorna null se inválida)
export function brParaISO(texto) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto.trim());
  if (!m) return null;
  const [, d, mes, a] = m;
  const dt = new Date(Number(a), Number(mes) - 1, Number(d));
  if (dt.getFullYear() !== Number(a) || dt.getMonth() !== Number(mes) - 1 || dt.getDate() !== Number(d)) {
    return null;
  }
  return `${a}-${mes}-${d}`;
}

export function diasAte(iso) {
  const hoje = paraDate(hojeISO());
  return Math.round((paraDate(iso) - hoje) / 86400000);
}

export function textoPrazo(iso, prefixo) {
  const dias = diasAte(iso);
  if (dias < 0) return `${prefixo} atrasado há ${-dias} dia(s)`;
  if (dias === 0) return `${prefixo} hoje`;
  return `${prefixo} em ${dias} dia(s)`;
}

// Próximos n dias úteis a partir de amanhã (para a tela de agendamento)
export function proximosDiasUteis(n) {
  const nomes = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const lista = [];
  const d = new Date();
  while (lista.length < n) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    const iso = paraISO(d);
    const [, m, dia] = iso.split('-');
    lista.push({ iso, data: `${dia}/${m}`, diaSemana: nomes[d.getDay()] });
  }
  return lista;
}
