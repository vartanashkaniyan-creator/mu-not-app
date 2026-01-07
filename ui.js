// ==================== ui.js ====================

const UI = {
    init() {
        this.cacheElements();
        this.setupEvents();
    },

    // ذخیره عناصر پرکاربرد
    cacheElements() {
        this.pageContainer = document.getElementById("page-container");
        this.navButtons = document.querySelectorAll("#app-nav button[data-page]");
        this.editorCode = document.getElementById("editor-code");
        this.runCodeBtn = document.getElementById("run-code-btn");
        this.languageSelect = document.getElementById("language-select");
    },

    // اتصال رویدادها
    setupEvents() {
        // ناوبری
        if (this.navButtons) {
            this.navButtons.forEach(btn => {
                btn.addEventListener("click", () => {
                    const page = btn.getAttribute("data-page");
                    PageManager.loadPage(page);
                    this.refreshUI();
                });
            });
        }

        // تغییر زبان
        if (this.languageSelect) {
            this.languageSelect.addEventListener("change", () => {
                const lang = this.languageSelect.value;
                this.setLanguage(lang);
            });
        }

        // دکمه اجرای کد
        if (this.runCodeBtn && this.editorCode) {
            this.runCodeBtn.addEventListener("click", () => {
                this.runCode(this.editorCode.value);
            });
        }
    },

    refreshUI() {
        // به‌روزرسانی رابط کاربری در صورت نیاز
        console.log("UI refreshed for page:", PageManager.currentPage);
    },

    runCode(code) {
        try {
            eval(code);
            alert("کد اجرا شد ✅");
        } catch (err) {
            alert("خطا در اجرای کد: " + err.message);
        }
    },

    setLanguage(lang) {
        // نمونه پیاده‌سازی تغییر زبان
        console.log("Language changed to:", lang);
        alert(`زبان به ${lang} تغییر کرد`);
    }
};

// ==================== شروع UI ====================
document.addEventListener("DOMContentLoaded", () => {
    UI.init();
    window.UI = UI; // دسترسی جهانی برای توسعه و دیباگ
});
