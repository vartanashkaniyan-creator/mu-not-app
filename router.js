/**
 * 🛣 Router.js – مدیریت مسیرها و SPA پیشرفته
 * نسخه 3.1.0 – Mobile & PWA Friendly
 */

const Router = (() => {
    const routes = {};
    let defaultRoute = null;

    function register(path, callback) {
        if (typeof callback !== 'function') {
            console.warn(`⚠️ مسیر ${path} فاقد callback معتبر است`);
            return;
        }
        routes[path] = callback;
    }

    function setDefault(path) {
        defaultRoute = path;
    }

    function navigate(path, options = {}) {
        const cb = routes[path] || routes[defaultRoute];
        if (!cb) {
            console.error(`❌ مسیر "${path}" تعریف نشده`);
            return;
        }

        // اجرا callback
        cb();

        // تاریخچه مرورگر (PushState)
        if (!options.skipHistory) {
            window.history.pushState({ path }, '', path);
        }
    }

    function init() {
        // مسیر اولیه صفحه
        const initialPath = location.pathname || defaultRoute;
        if (initialPath) navigate(initialPath, { skipHistory: true });

        // مدیریت دکمه‌های back/forward مرورگر
        window.addEventListener('popstate', (e) => {
            const path = e.state?.path || defaultRoute;
            const cb = routes[path] || routes[defaultRoute];
            if (cb) cb();
        });

        // اتصال لینک‌های data-route به navigate
        document.body.addEventListener('click', (e) => {
            const target = e.target.closest('[data-route]');
            if (!target) return;
            e.preventDefault();
            const route = target.getAttribute('data-route');
            if (route) navigate(route);
        });

        console.log('⚡ Router initialized');
    }

    // تغییر مسیر بدون reload
    function replace(path) {
        const cb = routes[path] || routes[defaultRoute];
        if (!cb) return;
        cb();
        window.history.replaceState({ path }, '', path);
    }

    return {
        register,
        setDefault,
        navigate,
        replace,
        init
    };
})();

// ثبت جهانی
window.Router = Router;
console.log('✅ Router.js 3.1.0 Loaded');
