// 👇 bump this every time you deploy a change so browsers pull a fresh cache
const CACHE_NAME = "zeeai-cache-v7"; // bump version

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
  OFFLINE_URL
];

// Install event — cache resources
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
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
  self.clients.claim();
});

// Fetch event — online → index.html, offline → offline.html
self.addEventListener("fetch", event => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(OFFLINE_URL))
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(response => response || fetch(event.request))
    );
  }
});