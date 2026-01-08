// ui.js - سیستم رابط کاربری اپ‌ساز
// Version 1.5 - فارسی/انگلیسی - بهینه موبایل

class AppBuilderUI {
    constructor() {
        this.theme = 'light';
        this.language = 'fa';
        this.rtl = true;
        this.components = {};
        this.modals = [];
        this.toasts = [];
        this.init();
    }

    init() {
        this.setupTheme();
        this.setupLanguage();
        this.setupMobileUI();
        this.loadComponents();
        this.setupGestures();
        this.setupAccessibility();
    }

    // تنظیم تم
    setupTheme() {
        const savedTheme = localStorage.getItem('appbuilder_theme') || 'light';
        this.setTheme(savedTheme);
    }

    setTheme(theme) {
        this.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        document.body.className = theme + '-theme';
        localStorage.setItem('appbuilder_theme', theme);
        
        // اعمال متغیرهای CSS
        const root = document.documentElement;
        if (theme === 'dark') {
            root.style.setProperty('--primary-color', '#2196F3');
            root.style.setProperty('--background-color', '#121212');
            root.style.setProperty('--text-color', '#FFFFFF');
            root.style.setProperty('--card-color', '#1E1E1E');
        } else {
            root.style.setProperty('--primary-color', '#2196F3');
            root.style.setProperty('--background-color', '#F5F5F5');
            root.style.setProperty('--text-color', '#333333');
            root.style.setProperty('--card-color', '#FFFFFF');
        }
    }

    // تنظیم زبان
    setupLanguage() {
        const savedLang = localStorage.getItem('appbuilder_language') || 'fa';
        this.setLanguage(savedLang);
    }

    setLanguage(lang) {
        this.language = lang;
        this.rtl = lang === 'fa';
        document.documentElement.lang = lang;
        document.documentElement.dir = this.rtl ? 'rtl' : 'ltr';
        localStorage.setItem('appbuilder_language', lang);
        this.updateUITexts();
    }

    updateUITexts() {
        const texts = {
            fa: {
                save: 'ذخیره',
                cancel: 'انصراف',
                delete: 'حذف',
                edit: 'ویرایش',
                loading: 'در حال بارگذاری...',
                error: 'خطا',
                success: 'موفق',
                warning: 'هشدار'
            },
            en: {
                save: 'Save',
                cancel: 'Cancel',
                delete: 'Delete',
                edit: 'Edit',
                loading: 'Loading...',
                error: 'Error',
                success: 'Success',
                warning: 'Warning'
            }
        };

        this.texts = texts[this.language];
    }

    t(key) {
        return this.texts[key] || key;
    }

    // UI برای موبایل
    setupMobileUI() {
        // تنظیم viewport
        const meta = document.querySelector('meta[name="viewport"]');
        if (meta) {
            meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        }

        // اضافه کردن استایل‌های موبایل
        this.addMobileStyles();
        
        // تنظیم ارتفاع متغیر
        this.setupViewportHeight();
        
        // مدیریت keyboard
        this.setupKeyboardBehavior();
    }

    addMobileStyles() {
        const style = document.createElement('style');
        style.textContent = `
            :root {
                --safe-area-top: env(safe-area-inset-top, 0px);
                --safe-area-bottom: env(safe-area-inset-bottom, 0px);
                --safe-area-left: env(safe-area-inset-left, 0px);
                --safe-area-right: env(safe-area-inset-right, 0px);
            }
            
            body {
                padding-top: var(--safe-area-top);
                padding-bottom: var(--safe-area-bottom);
                overflow-x: hidden;
                -webkit-overflow-scrolling: touch;
            }
            
            .mobile-optimized {
                min-height: 44px;
                min-width: 44px;
                touch-action: manipulation;
            }
            
            /* جلوگیری از انتخاب متن */
            .no-select {
                -webkit-user-select: none;
                user-select: none;
            }
            
            /* انیمیشن‌های نرم */
            .smooth-transition {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            /* سایه برای عمق */
            .elevation-1 {
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            
            .elevation-2 {
                box-shadow: 0 4px 8px rgba(0,0,0,0.12);
            }
            
            .elevation-3 {
                box-shadow: 0 8px 16px rgba(0,0,0,0.14);
            }
        `;
        document.head.appendChild(style);
    }

