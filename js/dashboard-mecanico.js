const rol      = localStorage.getItem('bikesos_rol_mecanico');
const nombre   = localStorage.getItem('bikesos_nombre_mecanico');
const movilidad = localStorage.getItem('bikesos_movilidad') || 'bicicleta';
if (!nombre || rol !== 'mecanico') window.location.href = './login.html';

document.getElementById('userName').textContent = nombre;

// Perfil del mecanico
const movEmoji = { bicicleta: '🚲', moto: '🏍️', auto: '🚗', 'a pie': '🚶' };
document.getElementById('perfilNombre').textContent = nombre;
document.getElementById('perfilMovilidad').textContent = (movEmoji[movilidad] || '🚲') + ' ' + movilidad;
const califPromedio = localStorage.getItem('bikesos_calif_mecanico') || '5.0';
document.getElementById('perfilCalif').textContent = califPromedio;

document.getElementById('btnLogout').addEventListener('click', () => {
  localStorage.removeItem('bikesos_rol_mecanico');
  localStorage.removeItem('bikesos_nombre_mecanico');
  localStorage.removeItem('bikesos_cobro');
  localStorage.removeItem('bikesos_pago_confirmado');
  localStorage.removeItem('bikesos_aceptada');
  window.location.href = './login.html';
});

document.getElementById('toggleDisponible').addEventListener('change', function () {
  document.getElementById('statusLabel').textContent = this.checked ? 'Disponible' : 'No disponible';
});

let solicitudActual = null;
let estadoActual = 1;
const estados = ['ms1', 'ms2', 'ms3', 'ms4'];

window.addEventListener('storage', e => {
  if (e.key === 'bikesos_solicitud' && e.newValue) mostrarSolicitudReal(JSON.parse(e.newValue));
  if (e.key === 'bikesos_pago_confirmado' && e.newValue) {
    document.getElementById('sectionCobroEspera').classList.add('hidden');
    document.getElementById('sectionTrabajo').classList.remove('hidden');
    document.getElementById('ms4').classList.add('active');
    document.getElementById('btnCompletar').style.display = 'inline-block';
    showToast('💰 ¡Pago recibido! ' + JSON.parse(e.newValue).monto, 'success');
  }
});

const solicitudPendiente = localStorage.getItem('bikesos_solicitud');
if (solicitudPendiente) setTimeout(() => mostrarSolicitudReal(JSON.parse(solicitudPendiente)), 500);

function mostrarSolicitudReal(sol) {
  const lista = document.getElementById('listaSolicitudes');
  const noSol = document.getElementById('noSolicitudes');
  if (document.getElementById('solicitud-real')) return;

  // Notificacion sonora
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.setValueAtTime(660, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);
  } catch(e) {}

  noSol.style.display = 'none';
  const card = document.createElement('div');
  card.className = 'solicitud-card';
  card.id = 'solicitud-real';
  card.innerHTML = `
    <div class="sol-info">
      <strong>${sol.nombre} 🔴 En vivo</strong>
      <span>📍 ${sol.ubicacion}</span>
      <span>🔧 ${sol.problema}${sol.rodado ? ' — ' + sol.rodado : ''}</span>
    </div>
    <button class="btn-primary btn-aceptar">Aceptar</button>
  `;
  lista.prepend(card);
  card.querySelector('.btn-aceptar').addEventListener('click', () => {
    localStorage.removeItem('bikesos_solicitud');
    localStorage.setItem('bikesos_aceptada', JSON.stringify({ mecanico: nombre, timestamp: Date.now() }));
    aceptarSolicitud({ ...sol, monto: '$2.500' });
    card.remove();
  });
}

function aceptarSolicitud(sol) {
  solicitudActual = sol;
  estadoActual = 1;
  document.getElementById('listaSolicitudes').innerHTML = '';
  document.getElementById('noSolicitudes').style.display = 'block';
  document.getElementById('noSolicitudes').textContent = 'No hay más solicitudes.';
  document.getElementById('sectionTrabajo').classList.remove('hidden');
  document.getElementById('trabajoDetalle').innerHTML = `
    <div class="sol-info" style="margin-bottom:1rem">
      <strong>${sol.nombre}</strong>
      <span>📍 ${sol.ubicacion}</span>
      <span>🔧 ${sol.problema}</span>
      <span>💰 Monto estimado: <strong>${sol.monto}</strong></span>
    </div>
  `;
  showToast('✅ Aceptaste la solicitud de ' + sol.nombre);
}

document.getElementById('btnAvanzar').addEventListener('click', () => {
  estadoActual++;
  if (estadoActual <= 3) document.getElementById(estados[estadoActual - 1]).classList.add('active');
  if (estadoActual === 3) {
    document.getElementById('btnAvanzar').style.display = 'none';
    document.getElementById('btnCobrar').style.display = 'inline-block';
  }
});

document.getElementById('btnCobrar').addEventListener('click', () => {
  localStorage.setItem('bikesos_cobro', JSON.stringify({
    monto: solicitudActual.monto,
    mecanico: nombre,
    timestamp: Date.now()
  }));
  document.getElementById('btnCobrar').style.display = 'none';
  document.getElementById('sectionTrabajo').classList.add('hidden');
  document.getElementById('sectionCobroEspera').classList.remove('hidden');
  showToast('💳 Solicitud de pago enviada al cliente...');
});

document.getElementById('btnCompletar').addEventListener('click', () => {
  localStorage.removeItem('bikesos_cobro');
  localStorage.removeItem('bikesos_pago_confirmado');
  localStorage.removeItem('bikesos_aceptada');
  document.getElementById('btnCompletar').style.display = 'none';
  document.getElementById('sectionTrabajo').classList.add('hidden');
  document.getElementById('sectionCalificacion').classList.remove('hidden');
});

document.querySelectorAll('.star').forEach(star => {
  star.addEventListener('click', function () {
    const val = this.dataset.val;
    document.querySelectorAll('.star').forEach(s => s.classList.toggle('active', s.dataset.val <= val));
    document.getElementById('btnEnviarCalif').disabled = false;
    document.getElementById('btnEnviarCalif').dataset.rating = val;
  });
});

document.getElementById('btnEnviarCalif').addEventListener('click', function () {
  const rating = this.dataset.rating;
  // Actualizar promedio
  const prev = parseFloat(localStorage.getItem('bikesos_calif_mecanico') || '5.0');
  const nuevo = ((prev + parseFloat(rating)) / 2).toFixed(1);
  localStorage.setItem('bikesos_calif_mecanico', nuevo);
  document.getElementById('perfilCalif').textContent = nuevo;

  showToast('⭐ Calificación de ' + rating + ' estrellas enviada. ¡Gracias!', 'success');
  document.getElementById('sectionCalificacion').classList.add('hidden');
  estadoActual = 1;
  estados.forEach(id => document.getElementById(id).classList.remove('active'));
  document.getElementById('ms1').classList.add('active');
  document.getElementById('btnAvanzar').style.display = 'inline-block';
});
