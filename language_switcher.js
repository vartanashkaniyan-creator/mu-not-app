/**
 * 🌍 Language.switchers.js – مدیریت دکمه‌های تغییر زبان
 * هماهنگ با ماژول I18n
 */

const LanguageSwitchers = (() => {

    function init() {
        const buttons = document.querySelectorAll('.lang-switcher button');
        if (!buttons.length) return;

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.getAttribute('data-lang');
                if (window.I18n && lang) {
                    I18n.setLanguage(lang);
                    highlightActive(lang);
                    console.log(`🌐 زبان تغییر یافت به: ${lang}`);
                }
            });
        });
    }

    function highlightActive(lang) {
        const buttons = document.querySelectorAll('.lang-switcher button');
        buttons.forEach(btn => {
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    return {
        init,
        highlightActive
    };

})();

// راه‌اندازی خودکار بعد از DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    LanguageSwitchers.init();
});

window.LanguageSwitchers = LanguageSwitchers;
console.log('✅ Language.switchers.js بارگذاری شد');
