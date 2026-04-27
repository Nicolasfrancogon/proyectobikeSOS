const roleBtns  = document.querySelectorAll('.role-btn');
const tabBtns   = document.querySelectorAll('.tab-btn');
const btnSubmit = document.getElementById('btnSubmit');
const btnReg    = document.getElementById('btnRegister');
let rolSeleccionado = 'usuario';

// Si viene del boton pedir ayuda, mostrar mensaje y preseleccionar ciclista
if (localStorage.getItem('bikesos_redirect')) {
  const subtitle = document.querySelector('.auth-subtitle');
  if (subtitle) {
    subtitle.textContent = '🚨 Ingresá o creá tu cuenta para pedir ayuda';
    subtitle.style.color = '#ff6a00';
  }
}

roleBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    roleBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    rolSeleccionado = btn.dataset.role;
    const label = rolSeleccionado === 'usuario' ? 'ciclista' : 'mecánico';
    btnSubmit.textContent = `Ingresar como ${label}`;
    btnReg.textContent    = `Crear cuenta como ${label}`;
    document.getElementById('campoMovilidad').classList.toggle('hidden', rolSeleccionado !== 'mecanico');
  });
});

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const tab = btn.dataset.tab;
    document.getElementById('loginForm').classList.toggle('hidden', tab !== 'ingresar');
    document.getElementById('registerForm').classList.toggle('hidden', tab !== 'registrar');
  });
});

document.getElementById('loginForm').addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  localStorage.setItem('bikesos_rol_' + rolSeleccionado, rolSeleccionado);
  localStorage.setItem('bikesos_nombre_' + rolSeleccionado, email.split('@')[0]);
  redirigir();
});

document.getElementById('registerForm').addEventListener('submit', e => {
  e.preventDefault();
  const pass  = document.getElementById('regPassword').value;
  const pass2 = document.getElementById('regPassword2').value;
  if (pass !== pass2) { showToast('⚠️ Las contraseñas no coinciden.'); return; }
  if (rolSeleccionado === 'mecanico') {
    const movilidad = document.getElementById('movilidad').value;
    if (!movilidad) { showToast('⚠️ Seleccioná tu movilidad.'); return; }
    localStorage.setItem('bikesos_movilidad', movilidad);
  }
  const nombre = document.getElementById('regNombre').value.split(' ')[0];
  localStorage.setItem('bikesos_rol_' + rolSeleccionado, rolSeleccionado);
  localStorage.setItem('bikesos_nombre_' + rolSeleccionado, nombre);
  showToast('✅ Cuenta creada. ¡Bienvenido!');
  setTimeout(redirigir, 1000);
});

function redirigir() {
  const redirect = localStorage.getItem('bikesos_redirect');
  localStorage.removeItem('bikesos_redirect');
  window.location.href = redirect || (rolSeleccionado === 'usuario'
    ? './dashboard-usuario.html'
    : './dashboard-mecanico.html');
}

