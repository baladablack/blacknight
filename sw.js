var CACHE_VERSION = 'my-site-cache-v1';
var urlsToCache = [
  '/',
  '/about-us/',
  '/contact-us/',
  '/wp-content/themes/pwa-theme/dist/main.css',
  '/wp-conßtent/themes/pwa-theme/dist/bundle.js'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});


self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// CODELAB: Update cache names any time any of the cached files change.
const FILES_TO_CACHE = [
  '/offline.html',
];

// CODELAB: Precache static resources here.
evt.waitUntil(
  caches.open(CACHE_NAME).then((cache) => {
    console.log('[ServiceWorker] Pre-caching offline page');
    return cache.addAll(FILES_TO_CACHE);
  })
);

// CODELAB: Remove previous cached data from disk.
evt.waitUntil(
  caches.keys().then((keyList) => {
    return Promise.all(keyList.map((key) => {
      if (key !== CACHE_NAME) {
        console.log('[ServiceWorker] Removing old cache', key);
        return caches.delete(key);
      }
    }));
  })
);
