/**
 * 🏗️ هسته اپ‌ساز ۲۵ اپ حرفه‌ای
 * شامل کلاس پایه، اپ‌های اصلی، فکتوری و ابزارها
 */

// ==================== کلاس پایه اپ ====================
class MobileApp {
    constructor(config) {
        this.name = config.name || 'New App';
        this.version = config.version || '1.0.0';
        this.author = config.author || 'App Builder';
        this.createdAt = new Date().toISOString();
        this.components = [];
        this.logs = [];
        this.errors = [];
    }

    log(action, data) {
        this.logs.push({ action, data, timestamp: new Date().toISOString() });
        console.log(`📱 [${this.name}] ${action}`, data);
    }

    error(message, details) {
        const err = { message, details, timestamp: new Date().toISOString() };
        this.errors.push(err);
        console.error(`❌ [${this.name}] ${message}`, details);
        return err;
    }

    toJSON() {
        return {
            meta: { name: this.name, version: this.version, author: this.author },
            components: this.components,
            stats: { logsCount: this.logs.length, errorsCount: this.errors.length }
        };
    }
}

// ==================== فکتوری اپ‌ها ====================
class AppFactory {
    static createApp(type, config = {}) {
        const apps = {
            'note': NoteApp,
            'calculator': CalculatorApp,
            'todo': TodoApp
        };
        const AppClass = apps[type];
        if (!AppClass) throw new Error(`اپ "${type}" پشتیبانی نمی‌شود`);
        return new AppClass(config);
    }

    static getAvailableApps() {
        return [
            { id: 'note', name: 'یادداشت حرفه‌ای', icon: '📝' },
            { id: 'calculator', name: 'ماشین حساب مهندسی', icon: '🧮' },
            { id: 'todo', name: 'مدیریت کارها', icon: '✅' }
        ];
    }
}

// ==================== صادرات ====================
window.AppLibrary = {
    MobileApp,
    AppFactory
};
