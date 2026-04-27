const scene    = new THREE.Scene();
const camera   = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bgCanvas'), alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
camera.position.z = 20;

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function matNaranja(op = 0.3) {
  return new THREE.MeshStandardMaterial({ color: 0xff6a00, wireframe: true, transparent: true, opacity: op });
}
function matBlanco(op = 0.1) {
  return new THREE.MeshStandardMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: op });
}

const meshes = [];

function crearBicicleta(x, y, z, escala, naranja = true) {
  const grupo = new THREE.Group();
  const mat = naranja ? matNaranja(0.35) : matBlanco(0.15);
  const matAcc = naranja ? matBlanco(0.2) : matNaranja(0.2);

  // Ruedas
  const ruedaD = new THREE.Mesh(new THREE.TorusGeometry(1, 0.07, 16, 50), mat);
  ruedaD.position.set(1.8, 0, 0);
  grupo.add(ruedaD);

  const ruedaT = new THREE.Mesh(new THREE.TorusGeometry(1, 0.07, 16, 50), mat);
  ruedaT.position.set(-1.8, 0, 0);
  grupo.add(ruedaT);

  // Plato
  const plato = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.04, 8, 20), mat);
  plato.position.set(-0.3, -0.2, 0);
  grupo.add(plato);

  // Cuadro
  const tuboInf = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3.6, 8), mat);
  tuboInf.rotation.z = Math.PI / 2;
  tuboInf.position.set(0, -0.5, 0);
  grupo.add(tuboInf);

  const tuboDiag = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.8, 8), mat);
  tuboDiag.rotation.z = Math.PI / 5;
  tuboDiag.position.set(0.3, 0.3, 0);
  grupo.add(tuboDiag);

  const tuboVert = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.8, 8), mat);
  tuboVert.rotation.z = Math.PI / 8;
  tuboVert.position.set(1.4, 0.2, 0);
  grupo.add(tuboVert);

  const tuboAsiento = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.5, 8), mat);
  tuboAsiento.rotation.z = -Math.PI / 10;
  tuboAsiento.position.set(-0.5, 0.3, 0);
  grupo.add(tuboAsiento);

  // Manubrio y asiento
  const manubrio = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.6, 8), matAcc);
  manubrio.rotation.x = Math.PI / 2;
  manubrio.position.set(1.7, 1, 0);
  grupo.add(manubrio);

  const asiento = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.5, 8), matAcc);
  asiento.rotation.x = Math.PI / 2;
  asiento.position.set(-0.6, 1.1, 0);
  grupo.add(asiento);

  grupo.position.set(x, y, z);
  grupo.scale.set(escala, escala, escala);
  grupo.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

  grupo.userData = {
    rotSpeed: {
      x: (Math.random() - 0.5) * 0.004,
      y: (Math.random() - 0.5) * 0.008,
      z: (Math.random() - 0.5) * 0.003,
    },
    floatSpeed: Math.random() * 0.0008 + 0.0004,
    floatAmp: Math.random() * 1.5 + 0.5,
    floatOffset: Math.random() * Math.PI * 2,
    baseX: x,
    baseY: y,
    driftSpeed: (Math.random() - 0.5) * 0.002,
  };

  scene.add(grupo);
  meshes.push(grupo);
  return grupo;
}

function crearLlave(x, y, z, escala, naranja = true) {
  const grupo = new THREE.Group();
  const mat = naranja ? matNaranja(0.35) : matBlanco(0.15);
  const matAcc = naranja ? matBlanco(0.2) : matNaranja(0.2);

  const mango = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 4, 8), mat);
  mango.position.set(0, -1, 0);
  grupo.add(mango);

  const cabeza = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 0.2), mat);
  cabeza.position.set(0, 1.5, 0);
  grupo.add(cabeza);

  const mandFija = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.7, 0.2), mat);
  mandFija.position.set(0.35, 1.9, 0);
  grupo.add(mandFija);

  const mandMovil = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.5, 0.2), matAcc);
  mandMovil.position.set(-0.35, 1.8, 0);
  grupo.add(mandMovil);

  const tornillo = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.3, 8), matAcc);
  tornillo.rotation.z = Math.PI / 2;
  tornillo.position.set(0, 1.4, 0);
  grupo.add(tornillo);

  grupo.position.set(x, y, z);
  grupo.scale.set(escala, escala, escala);
  grupo.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

  grupo.userData = {
    rotSpeed: {
      x: (Math.random() - 0.5) * 0.005,
      y: (Math.random() - 0.5) * 0.009,
      z: (Math.random() - 0.5) * 0.004,
    },
    floatSpeed: Math.random() * 0.001 + 0.0005,
    floatAmp: Math.random() * 1.2 + 0.4,
    floatOffset: Math.random() * Math.PI * 2,
    baseX: x,
    baseY: y,
    driftSpeed: (Math.random() - 0.5) * 0.002,
  };

  scene.add(grupo);
  meshes.push(grupo);
  return grupo;
}

// 🚲 Bicicletas
crearBicicleta(-13, 5,  -3, 1.2, true);
crearBicicleta( 11, -4, -5, 1.0, false);
crearBicicleta(  0, 7,  -6, 0.9, true);
crearBicicleta(-10, -6, -4, 1.1, false);
crearBicicleta( 15, 3,  -7, 0.8, true);
crearBicicleta( -4, -9, -5, 1.0, false);

// 🔧 Llaves
crearLlave( 13,  6, -4, 1.2, true);
crearLlave( -7, -5, -3, 1.0, false);
crearLlave(  6, -8, -6, 0.9, true);

// Luces
scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const pointLight = new THREE.PointLight(0xff6a00, 2, 60);
pointLight.position.set(5, 5, 10);
scene.add(pointLight);

let tiempo = 0;

function animate() {
  requestAnimationFrame(animate);
  tiempo += 0.01;

  meshes.forEach(m => {
    // Rotación
    m.rotation.x += m.userData.rotSpeed.x;
    m.rotation.y += m.userData.rotSpeed.y;
    m.rotation.z += m.userData.rotSpeed.z;

    // Flotación suave en Y
    m.position.y = m.userData.baseY + Math.sin(tiempo * m.userData.floatSpeed * 100 + m.userData.floatOffset) * m.userData.floatAmp;

    // Deriva suave en X
    m.position.x = m.userData.baseX + Math.cos(tiempo * m.userData.floatSpeed * 60 + m.userData.floatOffset) * 0.8;
  });

  renderer.render(scene, camera);
}

animate();
