/**
 * 🏗️ i18n.js – مدیریت چند زبانه اپ
 * نسخه 3.0.0
 * پشتیبانی از زبان‌های فارسی و انگلیسی و قابلیت افزودن زبان جدید
 */

class I18n {
    constructor(defaultLang = 'fa') {
        this.languages = {
            fa: {},
            en: {}
        };
        this.currentLang = defaultLang;
        this.core = window.AppCore || null;
    }

    // افزودن رشته‌ها به زبان مشخص
    addTranslations(lang, translations) {
        if (!this.languages[lang]) this.languages[lang] = {};
        Object.assign(this.languages[lang], translations);
        if (this.core) this.core.log('i18nAddTranslations', { lang, keys: Object.keys(translations) });
    }

    // تغییر زبان جاری
    setLanguage(lang) {
        if (!this.languages[lang]) {
            if (this.core) this.core.error('زبان پشتیبانی نمی‌شود', lang);
            return;
        }
        this.currentLang = lang;
        if (this.core) this.core.log('i18nSetLanguage', { lang });
        this.updateUI();
    }

    // گرفتن متن بر اساس کلید
    t(key) {
        return (this.languages[this.currentLang] && this.languages[this.currentLang][key]) || key;
    }

    // بروزرسانی متون UI (تگ data-i18n)
    updateUI(root = document.body) {
        const nodes = root.querySelectorAll('[data-i18n]');
        nodes.forEach(node => {
            const key = node.getAttribute('data-i18n');
            const translation = this.t(key);
            if (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA') {
                node.placeholder = translation;
            } else {
                node.textContent = translation;
            }
        });
        if (this.core) this.core.log('i18nUpdateUI', { lang: this.currentLang, updatedNodes: nodes.length });
    }
}

// نمونه آماده
window.I18n = new I18n('fa');

// نمونه افزودن ترجمه فارسی و انگلیسی
window.I18n.addTranslations('fa', {
    welcome: 'خوش آمدید',
    save: 'ذخیره',
    delete: 'حذف',
    search: 'جستجو',
    title: 'عنوان',
    content: 'محتوا'
});

window.I18n.addTranslations('en', {
    welcome: 'Welcome',
    save: 'Save',
    delete: 'Delete',
    search: 'Search',
    title: 'Title',
    content: 'Content'
});

console.log('✅ i18n.js بارگذاری شد و آماده استفاده');
