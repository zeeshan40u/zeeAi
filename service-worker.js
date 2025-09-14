const CACHE_NAME = 'my-pwa-cache-v1';
const filesToCache = [
    '/',
    'index.html',
    'carData.js',
    'manifest.json',
    'offline.html',
    'service-worker.js',
    'zee192.png',
    'zee512.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(filesToCache);
            })
            .catch((error) => {
                console.error('Failed to cache files:', error);
            })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});
