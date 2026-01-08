// i18n.js - سیستم بین‌المللی‌سازی
export class I18n {
    constructor() {
        this.locale = 'fa';
        this.fallbackLocale = 'en';
        this.messages = new Map();
        this.pluralRules = new Map();
        this.formatters = new Map();
        this.init();
    }

    init() {
        this.setLocale(this.detectLocale());
        this.loadMessages();
        this.setupFormatters();
        this.setupPluralRules();
        this.watchLocaleChanges();
    }

    detectLocale() {
        // اولویت‌ها: ذخیره شده ← مرورگر ← پیش‌فرض
        const saved = storage.get('app_locale');
        if (saved) return saved;

        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang) {
            if (browserLang.startsWith('fa')) return 'fa';
            if (browserLang.startsWith('ar')) return 'ar';
            if (browserLang.startsWith('en')) return 'en';
        }

        return 'fa';
    }

    setLocale(locale) {
        this.locale = locale;
        storage.set('app_locale', locale);
        document.documentElement.lang = locale;
        document.documentElement.dir = this.isRTL(locale) ? 'rtl' : 'ltr';
        
        window.dispatchEvent(new CustomEvent('localechange', {
            detail: { locale }
        }));
    }

    isRTL(locale) {
        return ['fa', 'ar', 'he', 'ur'].includes(locale);
    }

    loadMessages() {
        // فارسی
        this.addMessages('fa', {
            // عمومی
            'app.name': 'اپ‌ساز حرفه‌ای',
            'app.version': 'نسخه',
            'app.loading': 'در حال بارگذاری...',
            'app.error': 'خطا',
            'app.success': 'موفقیت',
            'app.warning': 'هشدار',
            'app.info': 'اطلاعات',
            'app.confirm': 'تایید',
            'app.cancel': 'لغو',
            'app.save': 'ذخیره',
            'app.edit': 'ویرایش',
            'app.delete': 'حذف',
            'app.add': 'افزودن',
            'app.search': 'جستجو',
            'app.filter': 'فیلتر',
            'app.sort': 'مرتب‌سازی',
            'app.refresh': 'تازه‌سازی',
            'app.back': 'بازگشت',
            'app.next': 'بعدی',
            'app.previous': 'قبلی',
            'app.done': 'انجام شد',
            'app.close': 'بستن',
            
            // ناوبری
            'nav.home': 'خانه',
            'nav.dashboard': 'داشبورد',
            'nav.apps': 'اپ‌ها',
            'nav.templates': 'تمپلیت‌ها',
            'nav.settings': 'تنظیمات',
            'nav.profile': 'پروفایل',
            'nav.help': 'راهنما',
            'nav.about': 'درباره',
            
            // اپ‌ها
            'apps.calculator': 'ماشین حساب',
            'apps.notes': 'یادداشت‌ها',
            'apps.todo': 'کارها',
            'apps.weather': 'آب و هوا',
            'apps.expenses': 'هزینه‌ها',
            'apps.timer': 'تایمر',
            'apps.converter': 'مبدل',
            'apps.camera': 'دوربین',
            'apps.gallery': 'گالری',
            'apps.music': 'موزیک',
            'apps.maps': 'نقشه',
            
            // فرم‌ها
            'form.submit': 'ارسال',
            'form.reset': 'بازنشانی',
            'form.required': 'الزامی',
            'form.invalid': 'نامعتبر',
            'form.email': 'ایمیل',
            'form.password': 'رمز عبور',
            'form.name': 'نام',
            'form.phone': 'تلفن',
            'form.address': 'آدرس',
            'form.message': 'پیام',
            
            // تاریخ و زمان
            'date.today': 'امروز',
            'date.yesterday': 'دیروز',
            'date.tomorrow': 'فردا',
            'date.just_now': 'همین الآن',
            'date.minutes_ago': 'دقیقه پیش',
            'date.hours_ago': 'ساعت پیش',
            'date.days_ago': 'روز پیش',
            
            // فایل‌ها
            'file.upload': 'آپلود',
            'file.download': 'دانلود',
            'file.rename': 'تغییر نام',
            'file.move': 'جابجایی',
            'file.copy': 'کپی',
            'file.paste': 'چسباندن',
            'file.select_all': 'انتخاب همه',
            'file.deselect_all': 'لغو انتخاب',
            
            // تنظیمات
            'settings.general': 'عمومی',
            'settings.display': 'نمایش',
            'settings.sounds': 'صداها',
            'settings.notifications': 'نوتیفیکیشن',
            'settings.privacy': 'حریم خصوصی',
            'settings.language': 'زبان',
            'settings.theme': 'تم',
            'settings.export': 'خروجی',
            'settings.import': 'ورودی',
            'settings.reset': 'بازنشانی',
            
            // خطاها
            'error.network': 'خطای شبکه',
            'error.server': 'خطای سرور',
            'error.not_found': 'پیدا نشد',
            'error.unauthorized': 'دسترسی غیرمجاز',
            'error.forbidden': 'ممنوع',
            'error.validation': 'خطای اعتبارسنجی',
            'error.timeout': 'اتمام زمان',
            'error.unknown': 'خطای ناشناخته',
            
            // موفقیت‌ها
            'success.saved': 'ذخیره شد',
            'success.deleted': 'حذف شد',
            'success.updated': 'بروزرسانی شد',
            'success.created': 'ساخته شد',
            'success.uploaded': 'آپلود شد',
            'success.downloaded': 'دانلود شد',
            
            // واحدها
            'unit.byte': 'بایت',
            'unit.kb': 'کیلوبایت',
            'unit.mb': 'مگابایت',
            'unit.gb': 'گیگابایت',
            'unit.tb': 'ترابایت',
            'unit.second': 'ثانیه',
            'unit.minute': 'دقیقه',
            'unit.hour': 'ساعت',
            'unit.day': 'روز',
            'unit.week': 'هفته',
            'unit.month': 'ماه',
            'unit.year': 'سال',
            
            // حالت‌ها
            'mode.on': 'روشن',
            'mode.off': 'خاموش',
            'mode.enabled': 'فعال',
            'mode.disabled': 'غیرفعال',
            'mode.visible': 'قابل مشاهده',
            'mode.hidden': 'مخفی',
            'mode.locked': 'قفل شده',
            'mode.unlocked': 'باز شده',
            
            // عملیات
            'operation.processing': 'در حال پردازش',
            'operation.completed': 'تکمیل شد',
            'operation.failed': 'ناموفق',
            'operation.pending': 'در انتظار',
            'operation.in_progress': 'در حال انجام',
            'operation.cancelled': 'لغو شد',
            
            // دسته‌ها
            'category.all': 'همه',
            'category.recent': 'اخیر',
            'category.favorite': 'مورد علاقه',
            'category.important': 'مهم',
            'category.archived': 'آرشیو',
            'category.trash': 'سطل آشغال',
            'category.draft': 'پیش‌نویس',
            'category.published': 'منتشر شده',
            
            // اعداد
            'number.zero': 'صفر',
            'number.one': 'یک',
            'number.two': 'دو',
            'number.three': 'سه',
            'number.few': 'چند',
            'number.many': 'بسیار',
            'number.other': 'دیگر'
        });

        // انگلیسی
        this.addMessages('en', {
            'app.name': 'Professional App Builder',
            'app.version': 'Version',
            'app.loading': 'Loading...',
            'app.error': 'Error',
            'app.success': 'Success',
            'app.warning': 'Warning',
            'app.info': 'Info',
            'app.confirm': 'Confirm',
            'app.cancel': 'Cancel',
            'app.save': 'Save',
            'app.edit': 'Edit',
            'app.delete': 'Delete',
            'app.add': 'Add',
            'app.search': 'Search',
            'app.filter': 'Filter',
            'app.sort': 'Sort',
            'app.refresh': 'Refresh',
            'app.back': 'Back',
            'app.next': 'Next',
            'app.previous': 'Previous',
            'app.done': 'Done',
            'app.close': 'Close',
            'nav.home': 'Home',
            'nav.dashboard': 'Dashboard',
            'nav.apps': 'Apps',
            'nav.templates': 'Templates',
            'nav.settings': 'Settings',
            'nav.profile': 'Profile',
            'nav.help': 'Help',
            'nav.about': 'About'
        });

        // عربی
        this.addMessages('ar', {
            'app.name': 'باني التطبيقات المحترف',
            'app.version': 'الإصدار',
            'app.loading': 'جاري التحميل...',
            'app.save': 'حفظ',
            'app.edit': 'تعديل',
            'app.delete': 'حذف',
            'nav.home': 'الرئيسية',
            'nav.settings': 'الإعدادات'
        });
    }

    addMessages(locale, messages) {
        if (!this.messages.has(locale)) {
            this.messages.set(locale, {});
        }
        
        const localeMessages = this.messages.get(locale);
        Object.assign(localeMessages, messages);
    }

    t(key, params = {}) {
        let message = this.getMessage(key);
        
        if (!message) {
            console.warn(`Translation missing for key: ${key}`);
            return key;
        }
        
        // جایگذاری پارامترها
        message = this.interpolate(message, params);
        
        // اعمال قواعد جمع
        if (params.count !== undefined) {
            message = this.applyPluralization(message, params.count, this.locale);
        }
        
        return message;
    }

    getMessage(key) {
        // اول زبان اصلی
        let message = this.messages.get(this.locale)?.[key];
        
        // اگر نبود، زبان جایگزین
        if (!message && this.fallbackLocale !== this.locale) {
            message = this.messages.get(this.fallbackLocale)?.[key];
        }
        
        return message;
    }

    interpolate(text, params) {
        return text.replace(/\{(\w+)\}/g, (match, key) => {
            return params[key] !== undefined ? params[key] : match;
        });
    }

    applyPluralization(text, count, locale) {
        const pluralForm = this.getPluralForm(count, locale);
        const patterns = text.split('|');
        
        if (patterns.length > 1) {
            const index = this.getPluralIndex(pluralForm);
            return patterns[index] || patterns[0];
        }
        
        return text;
    }

    setupPluralRules() {
        // فارسی: یک‌تا و دیگر
        this.pluralRules.set('fa', (count) => {
            return count === 1 ? 'one' : 'other';
        });
        
        // انگلیسی: یک‌تا و دیگر
        this.pluralRules.set('en', (count) => {
            return count === 1 ? 'one' : 'other';
        });
        
        // عربی: 6 شکل جمع
        this.pluralRules.set('ar', (count) => {
            if (count === 0) return 'zero';
            if (count === 1) return 'one';
            if (count === 2) return 'two';
            if (count >= 3 && count <= 10) return 'few';
            if (count >= 11 && count <= 99) return 'many';
            return 'other';
        });
    }

    getPluralForm(count, locale) {
        const rule = this.pluralRules.get(locale);
        return rule ? rule(count) : 'other';
    }

    getPluralIndex(pluralForm) {
        const map = {
            'zero': 0,
            'one': 1,
            'two': 2,
            'few': 3,
            'many': 4,
            'other': 5
        };
        
        return map[pluralForm] || 0;
    }

    setupFormatters() {
        // فرمت تاریخ
        this.formatters.set('date', {
            fa: new Intl.DateTimeFormat('fa-IR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            en: new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            ar: new Intl.DateTimeFormat('ar-SA', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        });
        
        // فرمت زمان
        this.formatters.set('time', {
            fa: new Intl.DateTimeFormat('fa-IR', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }),
            en: new Intl.DateTimeFormat('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            }),
            ar: new Intl.DateTimeFormat('ar-SA', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            })
        });
        
        // فرمت عدد
        this.formatters.set('number', {
            fa: new Intl.NumberFormat('fa-IR'),
            en: new Intl.NumberFormat('en-US'),
            ar: new Intl.NumberFormat('ar-SA')
        });
        
        // فرمت پول
        this.formatters.set('currency', {
            fa: new Intl.NumberFormat('fa-IR', {
                style: 'currency',
                currency: 'IRR'
            }),
            en: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }),
            ar: new Intl.NumberFormat('ar-SA', {
                style: 'currency',
                currency: 'SAR'
            })
        });
    }

    format(type, value, options = {}) {
        const locale = options.locale || this.locale;
        const formatter = this.formatters.get(type)?.[locale];
        
        if (!formatter) {
            return String(value);
        }
        
        try {
            if (type === 'date' && typeof value === 'string') {
                value = new Date(value);
            }
            
            return formatter.format(value);
        } catch (error) {
            console.warn(`Formatting error for ${type}:`, error);
            return String(value);
        }
    }

    formatRelativeTime(date, options = {}) {
        const now = new Date();
        const diff = now - new Date(date);
        const seconds = Math.floor(diff / 1000);
        
        const units = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60,
            second: 1
        };
        
        for (const [unit, secondsInUnit] of Object.entries(units)) {
            const count = Math.floor(seconds / secondsInUnit);
            
            if (count >= 1) {
                const key = `time.${unit}${count === 1 ? '' : 's'}`;
                return this.t(key, { count });
            }
        }
        
        return this.t('time.just_now');
    }

    watchLocaleChanges() {
        window.addEventListener('localechange', () => {
            // به‌روزرسانی عناصر با data-i18n
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (key) {
                    const params = this.extractParams(el);
                    el.textContent = this.t(key, params);
                }
            });
            
            // به‌روزرسانی placeholderها
            document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
                const key = el.getAttribute('data-i18n-placeholder');
                if (key) {
                    el.placeholder = this.t(key);
                }
            });
            
            // به‌روزرسانی titleها
            document.querySelectorAll('[data-i18n-title]').forEach(el => {
                const key = el.getAttribute('data-i18n-title');
                if (key) {
                    el.title = this.t(key);
                }
            });
        });
    }

    extractParams(element) {
        const params = {};
        const attributes = element.attributes;
        
        for (const attr of attributes) {
            if (attr.name.startsWith('data-i18n-')) {
                const paramName = attr.name.replace('data-i18n-', '');
                if (paramName !== 'key' && paramName !== 'placeholder' && paramName !== 'title') {
                    params[paramName] = attr.value;
                }
            }
        }
        
        return params;
    }

    getAvailableLocales() {
        return Array.from(this.messages.keys()).map(locale => ({
            code: locale,
            name: this.getLocaleName(locale),
            nativeName: this.getNativeLocaleName(locale),
            dir: this.isRTL(locale) ? 'rtl' : 'ltr',
            flag: this.getLocaleFlag(locale)
        }));
    }

    getLocaleName(locale) {
        const names = {
            'fa': 'Persian',
            'en': 'English',
            'ar': 'Arabic',
            'es': 'Spanish',
            'fr': 'French',
            'de': 'German',
            'zh': 'Chinese',
            'ja': 'Japanese',
            'ko': 'Korean',
            'ru': 'Russian',
            'tr': 'Turkish',
            'hi': 'Hindi'
        };
        
        return names[locale] || locale;
    }

    getNativeLocaleName(locale) {
        const names = {
            'fa': 'فارسی',
            'en': 'English',
            'ar': 'العربية',
            'es': 'Español',
            'fr': 'Français',
            'de': 'Deutsch',
            'zh': '中文',
            'ja': '日本語',
            'ko': '한국어',
            'ru': 'Русский',
            'tr': 'Türkçe',
            'hi': 'हिन्दी'
        };
        
        return names[locale] || locale;
    }

    getLocaleFlag(locale) {
        const flags = {
            'fa': '🇮🇷',
            'en': '🇺🇸',
            'ar': '🇸🇦',
            'es': '🇪🇸',
            'fr': '🇫🇷',
            'de': '🇩🇪',
            'zh': '🇨🇳',
            'ja': '🇯🇵',
            'ko': '🇰🇷',
            'ru': '🇷🇺',
            'tr': '🇹🇷',
            'hi': '🇮🇳'
        };
        
        return flags[locale] || '🏳️';
    }

    translateElement(element) {
        if (element.dataset.i18n) {
            const params = this.extractParams(element);
            element.textContent = this.t(element.dataset.i18n, params);
        }
        
        if (element.dataset.i18nPlaceholder) {
            element.placeholder = this.t(element.dataset.i18nPlaceholder);
        }
        
        if (element.dataset.i18nTitle) {
            element.title = this.t(element.dataset.i18nTitle);
        }
        
        // فرزندان
        element.querySelectorAll('[data-i18n], [data-i18n-placeholder], [data-i18n-title]')
            .forEach(child => this.translateElement(child));
    }

    translateDocument() {
        this.translateElement(document.documentElement);
    }

    addCustomTranslations(locale, translations) {
        this.addMessages(locale, translations);
        return this;
    }

    removeTranslation(locale, key) {
        if (this.messages.has(locale)) {
            delete this.messages.get(locale)[key];
        }
    }

    exportTranslations(locale) {
        const messages = this.messages.get(locale);
        if (!messages) return null;
        
        const data = {
            locale,
            messages,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: 'application/json'
        });
        
        return URL.createObjectURL(blob);
    }

    importTranslations(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    if (!data.locale || !data.messages) {
                        throw new Error('فرمت فایل نامعتبر است');
                    }
                    
                    this.addMessages(data.locale, data.messages);
                    
                    resolve({
                        success: true,
                        locale: data.locale,
                        count: Object.keys(data.messages).length
                    });
                    
                } catch (error) {
                    reject({
                        success: false,
                        error: error.message
                    });
                }
            };
            
            reader.onerror = () => {
                reject({
                    success: false,
                    error: 'خطا در خواندن فایل'
                });
            };
            
            reader.readAsText(file);
        });
    }

    getTranslationStats() {
        const stats = {};
        
        this.messages.forEach((messages, locale) => {
            stats[locale] = {
                count: Object.keys(messages).length,
                coverage: this.calculateCoverage(locale)
            };
        });
        
        return stats;
    }

    calculateCoverage(locale) {
        const baseLocale = 'en';
        const baseCount = Object.keys(this.messages.get(baseLocale) || {}).length;
        const localeCount = Object.keys(this.messages.get(locale) || {}).length;
        
        if (baseCount === 0) return 0;
        return Math.round((localeCount / baseCount) * 100);
    }

    getMissingTranslations(locale) {
        const baseLocale = 'en';
        const baseMessages = this.messages.get(baseLocale) || {};
        const localeMessages = this.messages.get(locale) || {};
        
        const missing = [];
        
        Object.keys(baseMessages).forEach(key => {
            if (!localeMessages[key]) {
                missing.push({
                    key,
                    baseText: baseMessages[key],
                    suggestion: this.suggestTranslation(baseMessages[key], locale)
                });
            }
        });
        
        return missing;
    }

    suggestTranslation(text, targetLocale) {
        // اینجا می‌توان از API ترجمه استفاده کرد
        // فعلاً متن اصلی را برمی‌گردانیم
        return text;
    }

    createTranslationKey(path, text) {
        // ایجاد کلید ترجمه از متن
        const key = path + '.' + text
            .toLowerCase()
            .replace(/[^a-z0-9\u0600-\u06FF]+/g, '_')
            .replace(/^_+|_+$/g, '');
        
        return key;
    }

    autoTranslateElement(element, targetLocale) {
        const text = element.textContent.trim();
        if (!text) return;
        
        const key = this.createTranslationKey('auto', text);
        this.addMessages(targetLocale, { [key]: text });
        
        element.setAttribute('data-i18n', key);
        this.translateElement(element);
    }

    extractFromHTML(selector = '[data-translate]') {
        const elements = document.querySelectorAll(selector);
        const translations = {};
        
        elements.forEach(el => {
            const text = el.textContent.trim();
            if (text) {
                const key = this.createTranslationKey('extracted', text);
                translations[key] = text;
                el.setAttribute('data-i18n', key);
            }
        });
        
        return translations;
    }

    syncWithServer(url) {
        return fetch(url)
            .then(response => response.json())
            .then(data => {
                Object.entries(data).forEach(([locale, messages]) => {
                    this.addMessages(locale, messages);
                });
                return true;
            })
            .catch(error => {
                console.error('Failed to sync translations:', error);
                return false;
            });
    }
}

export const i18n = new I18n();
