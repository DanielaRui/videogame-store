// frontend/service-worker.js
const CACHE_NAME = 'gameshop-v7';

// Archivos estáticos mínimos para que la app cargue offline
const ASSETS = [
  '/',                 // raíz
  '/index.html',
  '/manifest.json',
  '/css/styles.css',
  '/js/app.js',
  '/navbar.html',
  '/nav.js',
  '/js/weather.js',
  // agrega aquí otras rutas estáticas que quieras precachear
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting(); // toma control sin esperar
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(n => n !== CACHE).map(n => caches.delete(n)));
    await self.clients.claim(); // controla todas las pestañas abiertas
  })());
});

// Estrategias:
// - Iconos OpenWeather: cache-first
// - HTML y APIs: network-first (con fallback a cache o '/')
// - Estáticos locales: cache-first
self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);

  // 1) Iconos de OpenWeather (https://openweathermap.org/img/wn/..)
  if (url.hostname.includes('openweathermap.org') && url.pathname.includes('/img/wn/')) {
    e.respondWith((async () => {
      const cached = await caches.match(req);
      if (cached) return cached;
      const res = await fetch(req);
      const cache = await caches.open(CACHE);
      cache.put(req, res.clone());
      return res;
    })());
    return;
  }

  // 2) HTML y APIs → network-first
  const isHTML = req.headers.get('accept')?.includes('text/html');
  const isAPI  = url.pathname.startsWith('/api/');
  if (isHTML || isAPI) {
    e.respondWith((async () => {
      try {
        // intenta red primero (mejor dato)
        const fresh = await fetch(req);
        // opcional: guarda respuesta HTML en cache para fallback futuro
        if (isHTML && fresh.ok) {
          const cache = await caches.open(CACHE);
          cache.put(req, fresh.clone());
        }
        return fresh;
      } catch {
        // si no hay red, intenta caché o fallback a '/'
        return (await caches.match(req)) || (await caches.match('/'));
      }
    })());
    return;
  }

  // 3) Estáticos locales → cache-first
  e.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;
    try {
      const res = await fetch(req);
      // guarda solo si es mismo origen (evita llenar cache con todo internet)
      if (url.origin === location.origin) {
        const cache = await caches.open(CACHE);
        cache.put(req, res.clone());
      }
      return res;
    } catch {
      // si falla y no hay caché, no hay mucho que hacer
      return cached || Response.error();
    }
  })());
});