    setupViewportHeight() {
        // تنظیم ارتفاع 100vh واقعی
        const setVH = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        
        setVH();
        window.addEventListener('resize', setVH);
        window.addEventListener('orientationchange', setVH);
    }

    setupKeyboardBehavior() {
        // جلوگیری از push up layout هنگام نمایش کیبورد
        document.addEventListener('focusin', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                setTimeout(() => {
                    e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            }
        });
    }

    // لود کامپوننت‌های UI
    loadComponents() {
        this.components = {
            // Navigation
            navbar: this.createNavbar(),
            tabbar: this.createTabbar(),
            drawer: this.createDrawer(),
            
            // Cards
            card: this.createCard(),
            listCard: this.createListCard(),
            imageCard: this.createImageCard(),
            
            // Forms
            input: this.createInput(),
            button: this.createButton(),
            select: this.createSelect(),
            checkbox: this.createCheckbox(),
            radio: this.createRadio(),
            slider: this.createSlider(),
            toggle: this.createToggle(),
            
            // Feedback
            modal: this.createModal(),
            toast: this.createToast(),
            alert: this.createAlert(),
            progress: this.createProgress(),
            skeleton: this.createSkeleton(),
            
            // Display
            badge: this.createBadge(),
            avatar: this.createAvatar(),
            chip: this.createChip(),
            tooltip: this.createTooltip(),
            
            // Layout
            container: this.createContainer(),
            grid: this.createGrid(),
            divider: this.createDivider(),
            spacer: this.createSpacer()
        };
    }

    // ایجاد نوبار
    createNavbar() {
        return {
            render: (config = {}) => {
                const { title = '', leftButton = null, rightButton = null, color = 'primary' } = config;
                
                return `
                <nav class="navbar navbar-${color}">
                    <div class="navbar-left">
                        ${leftButton ? this.components.button.render(leftButton) : ''}
                    </div>
                    <div class="navbar-title">
                        <h1 class="navbar-text">${title}</h1>
                    </div>
                    <div class="navbar-right">
                        ${rightButton ? this.components.button.render(rightButton) : ''}
                    </div>
                </nav>
                <style>
                    .navbar {
                        height: 56px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 0 16px;
                        background: var(--primary-color);
                        color: white;
                        position: sticky;
                        top: 0;
                        z-index: 1000;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }
                    .navbar-title {
                        flex: 1;
                        text-align: center;
                        font-size: 18px;
                        font-weight: 600;
                    }
                    .navbar-left, .navbar-right {
                        width: 48px;
                        display: flex;
                        align-items: center;
                    }
                    .navbar-left { justify-content: flex-start; }
                    .navbar-right { justify-content: flex-end; }
                    @media (max-width: 480px) {
                        .navbar { padding: 0 12px; height: 52px; }
                        .navbar-title { font-size: 16px; }
                    }
                </style>`;
            }
        };
    }

    // ایجاد کارت
    createCard() {
        return {
            render: (config = {}) => {
                const { title = '', content = '', actions = [], image = null, elevated = true } = config;
                
                return `
                <div class="card ${elevated ? 'elevation-2' : ''}">
                    ${image ? `<img src="${image}" class="card-image" alt="${title}">` : ''}
                    <div class="card-content">
                        ${title ? `<h3 class="card-title">${title}</h3>` : ''}
                        <div class="card-text">${content}</div>
                    </div>
                    ${actions.length > 0 ? `
                    <div class="card-actions">
                        ${actions.map(action => 
                            this.components.button.render({ 
                                ...action, 
                                size: 'small',
                                variant: 'text'
                            })
                        ).join('')}
                    </div>` : ''}
                </div>
                <style>
                    .card {
                        background: var(--card-color);
                        border-radius: 12px;
                        overflow: hidden;
                        margin: 8px;
                        transition: all 0.3s;
                    }
                    .card:active {
                        transform: translateY(2px);
                    }
                    .card-image {
                        width: 100%;
                        height: 160px;
                        object-fit: cover;
                    }
                    .card-content {
                        padding: 16px;
                    }
                    .card-title {
                        margin: 0 0 8px 0;
                        font-size: 18px;
                        font-weight: 600;
                        color: var(--text-color);
                    }
                    .card-text {
                        font-size: 14px;
                        line-height: 1.5;
                        color: var(--text-color);
                        opacity: 0.8;
                    }
                    .card-actions {
                        padding: 8px 16px 16px;
                        display: flex;
                        gap: 8px;
                        justify-content: flex-end;
                    }
                    @media (max-width: 480px) {
                        .card { margin: 4px; border-radius: 8px; }
                        .card-content { padding: 12px; }
                    }
                </style>`;
            }
        };
    }

