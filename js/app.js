// ---------- Sesión y navegación general del panel ----------

(function () {
  const session = sessionStorage.getItem('avicola_session');
  if (!session) {
    window.location.href = 'index.html';
    return;
  }
  const data = JSON.parse(session);
  document.getElementById('welcomeName').textContent = data.nombre || 'Juan';
})();

document.getElementById('logoutBtn').addEventListener('click', () => {
  sessionStorage.removeItem('avicola_session');
  window.location.href = 'index.html';
});

const navItems = document.querySelectorAll('.nav-item[data-view]');
const views = {
  registros: document.getElementById('view-registros'),
  reportes: document.getElementById('view-reportes'),
  ajustes: document.getElementById('view-ajustes'),
};
const viewTitle = document.getElementById('viewTitle');
const titles = {
  registros: 'Registros de producción',
  reportes: 'Reportes y exportación',
  ajustes: 'Ajustes y soporte',
};
const navLinks = document.getElementById('navLinks');
const hamburgerBtn = document.getElementById('hamburgerBtn');

navItems.forEach(btn => {
  btn.addEventListener('click', () => {
    navItems.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const view = btn.dataset.view;
    Object.keys(views).forEach(key => {
      views[key].style.display = key === view ? '' : 'none';
    });
    viewTitle.textContent = titles[view];
    if (view === 'reportes' && window.refrescarReportes) {
      window.refrescarReportes();
    }
    navLinks.classList.remove('open');
  });
});

hamburgerBtn.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Seed inicial + primer render de reportes (que ahora concentra toda la data)
seedIfEmpty();
if (window.refrescarReportes) window.refrescarReportes();
