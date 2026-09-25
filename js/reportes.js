// ---------- Módulo Reportes ----------

const filtroTipoSelect = document.getElementById('filtroTipo');
TIPOS_HUEVO.forEach(tipo => {
  const opt = document.createElement('option');
  opt.value = tipo;
  opt.textContent = tipo;
  filtroTipoSelect.appendChild(opt);
});

document.getElementById('btnAplicarFiltro').addEventListener('click', refrescarReportes);
document.getElementById('btnLimpiarFiltro').addEventListener('click', () => {
  document.getElementById('filtroDesde').value = '';
  document.getElementById('filtroHasta').value = '';
  filtroTipoSelect.value = '';
  refrescarReportes();
});
document.getElementById('btnExportar').addEventListener('click', exportarExcel);
document.getElementById('btnEnviarWhatsapp').addEventListener('click', enviarPorWhatsapp);

function obtenerRegistrosFiltrados() {
  const desde = document.getElementById('filtroDesde').value;
  const hasta = document.getElementById('filtroHasta').value;
  const tipo = filtroTipoSelect.value;

  return getRegistros()
    .filter(r => (!desde || r.fecha >= desde))
    .filter(r => (!hasta || r.fecha <= hasta))
    .filter(r => (!tipo || r.tipo === tipo))
    .sort((a, b) => b.fecha.localeCompare(a.fecha));
}

function agruparPorFecha(registros) {
  const grupos = {};
  registros.forEach(r => {
    if (!grupos[r.fecha]) grupos[r.fecha] = [];
    grupos[r.fecha].push(r);
  });
  return grupos;
}

function refrescarReportes() {
  const registros = obtenerRegistrosFiltrados();
  renderTablaReportes(registros);
  renderStatsReportes(registros);
  renderChartTipos(registros);
}

function renderTablaReportes(registros) {
  const tbody = document.getElementById('tablaReportes');
  const empty = document.getElementById('emptyReportes');
  tbody.innerHTML = '';

  const grupos = agruparPorFecha(registros);
  const fechas = Object.keys(grupos).sort((a, b) => b.localeCompare(a));

  empty.style.display = fechas.length === 0 ? 'block' : 'none';

  fechas.forEach((fecha, idx) => {
    const items = grupos[fecha];
    const totalBruto = items.reduce((s, r) => s + totalUnidades(r.totalFlanes, r.totalUnidades), 0);
    const totalBajas = items.reduce((s, r) => s + totalUnidades(r.bajaFlanes, r.bajaUnidades), 0);
    const totalNeto = items.reduce((s, r) => s + calcularNeto(r), 0);
    const resumenTipos = items
      .map(r => `<span class="badge">${r.tipo}: ${calcularNeto(r)}</span>`)
      .join(' ');

    const detailId = `detalle-${idx}`;

    const trMain = document.createElement('tr');
    trMain.innerHTML = `
      <td><strong>${formatFecha(fecha)}</strong></td>
      <td>${resumenTipos}</td>
      <td>${totalBruto} uds</td>
      <td><span class="badge baja">${totalBajas} uds</span></td>
      <td><span class="badge neto">${totalNeto} uds</span></td>
      <td><button class="icon-btn toggle-detalle" title="Ver detalle" data-target="${detailId}">👁 Ver más</button></td>
    `;
    tbody.appendChild(trMain);

    const trDetail = document.createElement('tr');
    trDetail.id = detailId;
    trDetail.className = 'detail-row';
    trDetail.style.display = 'none';
    const detalleHtml = items.map(r => `
      <tr>
        <td><span class="badge">${r.tipo}</span></td>
        <td>${formatFlanesUnidades(r.totalFlanes, r.totalUnidades)}</td>
        <td><span class="badge baja">${formatFlanesUnidades(r.bajaFlanes, r.bajaUnidades)}</span></td>
        <td><span class="badge neto">${calcularNeto(r)} uds</span></td>
        <td>${r.observaciones ? escapeHtml(r.observaciones) : '—'}</td>
        <td>
          <button class="icon-btn" title="Editar" onclick="editarRegistro('${r.id}')">✏️</button>
          <button class="icon-btn" title="Eliminar" onclick="eliminarRegistro('${r.id}')">🗑️</button>
        </td>
      </tr>
    `).join('');

    trDetail.innerHTML = `
      <td colspan="6">
        <div class="detail-inner">
          <table class="detail-table">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Producción</th>
                <th>Bajas</th>
                <th>Neto</th>
                <th>Observaciones</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>${detalleHtml}</tbody>
          </table>
        </div>
      </td>
    `;
    tbody.appendChild(trDetail);
  });

  tbody.querySelectorAll('.toggle-detalle').forEach(btn => {
    btn.addEventListener('click', () => {
      const row = document.getElementById(btn.dataset.target);
      const abierta = row.style.display !== 'none';
      row.style.display = abierta ? 'none' : 'table-row';
      btn.textContent = abierta ? '👁 Ver más' : '🔽 Ocultar';
    });
  });
}

