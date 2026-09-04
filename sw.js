const CACHE_NAME = 'biblioteca-promps-v3.9';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/test.html',
  '/generar-iconos.html',
  '/css/styles.css',
  '/js/app.js',
  '/js/ai-chat.js',
  '/js/agent-tools.js',
  '/js/store.js',
  '/js/crypto.js',
  '/js/usage-tracker.js',
  '/js/lib-loader.js',
  '/js/prompts-data.js',
  '/js/prompts-data-extra.js',
  '/js/prompts-data-v2.js',
  '/js/prompts-data-fullstack.js',
  '/js/platform-tests.js',
  '/js/bpi-worker.js',
  '/js/vendor/dompurify.min.js',
  '/js/vendor/dexie.min.js',
  '/js/vendor/jspdf.umd.min.js',
  '/js/vendor/xlsx.full.min.js',
  '/js/vendor/highlight.min.js',
  '/js/vendor/mermaid.min.js',
  '/js/vendor/jszip.min.js',
  '/js/vendor/marked.min.js',
  '/css/highlight-github-dark.min.css',
  '/manifest.json',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg',
  '/icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        // Cache each asset individually so one failure doesn't block the rest
        return Promise.allSettled(
          ASSETS_TO_CACHE.map((asset) =>
            cache.add(asset).catch((err) => {
              console.warn('[SW] Failed to cache:', asset, err.message);
            })
          )
        );
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => Promise.all(cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Fonts: cache-first with network fallback
  if (url.origin === 'https://fonts.gstatic.com' || url.origin === 'https://fonts.googleapis.com') {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(event.request).then((cached) => {
          if (cached) return cached;
          return fetch(event.request)
            .then((response) => {
              if (response && response.status === 200) {
                cache.put(event.request, response.clone());
              }
              return response;
            })
            .catch(() => new Response('', { status: 504 }));
        })
      )
    );
    return;
  }

  // Navegaciones (documentos HTML): PRIORIDAD-RED con fallback a caché.
  // Así el usuario siempre ve la última versión del index.html cuando hay red
  // (evita el "no veo el botón nuevo" por caché obsoleta), y funciona offline si no.
  if (event.request.mode === 'navigate' || event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match('/index.html')))
    );
    return;
  }

  // App assets: stale-while-revalidate strategy
  // (todos los scripts son locales desde v3.6 — sin dependencias de CDN)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
        });

      return cachedResponse || fetchPromise;
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
