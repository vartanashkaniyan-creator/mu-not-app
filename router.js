/**
 * 🧭 Router.js – مدیریت مسیرها
 * نسخه 3.0.0
 * SPA-friendly | History API | Default & Fallback Routes
 */

const Router = (() => {
    const routes = {};
    let defaultRoute = '/home';

    // ثبت مسیر جدید
    function register(path, callback) {
        if (typeof callback !== 'function') {
            console.error(`Router: Callback برای مسیر "${path}" معتبر نیست`);
            return;
        }
        routes[path] = callback;
        console.log(`Router: مسیر "${path}" ثبت شد`);
    }

    // مسیر پیش‌فرض
    function setDefault(path) {
        defaultRoute = path;
    }

    // ناوبری به مسیر مشخص
    function navigate(path) {
        const cb = routes[path] || routes[defaultRoute];
        if (!cb) {
            console.warn(`Router: مسیر "${path}" یافت نشد و مسیر پیش‌فرض هم تعریف نشده`);
            return;
        }
        cb();
        window.history.pushState({ path }, '', path);
        console.log(`Router: حرکت به "${path}"`);
    }

    // راه‌اندازی Router
    function init() {
        // گوش دادن به popstate مرورگر
        window.addEventListener('popstate', (e) => {
            const path = e.state?.path || defaultRoute;
            const cb = routes[path] || routes[defaultRoute];
            if (cb) cb();
        });

        // مسیر اولیه
        const initialPath = location.pathname || defaultRoute;
        navigate(initialPath);
    }

    // Public API
    return {
        register,
        navigate,
        setDefault,
        init
    };
})();

/* ---------- نمونه استفاده ----------
Router.register('/home', () => UI.load('home'));
Router.register('/notes', () => UI.load('notes'));
Router.setDefault('/home');
Router.init();
------------------------------------ */

window.Router = Router;
console.log('🧭 Router.js بارگذاری شد');
