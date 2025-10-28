// sw.js
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('itsabot-cache').then(cache => {
      return cache.addAll([
        '/',
        '/login.html',
        '/menu.html',
        '/inicio.html',
        '/tramites.html',
        '/calendario.html',
        '/info.html',
        '/perfil.html',
        '/css/style.css',
        '/js/chatbot.js',
        '/img/logo.png',
        '/img/icon-192.png'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});