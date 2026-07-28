/* ==========================================
   MacroTrack
   Step 11 — Service Worker
========================================== */

const CACHE_NAME = "macrotrack-v4";

const APP_FILES = [
    "./",
    "./index.html",
    "./food-library.html",
    "./history.html",
    "./settings.html",
    "./manifest.json",

    "./css/style.css",

    "./js/app.js",
    "./js/storage.js",
    "./js/dashboard.js",
    "./js/foods.js",
    "./js/history.js",
    "./js/settings.js"

        "./icons/icon-192.png",
    "./icons/icon-512.png",
    "./icons/apple-touch-icon.png"
    
];


/* ==========================================
   INSTALL
========================================== */

self.addEventListener("install", event => {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(APP_FILES);
            })
    );

    self.skipWaiting();
});


/* ==========================================
   ACTIVATE
========================================== */

self.addEventListener("activate", event => {
    event.waitUntil(
        caches
            .keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(cacheName => {
                            return cacheName !== CACHE_NAME;
                        })
                        .map(cacheName => {
                            return caches.delete(cacheName);
                        })
                );
            })
    );

    self.clients.claim();
});


/* ==========================================
   FETCH
========================================== */

self.addEventListener("fetch", event => {
    if (event.request.method !== "GET") {
        return;
    }

    event.respondWith(
        caches
            .match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(event.request)
                    .then(networkResponse => {
                        if (
                            !networkResponse ||
                            networkResponse.status !== 200 ||
                            networkResponse.type === "opaque"
                        ) {
                            return networkResponse;
                        }

                        const responseCopy =
                            networkResponse.clone();

                        caches
                            .open(CACHE_NAME)
                            .then(cache => {
                                cache.put(
                                    event.request,
                                    responseCopy
                                );
                            });

                        return networkResponse;
                    });
            })
    );
});