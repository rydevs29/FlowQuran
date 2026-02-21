const CACHE_NAME = 'flowquran-cache-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './audio-engine.js',
    './manifest.json'
];

// Install & Simpan file UI
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// Intercept Network Requests (Logika Offline)
self.addEventListener('fetch', (event) => {
    // Untuk file Audio (.mp3), kita pakai strategi khusus agar tidak membebani storage HP
    if (event.request.url.endsWith('.mp3')) {
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request).then((fetchRes) => {
                    return caches.open('flowquran-audio-cache').then((cache) => {
                        cache.put(event.request, fetchRes.clone());
                        return fetchRes;
                    });
                });
            })
        );
    } else {
        // Untuk UI Web (HTML/CSS/JS)
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request);
            })
        );
    }
});
