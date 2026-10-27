// Network-first so updates always arrive; cache is only a fallback when offline.
var C = 'md-shell-v1';
self.addEventListener('install', function (e) { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function (e) {
  var u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then(function (r) {
      var copy = r.clone();
      caches.open(C).then(function (c) { c.put(e.request, copy); });
      return r;
    }).catch(function () { return caches.match(e.request); })
  );
});
