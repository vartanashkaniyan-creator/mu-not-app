
// router.js - سیستم مسیریابی SPA حرفه‌ای
export class Router {
    constructor() {
        this.routes = new Map();
        this.middlewares = [];
        this.currentRoute = null;
        this.history = [];
        this.maxHistory = 50;
        this.init();
    }

    init() {
        window.addEventListener('popstate', (e) => {
            this.handleRoute(window.location.pathname, false);
        });
        
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[data-spa]');
            if (link && !e.ctrlKey && !e.shiftKey && !e.metaKey) {
                e.preventDefault();
                this.navigate(link.getAttribute('href'));
            }
        });
        
        this.handleRoute(window.location.pathname, true);
    }

    addRoute(path, component, options = {}) {
        const route = {
            path,
            component,
            exact: options.exact || false,
            auth: options.auth || false,
            meta: options.meta || {},
            params: {}
        };
        this.routes.set(this.normalizePath(path), route);
        return this;
    }

    navigate(path, data = {}, replace = false) {
        const normalized = this.normalizePath(path);
        
        if (this.currentRoute && this.currentRoute.path === normalized) {
            return;
        }

        if (replace) {
            history.replaceState(data, '', normalized);
        } else {
            history.pushState(data, '', normalized);
            this.history.push({
                path: normalized,
                timestamp: Date.now(),
                data
            });
            
            if (this.history.length > this.maxHistory) {
                this.history.shift();
            }
        }
        
        this.handleRoute(normalized, true);
    }

    handleRoute(path, updateHistory = true) {
        const route = this.findRoute(path);
        
        if (!route) {
            this.navigate('/404', {}, true);
            return;
        }

        const params = this.extractParams(route.path, path);
        route.params = params;

        const result = this.runMiddlewares(route);
        if (result === false) return;

        this.currentRoute = route;
        
        if (updateHistory) {
            window.dispatchEvent(new CustomEvent('routechange', {
                detail: { route, params }
            }));
        }

        route.component(params);
    }

    findRoute(path) {
        for (const [routePath, route] of this.routes) {
            if (route.exact && routePath === path) {
                return route;
            }
            if (!route.exact && this.pathMatches(routePath, path)) {
                return route;
            }
        }
        return null;
    }

    pathMatches(pattern, path) {
        const patternParts = pattern.split('/').filter(p => p);
        const pathParts = path.split('/').filter(p => p);
        
        if (patternParts.length !== pathParts.length) return false;
        
        for (let i = 0; i < patternParts.length; i++) {
            if (patternParts[i].startsWith(':')) continue;
            if (patternParts[i] !== pathParts[i]) return false;
        }
        return true;
    }

    extractParams(pattern, path) {
        const params = {};
        const patternParts = pattern.split('/').filter(p => p);
        const pathParts = path.split('/').filter(p => p);
        
        patternParts.forEach((part, index) => {
            if (part.startsWith(':')) {
                const paramName = part.slice(1);
                params[paramName] = decodeURIComponent(pathParts[index]);
            }
        });
        
        return params;
    }

    normalizePath(path) {
        if (!path.startsWith('/')) path = '/' + path;
        if (path !== '/' && path.endsWith('/')) path = path.slice(0, -1);
        return path;
    }

    addMiddleware(middleware) {
        this.middlewares.push(middleware);
        return this;
    }

    runMiddlewares(route) {
        for (const middleware of this.middlewares) {
            const result = middleware(route);
            if (result === false) return false;
            if (typeof result === 'string') {
                this.navigate(result, {}, true);
                return false;
            }
        }
        return true;
    }

    back() {
        if (this.history.length > 1) {
            this.history.pop();
            const prev = this.history[this.history.length - 1];
            if (prev) {
                this.navigate(prev.path, prev.data, true);
            }
        } else {
            window.history.back();
        }
    }

    getRoutes() {
        return Array.from(this.routes.values());
    }

    getCurrentRoute() {
        return this.currentRoute;
    }

    getQueryParams() {
        const params = {};
        const search = window.location.search.substring(1);
        if (!search) return params;
        
        search.split('&').forEach(param => {
            const [key, value] = param.split('=');
            if (key) {
                params[decodeURIComponent(key)] = decodeURIComponent(value || '');
            }
        });
        
        return params;
    }

    setQueryParams(params, replace = false) {
        const current = this.getQueryParams();
        const newParams = replace ? params : { ...current, ...params };
        
        const queryString = Object.keys(newParams)
            .filter(key => newParams[key] !== undefined && newParams[key] !== null)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(newParams[key])}`)
            .join('&');
        
        const newUrl = window.location.pathname + (queryString ? `?${queryString}` : '');
        this.navigate(newUrl, {}, true);
    }
}

export const router = new Router();
