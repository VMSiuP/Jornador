// Define un nombre y versión para el caché
const CACHE_NAME = 'jornador-siu-cache-v3'; // Incrementa la versión para forzar la actualización

// Lista de archivos a cachear (el "App Shell")
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './manifest.webmanifest', // Actualizado al nuevo nombre
  './icons/icon-192.png',
  './icons/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Poppins&display=swap'
];

// El resto del archivo es idéntico...
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
