const cacheName = 'v1';

const cacheAssets = [
  'index.html',
  '/css/main.min.css',
  '/js/watched.js',
  '/js/main.js',
  'https://use.fontawesome.com/releases/v5.7.0/css/all.css',
  'https://fonts.googleapis.com/css?family=Lato:300,400,700&display=swap&subset=latin-ext',
  'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.5.0/css/swiper.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.5.0/js/swiper.min.js'
];

self.addEventListener('install', e => {
  console.log('Service Worker: Installed');

  e.waitUntil(
    caches
      .open(cacheName)
      .then(cache => {
        console.log('Service Worker: Caching Files');
        cache.addAll(cacheAssets);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  console.log('Service Worker: Activated');

  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cache => cache !== cacheName)
          .map(cache => caches.delete(cache))
      );
    })
  );
});

self.addEventListener('fetch', e => {
  console.log('Service Worker: Fetching');
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const resClone = res.clone();
        caches.open(cacheName).then(cache => {
          cache.put(e.request, resClone);
        });
        return res;
      })
      .catch(err => caches.match(e.request).then(res => res))
  );
});
