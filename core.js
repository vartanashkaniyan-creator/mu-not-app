/**
 * 🏗️ Core.js – هسته اصلی App Builder
 * نسخه 3.1.0 – پیشرفته و ماژولار
 */

class AppCore {
    constructor() {
        this.apps = new Map();          // نگهداری اپ‌ها با id
        this.currentApp = null;         // اپ جاری
        this.routes = new Map();        // مسیرها
        this.logs = [];                 // گزارش‌ها
        this.errors = [];               // خطاها
    }

    // ثبت اپ
    registerApp(appId, appInstance) {
        if (this.apps.has(appId)) return this.error('اپ قبلاً ثبت شده', { appId });
        this.apps.set(appId, appInstance);
        this.log('registerApp', { appId });
    }

    // راه‌اندازی اپ
    launchApp(appId) {
        const app = this.apps.get(appId);
        if (!app) return this.error('اپ یافت نشد', { appId });

        this.currentApp = app;
        if (typeof app.init === 'function') app.init();
        this.log('launchApp', { appId });
        return app;
    }

    // مسیرها
    registerRoute(path, handler) {
        if (typeof handler !== 'function') return this.error('Handler نامعتبر', { path });
        this.routes.set(path, handler);
        this.log('registerRoute', { path });
    }

    navigate(path, params = {}) {
        const handler = this.routes.get(path);
        if (!handler) return this.error('مسیر یافت نشد', { path });
        try {
            handler(params);
            window.history.pushState({ path }, '', path);
            this.log('navigate', { path, params });
        } catch (err) {
            this.error('خطا در اجرای مسیر', { path, error: err.message });
        }
    }

    // بازگشت وضعیت
    getStatus() {
        return {
            appsCount: this.apps.size,
            currentApp: this.currentApp?.name || null,
            routesCount: this.routes.size,
            logsCount: this.logs.length,
            errorsCount: this.errors.length
        };
    }

    // خروجی JSON برای ذخیره یا بکاپ
    exportState() {
        const appsState = {};
        for (const [id, app] of this.apps.entries()) {
            appsState[id] = typeof app.toJSON === 'function' ? app.toJSON() : {};
        }
        return {
            apps: appsState,
            currentApp: this.currentApp?.name || null,
            routes: Array.from(this.routes.keys()),
            logs: this.logs,
            errors: this.errors
        };
    }

    // گزارش‌گیری
    log(action, data) {
        const entry = { timestamp: new Date().toISOString(), action, data };
        this.logs.push(entry);
        console.log(`🟢 [Core] ${action}`, data);
    }

    // ثبت خطا
    error(message, details) {
        const err = { id: `ERR_${Date.now()}`, message, details, timestamp: new Date().toISOString() };
        this.errors.push(err);
        console.error(`🔴 [Core] ${message}`, details);
        return err;
    }
}

// نمونه جهانی
window.AppCore = new AppCore();

console.log('✅ Core.js 3.1.0 (پیشرفته) بارگذاری شد');
