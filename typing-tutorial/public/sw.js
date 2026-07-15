// VortexType Touch Typing Tutor — offline service worker (hand-rolled, no build deps).
//
// Strategy for a low/no-connectivity PWA:
//  - Precache the app shell on install.
//  - Navigations: network-first, fall back to the cached shell when offline (SPA still boots).
//  - Everything else (hashed JS/CSS, favicon, Google Fonts CSS + font files): cache-first,
//    then network and cache the response. After the first online visit the whole app,
//    including the CDN fonts (stored as opaque responses), works fully offline.
//
// Bump CACHE when the shell strategy changes; hashed asset URLs change per build on their own,
// and stale entries are pruned on activate.
const CACHE = 'vortextype-v1';
const SHELL = ['./', './index.html', './favicon.svg', './manifest.webmanifest'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  // App navigations: network-first so online users always get the freshest build,
  // fall back to the cached shell when the network is unavailable.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put('./index.html', copy));
          return res;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Assets and fonts: serve from cache first, otherwise fetch and cache for next time.
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          if (res && (res.ok || res.type === 'opaque')) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
    })
  );
});
