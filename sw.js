self.addEventListener('fetch', () => {
  // literally does nothing
});

importScripts('https://cdn.ampproject.org/sw/amp-sw.js');
AMP_SW.init({
  assetCachingOpitions: [
    {regexp:/\.(png|jpg|svg|webp)/,
    cachingSrrategy: 'CACHE_FIRST'
  },
  {
    regexp:/\.(js)/,
    cachingSrrategy: 'STALE_WHILE_REVALIDADTE'
  }
  ],
  offilinePageOptions: {
    url: '/offline.html',
    assets:[]
  }
});