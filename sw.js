const CACHE_NAME = 'modexa-cache-v1';
const ASSETS_TO_CACHE = [
  './public/index.html',
  './public/products.html',
  './public/product.html',
  './src/assets/styles/style_one.css',
  './src/assets/styles/style_two.css',
  './src/assets/styles/style_three.css',
  './src/assets/styles/carousel.css',
  './src/js/main.js',
  './src/js/products.js',
  './src/js/cart.js',
  './src/js/security.js',
  './src/js/steganography.js',
  './src/assets/icons/icon-192.png',
  './src/assets/icons/icon-512.png',
  './src/assets/icons/favicon.ico',
  './src/assets/images/carousel/carousel_1.png',
  './src/assets/images/carousel/carousel_2.png',
  './src/assets/images/carousel/carousel_3.png',
  './src/assets/images/carousel/carousel_4.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return Promise.allSettled(
          ASSETS_TO_CACHE.map(asset => {
            return cache.add(asset).catch(() => {});
          })
        );
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        if (event.request.destination === 'image') {
          return cachedResponse;
        }

        const fetchPromise = fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, networkResponse.clone());
            });
          }
          return networkResponse;
        }).catch(() => {});

        return cachedResponse || fetchPromise;
      }

      return fetch(event.request).then(networkResponse => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {});
    })
  );
});
