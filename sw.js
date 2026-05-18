const CACHE_NAME = "smartshop-v1";

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
  );
});
