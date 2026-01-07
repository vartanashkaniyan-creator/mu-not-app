// service.worker.js
// Service Worker پیشرفته برای App Builder
// Offline-first + Cache versioning + Mobile optimized

const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `app-builder-${CACHE_VERSION}`;

const CORE_ASSETS = [
    '/',
    '/index.html',
    '/style.css',
    '/main.js',
    '/engine.js',
    '/ui.js',
    '/router.js',
    '/script.js',
    '/i18n.js',
    '/storage.js',
    '/templates.js',
    '/manifest.json',
    '/notes.html',
    '/preview.html'
];

// نصب
self.addEventListener('install', event => {
    console.log('⚙️ Service Worker installing...');
    self.skipWaiting();

    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('📦 Caching core assets');
            return cache.addAll(CORE_ASSETS);
        })
    );
});

// فعال‌سازی
self.addEventListener('activate', event => {
    console.log('✅ Service Worker activated');

    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        console.log('🧹 Removing old cache:', key);
                        return caches.delete(key);
                    }
                })
            )
        )
    );

    self.clients.claim();
});

// Fetch – استراتژی Cache First برای موبایل
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then(cached => {
            if (cached) return cached;

            return fetch(event.request)
                .then(response => {
                    // ذخیره فایل‌های استاتیک
                    if (response.status === 200 && response.type === 'basic') {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, responseClone);
                        });
                    }
                    return response;
                })
                .catch(() => {
                    // fallback آفلاین
                    if (event.request.destination === 'document') {
                        return caches.match('/index.html');
                    }
                });
        })
    );
});

// پیام‌ها (برای توسعه آینده)
self.addEventListener('message', event => {
    if (!event.data) return;

    if (event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
