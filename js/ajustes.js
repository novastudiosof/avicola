// ---------- Módulo Ajustes ----------

const whatsappReportesInput = document.getElementById('whatsappReportesInput');
if (whatsappReportesInput) {
  whatsappReportesInput.value = getWhatsappReportes();
}

const btnGuardarAjustes = document.getElementById('btnGuardarAjustes');
if (btnGuardarAjustes) {
  btnGuardarAjustes.addEventListener('click', () => {
    const valor = whatsappReportesInput.value.trim();
    if (!valor || valor.replace(/\D/g, '').length < 7) {
      alert('Ingresa un número de WhatsApp válido.');
      return;
    }
    saveConfig({ whatsappReportes: valor });
    mostrarToastAjustes();
  });
}

function mostrarToastAjustes() {
  const toast = document.getElementById('ajustesToast');
  if (!toast) return;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2600);
}

const btnSoporte = document.getElementById('btnSoporte');
if (btnSoporte) {
  btnSoporte.addEventListener('click', () => {
    const link = toWaLink(WHATSAPP_SOPORTE, 'Hola, necesito soporte para Avicola R&R.');
    window.open(link, '_blank');
  });
}
