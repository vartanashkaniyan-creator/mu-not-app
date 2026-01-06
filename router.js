/**
 * 🧭 سیستم مسیریابی ساده
 */

const Router = {
    // بارگذاری اپ
    loadApp(appId) {
        console.log('🧭 در حال بارگذاری اپ:', appId);
        
        // اگر generateApp موجود باشد (از app.js)
        if (typeof generateApp === 'function') {
            try {
                const app = generateApp(appId);
                if (app && app.ui) {
                    this.renderApp(app);
                    return;
                }
            } catch (err) {
                console.error('خطا در بارگذاری اپ:', err);
            }
        }
        
        // اگر app.js کار نکرد، از سیستم اصلی استفاده کن
        if (typeof App !== 'undefined' && App.openApp) {
            App.openApp(appId);
        }
    },
    
    // رندر اپ
    renderApp(app) {
        const container = document.getElementById('app-container');
        if (!container) return;
        
        // رندر UI
        container.innerHTML = app.ui;
        
        // اجرای منطق
        if (app.logic) {
            try {
                const script = document.createElement('script');
                script.textContent = app.logic;
                document.body.appendChild(script);
                
                // به‌روزرسانی وضعیت
                if (App && App.updateStatus) {
                    App.updateStatus('اپ اجرا شد');
                }
            } catch (err) {
                console.error('خطا در اجرای منطق اپ:', err);
            }
        }
    },
    
    // تغییر صفحه
    navigateTo(page) {
        window.location.hash = page;
    }
};

// هندلر تغییر hash
window.addEventListener('hashchange', () => {
    const page = window.location.hash.substring(1);
    if (page && page !== 'home') {
        Router.loadApp(page);
    } else if (App && App.showHomePage) {
        App.showHomePage();
    }
});

// صادر کردن
window.Router = Router;
