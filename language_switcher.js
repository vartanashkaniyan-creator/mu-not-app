
/**
 * Language Switcher Module
 * مدیریت تغییر زبان اپلیکیشن
 */

window.I18n = (function () {
    const translations = {
        fa: {
            welcome: "خوش آمدید",
            search: "جستجو...",
            categories: "دسته‌بندی‌ها",
            stats: "آمار",
            title: "عنوان",
            content: "محتوا",
            save: "💾 ذخیره",
            delete: "🗑️ حذف",
            your_notes: "یادداشت‌های شما",
            personal: "شخصی",
            work: "کاری",
            idea: "ایده",
            shopping: "خرید",
            app_version: "نسخه 1.0.0"
        },
        en: {
            welcome: "Welcome",
            search: "Search...",
            categories: "Categories",
            stats: "Stats",
            title: "Title",
            content: "Content",
            save: "💾 Save",
            delete: "🗑️ Delete",
            your_notes: "Your Notes",
            personal: "Personal",
            work: "Work",
            idea: "Idea",
            shopping: "Shopping",
            app_version: "Version 1.0.0"
        }
    };

    let currentLang = "fa";

    function setLanguage(lang) {
        if (!translations[lang]) return;
        currentLang = lang;
        updateUI();
    }

    function translate(key) {
        return translations[currentLang][key] || key;
    }

    function updateUI() {
        document.querySelectorAll("[data-i18n]").forEach(el => {
            const key = el.getAttribute("data-i18n");
            el.innerText = translate(key);
        });

        document.querySelectorAll("input[data-i18n]").forEach(el => {
            const key = el.getAttribute("data-i18n");
            el.placeholder = translate(key);
        });

        document.querySelectorAll("textarea[data-i18n]").forEach(el => {
            const key = el.getAttribute("data-i18n");
            el.placeholder = translate(key);
        });
    }

    return {
        setLanguage,
        translate,
        getLanguage: () => currentLang
    };
})();
