// Timeline animado con scroll
const timelineItems = document.querySelectorAll('.timeline-item');
const timelineLine  = document.querySelector('.timeline-line');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.3 });

timelineItems.forEach(item => observer.observe(item));

const lineObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) timelineLine.classList.add('animate');
  });
}, { threshold: 0.1 });

if (timelineLine) lineObserver.observe(timelineLine);

// Tema claro/oscuro
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('bikesos_theme');
if (savedTheme === 'light') { document.body.classList.add('light'); themeToggle.textContent = '☀️'; }
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
  const isLight = document.body.classList.contains('light');
  themeToggle.textContent = isLight ? '☀️' : '🌙';
  localStorage.setItem('bikesos_theme', isLight ? 'light' : 'dark');
});

// Animaciones fade-scroll
const fadeScrollObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 120);
      fadeScrollObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('.fade-scroll').forEach(el => fadeScrollObserver.observe(el));

const statNums = document.querySelectorAll('.stat-num');
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = +el.dataset.target;
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = Math.floor(current).toLocaleString();
      }, 16);
      statsObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
statNums.forEach(n => statsObserver.observe(n));

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const headerH = document.querySelector('.header').offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// Botón "Pedir ayuda ahora" → redirige al login
document.getElementById('btnHelp').addEventListener('click', () => {
  localStorage.setItem('bikesos_redirect', 'dashboard-usuario.html');
  window.location.href = './login.html';
});
