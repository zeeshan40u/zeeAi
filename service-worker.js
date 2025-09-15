const CACHE_NAME = "zeeai-cache-v6"; // bump version
const OFFLINE_URL = "./offline.html";

const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "./zee192.png",
  "./zee512.png",
  "./carData.js",
  "./service-worker.js",
  OFFLINE_URL
];

// Install
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Activate
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(cacheNames.map(c => (c !== CACHE_NAME ? caches.delete(c) : null)))
    )
  );
});

// Fetch
self.addEventListener("fetch", event => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(OFFLINE_URL))
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(resp => resp || fetch(event.request))
    );
  }
});