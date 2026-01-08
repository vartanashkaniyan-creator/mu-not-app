/* =========================
   Router.js – مسیر‌یاب مرکزی اپ بیلدر
   نسخه 1.0.0
   هماهنگ با UI.js و Templates.js
========================= */

const Router = (() => {

    const routes = {};
    let currentRoute = '';

    function register(name, handler) {
        routes[name] = handler;
    }

    function navigate(name, data = {}) {
        if (!routes[name]) {
            console.warn('Route not found:', name);
            UI.load('404');
            return;
        }

        currentRoute = name;
        window.location.hash = name;
        routes[name](data);
    }

    function start(defaultRoute = 'home') {
        const hash = window.location.hash.replace('#', '');
        if (hash && routes[hash]) {
            navigate(hash);
        } else {
            navigate(defaultRoute);
        }
    }

    // ثبت مسیرهای اصلی
    register('home', () => {
        UI.load('home', {
            apps: [
                { id: 'notes', name: 'یادداشت‌ها', icon: '📝' },
                { id: 'calculator', name: 'ماشین حساب', icon: '🧮' },
                { id: 'todo', name: 'کارها', icon: '✅' }
            ]
        });
    });

    register('notes', () => UI.load('notes'));
    register('calculator', () => UI.load('calculator'));
    register('todo', () => UI.load('todo'));

    // مسیر پیش‌فرض خطا
    register('404', () => {
        UI.load('404');
    });

    // تغییر hash
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.replace('#', '');
        if (routes[hash]) navigate(hash);
    });

    return {
        register,
        navigate,
        start
    };

})();

window.Router = Router;
console.log('🧭 Router.js بارگذاری شد');
