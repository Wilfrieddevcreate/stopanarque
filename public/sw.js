const CACHE_NAME = "stopanarque-v4";
const OFFLINE_URL = "/offline";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll([OFFLINE_URL]))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  // Never cache Next.js JS/CSS chunks — they contain app code that must stay fresh
  if (request.url.includes("/_next/")) return;

  // API: always network
  if (request.url.includes("/api/")) return;

  // Navigation: network-first, offline fallback
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match(OFFLINE_URL) || new Response("Offline", { status: 503 }))
    );
    return;
  }

  // Static public assets (icons, images): cache-first
  if (request.url.includes("/icons/") || request.url.match(/\.(png|jpg|svg|webp|ico|woff2?)$/)) {
    event.respondWith(
      caches.match(request).then((cached) =>
        cached || fetch(request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
      )
    );
  }
});
