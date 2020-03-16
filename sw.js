self.addEventListener('fetch', () => {
  // literally does nothing
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
    url: '/assets/main.css',
    assets: ['/assets/main.js','/assets/offline/image01.png','/assets/offline/image02.png']
  }
});