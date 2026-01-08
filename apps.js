console.log('APP STARTED');
// app.js - کلاس اصلی اپلیکیشن
export class AppBuilder {
    constructor(config = {}) {
        this.config = {
            name: 'AppBuilder',
            version: '1.0.0',
            debug: false,
            theme: 'light',
            language: 'fa',
            ...config
        };
        
        this.modules = new Map();
        this.events = new Map();
        this.state = new Proxy({}, {
            set: (target, key, value) => {
                target[key] = value;
                this.emit('state:' + key, value);
                this.emit('state:change', { key, value });
                return true;
            }
        });
        
        this.init();
    }

    async init() {
        this.setupErrorHandling();
        this.loadConfig();
        await this.loadModules();
        this.setupServiceWorker();
        this.setupOfflineDetection();
        this.setupPerformanceMonitor();
        
        this.emit('app:ready', this.config);
    }

    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            this.log('error', `Uncaught error: ${event.message}`, {
                file: event.filename,
                line: event.lineno,
                col: event.colno
            });
            event.preventDefault();
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.log('error', 'Unhandled promise rejection:', event.reason);
            event.preventDefault();
        });

        console.error = (function(original) {
            return function(...args) {
                this.log('error', ...args);
                original.apply(console, args);
            }.bind(this);
        }.bind(this)(console.error));
    }

    loadConfig() {
        const saved = storage.get('app_config', {});
        this.config = { ...this.config, ...saved };
        
        document.documentElement.setAttribute('data-theme', this.config.theme);
        document.documentElement.setAttribute('lang', this.config.language);
        
        if (this.config.debug) {
            window.app = this;
        }
    }

    async loadModules() {
        const modules = [
            'ui',
            'router',
            'storage',
            'calculator',
            'notes',
            'templates'
        ];
        
        for (const moduleName of modules) {
            try {
                const module = await import(`./${moduleName}.js`);
                this.registerModule(moduleName, module);
            } catch (error) {
                this.log('warn', `Failed to load module ${moduleName}:`, error);
            }
        }
    }

    registerModule(name, module) {
        this.modules.set(name, module);
        
        if (module.init && typeof module.init === 'function') {
            module.init(this);
        }
        
        this.emit('module:registered', { name, module });
        this.log('info', `Module registered: ${name}`);
    }

    getModule(name) {
        return this.modules.get(name);
    }

    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    this.serviceWorker = registration;
                    this.emit('serviceworker:registered', registration);
                })
                .catch(error => {
                    this.log('error', 'Service worker registration failed:', error);
                });
        }
    }

    setupOfflineDetection() {
        window.addEventListener('online', () => {
            this.state.online = true;
            this.emit('app:online');
        });
        
        window.addEventListener('offline', () => {
            this.state.online = false;
            this.emit('app:offline');
        });
        
        this.state.online = navigator.onLine;
    }

    setupPerformanceMonitor() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    this.emit('performance:' + entry.entryType, entry);
                });
            });
            
            observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift'] });
        }
    }

    // سیستم رویداد
    on(event, callback) {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        this.events.get(event).push(callback);
    }

    off(event, callback) {
        if (this.events.has(event)) {
            const callbacks = this.events.get(event);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    emit(event, data) {
        if (this.events.has(event)) {
            this.events.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    this.log('error', `Event handler error for ${event}:`, error);
                }
            });
        }
    }

    // سیستم ثبت‌وقایع
    log(level, message, data = {}) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            level,
            message,
            timestamp,
            data,
            app: this.config.name,
            version: this.config.version
        };
        
        if (this.config.debug || level === 'error') {
            console[level](`[${timestamp}] ${message}`, data);
        }
        
        this.emit('log', logEntry);
        
        const logs = storage.getSession('app_logs', []);
        logs.push(logEntry);
        if (logs.length > 100) logs.shift();
        storage.setSession('app_logs', logs);
    }

    // مدیریت وضعیت
    setState(key, value) {
        this.state[key] = value;
    }

    getState(key) {
        return this.state[key];
    }

    updateState(updates) {
        Object.entries(updates).forEach(([key, value]) => {
            this.state[key] = value;
        });
    }

    // تنظیمات
    updateConfig(updates) {
        this.config = { ...this.config, ...updates };
        storage.set('app_config', this.config);
        this.emit('config:updated', this.config);
        
        if (updates.theme) {
            document.documentElement.setAttribute('data-theme', updates.theme);
        }
        
        if (updates.language) {
            document.documentElement.setAttribute('lang', updates.language);
        }
    }

    // ابزارک‌های کمکی
    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async retry(fn, retries = 3, delay = 1000) {
        for (let i = 0; i < retries; i++) {
            try {
                return await fn();
            } catch (error) {
                if (i === retries - 1) throw error;
                await this.sleep(delay);
                delay *= 2;
            }
        }
    }

    debounce(fn, delay) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn(...args), delay);
        };
    }

    throttle(fn, limit) {
        let inThrottle;
        return (...args) => {
            if (!inThrottle) {
                fn(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // مدیریت حافظه
    cleanup() {
        this.events.clear();
        this.modules.clear();
        
        if (this.serviceWorker) {
            this.serviceWorker.unregister();
        }
        
        this.emit('app:cleanup');
    }

    // خروجی اپ
    exportApp() {
        const exportData = {
            config: this.config,
            modules: Array.from(this.modules.keys()),
            timestamp: Date.now(),
            version: this.config.version
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });
        
        return URL.createObjectURL(blob);
    }

    // آماده‌سازی برای PWA
    async installPWA() {
        if (window.deferredPrompt) {
            const result = await window.deferredPrompt.prompt();
            if (result.outcome === 'accepted') {
                this.emit('pwa:installed');
                return true;
            }
        }
        return false;
    }

    // API برای ماژول‌های خارجی
    createAPI() {
        return {
            getConfig: () => ({ ...this.config }),
            updateConfig: (updates) => this.updateConfig(updates),
            getModule: (name) => this.getModule(name),
            on: (event, callback) => this.on(event, callback),
            emit: (event, data) => this.emit(event, data),
            log: (level, message, data) => this.log(level, message, data),
            storage: {
                get: (key, defaultValue) => storage.get(key, defaultValue),
                set: (key, value, options) => storage.set(key, value, options)
            }
        };
    }
}

export const app = new AppBuilder();
