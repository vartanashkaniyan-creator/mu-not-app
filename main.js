/**
 * Main JS
 * نقطه ورود اپلیکیشن
 */

document.addEventListener("DOMContentLoaded", () => {
    // تعیین زبان پیش‌فرض
    const defaultLang = AppTemplates.CONSTANTS.DEFAULT_CONFIG.language || "fa";
    I18n.setLanguage(defaultLang);

    // راه‌اندازی اپ ساز
    const app = new AppTemplates.generateApp("note", {
        language: defaultLang,
        theme: AppTemplates.CONSTANTS.DEFAULT_CONFIG.theme
    });

    window.App = app;

    // بارگذاری صفحه اصلی
    if (document.getElementById("app-container")) {
        ui.init();
    }

    // مدیریت تغییر زبان از رابط کاربری
    const langSwitcher = document.getElementById("lang-switcher");
    if (langSwitcher) {
        langSwitcher.addEventListener("change", (e) => {
            const lang = e.target.value;
            I18n.setLanguage(lang);
            app.log("languageChange", { lang });
        });
    }

    // ثبت سرویس‌ورکر برای حالت آفلاین
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/service.worker.js")
            .then(reg => console.log("Service Worker registered:", reg.scope))
            .catch(err => console.error("SW registration failed:", err));
    }

    console.log("🏗️ اپ ساز بارگذاری شد");
});
