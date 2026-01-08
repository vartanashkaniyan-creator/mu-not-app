// core.js - موتور اصلی اپ‌ساز
// Version 1.0 - فارسی/انگلیسی - مخصوص موبایل

class AppBuilderCore {
    constructor() {
        this.language = 'fa';
        this.appTypes = 25;
        this.currentApp = null;
        this.init();
    }

    init() {
        this.loadLanguage();
        this.setupMobileEvents();
        this.initializeModules();
        console.log(this.t('welcome_message'));
    }

    // سیستم چندزبانی
    translations = {
        fa: {
            welcome_message: 'موتور اپ‌ساز v1.0 آماده است',
            creating_app: 'در حال ساخت اپلیکیشن...',
            select_type: 'نوع اپلیکیشن را انتخاب کنید',
            error: 'خطا در پردازش',
            save: 'ذخیره',
            cancel: 'انصراف'
        },
        en: {
            welcome_message: 'App Builder Engine v1.0 ready',
            creating_app: 'Creating application...',
            select_type: 'Select application type',
            error: 'Processing error',
            save: 'Save',
            cancel: 'Cancel'
        }
    };

    t(key) {
        return this.translations[this.language][key] || key;
    }

    setLanguage(lang) {
        this.language = lang === 'en' ? 'en' : 'fa';
        this.updateUI();
    }

    // لیست ۲۵ نوع اپ پرکاربرد
    getAppTypes() {
        return [
            { id: 1, name: 'یادداشت', en: 'Notes', components: ['editor', 'list', 'search'] },
            { id: 2, name: 'ماشین حساب', en: 'Calculator', components: ['basic', 'scientific', 'converter'] },
            { id: 3, name: 'لیست کارها', en: 'To-Do List', components: ['tasks', 'categories', 'reminders'] },
            { id: 4, name: 'مدیریت هزینه', en: 'Expense Tracker', components: ['budget', 'categories', 'charts'] },
            { id: 5, name: 'دفترچه تلفن', en: 'Address Book', components: ['contacts', 'groups', 'search'] },
            { id: 6, name: 'یادآور', en: 'Reminder', components: ['alarms', 'recurring', 'notifications'] },
            { id: 7, name: 'فروشگاه آنلاین', en: 'E-Commerce', components: ['products', 'cart', 'checkout'] },
            { id: 8, name: 'پخش موسیقی', en: 'Music Player', components: ['player', 'playlist', 'equalizer'] },
            { id: 9, name: 'مدیریت پروژه', en: 'Project Manager', components: ['tasks', 'teams', 'timeline'] },
            { id: 10, name: 'دیکشنری', en: 'Dictionary', components: ['search', 'favorites', 'history'] },
            { id: 11, name: 'هواشناسی', en: 'Weather', components: ['forecast', 'locations', 'alerts'] },
            { id: 12, name: 'تبدیل واحد', en: 'Unit Converter', components: ['length', 'weight', 'temperature'] },
            { id: 13, name: 'دفتر خاطرات', en: 'Diary', components: ['entries', 'calendar', 'mood'] },
            { id: 14, name: 'تنظیم رژیم', en: 'Diet Planner', components: ['meals', 'calories', 'progress'] },
            { id: 15, name: 'ورزش', en: 'Workout', components: ['exercises', 'timer', 'progress'] },
            { id: 16, name: 'مدیتیشن', en: 'Meditation', components: ['timer', 'sessions', 'stats'] },
            { id: 17, name: 'آشپزی', en: 'Recipes', components: ['recipes', 'ingredients', 'timer'] },
            { id: 18, name: 'رمزساز', en: 'Password Manager', components: ['vault', 'generator', 'categories'] },
            { id: 19, name: 'نقشه', en: 'Map', components: ['locations', 'routes', 'bookmarks'] },
            { id: 20, name: 'عکاسی', en: 'Photo Editor', components: ['filters', 'crop', 'adjustments'] },
            { id: 21, name: 'رزرو غذا', en: 'Food Delivery', components: ['restaurants', 'cart', 'tracking'] },
            { id: 22, name: 'درخواست تاکسی', en: 'Taxi App', components: ['booking', 'tracking', 'payment'] },
            { id: 23, name: 'بانک', en: 'Banking', components: ['accounts', 'transactions', 'transfer'] },
            { id: 24, name: 'آموزش', en: 'E-Learning', components: ['courses', 'quizzes', 'progress'] },
            { id: 25, name: 'بازی', en: 'Simple Game', components: ['levels', 'scores', 'settings'] }
        ];
    }

