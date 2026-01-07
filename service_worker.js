// ==================== service.worker.js ====================

const CACHE_NAME = 'app-builder-cache-v1';
const ASSETS_TO_CACHE = [
    '/',               // index.html
    '/style.css',
    '/main.js',
    '/app.library.js',
    '/engine.js',
    '/core.js',
    '/i18n.js',
    '/templates.js',
    '/notes.js',
    '/calculator.js',
    '/todo.js',
    '/preview.js',
    '/ui.js'
];

// نصب و ذخیره فایل‌ها در کش
self.addEventListener('install', (event) => {
    console.log('[SW] Installing Service Worker...');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Caching app assets');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// فعال‌سازی و پاکسازی کش قدیمی
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating Service Worker...');
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        console.log('[SW] Removing old cache:', key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});

// هندل کردن درخواست‌ها
self.addEventListener('fetch', (event) => {
    const { request } = event;

    // فقط برای درخواست‌های GET
    if (request.method !== 'GET') return;

    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse; // پاسخ از کش
            }

            return fetch(request)
                .then((networkResponse) => {
                    // ذخیره پاسخ جدید در کش
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, networkResponse.clone());
                        return networkResponse;
                    });
                })
                .catch(() => {
                    // fallback وقتی آنلاین نیست
                    if (request.destination === 'document') {
                        return caches.match('/'); // index.html
                    }
                });
        })
    );
});

// پیام‌ها از اپ
self.addEventListener('message', (event) => {
    if (event.data === 'skipWaiting') {
        self.skipWaiting();
    }
});