    // ایجاد دکمه
    createButton() {
        return {
            render: (config = {}) => {
                const { 
                    text = 'Button', 
                    type = 'primary', 
                    size = 'medium', 
                    disabled = false,
                    loading = false,
                    icon = null,
                    onClick = null,
                    fullWidth = false
                } = config;
                
                const iconHTML = icon ? `<span class="button-icon">${icon}</span>` : '';
                const loadingHTML = loading ? '<span class="button-spinner"></span>' : '';
                
                return `
                <button class="btn btn-${type} btn-${size} ${fullWidth ? 'btn-full' : ''} ${disabled ? 'disabled' : ''}"
                        ${disabled ? 'disabled' : ''}
                        ${onClick ? `onclick="${onClick}"` : ''}
                        style="touch-action: manipulation;">
                    ${loadingHTML}
                    ${iconHTML}
                    <span class="button-text">${text}</span>
                </button>
                <style>
                    .btn {
                        border: none;
                        border-radius: 25px;
                        font-family: inherit;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;
                        position: relative;
                        -webkit-tap-highlight-color: transparent;
                        user-select: none;
                    }
                    .btn:active:not(.disabled) {
                        transform: translateY(2px);
                    }
                    .btn-small { padding: 8px 16px; font-size: 14px; }
                    .btn-medium { padding: 12px 24px; font-size: 16px; }
                    .btn-large { padding: 16px 32px; font-size: 18px; min-height: 44px; }
                    .btn-primary { 
                        background: linear-gradient(135deg, var(--primary-color), #764ba2); 
                        color: white; 
                    }
                    .btn-secondary { background: #f1f5f9; color: #64748b; }
                    .btn-outline { 
                        background: transparent; 
                        border: 2px solid var(--primary-color); 
                        color: var(--primary-color); 
                    }
                    .btn-text { background: transparent; color: var(--primary-color); }
                    .btn-danger { background: #ef4444; color: white; }
                    .btn-success { background: #10b981; color: white; }
                    .btn.disabled { opacity: 0.5; cursor: not-allowed; }
                    .btn-full { width: 100%; }
                    .button-spinner {
                        width: 16px;
                        height: 16px;
                        border: 2px solid rgba(255,255,255,0.3);
                        border-radius: 50%;
                        border-top-color: white;
                        animation: spin 1s linear infinite;
                    }
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                </style>`;
            }
        };
    }