    // ساخت اپ جدید
    createApp(typeId, config = {}) {
        const appType = this.getAppTypes().find(app => app.id === typeId);
        if (!appType) {
            throw new Error(this.t('error'));
        }

        this.currentApp = {
            id: Date.now(),
            type: appType,
            name: this.language === 'fa' ? appType.name : appType.en,
            config: {
                language: this.language,
                theme: config.theme || 'light',
                ...config
            },
            components: this.generateComponents(appType.components),
            createdAt: new Date().toISOString()
        };

        this.saveToStorage();
        return this.currentApp;
    }

    // تولید کامپوننت‌های اپ
    generateComponents(componentList) {
        const components = {};
        
        componentList.forEach(comp => {
            switch(comp) {
                case 'editor':
                    components.editor = this.createEditorComponent();
                    break;
                case 'list':
                    components.list = this.createListComponent();
                    break;
                case 'search':
                    components.search = this.createSearchComponent();
                    break;
                case 'basic':
                    components.calculator = this.createCalculatorComponent();
                    break;
                // ... بقیه کامپوننت‌ها
                default:
                    components[comp] = { type: comp, data: {} };
            }
        });
        
        return components;
    }

    // کامپوننت ویرایشگر
    createEditorComponent() {
        return {
            type: 'editor',
            version: '1.0',
            features: ['text', 'formatting', 'images'],
            mobileOptimized: true,
            getHTML() {
                return `<textarea class="editor" placeholder="${this.language === 'fa' ? 'متن خود را وارد کنید...' : 'Type here...'}"></textarea>`;
            }
        };
    }

    // کامپوننت لیست
    createListComponent() {
        return {
            type: 'list',
            items: [],
            add(item) {
                this.items.push(item);
            },
            remove(index) {
                this.items.splice(index, 1);
            },
            getHTML() {
                return `<ul class="mobile-list">${this.items.map(item => `<li>${item}</li>`).join('')}</ul>`;
            }
        };
    }

    // کامپوننت جستجو
    createSearchComponent() {
        return {
            type: 'search',
            placeholder: this.language === 'fa' ? 'جستجو...' : 'Search...',
            history: [],
            search(query) {
                this.history.push(query);
                return [];
            },
            getHTML() {
                return `<input type="search" placeholder="${this.placeholder}" class="mobile-search">`;
            }
        };
    }

    // کامپوننت ماشین حساب
    createCalculatorComponent() {
        return {
            type: 'calculator',
            operations: ['+', '-', '*', '/'],
            calculate(a, b, op) {
                switch(op) {
                    case '+': return a + b;
                    case '-': return a - b;
                    case '*': return a * b;
                    case '/': return b !== 0 ? a / b : 'Error';
                    default: return 0;
                }
            },
            getHTML() {
                return `<div class="calculator">2+2=4</div>`;
            }
        };
    }

    // بهینه‌سازی برای موبایل
    setupMobileEvents() {
        // تشخیص تاچ
        document.addEventListener('touchstart', (e) => {
            this.handleTouch(e);
        }, { passive: true });

        // تشخیص جهت صفحه
        window.addEventListener('orientationchange', () => {
            this.handleOrientationChange();
        });

        // مدیریت back button اندروید
        window.addEventListener('popstate', () => {
            this.handleBackButton();
        });
    }

    handleTouch(e) {
        // منطق تاچ برای موبایل
        const touch = e.touches[0];
        this.lastTouchX = touch.clientX;
        this.lastTouchY = touch.clientY;
    }

    handleOrientationChange() {
        console.log(this.t('orientation_changed'));
        this.updateUI();
    }

    handleBackButton() {
        // مدیریت دکمه بازگشت اندروید
        if (window.history.length <= 1) {
            this.showExitConfirm();
        }
    }

    showExitConfirm() {
        if (confirm(this.language === 'fa' ? 'آیا می‌خواهید خارج شوید؟' : 'Do you want to exit?')) {
            this.saveState();
        }
    }

