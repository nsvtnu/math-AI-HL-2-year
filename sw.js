// Orbit service worker — precache everything, serve cache-first.
// The whole app is local files, so after one visit it works with zero network.
const CACHE = 'mathkitty-v8';
const FILES = [
  './',
  './index.html',
  './css/app.css',
  './js/kitty.js',
  './js/config.js',
  './js/cloud.js',
  './js/mtex.js',
  './js/store.js',
  './js/quiz.js',
  './js/app.js',
  './data/units.js',
  './data/bank.js',
  './data/resources.js',
  './manifest.webmanifest',
  './icon.svg',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (!e.request.url.startsWith(self.location.origin)) return;   // cloud calls go straight to the network
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(hit =>
      hit ||
      fetch(e.request).catch(() =>
        e.request.mode === 'navigate' ? caches.match('./index.html') : Response.error()
      )
    )
  );
});
