// frontend/js/app.js
// Registra el Service Worker también en localhost para poder probar offline.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('/service-worker.js', { scope: '/' });
      console.log('Service Worker registrado en:', reg.scope);

      // Logs útiles para depurar estados del SW
      reg.addEventListener('updatefound', () => {
        const sw = reg.installing;
        sw && sw.addEventListener('statechange', () => {
          console.log('[SW] state:', sw.state);
        });
      });

      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('[SW] ahora controla esta página');
      });
    } catch (err) {
      console.error('Error al registrar SW:', err);
    }
  });
}
