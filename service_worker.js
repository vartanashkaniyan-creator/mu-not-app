const CACHE_NAME='app-builder-v1';
const CORE_ASSETS=['/','/index.html','/style.css','/main.js','/engine.js','/UI.js','/Router.js','/Templates.js','/script.js'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(CORE_ASSETS))); self.skipWaiting(); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE_NAME?caches.delete(k):null)))); self.clients.claim(); });
self.addEventListener('fetch',e=>{ if(e.request.method!=='GET') return; e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request).then(r=>{ if(r.status===200&&r.type==='basic'){ const rc=r.clone(); caches.open(CACHE_NAME).then(ca=>ca.put(e.request,rc)); } return r; }).catch(()=>caches.match('/index.html')))); });
