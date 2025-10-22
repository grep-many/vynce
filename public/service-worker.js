const CACHE_NAME = 'vynce-cache-v1';
const URLS_TO_CACHE = ['/']; // cache homepage or other static pages

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE)),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // 🚫 Skip API calls and non-GET requests
  if (
    request.url.includes('/api') ||
    request.url.includes('chrome-extension') ||
    request.method !== 'GET'
  ) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(request)
        .then((networkResponse) => {
          // Dynamically cache static assets/pages only
          const clonedResponse = networkResponse.clone();

          if (
            networkResponse.ok &&
            !request.url.includes('/api') &&
            request.url.startsWith(self.location.origin)
          ) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, clonedResponse);
            });
          }

          return networkResponse;
        })
        .catch(() => caches.match('/')); // fallback to cached homepage
    }),
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName))
            return caches.delete(cacheName);
        }),
      ),
    ),
  );
});
