// ---------- Módulo Registros (solo captura de datos) ----------

const modalOverlay = document.getElementById('modalOverlay');
const registroForm = document.getElementById('registroForm');
const modalTitle = document.getElementById('modalTitle');
const tipoSelect = document.getElementById('tipo');

// Poblar select de tipos de huevo
TIPOS_HUEVO.forEach(tipo => {
  const opt = document.createElement('option');
  opt.value = tipo;
  opt.textContent = tipo;
  tipoSelect.appendChild(opt);
});

function abrirModal(registro) {
  registroForm.reset();
  document.getElementById('registroId').value = registro ? registro.id : '';
  modalTitle.textContent = registro ? 'Editar registro' : 'Nuevo registro de producción';
  document.getElementById('fecha').value = registro ? registro.fecha : new Date().toISOString().slice(0, 10);
  tipoSelect.value = registro ? registro.tipo : TIPOS_HUEVO[0];
  document.getElementById('totalFlanes').value = registro ? registro.totalFlanes : 0;
  document.getElementById('totalUnidades').value = registro ? registro.totalUnidades : 0;
  document.getElementById('bajaFlanes').value = registro ? registro.bajaFlanes : 0;
  document.getElementById('bajaUnidades').value = registro ? registro.bajaUnidades : 0;
  document.getElementById('observaciones').value = registro ? (registro.observaciones || '') : '';
  actualizarNetoPreview();
  modalOverlay.classList.remove('hidden');
}

function cerrarModal() {
  modalOverlay.classList.add('hidden');
}

document.getElementById('btnNuevoRegistro').addEventListener('click', () => abrirModal(null));
document.getElementById('btnCancelar').addEventListener('click', cerrarModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) cerrarModal();
});

['totalFlanes', 'totalUnidades', 'bajaFlanes', 'bajaUnidades'].forEach(id => {
  document.getElementById(id).addEventListener('input', actualizarNetoPreview);
});

function actualizarNetoPreview() {
  const neto = calcularNeto({
    totalFlanes: document.getElementById('totalFlanes').value,
    totalUnidades: document.getElementById('totalUnidades').value,
    bajaFlanes: document.getElementById('bajaFlanes').value,
    bajaUnidades: document.getElementById('bajaUnidades').value,
  });
  document.getElementById('netoPreview').textContent = `${neto} unidades`;
}

registroForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = document.getElementById('registroId').value;
  const esNuevo = !id;

  const registro = {
    id: id || uid(),
    fecha: document.getElementById('fecha').value,
    tipo: tipoSelect.value,
    totalFlanes: Number(document.getElementById('totalFlanes').value) || 0,
    totalUnidades: Number(document.getElementById('totalUnidades').value) || 0,
    bajaFlanes: Number(document.getElementById('bajaFlanes').value) || 0,
    bajaUnidades: Number(document.getElementById('bajaUnidades').value) || 0,
    observaciones: document.getElementById('observaciones').value.trim(),
  };

  if (id) {
    updateRegistro(id, registro);
  } else {
    addRegistro(registro);
  }

  cerrarModal();
  if (window.refrescarReportes) refrescarReportes();
  if (esNuevo) mostrarToastRegistro();
});

function mostrarToastRegistro() {
  const toast = document.getElementById('registroToast');
  if (!toast) return;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2600);
}

function editarRegistro(id) {
  const registro = getRegistros().find(r => r.id === id);
  if (registro) abrirModal(registro);
}

function eliminarRegistro(id) {
  if (confirm('¿Eliminar este registro de producción? Esta acción no se puede deshacer.')) {
    deleteRegistro(id);
    if (window.refrescarReportes) refrescarReportes();
  }
}

function formatFecha(fecha) {
  const [y, m, d] = fecha.split('-');
  return `${d}/${m}/${y}`;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
