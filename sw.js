self.addEventListener('fetch', () => {
  // literally does nothing
});


var CACHE_NAME = 'static-v1';

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll([
        '/',
        `/assets/images/image01.png`,
        `/assets/main.css`,
        `/assets/main.js`,
        `/scripts/main.min.js`,
      ]);
    })
  )
});

self.addEventListener('activate', function activator(event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys
        .filter(function (key) {
          return key.indexOf(CACHE_NAME) !== 0;
        })
        .map(function (key) {
          return caches.delete(key);
        })
      );
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (cachedResponse) {
      return cachedResponse || fetch(event.request);
    })
  );
});

importScripts('https://cdn.ampproject.org/sw/amp-sw.js');
AMP_SW.init({
  assetCachingOpitions: [
    {
      regexp:/\.(png|jpg|svg|webp)/,
      cachingStrategy: 'CACHE_FIRST'
  },
  {
    regexp: /\.(js|css)/,
    cachingStrategy: 'STALE_WHILE_REVALIDADATE'
     }
  ],
  offlinePageOptions: {
    url: '/offline.html',
    assets: []
  }
});