function renderStatsReportes(registros) {
  const totalNeto = registros.reduce((sum, r) => sum + calcularNeto(r), 0);
  const totalBajas = registros.reduce((sum, r) => sum + totalUnidades(r.bajaFlanes, r.bajaUnidades), 0);
  const totalBruto = registros.reduce((sum, r) => sum + totalUnidades(r.totalFlanes, r.totalUnidades), 0);
  const porcentajeBajas = totalBruto > 0 ? ((totalBajas / totalBruto) * 100).toFixed(1) : '0.0';

  const stats = [
    { label: 'Registros en el período', value: registros.length, cls: '' },
    { label: 'Producción bruta', value: `${totalBruto} uds`, cls: 'blue' },
    { label: 'Producción neta', value: `${totalNeto} uds`, cls: 'green' },
    { label: '% de bajas', value: `${porcentajeBajas}%`, cls: 'red' },
  ];

  document.getElementById('statsReportes').innerHTML = stats.map(s => `
    <div class="stat-card ${s.cls}">
      <div class="label">${s.label}</div>
      <div class="value">${s.value}</div>
    </div>
  `).join('');
}

function renderChartTipos(registros) {
  const porTipo = {};
  TIPOS_HUEVO.forEach(t => porTipo[t] = 0);
  registros.forEach(r => {
    porTipo[r.tipo] = (porTipo[r.tipo] || 0) + calcularNeto(r);
  });

  const maxVal = Math.max(...Object.values(porTipo), 1);
  const container = document.getElementById('chartTipos');
  container.innerHTML = Object.entries(porTipo).map(([tipo, val]) => {
    const heightPct = Math.round((val / maxVal) * 100);
    return `
      <div class="chart-col">
        <div class="val">${val}</div>
        <div class="chart-bar" style="height:${Math.max(heightPct, 3)}%;"></div>
        <div class="lbl">${tipo}</div>
      </div>
    `;
  }).join('');
}

function exportarExcel() {
  const registros = obtenerRegistrosFiltrados();
  if (registros.length === 0) {
    alert('No hay registros en el rango seleccionado para exportar.');
    return;
  }
  generarArchivoExcel(registros);
}

function enviarPorWhatsapp() {
  const registros = obtenerRegistrosFiltrados();
  if (registros.length === 0) {
    alert('No hay registros en el rango seleccionado para enviar.');
    return;
  }

  generarArchivoExcel(registros);

  const desde = document.getElementById('filtroDesde').value;
  const hasta = document.getElementById('filtroHasta').value;
  const rango = (desde || hasta)
    ? `del ${desde ? formatFecha(desde) : '...'} al ${hasta ? formatFecha(hasta) : 'hoy'}`
    : '(todos los registros)';
  const totalNeto = registros.reduce((s, r) => s + calcularNeto(r), 0);

  const mensaje = `Hola, te comparto el reporte de producción de Avícola R&R ${rango}.\nProducción neta total: ${totalNeto} unidades.\n(Se acaba de descargar el archivo Excel en este equipo, por favor adjúntalo a este chat).`;

  const numero = getWhatsappReportes();
  window.open(toWaLink(numero, mensaje), '_blank');
}

function generarArchivoExcel(registros) {
  const filas = registros.map(r => ({
    Fecha: formatFecha(r.fecha),
    Tipo: r.tipo,
    'Total flanes': r.totalFlanes,
    'Total unidades sueltas': r.totalUnidades,
    'Total en unidades': totalUnidades(r.totalFlanes, r.totalUnidades),
    'Bajas flanes': r.bajaFlanes,
    'Bajas unidades sueltas': r.bajaUnidades,
    'Bajas en unidades': totalUnidades(r.bajaFlanes, r.bajaUnidades),
    'Neto (unidades)': calcularNeto(r),
    Observaciones: r.observaciones || '',
  }));

  const ws = XLSX.utils.json_to_sheet(filas);
  ws['!cols'] = [
    { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 18 },
    { wch: 16 }, { wch: 12 }, { wch: 18 }, { wch: 16 },
    { wch: 16 }, { wch: 30 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Producción');

  const fechaArchivo = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `avicola-rr-produccion-${fechaArchivo}.xlsx`);
}

window.refrescarReportes = refrescarReportes;
