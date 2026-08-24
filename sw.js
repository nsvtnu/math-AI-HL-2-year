// Mathkitty service worker.
// Stale-while-revalidate: pages open instantly from the cache and work
// with no internet, while a fresh copy is fetched in the background for
// next time. That means a bad cached build repairs itself on the next
// load instead of sticking around.
const CACHE = 'mathkitty-v15';
const FILES = [
  './',
  './index.html',
  './css/app.css',
  './js/kitty.js',
  './js/config.js',
  './js/cloud.js',
  './js/mtex.js',
  './js/viz.js',
  './js/files.js',
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
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.all(FILES.map(f => c.add(f).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Let the page ask for an immediate takeover.
self.addEventListener('message', e => { if (e.data === 'skip-waiting') self.skipWaiting(); });

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (!req.url.startsWith(self.location.origin)) return;   // cloud calls go straight out

  // Escape hatch: ...?fresh=1 always goes to the network and refills the cache.
  const fresh = new URL(req.url).searchParams.get('fresh') === '1';

  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = fresh ? null : await cache.match(req, { ignoreSearch: true });

    const update = fetch(req).then(res => {
      if (res && res.ok) cache.put(req, res.clone()).catch(() => {});
      return res;
    }).catch(() => null);

    if (hit) { e.waitUntil(update); return hit; }           // fast, then refresh for next time
    const net = await update;
    if (net) return net;
    if (req.mode === 'navigate') {
      const shell = await cache.match('./index.html');
      if (shell) return shell;
    }
    return Response.error();
  })());
});
