// 👇 bump this every time you deploy a change so browsers pull a fresh cache
const CACHE_NAME = "zeeai-cache-v6"; // bumped version

// Define the custom offline page URL
const OFFLINE_URL = "/zeeAi/offline.html";

// Put here all files you want cached for offline use
const urlsToCache = [
  "/zeeAi/",
  "/zeeAi/index.html",
  "/zeeAi/manifest.json",
  "/zeeAi/zee192.png",
  "/zeeAi/zee512.png",
  "/zeeAi/carData.js",
  "/zeeAi/service-worker.js",
  OFFLINE_URL // 💡 cache the offline page
];

// Install event — cache resources
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting(); // activate immediately
});

// Activate event — delete old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      )
    )
  );
  self.clients.claim(); // take control right away
});

// Fetch event — show index.html when online, offline.html when offline
self.addEventListener("fetch", event => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // If network is fine, return index.html or requested page
          return response;
        })
        .catch(() => {
          // If offline, show offline.html
          return caches.match(OFFLINE_URL);
        })
    );
  } else {
    // For non-navigation requests → try cache first
    event.respondWith(
      caches.match(event.request).then(response => response || fetch(event.request))
    );
  }
});