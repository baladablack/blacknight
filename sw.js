self.addEventListener('fetch', () => {
  // literally does nothing
});

const version = "0.6.18";
const cacheName = `airhorner-${version}`;
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll([
        `/assets/images/image01.png`,
        `/assets/main.css`,
        `/assets/main.js`,
        `/scripts/main.min.js`,
        `/scripts/comlink.global.js`,
        `/scripts/messagechanneladapter.global.js`,
        `/scripts/pwacompat.min.js`,
        `/sounds/airhorn.mp3`
      ])
          .then(() => self.skipWaiting());
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(cacheName)
      .then(cache => cache.match(event.request, {ignoreSearch: true}))
      .then(response => {
      return response || fetch(event.request);
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