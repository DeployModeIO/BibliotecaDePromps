// Dos caches independientes: un bump futuro de APP_CACHE NO purga la librería
// vendor (~6,3 MB), que se revalida solo cuando cambia VENDOR_CACHE.
const APP_CACHE = 'biblioteca-promps-v4.0';
const VENDOR_CACHE = 'biblioteca-promps-vendor-v1';
const CACHE_NAMES = [APP_CACHE, VENDOR_CACHE];
const VENDOR_LIBS = ['marked.min.js', 'jszip.min.js', 'mermaid.min.js', 'jspdf.umd.min.js', 'xlsx.full.min.js'];

// Rutas RELATIVAS al scope del SW: se resuelven con new URL(asset, self.registration.scope)
// para que el precache funcione en GitHub Pages bajo /BibliotecaDePromps/.
const ASSETS_TO_CACHE = [
  // Páginas
  '',
  'index.html',
  'landing.html',
  // Estilos (el ?v= DEBE coincidir con el <link> de index.html/landing.html y
  // con el prefijo de version de APP_CACHE; nginx sirve el CSS con immutable 1y)
  'css/styles.css?v=4.0',
  'css/highlight-github-dark.min.css',
  // Manifiesto e iconos
  'manifest.json',
  'icons/icon-192.svg',
  'icons/icon-512.svg',
  'icons/icon-512.png',
  // Scripts de index.html (mismo orden de carga)
  'js/vendor/dompurify.min.js',
  'js/vendor/highlight.min.js',
  'js/lib-loader.js',
  'js/prompts-data.js',
  'js/prompts-data-extra.js',
  'js/prompts-data-v2.js',
  'js/prompts-data-fullstack.js',
  'js/prompts-data-industries.js',
  'js/prompts-data-community.js',
  'js/prompts-data-gpt4o.js',
  'js/prompts-simplified.js',
  'js/app-generator.js',
  'js/platform-tests.js',
  'js/crypto.js',
  'js/usage-tracker.js',
  'js/vendor/dexie.min.js',
  'js/store.js',
  'js/agent-tools.js',
  'js/ai-chat.js',
  'js/app.js',
  // Worker (new Worker('js/bpi-worker.js') desde app.js)
  'js/bpi-worker.js',
  // Vendor perezoso vía js/lib-loader.js (exportación offline) → VENDOR_CACHE
  'js/vendor/marked.min.js',
  'js/vendor/jszip.min.js',
  'js/vendor/mermaid.min.js',
  'js/vendor/jspdf.umd.min.js',
  'js/vendor/xlsx.full.min.js',
];

function assetUrl(asset) {
  return new URL(asset, self.registration.scope).href;
}

function cacheNameFor(url) {
  const file = url.pathname.split('/').pop();
  return VENDOR_LIBS.includes(file) ? VENDOR_CACHE : APP_CACHE;
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.allSettled(
      ASSETS_TO_CACHE.map((asset) => {
        const url = assetUrl(asset);
        return caches
          .open(cacheNameFor(new URL(url)))
          .then((cache) => cache.add(url))
          .catch((err) => {
            console.warn('[SW] Failed to cache:', asset, err.message);
          });
      })
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => Promise.all(cacheNames.filter((name) => !CACHE_NAMES.includes(name)).map((name) => caches.delete(name))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Fonts: cache-first with network fallback
  if (url.origin === 'https://fonts.gstatic.com' || url.origin === 'https://fonts.googleapis.com') {
    event.respondWith(
      caches.open(APP_CACHE).then((cache) =>
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
            caches.open(APP_CACHE).then((cache) => cache.put(event.request, copy));
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match(assetUrl('index.html'))))
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
            caches.open(cacheNameFor(url)).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          if (event.request.destination === 'document') {
            return caches.match(assetUrl('index.html'));
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
