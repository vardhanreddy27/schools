const CACHE_NAME = "qh-pwa-v3";
const STATIC_ASSETS = [
  "/",
  "/Admin_login",
  "/Teacher_login",
  "/Student_login",
  "/Parent_login",
  "/logo.jpg",
  "/manifest.webmanifest",
  "/manifest-admin.webmanifest",
  "/manifest-teacher.webmanifest",
  "/manifest-parent.webmanifest",
  "/manifest-student.webmanifest"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (event.request.method !== "GET") {
    return;
  }

  // Never cache auth/api responses to avoid stale sessions and CSRF tokens in PWA mode.
  if (url.origin === self.location.origin && (url.pathname.startsWith("/api/") || url.pathname.startsWith("/_next/"))) {
    event.respondWith(fetch(event.request));
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => response)
        .catch(async () => {
          const cachedResponse = await caches.match(event.request);
          if (cachedResponse) {
            return cachedResponse;
          }

          return caches.match("/");
        })
    );
    return;
  }

  // Only cache http/https requests
  if (!event.request.url.startsWith("http://") && !event.request.url.startsWith("https://")) {
    return;
  }

  const isStaticAssetRequest =
    url.origin === self.location.origin
    && (STATIC_ASSETS.includes(url.pathname)
      || /\.(?:js|css|png|jpg|jpeg|svg|webp|ico|woff2?|ttf|eot|json)$/i.test(url.pathname));

  if (!isStaticAssetRequest) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== "basic") {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      });
    })
  );
});
