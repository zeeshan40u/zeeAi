// 👇 bump this every time you deploy a change so browsers pull a fresh cache
const CACHE_NAME = "zeeai-cache-v2";

// put here all files you want cached for offline use
const urlsToCache = [
  "/zeeAi/",           // your start page on GitHub Pages
  "/zeeAi/manifest.json",
  "/zeeAi/zee192.png",
  "/zeeAi/zee512.png"
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

// Fetch event — respond from cache, then network
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
