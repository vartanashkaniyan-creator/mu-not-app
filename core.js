/**
 * 🏗️ Core.js – هسته اصلی موتور اپ ساز
 * نسخه 3.0.0
 * مدیریت اپ‌ها، مسیرها، و حالت‌ها
 */

class AppCore {
    constructor() {
        this.apps = {};
        this.currentApp = null;
        this.routes = {};
        this.logs = [];
        this.errors = [];
    }

    // ثبت اپ
    registerApp(appId, appInstance) {
        if (this.apps[appId]) {
            return this.error('اپ قبلاً ثبت شده', { appId });
        }
        this.apps[appId] = appInstance;
        this.log('registerApp', { appId });
    }

    // راه‌اندازی اپ
    launchApp(appId) {
        const app = this.apps[appId];
        if (!app) return this.error('اپ یافت نشد', { appId });

        this.currentApp = app;
        if (typeof app.init === 'function') app.init();
        this.log('launchApp', { appId });
        return app;
    }

    // ثبت مسیر (Router)
    registerRoute(path, handler) {
        this.routes[path] = handler;
        this.log('registerRoute', { path });
    }

    navigate(path, params = {}) {
        const handler = this.routes[path];
        if (!handler) return this.error('مسیر یافت نشد', { path });

        try {
            handler(params);
            this.log('navigate', { path, params });
        } catch (err) {
            this.error('خطا در اجرای مسیر', { path, error: err.message });
        }
    }

    // گزارش‌گیری
    log(action, data) {
        const entry = {
            timestamp: new Date().toISOString(),
            action,
            data
        };
        this.logs.push(entry);
        console.log(`🟢 [Core] ${action}`, data);
    }

    error(message, details) {
        const err = {
            id: `ERR_${Date.now()}`,
            message,
            details,
            timestamp: new Date().toISOString()
        };
        this.errors.push(err);
        console.error(`🔴 [Core] ${message}`, details);
        return err;
    }

    // دریافت وضعیت اپ‌ها
    getStatus() {
        return {
            appsCount: Object.keys(this.apps).length,
            currentApp: this.currentApp ? this.currentApp.name : null,
            logsCount: this.logs.length,
            errorsCount: this.errors.length
        };
    }

    // خروجی JSON برای ذخیره یا بکاپ
    exportState() {
        const appsState = {};
        for (const [id, app] of Object.entries(this.apps)) {
            appsState[id] = typeof app.toJSON === 'function' ? app.toJSON() : {};
        }
        return {
            apps: appsState,
            currentApp: this.currentApp ? this.currentApp.name : null,
            logs: this.logs,
            errors: this.errors
        };
    }
}

// ثبت در سطح جهانی
window.AppCore = new AppCore();

console.log('✅ Core.js بارگذاری شد');
