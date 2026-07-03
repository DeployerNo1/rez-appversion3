const CV = 'kochbuch-v5';
const ASSETS = ['/rez-app/', '/rez-app/index.html', '/rez-app/manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CV).then(c => c.addAll(ASSETS).catch(()=>{})));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks =>
    Promise.all(ks.filter(k => k !== CV).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if (!e.request.url.startsWith('http')) return;
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).catch(() =>
      caches.match('/index.html')
    ))
  );
});
