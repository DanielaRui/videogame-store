// frontend/service-worker.js
const CACHE_NAME = 'gameshop-v1';
const ASSETS = [
  '/',               // la raíz
  '/index.html',
  '/css/styles.css',
  '/js/app.js',
  '/manifest.json',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(resp => resp || fetch(e.request))
  );
});
