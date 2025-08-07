// frontend/js/app.js
const isLocalhost = ['localhost', '127.0.0.1'].includes(location.hostname);

if ('serviceWorker' in navigator && !isLocalhost) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js');
  });
}
