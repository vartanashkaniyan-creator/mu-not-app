/**
 * 🌐 i18n.js – مدیریت چندزبانه
 * نسخه 3.0.0
 * پشتیبانی از چند زبان و بروزرسانی خودکار UI
 */

class I18n {
    constructor(defaultLang = 'fa') {
        this.languages = { fa: {}, en: {} };
        this.currentLang = defaultLang;
        this.core = window.AppCore || null;
    }

    // افزودن یا به‌روزرسانی ترجمه‌ها
    addTranslations(lang, translations = {}) {
        if (!this.languages[lang]) this.languages[lang] = {};
        Object.assign(this.languages[lang], translations);
        this.log('addTranslations', lang, Object.keys(translations));
        this.updateUI();
    }

    // تغییر زبان جاری
    setLanguage(lang) {
        if (!this.languages[lang]) {
            this.error('زبان پشتیبانی نمی‌شود', lang);
            return;
        }
        this.currentLang = lang;
        this.log('setLanguage', lang);
        this.updateUI();
    }

    // گرفتن متن بر اساس کلید
    t(key) {
        return (this.languages[this.currentLang] && this.languages[this.currentLang][key]) || key;
    }

    // بروزرسانی خودکار متون UI (data-i18n)
    updateUI(root = document.body) {
        const nodes = root.querySelectorAll('[data-i18n]');
        nodes.forEach(node => {
            const key = node.getAttribute('data-i18n');
            const text = this.t(key);
            if (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA') {
                node.placeholder = text;
            } else {
                node.textContent = text;
            }
        });
        this.log('updateUI', nodes.length);
    }

    // گزارش داخلی
    log(action, ...args) {
        if (this.core) this.core.log(`i18n:${action}`, args);
        else console.log(`i18n:${action}`, ...args);
    }

    error(msg, details = null) {
        if (this.core) this.core.error(`i18n Error: ${msg}`, details);
        else console.error(`i18n Error: ${msg}`, details);
    }
}

// نمونه آماده
window.I18n = new I18n('fa');

// ترجمه پیش‌فرض فارسی
window.I18n.addTranslations('fa', {
    welcome: 'خوش آمدید',
    save: '💾 ذخیره',
    delete: '🗑️ حذف',
    search: 'جستجو...',
    title: 'عنوان',
    content: 'محتوا',
    your_notes: 'یادداشت‌های شما',
    personal: 'شخصی',
    work: 'کاری',
    idea: 'ایده',
    shopping: 'خرید',
    app_version: 'نسخه 1.0.0',
    categories: 'دسته‌بندی‌ها',
    stats: 'آمار'
});

// ترجمه پیش‌فرض انگلیسی
window.I18n.addTranslations('en', {
    welcome: 'Welcome',
    save: '💾 Save',
    delete: '🗑️ Delete',
    search: 'Search...',
    title: 'Title',
    content: 'Content',
    your_notes: 'Your Notes',
    personal: 'Personal',
    work: 'Work',
    idea: 'Idea',
    shopping: 'Shopping',
    app_version: 'Version 1.0.0',
    categories: 'Categories',
    stats: 'Stats'
});

console.log('🌐 i18n.js بارگذاری شد و آماده استفاده');
