const CACHE_NAME = "zeeai-cache-v7"; // bump version
const OFFLINE_URL = "./offline.html";

const urlsToCache = [
  "./",
  "./index.html",
  "./offline.html",
  "./manifest.json",
  "./zee192.png",
  "./zee512.png",
  "./carData.js",
  "./Player.png",
  "./opponent.png",
  "./NitroAbility_Icon.png"
];

// Install
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Activate
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(c => {
          if (c !== CACHE_NAME) {
            return caches.delete(c);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch
self.addEventListener("fetch", event => {
  if (event.request.mode === "navigate") {
    // Page navigation: serve network first, fallback offline.html
    event.respondWith(
      fetch(event.request).catch(() => caches.match(OFFLINE_URL))
    );
  } else {
    // Other requests: cache-first strategy
    event.respondWith(
      caches.match(event.request).then(resp => {
        return resp || fetch(event.request);
      })
    );
  }
});