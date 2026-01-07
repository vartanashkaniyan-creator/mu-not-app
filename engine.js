// ==================== engine.js ====================

class Engine {
    constructor(config = {}) {
        this.apps = new Map();      // اپ‌های ساخته شده
        this.currentApp = null;     // اپ فعال
        this.storage = StorageManager; // مدیریت ذخیره‌سازی
        this.config = Object.assign({
            language: 'fa',
            autoSave: true,
            offlineMode: true
        }, config);

        this.init();
    }

    init() {
        console.log("🚀 Engine initialized");
    }

    // ساخت یک اپ جدید
    createApp(type, config) {
        try {
            const app = AppFactory.createApp(type, config);
            this.apps.set(app.name, app);
            this.currentApp = app;
            console.log(`✅ App created: ${app.name}`);
            return app;
        } catch (err) {
            console.error("❌ Error creating app:", err);
            return null;
        }
    }

    // بارگذاری اپ موجود
    loadApp(name) {
        if (!this.apps.has(name)) {
            console.error(`App "${name}" not found`);
            return null;
        }
        this.currentApp = this.apps.get(name);
        console.log(`📂 App loaded: ${name}`);
        return this.currentApp;
    }

    // اجرای کد اپ یا صفحه
    runCode(code, context = {}) {
        try {
            const func = new Function("EngineContext", code);
            return func(context);
        } catch (err) {
            console.error("❌ Error running code:", err);
            return null;
        }
    }

    // ذخیره خودکار اپ
    autoSaveApp(appName) {
        if (!this.config.autoSave || !this.apps.has(appName)) return;
        const app = this.apps.get(appName);
        const data = app.generateCode();
        this.storage.save(appName, data);
        console.log(`💾 App "${appName}" auto-saved`);
    }

    // گرفتن وضعیت فعلی اپ‌ها
    getStatus() {
        return {
            totalApps: this.apps.size,
            currentApp: this.currentApp ? this.currentApp.name : null,
            config: this.config
        };
    }

    // حذف یک اپ
    deleteApp(name) {
        if (this.apps.has(name)) {
            this.apps.delete(name);
            console.log(`🗑️ App deleted: ${name}`);
            if (this.currentApp && this.currentApp.name === name) this.currentApp = null;
            return true;
        }
        return false;
    }

    // اجرای پیش‌نمایش زنده اپ
    previewApp(name) {
        const app = this.loadApp(name);
        if (!app) return;
        const previewWindow = window.open("", "_blank");
        const code = app.generateCode();
        previewWindow.document.write(code.html);
        const style = document.createElement("style");
        style.innerHTML = code.css;
        previewWindow.document.head.appendChild(style);
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.innerHTML = code.js;
        previewWindow.document.body.appendChild(script);
        console.log(`👀 Preview launched for app: ${name}`);
    }
}

// ==================== Singleton Engine ====================
window.EngineInstance = new Engine();