    // ایجاد مودال
    createModal() {
        return {
            show: (config = {}) => {
                const { 
                    title = '', 
                    content = '', 
                    actions = [],
                    onClose = null,
                    closeOnBackdrop = true
                } = config;
                
                const modalId = 'modal-' + Date.now();
                const modal = document.createElement('div');
                modal.className = 'modal-overlay';
                modal.id = modalId;
                modal.innerHTML = `
                    <div class="modal-container">
                        <div class="modal-header">
                            <h3 class="modal-title">${title}</h3>
                            <button class="modal-close" onclick="AppBuilderUI.closeModal('${modalId}')">×</button>
                        </div>
                        <div class="modal-content">
                            ${content}
                        </div>
                        ${actions.length > 0 ? `
                        <div class="modal-actions">
                            ${actions.map(action => 
                                this.components.button.render(action)
                            ).join('')}
                        </div>` : ''}
                    </div>
                `;
                
                // استایل‌ها
                const style = document.createElement('style');
                style.textContent = `
                    .modal-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: rgba(0,0,0,0.5);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 2000;
                        animation: fadeIn 0.3s;
                        padding: 16px;
                    }
                    .modal-container {
                        background: var(--card-color);
                        border-radius: 16px;
                        max-width: 500px;
                        width: 100%;
                        max-height: 80vh;
                        overflow: hidden;
                        animation: slideUp 0.3s;
                        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    }
                    .modal-header {
                        padding: 20px;
                        border-bottom: 1px solid rgba(0,0,0,0.1);
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                    }
                    .modal-title {
                        margin: 0;
                        font-size: 20px;
                        font-weight: 600;
                        color: var(--text-color);
                    }
                    .modal-close {
                        background: none;
                        border: none;
                        font-size: 28px;
                        color: var(--text-color);
                        opacity: 0.5;
                        cursor: pointer;
                        padding: 0;
                        width: 32px;
                        height: 32px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 50%;
                        transition: all 0.2s;
                    }
                    .modal-close:hover {
                        background: rgba(0,0,0,0.1);
                        opacity: 1;
                    }
                    .modal-content {
                        padding: 20px;
                        max-height: calc(80vh - 120px);
                        overflow-y: auto;
                        -webkit-overflow-scrolling: touch;
                    }
                    .modal-actions {
                        padding: 20px;
                        border-top: 1px solid rgba(0,0,0,0.1);
                        display: flex;
                        gap: 12px;
                        justify-content: flex-end;
                    }
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes slideUp {
                        from { transform: translateY(50px); opacity: 0; }
                        to { transform: translateY(0); opacity: 1; }
                    }
                    @media (max-width: 480px) {
                        .modal-container {
                            max-height: 90vh;
                            border-radius: 12px;
                        }
                        .modal-header,
                        .modal-content,
                        .modal-actions {
                            padding: 16px;
                        }
                    }
                `;
                
                modal.appendChild(style);
                document.body.appendChild(modal);
                this.modals.push(modalId);
                
                // بستن با کلیک روی backdrop
                if (closeOnBackdrop) {
                    modal.addEventListener('click', (e) => {
                        if (e.target === modal) {
                            this.closeModal(modalId);
                            if (onClose) onClose();
                        }
                    });
                }
                
                // جلوگیری از اسکرول body
                document.body.style.overflow = 'hidden';
                
                return modalId;
            },
            
            close: (modalId) => {
                this.closeModal(modalId);
            }
        };
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.animation = 'fadeOut 0.3s';
            modal.querySelector('.modal-container').style.animation = 'slideDown 0.3s';
            
            setTimeout(() => {
                modal.remove();
                this.modals = this.modals.filter(id => id !== modalId);
                
                // بازگرداندن اسکرول body اگر مودال دیگری باز نیست
                if (this.modals.length === 0) {
                    document.body.style.overflow = '';
                }
            }, 300);
        }
    }

    // ایجاد Toast
    createToast() {
        return {
            show: (config = {}) => {
                const { 
                    message = '', 
                    type = 'info', 
                    duration = 3000,
                    position = 'bottom'
                } = config;
                
                const toastId = 'toast-' + Date.now();
                const toast = document.createElement('div');
                toast.className = `toast toast-${type} toast-${position}`;
                toast.id = toastId;
                toast.innerHTML = `
                    <div class="toast-content">
                        <span class="toast-message">${message}</span>
                    </div>
                `;
                
                // استایل‌ها
                const style = document.createElement('style');
                style.textContent = `
                    .toast {
                        position: fixed;
                        z-index: 1000;
                        max-width: 400px;
                        width: calc(100% - 32px);
                        animation: toastIn 0.3s;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                    }
                    .toast-top {
                        top: calc(var(--safe-area-top) + 20px);
                        left: 50%;
                        transform: translateX(-50%);
                    }
                    .toast-bottom {
                        bottom: calc(var(--safe-area-bottom) + 20px);
                        left: 50%;
                        transform: translateX(-50%);
                    }
                    .toast-content {
                        padding: 16px 20px;
                        display: flex;
                        align-items: center;
                        gap: 12px;
                    }
                    .toast-message {
                        font-size: 14px;
                        line-height: 1.4;
                    }
                    .toast-info {
                        background: #2196F3;
                        color: white;
                    }
                    .toast-success {
                        background: #4CAF50;
                        color: white;
                    }
                    .toast-warning {
                        background: #FF9800;
                        color: white;
                    }
                    .toast-error {
                        background: #F44336;
                        color: white;
                    }
                    @keyframes toastIn {
                        from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
                        to { opacity: 1; transform: translateX(-50%) translateY(0); }
                    }
                    @keyframes toastOut {
                        from { opacity: 1; transform: translateX(-50%) translateY(0); }
                        to { opacity: 0; transform: translateX(-50%) translateY(-20px); }
                    }
                    @media (max-width: 480px) {
                        .toast {
                            width: calc(100% - 24px);
                            border-radius: 8px;
                        }
                        .toast-content {
                            padding: 14px 16px;
                        }
                    }
                `;
                
                toast.appendChild(style);
                document.body.appendChild(toast);
                this.toasts.push(toastId);
                
                // حذف خودکار
                setTimeout(() => {
                    this.hideToast(toastId);
                }, duration);
                
                return toastId;
            },
            
            hide: (toastId) => {
                this.hideToast(toastId);
            }
        };
    }

    hideToast(toastId) {
        const toast = document.getElementById(toastId);
        if (toast) {
            toast.style.animation = 'toastOut 0.3s';
            setTimeout(() => {
                toast.remove();
                this.toasts = this.toasts.filter(id => id !== toastId);
            }, 300);
        }
    }

    // ایجاد اسلایدر (مخصوص موبایل)
    createSlider() {
        return {
            render: (config = {}) => {
                const {
                    value = 50,
                    min = 0,
                    max = 100,
                    step = 1,
                    onChange = null,
                    disabled = false
                } = config;
                
                const sliderId = 'slider-' + Date.now();
                
                return `
                <div class="slider-container">
                    <input type="range" 
                           id="${sliderId}"
                           class="slider"
                           min="${min}" 
                           max="${max}" 
                           value="${value}"
                           step="${step}"
                           ${disabled ? 'disabled' : ''}
                           ${onChange ? `oninput="${onChange}(this.value)"` : ''}
                           style="touch-action: none;">
                    <div class="slider-value">${value}</div>
                </div>
                <style>
                    .slider-container {
                        padding: 16px 0;
                        position: relative;
                    }
                    .slider {
                        width: 100%;
                        height: 4px;
                        -webkit-appearance: none;
                        appearance: none;
                        background: linear-gradient(to right, var(--primary-color) 0%, var(--primary-color) ${(value-min)/(max-min)*100}%, #ddd ${(value-min)/(max-min)*100}%, #ddd 100%);
                        border-radius: 2px;
                        outline: none;
                        opacity: ${disabled ? 0.5 : 1};
                    }
                    .slider::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        appearance: none;
                        width: 24px;
                        height: 24px;
                        border-radius: 50%;
                        background: var(--primary-color);
                        cursor: pointer;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                        border: 3px solid white;
                        transition: all 0.2s;
                    }
                    .slider::-webkit-slider-thumb:active {
                        transform: scale(1.2);
                    }
                    .slider-value {
                        position: absolute;
                        top: -8px;
                        right: 0;
                        font-size: 12px;
                        color: var(--text-color);
                        opacity: 0.7;
                    }
                </style>`;
            }
        };
    }

    // سیستم ژستورها (مخصوص موبایل)
    setupGestures() {
        // تشخیص swipe
        let touchStartX = 0;
        let touchStartY = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const diffX = touchEndX - touchStartX;
            const diffY = touchEndY - touchStartY;
            
            // تشخیص swipe
            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (Math.abs(diffX) > 50) { // حداقل فاصله
                    if (diffX > 0) {
                        this.onSwipe('right');
                    } else {
                        this.onSwipe('left');
                    }
                }
            } else {
                if (Math.abs(diffY) > 50) {
                    if (diffY > 0) {
                        this.onSwipe('down');
                    } else {
                        this.onSwipe('up');
                    }
                }
            }
        }, { passive: true });
        
        // تشخیص long press
        let longPressTimer;
        document.addEventListener('touchstart', (e) => {
            longPressTimer = setTimeout(() => {
                this.onLongPress(e);
            }, 500);
        }, { passive: true });
        
        document.addEventListener('touchend', () => {
            clearTimeout(longPressTimer);
        }, { passive: true });
    }
    
    onSwipe(direction) {
        console.log(`Swipe ${direction} detected`);
        // می‌توانید event custom ایجاد کنید
        const event = new CustomEvent('swipe', { 
            detail: { direction },
            bubbles: true
        });
        document.dispatchEvent(event);
    }
    
    onLongPress(e) {
        console.log('Long press detected');
        const event = new CustomEvent('longpress', { 
            detail: { x: e.touches[0].clientX, y: e.touches[0].clientY },
            bubbles: true
        });
        e.target.dispatchEvent(event);
    }

    // دسترسی‌پذیری
    setupAccessibility() {
        // اضافه کردن ARIA attributes
        document.addEventListener('DOMContentLoaded', () => {
            // دکمه‌ها
            document.querySelectorAll('button').forEach(btn => {
                if (!btn.getAttribute('aria-label')) {
                    const text = btn.textContent.trim();
                    if (text) {
                        btn.setAttribute('aria-label', text);
                    }
                }
            });
            
            // input ها
            document.querySelectorAll('input').forEach(input => {
                if (!input.getAttribute('aria-label')) {
                    const placeholder = input.getAttribute('placeholder');
                    if (placeholder) {
                        input.setAttribute('aria-label', placeholder);
                    }
                }
            });
        });
        
        // مدیریت focus
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                // اطمینان از focus trap در مودال‌ها
                if (this.modals.length > 0) {
                    const modal = document.getElementById(this.modals[this.modals.length - 1]);
                    const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                    
                    if (focusable.length === 0) return;
                    
                    const first = focusable[0];
                    const last = focusable[focusable.length - 1];
                    
                    if (e.shiftKey) {
                        if (document.activeElement === first) {
                            last.focus();
                            e.preventDefault();
                        }
                    } else {
                        if (document.activeElement === last) {
                            first.focus();
                            e.preventDefault();
                        }
                    }
                }
            }
        });
    }

    // سایر کامپوننت‌ها (خلاصه)
    createInput() {
        return { render: () => 'Input Component' };
    }
    
    createSelect() {
        return { render: () => 'Select Component' };
    }
    
    createCheckbox() {
        return { render: () => 'Checkbox Component' };
    }
    
    createRadio() {
        return { render: () => 'Radio Component' };
    }
    
    createToggle() {
        return { render: () => 'Toggle Component' };
    }
    
    createAlert() {
        return { render: () => 'Alert Component' };
    }
    
    createProgress() {
        return { render: () => 'Progress Component' };
    }
    
    createSkeleton() {
        return { render: () => 'Skeleton Component' };
    }
    
    createBadge() {
        return { render: () => 'Badge Component' };
    }
    
    createAvatar() {
        return { render: () => 'Avatar Component' };
    }
    
    createChip() {
        return { render: () => 'Chip Component' };
    }
    
    createTooltip() {
        return { render: () => 'Tooltip Component' };
    }
    
    createTabbar() {
        return { render: () => 'Tabbar Component' };
    }
    
    createDrawer() {
        return { render: () => 'Drawer Component' };
    }
    
    createListCard() {
        return { render: () => 'List Card Component' };
    }
    
    createImageCard() {
        return { render: () => 'Image Card Component' };
    }
    
    createContainer() {
        return { render: () => 'Container Component' };
    }
    
    createGrid() {
        return { render: () => 'Grid Component' };
    }
    
    createDivider() {
        return { render: () => 'Divider Component' };
    }
    
    createSpacer() {
        return { render: () => 'Spacer Component' };
    }

    // render یک کامپوننت
    render(componentName, config = {}) {
        const component = this.components[componentName];
        if (!component) {
            console.error(`Component ${componentName} not found`);
            return '';
        }
        return component.render(config);
    }

    // رندر چند کامپوننت
    renderMultiple(components) {
        return components.map(comp => 
            this.render(comp.type, comp.config)
        ).join('');
    }

    // گرفتن اطلاعات UI
    getUIInfo() {
        return {
            theme: this.theme,
            language: this.language,
            rtl: this.rtl,
            componentsCount: Object.keys(this.components).length,
            activeModals: this.modals.length,
            activeToasts: this.toasts.length,
            screenSize: `${window.innerWidth}x${window.innerHeight}`,
            pixelRatio: window.devicePixelRatio
        };
    }

    // ریست UI
    reset() {
        // بستن همه مودال‌ها
        this.modals.forEach(modalId => this.closeModal(modalId));
        
        // بستن همه toast ها
        this.toasts.forEach(toastId => this.hideToast(toastId));
        
        // ریست theme
        this.setTheme('light');
        
        // ریست زبان
        this.setLanguage('fa');
        
        console.log('UI reset completed');
    }

    // نابود کردن
    destroy() {
        this.reset();
        document.body.style.overflow = '';
        
        // حذف event listeners
        document.removeEventListener('touchstart', () => {});
        document.removeEventListener('touchend', () => {});
        
        console.log('UI destroyed');
    }
}

// ایجاد instance جهانی
window.AppBuilderUI = new AppBuilderUI();

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppBuilderUI;
}
