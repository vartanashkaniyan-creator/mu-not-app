/**
 * 🧭 Router.js – مدیریت مسیرها هماهنگ با UI
 */
const Router = (() => {
    const routes = {};
    let defaultRoute = '/home';

    function register(path, callback) {
        if (typeof callback !== 'function') return;
        routes[path] = callback;
    }

    function setDefault(path) {
        defaultRoute = path;
    }

    function navigate(path) {
        const cb = routes[path] || routes[defaultRoute];
        if (cb) cb();
        window.history.pushState({ path }, '', path);
    }

    function init() {
        window.addEventListener('popstate', e => {
            const path = e.state?.path || defaultRoute;
            const cb = routes[path] || routes[defaultRoute];
            if (cb) cb();
        });
        navigate(location.pathname || defaultRoute);
    }

    return { register, setDefault, navigate, init };
})();

window.Router = Router;
console.log('✅ Router.js آماده شد');
