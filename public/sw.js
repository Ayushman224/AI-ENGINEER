// Network-first service worker: always fresh when online, cached shell when offline.
const CACHE = 'aieos-v2';
// Resolve shell URLs against the SW scope so this works at / and at sub-paths like /AI-ENGINEER/.
const at = (p) => new URL(p, self.registration.scope).toString();
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll([at('./'), at('index.html'), at('manifest.webmanifest'), at('icon.svg')])));
  self.skipWaiting();
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
        return res;
      })
      .catch(() => caches.match(req).then((r) => r || caches.match(at('index.html'))))
  );
});
