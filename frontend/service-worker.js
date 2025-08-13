// frontend/service-worker.js
// 📦 Versiona al cambiar (para forzar actualización)
const CACHE_STATIC  = 'gs-static-v1';
const CACHE_RUNTIME = 'gs-runtime-v1';
const OFFLINE_URL   = '/offline.html';

// Precarga de assets esenciales
const ASSETS = [
  '/',                // raíz (sirve index.html)
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/css/styles.css',
  '/js/app.js',
  '/navbar.html',
  '/nav.js',
  '/js/weather.js',
  // si tienes imágenes/logo propios, agrégalos aquí
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_STATIC);
    await cache.addAll(ASSETS);
  })());
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter(k => k !== CACHE_STATIC && k !== CACHE_RUNTIME)
        .map(k => caches.delete(k))
    );
    await self.clients.claim();
  })());
});

// Estrategias:
// - Navegación/HTML: network-first con fallback a cache y luego offline.html
// - Estáticos mismo origen: cache-first (con actualización diferida)
// - Iconos de OpenWeather: cache-first
// - Resto (cross-origin): network-first con fallback a cache
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Solo GET
  if (req.method !== 'GET') return;

  // 1) Iconos de OpenWeather
  if (url.hostname.includes('openweathermap.org') && url.pathname.includes('/img/wn/')) {
    event.respondWith((async () => {
      const cached = await caches.match(req);
      if (cached) return cached;
      try {
        const res = await fetch(req);
        const cache = await caches.open(CACHE_RUNTIME);
        cache.put(req, res.clone());
        return res;
      } catch (e) {
        // Si falla, no hay buen placeholder; devuelve 504 controlado
        return new Response('', { status: 504, statusText: 'Icon unavailable offline' });
      }
    })());
    return;
  }

  // 2) Navegaciones/HTML (Accept: text/html o mode 'navigate')
  const isNav = req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html');
  if (isNav) {
    event.respondWith((async () => {
      try {
        // red primero
        const fresh = await fetch(req);
        // cachea copia para futuros offline
        const cache = await caches.open(CACHE_STATIC);
        cache.put(req, fresh.clone());
        return fresh;
      } catch {
        // fallback a cache o a offline.html
        const cached = await caches.match(req);
        return cached || (await caches.match(OFFLINE_URL));
      }
    })());
    return;
  }

  // 3) Estáticos mismo origen → cache-first
  if (url.origin === location.origin) {
    event.respondWith((async () => {
      const cached = await caches.match(req);
      if (cached) return cached;
      try {
        const res = await fetch(req);
        const cache = await caches.open(CACHE_STATIC);
        cache.put(req, res.clone());
        return res;
      } catch {
        // Si no hay cache ni red, error controlado
        return new Response('', { status: 504, statusText: 'Asset unavailable offline' });
      }
    })());
    return;
  }

  // 4) Cross-origin genérico → network-first con fallback a cache
  event.respondWith((async () => {
    try {
      const res = await fetch(req);
      const cache = await caches.open(CACHE_RUNTIME);
      cache.put(req, res.clone());
      return res;
    } catch {
      const cached = await caches.match(req);
      return cached || new Response('', { status: 504, statusText: 'Resource unavailable offline' });
    }
  })());
});
