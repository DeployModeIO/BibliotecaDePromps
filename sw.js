const CACHE_NAME = 'biblioteca-promps-v3.2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/app.js',
  '/js/prompts-data.js',
  '/js/prompts-data-extra.js',
  '/js/prompts-data-v2.js',
  '/js/platform-tests.js',
  '/manifest.json',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
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

  if (url.origin === 'https://fonts.gstatic.com' || url.origin === 'https://fonts.googleapis.com') {
    event.respondWith(
      caches
        .open(CACHE_NAME)
        .then((cache) =>
          cache.match(event.request).then((cached) => {
            if (cached) return cached;
            return fetch(event.request).then((response) => {
              if (response && response.status === 200) {
                cache.put(event.request, response.clone());
              }
              return response;
            });
          })
        )
        .catch(() => new Response('', { status: 504 }))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        })
        .catch(() => {
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
        });
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
