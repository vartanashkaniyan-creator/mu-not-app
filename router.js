
// router.js
const Router = (() => {
    const routes = {};
    let defaultRoute = null;

    function register(path, callback) {
        routes[path] = callback;
    }

    function setDefault(path) {
        defaultRoute = path;
    }

    function navigate(path) {
        const routeCallback = routes[path] || routes[defaultRoute];
        if (routeCallback) {
            routeCallback();
            window.history.pushState({ path }, '', path);
        } else {
            console.warn(`⚠️ مسیر "${path}" تعریف نشده`);
        }
    }

    function init() {
        window.addEventListener('popstate', (e) => {
            const path = e.state?.path || defaultRoute;
            const routeCallback = routes[path];
            if (routeCallback) routeCallback();
        });

        // مسیر اولیه
        const initialPath = location.pathname || defaultRoute;
        navigate(initialPath);
    }

    return {
        register,
        navigate,
        setDefault,
        init
    };
})();

// مثال استفاده:
// Router.register('/home', () => loadPage('home'));
// Router.setDefault('/home');
// Router.init();

window.Router = Router;
