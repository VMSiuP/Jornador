// Define un nombre y versión para el caché
const CACHE_NAME = 'jornador-siu-cache-v4';

// Lista de archivos a cachear (el "App Shell")
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Poppins&display=swap'
];

// Evento 'install': se dispara cuando el Service Worker se instala.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto y archivos cacheados');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento 'activate': se dispara cuando el Service Worker se activa.
// Aquí es donde limpiamos los cachés antiguos.
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

// Evento 'fetch': intercepta las peticiones de red.
// Estrategia: "Cache First". Primero busca en el caché, si no lo encuentra, va a la red.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