    // ذخیره‌سازی
    saveToStorage() {
        try {
            localStorage.setItem('appBuilder_currentApp', JSON.stringify(this.currentApp));
            localStorage.setItem('appBuilder_language', this.language);
            return true;
        } catch (e) {
            console.error(this.t('error'), e);
            return false;
        }
    }

    loadFromStorage() {
        try {
            const savedApp = localStorage.getItem('appBuilder_currentApp');
            const savedLang = localStorage.getItem('appBuilder_language');
            
            if (savedApp) this.currentApp = JSON.parse(savedApp);
            if (savedLang) this.language = savedLang;
            
            return true;
        } catch (e) {
            console.error(this.t('error'), e);
            return false;
        }
    }

    // UI
    updateUI() {
        // به‌روزرسانی رابط کاربری بر اساس زبان
        document.documentElement.dir = this.language === 'fa' ? 'rtl' : 'ltr';
        document.documentElement.lang = this.language;
    }

    // ماژول‌ها
    initializeModules() {
        this.modules = {
            router: null,
            storage: null,
            ui: null
        };
    }

    // ذخیره وضعیت
    saveState() {
        const state = {
            app: this.currentApp,
            language: this.language,
            timestamp: Date.now()
        };
        this.saveToStorage();
        return state;
    }

    // بارگذاری زبان
    loadLanguage() {
        const savedLang = localStorage.getItem('appBuilder_language');
        const browserLang = navigator.language.startsWith('fa') ? 'fa' : 'en';
        this.language = savedLang || browserLang;
    }

    // دریافت اپلیکیشن‌های ساخته شده
    getCreatedApps() {
        const saved = localStorage.getItem('appBuilder_apps');
        return saved ? JSON.parse(saved) : [];
    }

    // حذف اپ
    deleteApp(appId) {
        const apps = this.getCreatedApps();
        const filtered = apps.filter(app => app.id !== appId);
        localStorage.setItem('appBuilder_apps', JSON.stringify(filtered));
        return true;
    }

    // خروجی‌گیری
    exportApp(appId, format = 'html') {
        const apps = this.getCreatedApps();
        const app = apps.find(a => a.id === appId);
        
        if (!app) return null;

        switch(format) {
            case 'html':
                return this.generateHTML(app);
            case 'json':
                return JSON.stringify(app, null, 2);
            case 'pwa':
                return this.generatePWA(app);
            default:
                return this.generateHTML(app);
        }
    }

    generateHTML(app) {
        return `
<!DOCTYPE html>
<html lang="${app.config.language}" dir="${app.config.language === 'fa' ? 'rtl' : 'ltr'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>${app.name}</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .app-container { max-width: 500px; margin: 0 auto; background: white; border-radius: 15px; padding: 20px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
        .app-header { text-align: center; margin-bottom: 20px; }
        .app-content { min-height: 300px; }
        @media (max-width: 768px) {
            body { padding: 10px; }
            .app-container { border-radius: 10px; padding: 15px; }
        }
    </style>
</head>
<body>
    <div class="app-container">
        <div class="app-header">
            <h1>${app.name}</h1>
            <p>${this.language === 'fa' ? 'ساخته شده با اپ‌ساز' : 'Created with App Builder'}</p>
        </div>
        <div class="app-content" id="app-content">
            <!-- محتوای اپ -->
        </div>
    </div>
    <script>
        // کد JavaScript اپ
        console.log('${app.name} loaded');
    </script>
</body>
</html>`;
    }

    generatePWA(app) {
        // ساخت PWA
        return {
            ...app,
            manifest: {
                name: app.name,
                short_name: app.name.substring(0, 12),
                start_url: './',
                display: 'standalone',
                theme_color: '#2196F3',
                background_color: '#ffffff'
            },
            serviceWorker: `
self.addEventListener('install', (e) => {
    console.log('Service Worker installed');
});
            `
        };
    }

    // راه‌اندازی
    start() {
        this.loadFromStorage();
        this.updateUI();
        console.log(`${this.t('welcome_message')} - ${this.appTypes} app types available`);
        return this;
    }
}

// ایجاد instance جهانی
window.AppBuilder = new AppBuilderCore().start();

// Export برای ماژول‌ها
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppBuilderCore;
  }
