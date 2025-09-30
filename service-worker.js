// Define un nombre y versión para el caché
const CACHE_NAME = 'jornador-siu-cache-v2';

// Lista de archivos a cachear (el "App Shell")
const urlsToCache = [
  './', // Ruta relativa a la raíz del proyecto (muy importante)
  './index.html',
  './styles.css',
  './script.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Poppins&display=swap' // Ruta absoluta externa (correcto)
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
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Borrando caché antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Evento 'fetch': intercepta las peticiones de red.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
