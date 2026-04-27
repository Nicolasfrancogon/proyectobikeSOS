function showToast(msg, type = 'info') {
  const bg = type === 'warning' ? '#e05a00' : type === 'success' ? '#1a7a3a' : '#1e1e1e';
  const toast = document.createElement('div');
  toast.textContent = msg;
  toast.style.cssText = `
    position:fixed; bottom:2rem; left:50%; transform:translateX(-50%);
    background:${bg}; color:#fff; padding:1rem 1.8rem;
    border-radius:10px; font-size:0.95rem; z-index:300;
    box-shadow:0 8px 24px rgba(0,0,0,0.3);
    animation: slideUp 0.3s ease;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}
