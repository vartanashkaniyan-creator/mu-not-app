/**
 * 🌍 سیستم دوزبانه (فارسی/انگلیسی)
 */

const Translations = {
    // ============ دیکشنری ترجمه ============
    dictionary: {
        en: {
            // عمومی
            'app_name': 'Mobile App Builder',
            'status': 'Status',
            'ready': 'Ready',
            'loading': 'Loading...',
            'error': 'Error',
            'success': 'Success',
            'save': 'Save',
            'cancel': 'Cancel',
            'delete': 'Delete',
            'edit': 'Edit',
            'search': 'Search',
            'home': 'Home',
            'back': 'Back',
            'next': 'Next',
            'settings': 'Settings',
            'language': 'Language',
            
            // دستورات
            'enter_command': 'Enter command...',
            'execute': 'Execute',
            'example': 'Example',
            'page_note': 'page note',
            'page_calculator': 'page calculator',
            'page_todo': 'page todo',
            
            // صفحات
            'welcome': 'Welcome!',
            'welcome_message': 'Enter a command or select from options:',
            'quick_actions': 'Quick Actions',
            'notes': 'Notes',
            'calculator': 'Calculator',
            'todo_list': 'Todo List',
            'timer': 'Timer',
            'calendar': 'Calendar',
            'converter': 'Unit Converter',
            'contacts': 'Contacts',
            'weather': 'Weather',
            'map': 'Map',
            'translator': 'Translator',
            'finance': 'Finance',
            'health': 'Health',
            
            // دکمه‌ها
            'save_note': 'Save Note',
            'load_note': 'Load Note',
            'clear_note': 'Clear',
            'add_item': 'Add Item',
            'clear_all': 'Clear All',
            'start': 'Start',
            'pause': 'Pause',
            'reset': 'Reset',
            
            // پیام‌ها
            'saved_successfully': 'Saved successfully',
            'deleted_successfully': 'Deleted successfully',
            'are_you_sure': 'Are you sure?',
            'no_data': 'No data available',
            'coming_soon': 'Coming soon...',
            
            // ارورها
            'invalid_command': 'Invalid command',
            'command_not_found': 'Command not found',
            'try_again': 'Please try again',
            
            // آمار
            'total': 'Total',
            'completed': 'Completed',
            'remaining': 'Remaining',
            'characters': 'Characters',
            'words': 'Words'
        },
        
        fa: {
            // عمومی
            'app_name': 'سازنده اپ موبایل',
            'status': 'وضعیت',
            'ready': 'آماده',
            'loading': 'در حال بارگذاری...',
            'error': 'خطا',
            'success': 'موفق',
            'save': 'ذخیره',
            'cancel': 'لغو',
            'delete': 'حذف',
            'edit': 'ویرایش',
            'search': 'جستجو',
            'home': 'خانه',
            'back': 'بازگشت',
            'next': 'بعدی',
            'settings': 'تنظیمات',
            'language': 'زبان',
            
            // دستورات
            'enter_command': 'دستور را وارد کنید...',
            'execute': 'اجرا',
            'example': 'مثال',
            'page_note': 'صفحه یادداشت',
            'page_calculator': 'صفحه ماشین حساب',
            'page_todo': 'صفحه کارها',
            
            // صفحات
            'welcome': 'خوش آمدید!',
            'welcome_message': 'دستور وارد کنید یا از گزینه‌ها انتخاب نمایید:',
            'quick_actions': 'دستورات سریع',
            'notes': 'یادداشت',
            'calculator': 'ماشین حساب',
            'todo_list': 'لیست کارها',
            'timer': 'تایمر',
            'calendar': 'تقویم',
            'converter': 'مبدل واحد',
            'contacts': 'مخاطبین',
            'weather': 'آب و هوا',
            'map': 'نقشه',
            'translator': 'مترجم',
            'finance': 'مالی',
            'health': 'سلامتی',
            
            // دکمه‌ها
            'save_note': 'ذخیره یادداشت',
            'load_note': 'بارگذاری یادداشت',
            'clear_note': 'پاک کردن',
            'add_item': 'افزودن آیتم',
            'clear_all': 'حذف همه',
            'start': 'شروع',
            'pause': 'توقف',
            'reset': 'بازنشانی',
            
            // پیام‌ها
            'saved_successfully': 'با موفقیت ذخیره شد',
            'deleted_successfully': 'با موفقیت حذف شد',
            'are_you_sure': 'آیا مطمئن هستید؟',
            'no_data': 'داده‌ای موجود نیست',
            'coming_soon': 'به زودی...',
            
            // ارورها
            'invalid_command': 'دستور نامعتبر',
            'command_not_found': 'دستور یافت نشد',
            'try_again': 'لطفاً دوباره امتحان کنید',
            
            // آمار
            'total': 'کل',
            'completed': 'انجام شده',
            'remaining': 'باقی‌مانده',
            'characters': 'کاراکتر',
            'words': 'کلمه'
        }
    },
    
    // ============ وضعیت فعلی ============
    currentLang: 'fa',
    
    // ============ توابع اصلی ============
    
    // تغییر زبان
    setLanguage(lang) {
        if (this.dictionary[lang]) {
            this.currentLang = lang;
            localStorage.setItem('app_language', lang);
            
            // اعمال تغییرات
            this.applyTranslations();
            this.updateDirection();
            
            // ذخیره در AppState اگر موجود است
            if (window.AppState) {
                AppState.data.language = lang;
                AppState.save();
            }
            
            console.log(`🌍 زبان تغییر کرد به: ${lang}`);
            return true;
        }
        return false;
    },
    
    // دریافت ترجمه
    t(key, params = {}) {
        let translation = this.dictionary[this.currentLang][key] || 
                         this.dictionary.en[key] || 
                         key;
        
        // جایگزینی پارامترها
        Object.keys(params).forEach(param => {
            translation = translation.replace(`{{${param}}}`, params[param]);
        });
        
        return translation;
    },
    
    // ترجمه متون در صفحه
    applyTranslations() {
        // عناصری که data-i18n دارند
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });
        
        // عناصری که data-i18n-title دارند
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            element.title = this.t(key);
        });
        
        // عناصری که data-i18n-aria-label دارند
        document.querySelectorAll('[data-i18n-aria-label]').forEach(element => {
            const key = element.getAttribute('data-i18n-aria-label');
            element.setAttribute('aria-label', this.t(key));
        });
        
        // به‌روزرسانی عنوان صفحه
        const title = document.querySelector('title');
        if (title && !title.hasAttribute('data-i18n')) {
            title.textContent = this.t('app_name');
        }
        
        // اعمال روی اجزای داینامیک
        this.updateDynamicContent();
    },
    
    // به‌روزرسانی اجزای داینامیک
    updateDynamicContent() {
        // به‌روزرسانی دکمه‌ها و متن‌های ایجاد شده توسط جاوااسکریپت
        const appTitle = document.querySelector('.app-title');
        if (appTitle && window.AppState?.current?.schema?.title) {
            // اگر عنوان از موتور آمده، ترجمه کن
            const currentTitle = AppState.current.schema.title;
            const translatedTitle = this.translateText(currentTitle);
            appTitle.textContent = translatedTitle;
        }
        
        // به‌روزرسانی وضعیت
        const statusEl = document.getElementById('app-status');
        if (statusEl) {
            const currentText = statusEl.textContent;
            const translatedStatus = this.translateText(currentText);
            if (translatedStatus !== currentText) {
                statusEl.textContent = translatedStatus;
            }
        }
    },
    
    // ترجمه متن معمولی (غیر کلید)
    translateText(text) {
        if (!text || typeof text !== 'string') return text;
        
        // جستجوی معادل در دیکشنری
        const entries = Object.entries(this.dictionary[this.currentLang]);
        for (const [key, value] of entries) {
            if (text.includes(key) || text.toLowerCase().includes(key.toLowerCase())) {
                // اگر متن دقیقاً با کلید مطابقت دارد
                if (text.trim() === key || text.trim().toLowerCase() === key.toLowerCase()) {
                    return value;
                }
            }
        }
        
        return text;
    },
    
    // تنظیم جهت متن
    updateDirection() {
        document.documentElement.dir = this.currentLang === 'fa' ? 'rtl' : 'ltr';
        document.documentElement.lang = this.currentLang;
        
        // اضافه کردن کلاس جهت
        document.body.classList.remove('ltr', 'rtl');
        document.body.classList.add(this.currentLang === 'fa' ? 'rtl' : 'ltr');
    },
    
    // مقداردهی اولیه
    init() {
        // بارگذاری زبان ذخیره شده
        const savedLang = localStorage.getItem('app_language') || 'fa';
        this.setLanguage(savedLang);
        
        // اضافه کردن کلاس جهت
        this.updateDirection();
        
        // ردیابی تغییرات DOM برای عناصر جدید
        const observer = new MutationObserver(() => {
            this.applyTranslations();
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('🌍 سیستم ترجمه بارگذاری شد');
    },
    
    // ============ ابزارهای کمکی ============
    
    // تشخیص زبان مرورگر
    detectBrowserLanguage() {
        const browserLang = (navigator.language || navigator.userLanguage || 'en').substring(0, 2);
        return browserLang === 'fa' ? 'fa' : 'en';
    },
    
    // لیست زبان‌های پشتیبانی شده
    getSupportedLanguages() {
        return Object.keys(this.dictionary).map(lang => ({
            code: lang,
            name: lang === 'fa' ? 'فارسی' : 'English',
            native: lang === 'fa' ? 'فارسی' : 'English',
            dir: lang === 'fa' ? 'rtl' : 'ltr'
        }));
    },
    
    // تغییر خودکار زبان
    toggleLanguage() {
        const newLang = this.currentLang === 'fa' ? 'en' : 'fa';
        return this.setLanguage(newLang);
    },
    
    // ترجمه دستورات
    translateCommand(command) {
        if (this.currentLang === 'fa') {
            // اگر کاربر فارسی تایپ کرد، به انگلیسی تبدیل کن
            const faToEn = {
                'صفحه': 'screen',
                'یادداشت': 'note',
                'ماشین حساب': 'calculator',
                'کارها': 'todo',
                'تایمر': 'timer',
                'تقویم': 'calendar',
                'عنوان': 'title',
                'هشدار': 'alert'
            };
            
            let translated = command;
            Object.entries(faToEn).forEach(([fa, en]) => {
                translated = translated.replace(new RegExp(fa, 'g'), en);
            });
            return translated;
        }
        return command;
    },
    
    // قالب پیام
    formatMessage(key, params = {}) {
        return this.t(key, params);
    }
};

// ============ API عمومی ============

// تابع ترجمه سریع
function t(key, params) {
    return Translations.t(key, params);
}

// تغییر زبان
function setLanguage(lang) {
    return Translations.setLanguage(lang);
}

// دریافت زبان فعلی
function getCurrentLanguage() {
    return Translations.currentLang;
}

// تغییر خودکار زبان
function toggleLanguage() {
    return Translations.toggleLanguage();
}

// ============ صادر کردن ============
window.i18n = Translations;
window.t = t;
window.setLanguage = setLanguage;
window.getCurrentLanguage = getCurrentLanguage;
window.toggleLanguage = toggleLanguage;

// شروع خودکار
document.addEventListener('DOMContentLoaded', () => {
    Translations.init();
});
