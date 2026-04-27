const rol    = localStorage.getItem('bikesos_rol_usuario');
const nombre = localStorage.getItem('bikesos_nombre_usuario');
if (!nombre || rol !== 'usuario') window.location.href = './login.html';
document.getElementById('userName').textContent = nombre;

document.getElementById('btnLogout').addEventListener('click', () => {
  localStorage.removeItem('bikesos_rol_usuario');
  localStorage.removeItem('bikesos_nombre_usuario');
  localStorage.removeItem('bikesos_cobro');
  localStorage.removeItem('bikesos_pago_confirmado');
  window.location.href = './login.html';
});

document.getElementById('problema').addEventListener('change', function () {
  const campoRodado = document.getElementById('campoRodado');
  campoRodado.classList.toggle('hidden', this.value !== 'rueda pinchada');
  if (this.value !== 'rueda pinchada') document.getElementById('rodado').value = '';
});

document.getElementById('btnSolicitar').addEventListener('click', () => {
  const ubicacion = document.getElementById('ubicacion').value.trim();
  const problema  = document.getElementById('problema').value;
  if (!ubicacion || !problema) {
    showToast('⚠️ Completá la ubicación y el problema.', 'warning');
    return;
  }
  if (problema === 'rueda pinchada' && !document.getElementById('rodado').value) {
    showToast('⚠️ Seleccioná el rodado de la bicicleta.', 'warning');
    return;
  }

  // Publicar solicitud para que el mecánico la vea
  localStorage.setItem('bikesos_solicitud', JSON.stringify({
    nombre,
    ubicacion,
    problema,
    rodado: document.getElementById('rodado')?.value || '',
    timestamp: Date.now()
  }));
  localStorage.setItem('bikesos_ultima_solicitud', JSON.stringify({ ubicacion, problema }));

  document.getElementById('sectionRequest').classList.add('hidden');
  document.getElementById('sectionTracking').classList.remove('hidden');
  esperarAceptacion();
});

document.getElementById('btnCancelar').addEventListener('click', () => {
  localStorage.removeItem('bikesos_solicitud');
  document.getElementById('sectionTracking').classList.add('hidden');
  document.getElementById('sectionRequest').classList.remove('hidden');
  showToast('Solicitud cancelada.');
});

// Esperar que el mecánico acepte
function esperarAceptacion() {
  const check = setInterval(() => {
    const aceptada = localStorage.getItem('bikesos_aceptada');
    if (aceptada) {
      clearInterval(check);
      const data = JSON.parse(aceptada);
      document.getElementById('ts2').classList.add('active');
      document.getElementById('trackingMsg').textContent = `Mecánico ${data.mecanico} aceptó tu solicitud 🛠️`;
      setTimeout(() => {
        document.getElementById('ts3').classList.add('active');
        document.getElementById('trackingMsg').textContent = `${data.mecanico} está en camino 🚴`;
      }, 4000);
      setTimeout(() => {
        document.getElementById('ts4').classList.add('active');
        document.getElementById('trackingMsg').textContent = '¡El mecánico llegó! Mostrá esta pantalla 🎉';
        document.getElementById('btnCancelar').style.display = 'none';
      }, 9000);
    }
  }, 1000);
}

window.addEventListener('storage', e => {
  if (e.key === 'bikesos_cobro' && e.newValue) mostrarPago(JSON.parse(e.newValue));
});

function mostrarPago(cobro) {
  document.getElementById('sectionTracking').classList.add('hidden');
  document.getElementById('sectionPago').classList.remove('hidden');
  document.getElementById('montoPagar').textContent = cobro.monto;
  document.getElementById('numTarjeta').addEventListener('input', function () {
    this.value = this.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
  });
  document.getElementById('vencimiento').addEventListener('input', function () {
    this.value = this.value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
  });
}

document.getElementById('btnPagar').addEventListener('click', () => {
  const num  = document.getElementById('numTarjeta').value.replace(/\s/g, '');
  const venc = document.getElementById('vencimiento').value;
  const cvv  = document.getElementById('cvv').value;
  if (num.length < 16 || venc.length < 5 || cvv.length < 3) {
    showToast('⚠️ Completá todos los datos de la tarjeta.', 'warning');
    return;
  }
  const monto = document.getElementById('montoPagar').textContent;
  localStorage.setItem('bikesos_pago_confirmado', JSON.stringify({ monto, timestamp: Date.now() }));
  document.getElementById('sectionPago').classList.add('hidden');
  document.getElementById('sectionCalificacion').classList.remove('hidden');
  showToast('💳 Pago confirmado. ¡Gracias!', 'success');
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
  showToast(`⭐ ¡Gracias por calificar con ${this.dataset.rating} estrellas!`, 'success');
  document.getElementById('sectionCalificacion').classList.add('hidden');

  // Guardar en historial
  const historial = JSON.parse(localStorage.getItem('bikesos_historial_usuario') || '[]');
  const solicitud = JSON.parse(localStorage.getItem('bikesos_ultima_solicitud') || '{}');
  historial.unshift({
    fecha: new Date().toLocaleDateString('es-AR'),
    problema: solicitud.problema || 'Servicio',
    ubicacion: solicitud.ubicacion || '',
    calificacion: this.dataset.rating
  });
  localStorage.setItem('bikesos_historial_usuario', JSON.stringify(historial));
  renderHistorial();

  const fin = document.createElement('section');
  fin.className = 'dash-card';
  fin.innerHTML = `
    <div style="text-align:center; padding:1rem 0">
      <span style="font-size:3.5rem">🚴</span>
      <h2 style="margin-top:1rem">¡Hasta la próxima!</h2>
      <p style="color:#888; margin-top:0.5rem">Gracias por usar BikeSOS. ¡Buen viaje!</p>
    </div>
  `;
  document.querySelector('.dashboard').insertBefore(fin, document.getElementById('sectionHistorial'));
});

function renderHistorial() {
  const historial = JSON.parse(localStorage.getItem('bikesos_historial_usuario') || '[]');
  const lista = document.getElementById('listaHistorial');
  if (!historial.length) return;
  lista.innerHTML = historial.map(h => `
    <div class="solicitud-card">
      <div class="sol-info">
        <strong>${h.problema}</strong>
        <span>📍 ${h.ubicacion}</span>
        <span>📅 ${h.fecha}</span>
      </div>
      <span style="color:#ff6a00; font-size:1.1rem">${'★'.repeat(h.calificacion)}</span>
    </div>
  `).join('');
}

renderHistorial();
