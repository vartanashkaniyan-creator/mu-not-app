/**
 * 🏗️ کتابخانه اپ‌ها – App Library
 * نسخه 3.0.0
 * پشتیبانی از موبایل و وب
 * کلاس محور، MVC، مدیریت خطا و لاگ
 */

class MobileApp {
    constructor(config = {}) {
        this.name = config.name || 'App';
        this.version = config.version || '1.0.0';
        this.author = config.author || 'App Builder';
        this.createdAt = new Date().toISOString();
        this.components = [];
        this.logs = [];
        this.errors = [];
    }

    log(action, data) {
        const entry = {
            timestamp: Date.now(),
            action,
            data,
            app: this.name
        };
        this.logs.push(entry);
        console.log(`📱 [${this.name}] ${action}`, data);
    }

    error(message, details = {}) {
        const err = {
            id: `ERR_${Date.now()}`,
            message,
            details,
            timestamp: new Date().toISOString(),
            app: this.name
        };
        this.errors.push(err);
        console.error(`❌ [${this.name}] ${message}`, details);
        return err;
    }

    validate() {
        return this.errors.length === 0;
    }

    toJSON() {
        return {
            meta: {
                name: this.name,
                version: this.version,
                author: this.author,
                createdAt: this.createdAt,
                componentsCount: this.components.length
            },
            components: this.components,
            stats: {
                logsCount: this.logs.length,
                errorsCount: this.errors.length
            }
        };
    }

    addComponent(component) {
        this.components.push(component);
        this.log('addComponent', component);
    }

    removeComponent(id) {
        const index = this.components.findIndex(c => c.id === id);
        if (index >= 0) {
            const removed = this.components.splice(index, 1)[0];
            this.log('removeComponent', removed);
            return removed;
        }
        return null;
    }
}

// ثبت در window برای دسترسی عمومی
window.AppLibrary = {
    MobileApp
};

console.log('✅ App Library بارگذاری شد');
