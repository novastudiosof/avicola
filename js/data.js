// ---------- Configuración y datos de la demo (Avícola R&R) ----------
// En la versión con Supabase, todo este módulo se reemplaza por llamadas a la API.

const UNIDADES_POR_FLAN = 30;

const TIPOS_HUEVO = ['AA', 'A', 'B', 'C', 'Extra', 'Doble Yema'];

const STORAGE_KEY = 'avicola_registros';

function totalUnidades(flanes, unidades) {
  return (Number(flanes) || 0) * UNIDADES_POR_FLAN + (Number(unidades) || 0);
}

function calcularNeto(registro) {
  const total = totalUnidades(registro.totalFlanes, registro.totalUnidades);
  const bajas = totalUnidades(registro.bajaFlanes, registro.bajaUnidades);
  return Math.max(total - bajas, 0);
}

function formatFlanesUnidades(flanes, unidades) {
  const f = Number(flanes) || 0;
  const u = Number(unidades) || 0;
  return `${f} fl · ${u} uds`;
}

function uid() {
  return 'r_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);
}

function getRegistros() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveRegistros(registros) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(registros));
}

function addRegistro(registro) {
  const registros = getRegistros();
  registros.push(registro);
  saveRegistros(registros);
}

function updateRegistro(id, data) {
  const registros = getRegistros();
  const idx = registros.findIndex(r => r.id === id);
  if (idx !== -1) {
    registros[idx] = { ...registros[idx], ...data };
    saveRegistros(registros);
  }
}

function deleteRegistro(id) {
  const registros = getRegistros().filter(r => r.id !== id);
  saveRegistros(registros);
}

function dateStr(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

function seedIfEmpty() {
  const existing = getRegistros();
  if (existing.length > 0) return;

  const seedPlan = [
    { d: 27, tipo: 'AA', tf: 32, tu: 10, bf: 0, bu: 4 },
    { d: 27, tipo: 'A', tf: 28, tu: 5, bf: 0, bu: 2 },
    { d: 24, tipo: 'B', tf: 20, tu: 0, bf: 1, bu: 0 },
    { d: 24, tipo: 'AA', tf: 35, tu: 12, bf: 0, bu: 6 },
    { d: 21, tipo: 'Extra', tf: 15, tu: 8, bf: 0, bu: 1 },
    { d: 21, tipo: 'A', tf: 30, tu: 0, bf: 0, bu: 5 },
    { d: 18, tipo: 'AA', tf: 33, tu: 6, bf: 1, bu: 0 },
    { d: 18, tipo: 'C', tf: 12, tu: 4, bf: 0, bu: 2 },
    { d: 15, tipo: 'Doble Yema', tf: 4, tu: 10, bf: 0, bu: 0 },
    { d: 15, tipo: 'AA', tf: 31, tu: 0, bf: 0, bu: 3 },
    { d: 12, tipo: 'B', tf: 22, tu: 15, bf: 0, bu: 4 },
    { d: 12, tipo: 'A', tf: 29, tu: 9, bf: 1, bu: 0 },
    { d: 9, tipo: 'AA', tf: 36, tu: 4, bf: 0, bu: 7 },
    { d: 9, tipo: 'Extra', tf: 14, tu: 2, bf: 0, bu: 0 },
    { d: 6, tipo: 'AA', tf: 34, tu: 8, bf: 0, bu: 5 },
    { d: 6, tipo: 'C', tf: 10, tu: 6, bf: 0, bu: 1 },
    { d: 3, tipo: 'A', tf: 27, tu: 11, bf: 0, bu: 2 },
    { d: 3, tipo: 'AA', tf: 30, tu: 20, bf: 0, bu: 4 },
    { d: 1, tipo: 'B', tf: 19, tu: 3, bf: 0, bu: 0 },
    { d: 0, tipo: 'AA', tf: 30, tu: 20, bf: 0, bu: 5 },
  ];

  const registros = seedPlan.map(item => ({
    id: uid(),
    fecha: dateStr(item.d),
    tipo: item.tipo,
    totalFlanes: item.tf,
    totalUnidades: item.tu,
    bajaFlanes: item.bf,
    bajaUnidades: item.bu,
    observaciones: '',
  }));

  saveRegistros(registros);
}
