// ---------- Configuración y helpers de WhatsApp ----------

const CONFIG_KEY = 'avicola_config';
const WHATSAPP_SOPORTE = '3193034610'; // Nova Studio (fijo, no editable desde Ajustes)

function getConfig() {
  try {
    return JSON.parse(localStorage.getItem(CONFIG_KEY)) || {};
  } catch (e) {
    return {};
  }
}

function saveConfig(cfg) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg));
}

function getWhatsappReportes() {
  const cfg = getConfig();
  return cfg.whatsappReportes || WHATSAPP_SOPORTE;
}

function toWaLink(numero, mensaje) {
  let digits = String(numero).replace(/\D/g, '');
  if (!digits.startsWith('57')) digits = '57' + digits;
  return `https://wa.me/${digits}?text=${encodeURIComponent(mensaje)}`;
}
