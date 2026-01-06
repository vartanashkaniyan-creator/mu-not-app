/**
 * 🔄 کلید تغییر زبان در رابط کاربری
 */

class LanguageSwitcher {
    constructor() {
        this.button = null;
        this.menu = null;
        this.init();
    }
    
    init() {
        // ایجاد دکمه تغییر زبان
        this.createButton();
        
        // ایجاد منوی زبان
        this.createMenu();
        
        // اضافه کردن به صفحه
        this.addToUI();
        
        // رویدادها
        this.setupEvents();
    }
    
    createButton() {
        this.button = document.createElement('button');
        this.button.id = 'language-switcher';
        this.button.className = 'language-button';
        this.button.innerHTML = `
            <span class="language-icon">🌐</span>
            <span class="language-code">${getCurrentLanguage() === 'fa' ? 'FA' : 'EN'}</span>
        `;
        this.button.title = i18n.t('language');
    }
    
    createMenu() {
        this.menu = document.createElement('div');
        this.menu.id = 'language-menu';
        this.menu.className = 'language-menu';
        this.menu.style.display = 'none';
        
        const languages = i18n.getSupportedLanguages();
        let html = '<div class="language-options">';
        
        languages.forEach(lang => {
            const isActive = lang.code === getCurrentLanguage();
            html += `
                <div class="language-option ${isActive ? 'active' : ''}" 
                     data-lang="${lang.code}"
                     onclick="switchLanguage('${lang.code}')">
                    <span class="lang-flag">${lang.code === 'fa' ? '🇮🇷' : '🇺🇸'}</span>
                    <span class="lang-name">${lang.native}</span>
                    ${isActive ? '<span class="lang-check">✓</span>' : ''}
                </div>
            `;
        });
        
        html += '</div>';
        this.menu.innerHTML = html;
    }
    
    addToUI() {
        // اضافه کردن به هدر
        const header = document.querySelector('header');
        if (header) {
            const container = document.createElement('div');
            container.className = 'language-container';
            container.appendChild(this.button);
            container.appendChild(this.menu);
            header.appendChild(container);
        } else {
            // اگر هدر نبود، به body اضافه کن
            document.body.appendChild(this.button);
            document.body.appendChild(this.menu);
            
            // استایل موقعیت
            this.button.style.position = 'fixed';
            this.button.style.top = '10px';
            this.button.style.left = '10px';
            this.button.style.zIndex = '1000';
        }
    }
    
    setupEvents() {
        // کلیک روی دکمه
        this.button.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMenu();
        });
        
        // بستن منو با کلیک بیرون
        document.addEventListener('click', () => {
            this.hideMenu();
        });
        
        // جلوگیری از بستن وقتی روی منو کلیک شد
        this.menu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
    
    toggleMenu() {
        if (this.menu.style.display === 'none') {
            this.showMenu();
        } else {
            this.hideMenu();
        }
    }
    
    showMenu() {
        this.menu.style.display = 'block';
        this.button.classList.add('active');
    }
    
    hideMenu() {
        this.menu.style.display = 'none';
        this.button.classList.remove('active');
    }
    
    updateButton() {
        const langCode = getCurrentLanguage();
        const codeSpan = this.button.querySelector('.language-code');
        const iconSpan = this.button.querySelector('.language-icon');
        
        if (codeSpan) {
            codeSpan.textContent = langCode === 'fa' ? 'FA' : 'EN';
        }
        
        if (iconSpan) {
            iconSpan.textContent = langCode === 'fa' ? '🇮🇷' : '🌐';
        }
        
        // به‌روزرسانی منو
        this.updateMenu();
    }
    
    updateMenu() {
        const options = this.menu.querySelectorAll('.language-option');
        const currentLang = getCurrentLanguage();
        
        options.forEach(option => {
            const lang = option.dataset.lang;
            if (lang === currentLang) {
                option.classList.add('active');
                const check = option.querySelector('.lang-check');
                if (!check) {
                    option.innerHTML += '<span class="lang-check">✓</span>';
                }
            } else {
                option.classList.remove('active');
                const check = option.querySelector('.lang-check');
                if (check) {
                    check.remove();
                }
            }
        });
    }
}

// ============ توابع عمومی ============

// تغییر زبان
function switchLanguage(lang) {
    if (setLanguage(lang)) {
        // به‌روزرسانی دکمه
        if (window.languageSwitcher) {
            window.languageSwitcher.updateButton();
        }
        
        // رفرش صفحه فعلی
        if (window.AppState?.current) {
            window.runApp(window.AppState.current.meta.title || 'خانه');
        }
        
        // نمایش پیام
        showLanguageMessage(lang);
    }
}

// نمایش پیام تغییر زبان
function showLanguageMessage(lang) {
    const messages = {
        'fa': 'زبان به فارسی تغییر کرد',
        'en': 'Language changed to English'
    };
    
    // استفاده از سیستم alert موجود یا ساخت جدید
    if (window.showAlert) {
        window.showAlert(messages[lang]);
    } else {
        alert(messages[lang]);
    }
}

// تغییر خودکار زبان
function toggleAppLanguage() {
    const newLang = getCurrentLanguage() === 'fa' ? 'en' : 'fa';
    switchLanguage(newLang);
}

// ============ استایل‌ها ============
const languageStyles = `
    /* دکمه تغییر زبان */
    .language-button {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        padding: 8px 12px;
        border-radius: 20px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 14px;
        transition: all 0.3s;
        backdrop-filter: blur(10px);
    }
    
    .language-button:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: scale(1.05);
    }
    
    .language-button.active {
        background: rgba(76, 175, 80, 0.3);
        border-color: #4CAF50;
    }
    
    .language-icon {
        font-size: 16px;
    }
    
    .language-code {
        font-weight: bold;
    }
    
    /* منوی زبان */
    .language-menu {
        position: absolute;
        top: 45px;
        right: 0;
        background: #1a1a1a;
        border: 1px solid #333;
        border-radius: 10px;
        min-width: 150px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        overflow: hidden;
    }
    
    .language-options {
        padding: 8px 0;
    }
    
    .language-option {
        padding: 10px 15px;
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        transition: background 0.2s;
    }
    
    .language-option:hover {
        background: #2a2a2a;
    }
    
    .language-option.active {
        background: rgba(76, 175, 80, 0.2);
        color: #4CAF50;
    }
    
    .lang-flag {
        font-size: 18px;
    }
    
    .lang-name {
        flex: 1;
    }
    
    .lang-check {
        color: #4CAF50;
        font-weight: bold;
    }
    
    /* حالت RTL/LTR */
    .rtl .language-menu {
        right: auto;
        left: 0;
    }
    
    .rtl .language-option {
        text-align: right;
    }
`;

// اضافه کردن استایل‌ها
const styleSheet = document.createElement('style');
styleSheet.textContent = languageStyles;
document.head.appendChild(styleSheet);

// ============ راه‌اندازی ============

// منتظر بارگذاری سیستم ترجمه بمان
document.addEventListener('DOMContentLoaded', () => {
    // کمی تاخیر برای اطمینان از بارگذاری i18n
    setTimeout(() => {
        if (window.i18n) {
            window.languageSwitcher = new LanguageSwitcher();
            console.log('🔄 کلید تغییر زبان بارگذاری شد');
        }
    }, 500);
});

// ============ صادر کردن ============
window.switchLanguage = switchLanguage;
window.toggleAppLanguage = toggleAppLanguage;
