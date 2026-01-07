
/**
 * 🏗️ App Manager – مدیریت و راه‌اندازی اپ‌ها
 * نسخه 3.0.0
 * وابسته به AppLibrary
 */

class AppFactory {
    constructor() {
        this.apps = {};
    }

    // ساخت اپ
    createApp(type, config = {}) {
        const AppClass = this.getAppClass(type);
        if (!AppClass) throw new Error(`اپ "${type}" پشتیبانی نمی‌شود`);
        const app = new AppClass(config);
        this.apps[type] = app;
        return app;
    }

    // دریافت کلاس اپ بر اساس نوع
    getAppClass(type) {
        const mapping = {
            'note': window.NoteApp,
            'calculator': window.CalculatorApp,
            'todo': window.TodoApp
            // بقیه اپ‌ها اضافه می‌شوند
        };
        return mapping[type] || null;
    }

    getApp(type) {
        return this.apps[type] || null;
    }

    listAvailableApps() {
        return [
            { id: 'note', name: 'یادداشت حرفه‌ای', icon: '📝', category: 'ابزار' },
            { id: 'calculator', name: 'ماشین حساب مهندسی', icon: '🧮', category: 'ابزار' },
            { id: 'todo', name: 'مدیریت کارها', icon: '✅', category: 'مدیریت' },
            { id: 'timer', name: 'تایمر و کرونومتر', icon: '⏱️', category: 'ابزار' },
            { id: 'calendar', name: 'تقویم هوشمند', icon: '📅', category: 'مدیریت' },
            { id: 'contacts', name: 'مدیریت مخاطبین', icon: '👥', category: 'مدیریت' },
            { id: 'expenses', name: 'پیگیری هزینه‌ها', icon: '💰', category: 'مالی' },
            { id: 'weather', name: 'آب و هوا', icon: '🌤️', category: 'اطلاعات' },
            { id: 'news', name: 'خبرخوان', icon: '📰', category: 'اطلاعات' },
            { id: 'music', name: 'پخش موسیقی', icon: '🎵', category: 'رسانه' },
            { id: 'gallery', name: 'گالری عکس', icon: '🖼️', category: 'رسانه' },
            { id: 'camera', name: 'دوربین و ویرایشگر', icon: '📷', category: 'رسانه' },
            { id: 'recorder', name: 'ضبط صدا', icon: '🎤', category: 'رسانه' },
            { id: 'map', name: 'نقشه و مسیریاب', icon: '🗺️', category: 'سرویس' },
            { id: 'translator', name: 'مترجم متن', icon: '🌐', category: 'ابزار' },
            { id: 'unit_converter', name: 'مبدل واحد', icon: '🔄', category: 'ابزار' },
            { id: 'barcode', name: 'اسکنر بارکد', icon: '📊', category: 'ابزار' },
            { id: 'qr_generator', name: 'سازنده QR', icon: '🔲', category: 'ابزار' },
            { id: 'flashlight', name: 'چراغ قوه', icon: '🔦', category: 'ابزار' },
            { id: 'compass', name: 'قطب‌نما', icon: '🧭', category: 'ابزار' },
            { id: 'level', name: 'تراز', icon: '📐', category: 'ابزار' },
            { id: 'speed_test', name: 'تست سرعت', icon: '🚀', category: 'سرویس' },
            { id: 'vpn', name: 'اتصال امن', icon: '🛡️', category: 'سرویس' },
            { id: 'password_manager', name: 'مدیر رمز عبور', icon: '🔐', category: 'امنیت' },
            { id: 'fitness', name: 'تناسب اندام', icon: '🏋️', category: 'سلامتی' }
        ];
    }

    generateAllApps() {
        const generated = {};
        this.listAvailableApps().forEach(appInfo => {
            try {
                const app = this.createApp(appInfo.id);
                if (typeof app.generateCode === 'function') {
                    generated[appInfo.id] = app.generateCode();
                }
            } catch (err) {
                console.warn(`خطا در ساخت اپ ${appInfo.name}:`, err);
            }
        });
        return generated;
    }
}

// Singleton برای دسترسی عمومی
window.AppFactory = new AppFactory();

console.log('✅ App Manager آماده و بارگذاری شد');
