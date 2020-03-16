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
    regexp: /\.(js)/,
    cachingStrategy: 'STALE_WHILE_REVALIDADATE'
     }
  ],
  offilinePageOptions: {
    url: '/offline.html',
    assets: []
  }
});