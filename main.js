if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service.worker.js')
            .then(reg => console.log('✅ Service Worker ثبت شد:', reg.scope))
            .catch(err => console.warn('❌ Service Worker ثبت نشد:', err));
    });
}
