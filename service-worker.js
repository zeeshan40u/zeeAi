// 👇 bump this every time you deploy a change so browsers pull a fresh cache
const CACHE_NAME = "zeeai-cache-v4";

// Define the custom offline page URL
const OFFLINE_URL = "/zeeAi/offline.html";

// Put here all files you want cached for offline use
const urlsToCache = [
  "/zeeAi/",
  "/zeeAi/index.html",
  "/zeeAi/manifest.json",
  "/zeeAi/zee192.png",
  "/zeeAi/zee512.png",
  // 💡 Add the custom offline page to the cache list
  OFFLINE_URL
];

// Install event — cache resources
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
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
});

// Fetch event — respond from cache first, fallback to network, then offline fallback
self.addEventListener("fetch", event => {
  // We only want to handle navigation requests for HTML pages
  if (event.request.mode === "navigate") {
    // For navigation requests, try network first
    event.respondWith(
      fetch(event.request).catch(() => {
        // If the network fails, serve the cached offline page
        return caches.match(OFFLINE_URL);
      })
    );
  } else {
    // For other requests, try cache first
    event.respondWith(
      caches.match(event.request).then(response => response || fetch(event.request))
    );
  }
});
