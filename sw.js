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