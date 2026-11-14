const CACHE_NAME = 'bk-murli-v3';
const ASSETS = ['./', './index.html', './manifest.json'];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Никогаш не ги пресретнувај повиците кон Google Apps Script базата
  if (event.request.url.indexOf('script.google.com') !== -1 || event.request.url.indexOf('googleusercontent.com') !== -1) {
    return;
  }
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
