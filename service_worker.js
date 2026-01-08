// Service Worker v1.0
const CACHE_NAME = 'appbuilder-v1';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './main.js',
  './manifest.json',
  './icons/icon-72x72.png',
  './icons/icon-192x192.png'
];

// نصب
self.addEventListener('install', event => {
  console.log('📦 Service Worker نصب شد');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// فعال‌سازی
self.addEventListener('activate', event => {
  console.log('✅ Service Worker فعال شد');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('🗑️ حذف کش قدیمی:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// دریافت
self.addEventListener('fetch', event => {
  // حذف درخواست‌های chrome-extension
  if (event.request.url.startsWith('chrome-extension://')) return;
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // کش وجود دارد
        if (response) {
          console.log('💾 از کش:', event.request.url);
          return response;
        }
        
        // دریافت از شبکه
        console.log('🌐 از شبکه:', event.request.url);
        return fetch(event.request)
          .then(response => {
            // کش کردن پاسخ‌های موفق
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, responseToCache));
            
            return response;
          })
          .catch(() => {
            // حالت آفلاین
            if (event.request.destination === 'document') {
              return caches.match('./index.html');
            }
            return new Response('🆘 حالت آفلاین!', {
              status: 503,
              headers: { 'Content-Type': 'text/plain; charset=utf-8' }
            });
          });
      })
  );
});

// پیام‌ها
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});

// پس‌زمینه‌
self.addEventListener('sync', event => {
  console.log('🔄 همگام‌سازی:', event.tag);
});

// نوتیفیکیشن
self.addEventListener('push', event => {
  const options = {
    body: event.data?.text() || 'اعلان جدید',
    icon: './icons/icon-192x192.png',
    badge: './icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    tag: 'appbuilder-notification'
  };
  
  event.waitUntil(
    self.registration.showNotification('اپ‌ساز', options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('./')
  );
});
