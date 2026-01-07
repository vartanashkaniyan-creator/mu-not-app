// ==================== main.js ====================

// مدیریت صفحات و ناوبری
const PageManager = {
    pages: {},           // نگهداری محتوای صفحات
    currentPage: null,   // صفحه فعلی

    init() {
        this.loadPage("home"); // بارگذاری صفحه اصلی
        this.setupNav();
    },

    // ثبت محتوای یک صفحه
    registerPage(name, contentFunc) {
        this.pages[name] = contentFunc;
    },

    // بارگذاری یک صفحه
    loadPage(name) {
        const container = document.getElementById("page-container");
        if (!container) return console.error("صفحه هدف پیدا نشد");

        if (!this.pages[name]) {
            container.innerHTML = `<p>صفحه "${name}" وجود ندارد</p>`;
            return;
        }

        // رندر صفحه
        container.innerHTML = "";
        const content = this.pages[name]();
        if (typeof content === "string") {
            container.innerHTML = content;
        } else if (content instanceof HTMLElement) {
            container.appendChild(content);
        }

        this.currentPage = name;
    },

    // تنظیم دکمه‌های ناوبری
    setupNav() {
        const navButtons = document.querySelectorAll("#app-nav button[data-page]");
        navButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                const page = btn.getAttribute("data-page");
                this.loadPage(page);
            });
        });
    }
};

// ==================== صفحات پیش‌فرض ====================

// صفحه خانه
PageManager.registerPage("home", () => {
    return `
        <h2>خانه</h2>
        <p>به اپ ساز حرفه‌ای خوش آمدید. از منو برای رفتن به ویرایشگر یا پیش‌نمایش استفاده کنید.</p>
    `;
});

// صفحه ویرایشگر
PageManager.registerPage("editor", () => {
    const container = document.createElement("div");
    container.innerHTML = `
        <h2>ویرایشگر اپ</h2>
        <p>اینجا می‌توانید کد اپ‌ها را ایجاد یا ویرایش کنید.</p>
        <textarea id="editor-code" placeholder="کد اپ خود را اینجا بنویسید..." rows="15" style="width:100%;"></textarea>
        <button id="run-code-btn">اجرای کد</button>
    `;

    // دکمه اجرا
    container.querySelector("#run-code-btn").addEventListener("click", () => {
        const code = container.querySelector("#editor-code").value;
        try {
            eval(code); // ⚠️ اجرای کد داینامیک (مواظب باش)
            alert("کد اجرا شد");
        } catch (err) {
            alert("خطا در اجرای کد: " + err.message);
        }
    });

    return container;
});

// صفحه پیش‌نمایش
PageManager.registerPage("preview", () => {
    const container = document.createElement("div");
    container.innerHTML = `
        <h2>پیش‌نمایش اپ</h2>
        <p>در این قسمت پیش‌نمایش اپ ساخته‌شده را مشاهده می‌کنید.</p>
        <iframe id="preview-frame" style="width:100%; height:400px; border:1px solid #ccc;"></iframe>
    `;

    // نمونه بارگذاری iframe
    const iframe = container.querySelector("#preview-frame");
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write("<h3>پیش‌نمایش خالی است</h3>");
    doc.close();

    return container;
});

// صفحه تنظیمات
PageManager.registerPage("settings", () => {
    return `
        <h2>تنظیمات</h2>
        <p>اینجا می‌توانید تنظیمات اپ ساز را تغییر دهید.</p>
        <label>زبان:
            <select id="language-select">
                <option value="fa">فارسی</option>
                <option value="en">انگلیسی</option>
            </select>
        </label>
    `;
});

// ==================== شروع اپ ====================
document.addEventListener("DOMContentLoaded", () => {
    PageManager.init();
    window.PageManager = PageManager; // دسترسی جهانی برای توسعه
});
