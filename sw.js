/* Service Worker — Mania de Pizza V3
 * Estratégia: network-first para HTML/API; cache-first para assets estáticos.
 */
const CACHE_NAME = 'mdp-v3-2026-04-26';
const ASSETS = [
  '/index.html',
  '/css/global.css',
  '/js/security.js',
  '/js/api.js',
  '/js/ui.js',
  '/js/qr-core.js',
  '/js/validators.js',
  '/manifest.json'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS).catch(() => {})));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Não cachear API
  if (url.pathname.indexOf('/tables/') >= 0) return;
  if (e.request.method !== 'GET') return;

  if (e.request.destination === 'document' || url.pathname.endsWith('.html')) {
    e.respondWith(
      fetch(e.request)
        .then(r => { caches.open(CACHE_NAME).then(c => c.put(e.request, r.clone())); return r; })
        .catch(() => caches.match(e.request).then(c => c || caches.match('/index.html')))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(c => c || fetch(e.request).then(r => {
      caches.open(CACHE_NAME).then(c2 => c2.put(e.request, r.clone()));
      return r;
    }).catch(() => new Response('Offline')))
  );
});
