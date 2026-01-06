/**
 * 🚀 سیستم اصلی - نسخه ساده و قابل اجرا
 */

const App = {
    // متغیرهای حالت
    state: {
        currentPage: 'home',
        apps: [],
        darkMode: false,
        language: 'fa'
    },
    
    // راه‌اندازی
    init() {
        console.log('🚀 برنامه در حال راه‌اندازی...');
        
        // بارگذاری حالت ذخیره شده
        this.loadState();
        
        // نمایش صفحه اصلی
        this.showHomePage();
        
        // رویدادهای کیبورد
        this.setupKeyboard();
        
        // به‌روزرسانی زمان
        this.updateTime();
        setInterval(() => this.updateTime(), 60000);
        
        console.log('✅ برنامه آماده است');
    },
    
    // بارگذاری حالت
    loadState() {
        // حالت تاریک
        if (localStorage.getItem('darkMode') === 'true') {
            this.state.darkMode = true;
            document.body.classList.add('dark-mode');
        }
        
        // زبان
        this.state.language = localStorage.getItem('language') || 'fa';
        
        // بارگذاری اپ‌ها
        this.loadApps();
    },
    
    // بارگذاری اپ‌ها
    loadApps() {
        this.state.apps = [
            { id: 'note', name: 'یادداشت', icon: '📝', category: 'ابزار', color: '#4CAF50' },
            { id: 'calculator', name: 'ماشین حساب', icon: '🧮', category: 'ابزار', color: '#2196F3' },
            { id: 'todo', name: 'لیست کارها', icon: '✅', category: 'کاربردی', color: '#FF9800' },
            { id: 'timer', name: 'تایمر', icon: '⏱️', category: 'ابزار', color: '#9C27B0' },
            { id: 'weather', name: 'هواشناسی', icon: '🌤️', category: 'اطلاعات', color: '#00BCD4' },
            { id: 'expense', name: 'مدیریت هزینه', icon: '💰', category: 'مالی', color: '#8BC34A' },
            { id: 'calendar', name: 'تقویم', icon: '📅', category: 'کاربردی', color: '#F44336' },
            { id: 'flashlight', name: 'چراغ قوه', icon: '🔦', category: 'ابزار', color: '#FFC107' },
            { id: 'qr', name: 'ساخت QR', icon: '🔳', category: 'ابزار', color: '#3F51B5' },
            { id: 'compass', name: 'قطب‌نما', icon: '🧭', category: 'ابزار', color: '#009688' }
        ];
    },
    
    // نمایش صفحه اصلی
    showHomePage() {
        const container = document.getElementById('app-container');
        
        const html = `
            <div class="home-page">
                <div class="welcome-section">
                    <h2><i class="fas fa-rocket"></i> خوش آمدید!</h2>
                    <p>از بین ۱۰ اپ کاربردی انتخاب کنید یا دستور دهید</p>
                </div>
                
                <div class="apps-grid">
                    ${this.state.apps.map(app => `
                        <div class="app-card" onclick="App.openApp('${app.id}')">
                            <div class="app-icon" style="color: ${app.color}">${app.icon}</div>
                            <div class="app-name">${app.name}</div>
                            <div class="app-category">${app.category}</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="quick-commands">
                    <h3><i class="fas fa-bolt"></i> دستورات سریع:</h3>
                    <div class="commands-list">
                        <button class="cmd-btn" onclick="App.executeCommand('باز کن یادداشت')">📝 یادداشت</button>
                        <button class="cmd-btn" onclick="App.executeCommand('باز کن ماشین حساب')">🧮 ماشین حساب</button>
                        <button class="cmd-btn" onclick="App.executeCommand('باز کن لیست کارها')">✅ کارها</button>
                        <button class="cmd-btn" onclick="App.executeCommand('تنظیمات')">⚙️ تنظیمات</button>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
        this.state.currentPage = 'home';
        this.updateStatus('خانه');
    },
    
    // باز کردن اپ
    openApp(appId) {
        const app = this.state.apps.find(a => a.id === appId);
        if (!app) {
            this.showNotification('اپ یافت نشد', 'error');
            return;
        }
        
        this.showNotification(`در حال باز کردن ${app.name}...`, 'info');
        
        // استفاده از سیستم router
        if (typeof Router !== 'undefined' && Router.loadApp) {
            Router.loadApp(appId);
        } else {
            // fallback ساده
            this.showAppPage(app);
        }
    },
    
    // نمایش صفحه اپ
    showAppPage(app) {
        const container = document.getElementById('app-container');
        
        const html = `
            <div class="app-page">
                <div class="app-header">
                    <button class="btn-back" onclick="App.showHomePage()">
                        <i class="fas fa-arrow-right"></i> بازگشت
                    </button>
                    <h2>${app.icon} ${app.name}</h2>
                </div>
                
                <div class="app-content">
                    <div class="app-placeholder">
                        <div class="placeholder-icon">${app.icon}</div>
                        <h3>${app.name}</h3>
                        <p>این اپ به زودی اضافه خواهد شد</p>
                        <p>دسته‌بندی: ${app.category}</p>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
        this.state.currentPage = app.id;
        this.updateStatus(app.name);
    },
    
    // اجرای دستور
    executeCommand(command = null) {
        const input = document.getElementById('command-input');
        const cmd = command || input.value.trim();
        
        if (!cmd) {
            this.showNotification('لطفاً دستور وارد کنید', 'warning');
            return;
        }
        
        console.log('🎯 اجرای دستور:', cmd);
        input.value = '';
        
        // دستورات اصلی
        if (cmd.includes('باز کن') || cmd.includes('باز کردن')) {
            const appName = cmd.replace('باز کن', '').replace('باز کردن', '').trim();
            this.openAppByName(appName);
        } 
        else if (cmd === 'خانه' || cmd === 'home') {
            this.showHomePage();
        }
        else if (cmd === 'تنظیمات' || cmd === 'settings') {
            this.showSettings();
        }
        else if (cmd === 'راهنما' || cmd === 'help') {
            this.showHelp();
        }
        else if (cmd === 'حالت تاریک' || cmd === 'dark mode') {
            this.toggleDarkMode();
        }
        else {
            // جستجوی اپ
            const found = this.state.apps.find(app => 
                app.name.includes(cmd) || 
                app.id === cmd || 
                app.category.includes(cmd)
            );
            
            if (found) {
                this.openApp(found.id);
            } else {
                this.showNotification(`دستور "${cmd}" شناخته نشد`, 'error');
            }
        }
    },
    
    // باز کردن اپ با نام
    openAppByName(name) {
        const apps = this.state.apps.filter(app => 
            app.name.includes(name) || 
            app.id === name
        );
        
        if (apps.length === 0) {
            this.showNotification(`اپ "${name}" یافت نشد`, 'error');
        } else if (apps.length === 1) {
            this.openApp(apps[0].id);
        } else {
            // چند اپ پیدا شد
            this.showNotification(`چندین اپ پیدا شد. لطفاً دقیق‌تر مشخص کنید`, 'info');
        }
    },
    
    // نمایش تنظیمات
    showSettings() {
        const container = document.getElementById('app-container');
        
        const html = `
            <div class="settings-page">
                <div class="page-header">
                    <button class="btn-back" onclick="App.showHomePage()">
                        <i class="fas fa-arrow-right"></i> بازگشت
                    </button>
                    <h2><i class="fas fa-cog"></i> تنظیمات</h2>
                </div>
                
                <div class="settings-list">
                    <div class="setting-item">
                        <label>حالت تاریک</label>
                        <label class="switch">
                            <input type="checkbox" ${this.state.darkMode ? 'checked' : ''} 
                                   onchange="App.toggleDarkMode()">
                            <span class="slider"></span>
                        </label>
                    </div>
                    
                    <div class="setting-item">
                        <label>زبان</label>
                        <select onchange="App.changeLanguage(this.value)">
                            <option value="fa" ${this.state.language === 'fa' ? 'selected' : ''}>فارسی</option>
                            <option value="en" ${this.state.language === 'en' ? 'selected' : ''}>English</option>
                        </select>
                    </div>
                    
                    <div class="setting-item">
                        <label>ذخیره‌سازی</label>
                        <button class="btn-clear" onclick="App.clearStorage()">
                            <i class="fas fa-trash"></i> پاک کردن داده‌ها
                        </button>
                    </div>
                    
                    <div class="setting-item">
                        <label>درباره</label>
                        <div class="about-info">
                            <p>سازنده ۲۵ اپ موبایل</p>
                            <p>نسخه ۱.۰.۰</p>
                            <p>توسعه‌دهنده: وارتان اشکانیان</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
        this.state.currentPage = 'settings';
        this.updateStatus('تنظیمات');
    },
    
    // نمایش راهنما
    showHelp() {
        const container = document.getElementById('app-container');
        
        const html = `
            <div class="help-page">
                <div class="page-header">
                    <button class="btn-back" onclick="App.showHomePage()">
                        <i class="fas fa-arrow-right"></i> بازگشت
                    </button>
                    <h2><i class="fas fa-question-circle"></i> راهنما</h2>
                </div>
                
                <div class="help-content">
                    <h3>🎯 دستورات اصلی:</h3>
                    <ul>
                        <li><code>باز کن [نام اپ]</code> - باز کردن اپ</li>
                        <li><code>خانه</code> - بازگشت به صفحه اصلی</li>
                        <li><code>تنظیمات</code> - تنظیمات برنامه</li>
                        <li><code>راهنما</code> - نمایش این صفحه</li>
                    </ul>
                    
                    <h3>📱 اپ‌های موجود:</h3>
                    <div class="apps-help">
                        ${this.state.apps.map(app => `
                            <div class="app-help-item">
                                <span class="app-icon">${app.icon}</span>
                                <span class="app-name">${app.name}</span>
                                <code class="app-command">باز کن ${app.name}</code>
                            </div>
                        `).join('')}
                    </div>
                    
                    <h3>🔧 نکات:</h3>
                    <ul>
                        <li>می‌توانید روی اپ‌ها کلیک کنید</li>
                        <li>دستورات را می‌توانید تایپ یا کلیک کنید</li>
                        <li>از کلید Enter برای اجرای دستور استفاده کنید</li>
                    </ul>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
        this.state.currentPage = 'help';
        this.updateStatus('راهنما');
    },
    
    // تغییر حالت تاریک
    toggleDarkMode() {
        this.state.darkMode = !this.state.darkMode;
        document.body.classList.toggle('dark-mode', this.state.darkMode);
        localStorage.setItem('darkMode', this.state.darkMode);
        
        this.showNotification(
            `حالت ${this.state.darkMode ? 'تاریک' : 'روشن'} فعال شد`,
            'info'
        );
    },
    
    // تغییر زبان
    changeLanguage(lang) {
        this.state.language = lang;
        localStorage.setItem('language', lang);
        this.showNotification('زبان تغییر کرد. صفحه رفرش می‌شود...', 'info');
        
        setTimeout(() => {
            location.reload();
        }, 1000);
    },
    
    // پاک کردن ذخیره‌سازی
    clearStorage() {
        if (confirm('⚠️ آیا مطمئن هستید؟ همه داده‌ها پاک خواهند شد.')) {
            localStorage.clear();
            this.showNotification('✅ همه داده‌ها پاک شدند', 'success');
            setTimeout(() => location.reload(), 1000);
        }
    },
    
    // نمایش اعلان
    showNotification(message, type = 'info') {
        const container = document.getElementById('notifications');
        const id = 'notif-' + Date.now();
        
        const icon = {
            'success': '✅',
            'error': '❌',
            'warning': '⚠️',
            'info': 'ℹ️'
        }[type];
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.id = id;
        notification.innerHTML = `
            <span class="notif-icon">${icon}</span>
            <span class="notif-text">${message}</span>
            <button class="notif-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        container.appendChild(notification);
        
        // حذف خودکار بعد از ۳ ثانیه
        setTimeout(() => {
            const elem = document.getElementById(id);
            if (elem) elem.remove();
        }, 3000);
    },
    
    // به‌روزرسانی وضعیت
    updateStatus(text) {
        const statusEl = document.getElementById('app-status');
        if (statusEl) {
            statusEl.textContent = text;
        }
    },
    
    // به‌روزرسانی زمان
    updateTime() {
        const timeEl = document.getElementById('current-time');
        if (timeEl) {
            const now = new Date();
            const time = now.toLocaleTimeString('fa-IR', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            timeEl.textContent = time;
        }
    },
    
    // رویدادهای کیبورد
    setupKeyboard() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+K یا / برای فوکوس روی دستور
            if ((e.ctrlKey && e.key === 'k') || e.key === '/') {
                e.preventDefault();
                document.getElementById('command-input').focus();
            }
            
            // Enter برای اجرای دستور
            if (e.key === 'Enter' && document.activeElement.id === 'command-input') {
                this.executeCommand();
            }
            
            // Escape برای پاک کردن دستور
            if (e.key === 'Escape') {
                document.getElementById('command-input').value = '';
            }
        });
        
        // اتوفوکوس روی input
        document.getElementById('command-input').focus();
    },
    
    // به‌روزرسانی شمارنده
    updateCounter() {
        const counter = document.getElementById('app-counter');
        if (counter) {
            counter.textContent = `${this.state.apps.length}/25`;
        }
    }
};

// صادر کردن به window
window.App = App;/**
 * 🚀 سیستم اصلی - نسخه ساده و قابل اجرا
 */

const App = {
    // متغیرهای حالت
    state: {
        currentPage: 'home',
        apps: [],
        darkMode: false,
        language: 'fa'
    },
    
    // راه‌اندازی
    init() {
        console.log('🚀 برنامه در حال راه‌اندازی...');
        
        // بارگذاری حالت ذخیره شده
        this.loadState();
        
        // نمایش صفحه اصلی
        this.showHomePage();
        
        // رویدادهای کیبورد
        this.setupKeyboard();
        
        // به‌روزرسانی زمان
        this.updateTime();
        setInterval(() => this.updateTime(), 60000);
        
        console.log('✅ برنامه آماده است');
    },
    
    // بارگذاری حالت
    loadState() {
        // حالت تاریک
        if (localStorage.getItem('darkMode') === 'true') {
            this.state.darkMode = true;
            document.body.classList.add('dark-mode');
        }
        
        // زبان
        this.state.language = localStorage.getItem('language') || 'fa';
        
        // بارگذاری اپ‌ها
        this.loadApps();
    },
    
    // بارگذاری اپ‌ها
    loadApps() {
        this.state.apps = [
            { id: 'note', name: 'یادداشت', icon: '📝', category: 'ابزار', color: '#4CAF50' },
            { id: 'calculator', name: 'ماشین حساب', icon: '🧮', category: 'ابزار', color: '#2196F3' },
            { id: 'todo', name: 'لیست کارها', icon: '✅', category: 'کاربردی', color: '#FF9800' },
            { id: 'timer', name: 'تایمر', icon: '⏱️', category: 'ابزار', color: '#9C27B0' },
            { id: 'weather', name: 'هواشناسی', icon: '🌤️', category: 'اطلاعات', color: '#00BCD4' },
            { id: 'expense', name: 'مدیریت هزینه', icon: '💰', category: 'مالی', color: '#8BC34A' },
            { id: 'calendar', name: 'تقویم', icon: '📅', category: 'کاربردی', color: '#F44336' },
            { id: 'flashlight', name: 'چراغ قوه', icon: '🔦', category: 'ابزار', color: '#FFC107' },
            { id: 'qr', name: 'ساخت QR', icon: '🔳', category: 'ابزار', color: '#3F51B5' },
            { id: 'compass', name: 'قطب‌نما', icon: '🧭', category: 'ابزار', color: '#009688' }
        ];
    },
    
    // نمایش صفحه اصلی
    showHomePage() {
        const container = document.getElementById('app-container');
        
        const html = `
            <div class="home-page">
                <div class="welcome-section">
                    <h2><i class="fas fa-rocket"></i> خوش آمدید!</h2>
                    <p>از بین ۱۰ اپ کاربردی انتخاب کنید یا دستور دهید</p>
                </div>
                
                <div class="apps-grid">
                    ${this.state.apps.map(app => `
                        <div class="app-card" onclick="App.openApp('${app.id}')">
                            <div class="app-icon" style="color: ${app.color}">${app.icon}</div>
                            <div class="app-name">${app.name}</div>
                            <div class="app-category">${app.category}</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="quick-commands">
                    <h3><i class="fas fa-bolt"></i> دستورات سریع:</h3>
                    <div class="commands-list">
                        <button class="cmd-btn" onclick="App.executeCommand('باز کن یادداشت')">📝 یادداشت</button>
                        <button class="cmd-btn" onclick="App.executeCommand('باز کن ماشین حساب')">🧮 ماشین حساب</button>
                        <button class="cmd-btn" onclick="App.executeCommand('باز کن لیست کارها')">✅ کارها</button>
                        <button class="cmd-btn" onclick="App.executeCommand('تنظیمات')">⚙️ تنظیمات</button>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
        this.state.currentPage = 'home';
        this.updateStatus('خانه');
    },
    
    // باز کردن اپ
    openApp(appId) {
        const app = this.state.apps.find(a => a.id === appId);
        if (!app) {
            this.showNotification('اپ یافت نشد', 'error');
            return;
        }
        
        this.showNotification(`در حال باز کردن ${app.name}...`, 'info');
        
        // استفاده از سیستم router
        if (typeof Router !== 'undefined' && Router.loadApp) {
            Router.loadApp(appId);
        } else {
            // fallback ساده
            this.showAppPage(app);
        }
    },
    
    // نمایش صفحه اپ
    showAppPage(app) {
        const container = document.getElementById('app-container');
        
        const html = `
            <div class="app-page">
                <div class="app-header">
                    <button class="btn-back" onclick="App.showHomePage()">
                        <i class="fas fa-arrow-right"></i> بازگشت
                    </button>
                    <h2>${app.icon} ${app.name}</h2>
                </div>
                
                <div class="app-content">
                    <div class="app-placeholder">
                        <div class="placeholder-icon">${app.icon}</div>
                        <h3>${app.name}</h3>
                        <p>این اپ به زودی اضافه خواهد شد</p>
                        <p>دسته‌بندی: ${app.category}</p>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
        this.state.currentPage = app.id;
        this.updateStatus(app.name);
    },
    
    // اجرای دستور
    executeCommand(command = null) {
        const input = document.getElementById('command-input');
        const cmd = command || input.value.trim();
        
        if (!cmd) {
            this.showNotification('لطفاً دستور وارد کنید', 'warning');
            return;
        }
        
        console.log('🎯 اجرای دستور:', cmd);
        input.value = '';
        
        // دستورات اصلی
        if (cmd.includes('باز کن') || cmd.includes('باز کردن')) {
            const appName = cmd.replace('باز کن', '').replace('باز کردن', '').trim();
            this.openAppByName(appName);
        } 
        else if (cmd === 'خانه' || cmd === 'home') {
            this.showHomePage();
        }
        else if (cmd === 'تنظیمات' || cmd === 'settings') {
            this.showSettings();
        }
        else if (cmd === 'راهنما' || cmd === 'help') {
            this.showHelp();
        }
        else if (cmd === 'حالت تاریک' || cmd === 'dark mode') {
            this.toggleDarkMode();
        }
        else {
            // جستجوی اپ
            const found = this.state.apps.find(app => 
                app.name.includes(cmd) || 
                app.id === cmd || 
                app.category.includes(cmd)
            );
            
            if (found) {
                this.openApp(found.id);
            } else {
                this.showNotification(`دستور "${cmd}" شناخته نشد`, 'error');
            }
        }
    },
    
    // باز کردن اپ با نام
    openAppByName(name) {
        const apps = this.state.apps.filter(app => 
            app.name.includes(name) || 
            app.id === name
        );
        
        if (apps.length === 0) {
            this.showNotification(`اپ "${name}" یافت نشد`, 'error');
        } else if (apps.length === 1) {
            this.openApp(apps[0].id);
        } else {
            // چند اپ پیدا شد
            this.showNotification(`چندین اپ پیدا شد. لطفاً دقیق‌تر مشخص کنید`, 'info');
        }
    },
    
    // نمایش تنظیمات
    showSettings() {
        const container = document.getElementById('app-container');
        
        const html = `
            <div class="settings-page">
                <div class="page-header">
                    <button class="btn-back" onclick="App.showHomePage()">
                        <i class="fas fa-arrow-right"></i> بازگشت
                    </button>
                    <h2><i class="fas fa-cog"></i> تنظیمات</h2>
                </div>
                
                <div class="settings-list">
                    <div class="setting-item">
                        <label>حالت تاریک</label>
                        <label class="switch">
                            <input type="checkbox" ${this.state.darkMode ? 'checked' : ''} 
                                   onchange="App.toggleDarkMode()">
                            <span class="slider"></span>
                        </label>
                    </div>
                    
                    <div class="setting-item">
                        <label>زبان</label>
                        <select onchange="App.changeLanguage(this.value)">
                            <option value="fa" ${this.state.language === 'fa' ? 'selected' : ''}>فارسی</option>
                            <option value="en" ${this.state.language === 'en' ? 'selected' : ''}>English</option>
                        </select>
                    </div>
                    
                    <div class="setting-item">
                        <label>ذخیره‌سازی</label>
                        <button class="btn-clear" onclick="App.clearStorage()">
                            <i class="fas fa-trash"></i> پاک کردن داده‌ها
                        </button>
                    </div>
                    
                    <div class="setting-item">
                        <label>درباره</label>
                        <div class="about-info">
                            <p>سازنده ۲۵ اپ موبایل</p>
                            <p>نسخه ۱.۰.۰</p>
                            <p>توسعه‌دهنده: وارتان اشکانیان</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
        this.state.currentPage = 'settings';
        this.updateStatus('تنظیمات');
    },
    
    // نمایش راهنما
    showHelp() {
        const container = document.getElementById('app-container');
        
        const html = `
            <div class="help-page">
                <div class="page-header">
                    <button class="btn-back" onclick="App.showHomePage()">
                        <i class="fas fa-arrow-right"></i> بازگشت
                    </button>
                    <h2><i class="fas fa-question-circle"></i> راهنما</h2>
                </div>
                
                <div class="help-content">
                    <h3>🎯 دستورات اصلی:</h3>
                    <ul>
                        <li><code>باز کن [نام اپ]</code> - باز کردن اپ</li>
                        <li><code>خانه</code> - بازگشت به صفحه اصلی</li>
                        <li><code>تنظیمات</code> - تنظیمات برنامه</li>
                        <li><code>راهنما</code> - نمایش این صفحه</li>
                    </ul>
                    
                    <h3>📱 اپ‌های موجود:</h3>
                    <div class="apps-help">
                        ${this.state.apps.map(app => `
                            <div class="app-help-item">
                                <span class="app-icon">${app.icon}</span>
                                <span class="app-name">${app.name}</span>
                                <code class="app-command">باز کن ${app.name}</code>
                            </div>
                        `).join('')}
                    </div>
                    
                    <h3>🔧 نکات:</h3>
                    <ul>
                        <li>می‌توانید روی اپ‌ها کلیک کنید</li>
                        <li>دستورات را می‌توانید تایپ یا کلیک کنید</li>
                        <li>از کلید Enter برای اجرای دستور استفاده کنید</li>
                    </ul>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
        this.state.currentPage = 'help';
        this.updateStatus('راهنما');
    },
    
    // تغییر حالت تاریک
    toggleDarkMode() {
        this.state.darkMode = !this.state.darkMode;
        document.body.classList.toggle('dark-mode', this.state.darkMode);
        localStorage.setItem('darkMode', this.state.darkMode);
        
        this.showNotification(
            `حالت ${this.state.darkMode ? 'تاریک' : 'روشن'} فعال شد`,
            'info'
        );
    },
    
    // تغییر زبان
    changeLanguage(lang) {
        this.state.language = lang;
        localStorage.setItem('language', lang);
        this.showNotification('زبان تغییر کرد. صفحه رفرش می‌شود...', 'info');
        
        setTimeout(() => {
            location.reload();
        }, 1000);
    },
    
    // پاک کردن ذخیره‌سازی
    clearStorage() {
        if (confirm('⚠️ آیا مطمئن هستید؟ همه داده‌ها پاک خواهند شد.')) {
            localStorage.clear();
            this.showNotification('✅ همه داده‌ها پاک شدند', 'success');
            setTimeout(() => location.reload(), 1000);
        }
    },
    
    // نمایش اعلان
    showNotification(message, type = 'info') {
        const container = document.getElementById('notifications');
        const id = 'notif-' + Date.now();
        
        const icon = {
            'success': '✅',
            'error': '❌',
            'warning': '⚠️',
            'info': 'ℹ️'
        }[type];
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.id = id;
        notification.innerHTML = `
            <span class="notif-icon">${icon}</span>
            <span class="notif-text">${message}</span>
            <button class="notif-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        container.appendChild(notification);
        
        // حذف خودکار بعد از ۳ ثانیه
        setTimeout(() => {
            const elem = document.getElementById(id);
            if (elem) elem.remove();
        }, 3000);
    },
    
    // به‌روزرسانی وضعیت
    updateStatus(text) {
        const statusEl = document.getElementById('app-status');
        if (statusEl) {
            statusEl.textContent = text;
        }
    },
    
    // به‌روزرسانی زمان
    updateTime() {
        const timeEl = document.getElementById('current-time');
        if (timeEl) {
            const now = new Date();
            const time = now.toLocaleTimeString('fa-IR', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            timeEl.textContent = time;
        }
    },
    
    // رویدادهای کیبورد
    setupKeyboard() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+K یا / برای فوکوس روی دستور
            if ((e.ctrlKey && e.key === 'k') || e.key === '/') {
                e.preventDefault();
                document.getElementById('command-input').focus();
            }
            
            // Enter برای اجرای دستور
            if (e.key === 'Enter' && document.activeElement.id === 'command-input') {
                this.executeCommand();
            }
            
            // Escape برای پاک کردن دستور
            if (e.key === 'Escape') {
                document.getElementById('command-input').value = '';
            }
        });
        
        // اتوفوکوس روی input
        document.getElementById('command-input').focus();
    },
    
    // به‌روزرسانی شمارنده
    updateCounter() {
        const counter = document.getElementById('app-counter');
        if (counter) {
            counter.textContent = `${this.state.apps.length}/25`;
        }
    }
};

// صادر کردن به window
window.App = App;/**
 * 🚀 سیستم اصلی - نسخه ساده و قابل اجرا
 */

const App = {
    // متغیرهای حالت
    state: {
        currentPage: 'home',
        apps: [],
        darkMode: false,
        language: 'fa'
    },
    
    // راه‌اندازی
    init() {
        console.log('🚀 برنامه در حال راه‌اندازی...');
        
        // بارگذاری حالت ذخیره شده
        this.loadState();
        
        // نمایش صفحه اصلی
        this.showHomePage();
        
        // رویدادهای کیبورد
        this.setupKeyboard();
        
        // به‌روزرسانی زمان
        this.updateTime();
        setInterval(() => this.updateTime(), 60000);
        
        console.log('✅ برنامه آماده است');
    },
    
    // بارگذاری حالت
    loadState() {
        // حالت تاریک
        if (localStorage.getItem('darkMode') === 'true') {
            this.state.darkMode = true;
            document.body.classList.add('dark-mode');
        }
        
        // زبان
        this.state.language = localStorage.getItem('language') || 'fa';
        
        // بارگذاری اپ‌ها
        this.loadApps();
    },
    
    // بارگذاری اپ‌ها
    loadApps() {
        this.state.apps = [
            { id: 'note', name: 'یادداشت', icon: '📝', category: 'ابزار', color: '#4CAF50' },
            { id: 'calculator', name: 'ماشین حساب', icon: '🧮', category: 'ابزار', color: '#2196F3' },
            { id: 'todo', name: 'لیست کارها', icon: '✅', category: 'کاربردی', color: '#FF9800' },
            { id: 'timer', name: 'تایمر', icon: '⏱️', category: 'ابزار', color: '#9C27B0' },
            { id: 'weather', name: 'هواشناسی', icon: '🌤️', category: 'اطلاعات', color: '#00BCD4' },
            { id: 'expense', name: 'مدیریت هزینه', icon: '💰', category: 'مالی', color: '#8BC34A' },
            { id: 'calendar', name: 'تقویم', icon: '📅', category: 'کاربردی', color: '#F44336' },
            { id: 'flashlight', name: 'چراغ قوه', icon: '🔦', category: 'ابزار', color: '#FFC107' },
            { id: 'qr', name: 'ساخت QR', icon: '🔳', category: 'ابزار', color: '#3F51B5' },
            { id: 'compass', name: 'قطب‌نما', icon: '🧭', category: 'ابزار', color: '#009688' }
        ];
    },
    
    // نمایش صفحه اصلی
    showHomePage() {
        const container = document.getElementById('app-container');
        
        const html = `
            <div class="home-page">
                <div class="welcome-section">
                    <h2><i class="fas fa-rocket"></i> خوش آمدید!</h2>
                    <p>از بین ۱۰ اپ کاربردی انتخاب کنید یا دستور دهید</p>
                </div>
                
                <div class="apps-grid">
                    ${this.state.apps.map(app => `
                        <div class="app-card" onclick="App.openApp('${app.id}')">
                            <div class="app-icon" style="color: ${app.color}">${app.icon}</div>
                            <div class="app-name">${app.name}</div>
                            <div class="app-category">${app.category}</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="quick-commands">
                    <h3><i class="fas fa-bolt"></i> دستورات سریع:</h3>
                    <div class="commands-list">
                        <button class="cmd-btn" onclick="App.executeCommand('باز کن یادداشت')">📝 یادداشت</button>
                        <button class="cmd-btn" onclick="App.executeCommand('باز کن ماشین حساب')">🧮 ماشین حساب</button>
                        <button class="cmd-btn" onclick="App.executeCommand('باز کن لیست کارها')">✅ کارها</button>
                        <button class="cmd-btn" onclick="App.executeCommand('تنظیمات')">⚙️ تنظیمات</button>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
        this.state.currentPage = 'home';
        this.updateStatus('خانه');
    },
    
    // باز کردن اپ
    openApp(appId) {
        const app = this.state.apps.find(a => a.id === appId);
        if (!app) {
            this.showNotification('اپ یافت نشد', 'error');
            return;
        }
        
        this.showNotification(`در حال باز کردن ${app.name}...`, 'info');
        
        // استفاده از سیستم router
        if (typeof Router !== 'undefined' && Router.loadApp) {
            Router.loadApp(appId);
        } else {
            // fallback ساده
            this.showAppPage(app);
        }
    },
    
    // نمایش صفحه اپ
    showAppPage(app) {
        const container = document.getElementById('app-container');
        
        const html = `
            <div class="app-page">
                <div class="app-header">
                    <button class="btn-back" onclick="App.showHomePage()">
                        <i class="fas fa-arrow-right"></i> بازگشت
                    </button>
                    <h2>${app.icon} ${app.name}</h2>
                </div>
                
                <div class="app-content">
                    <div class="app-placeholder">
                        <div class="placeholder-icon">${app.icon}</div>
                        <h3>${app.name}</h3>
                        <p>این اپ به زودی اضافه خواهد شد</p>
                        <p>دسته‌بندی: ${app.category}</p>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
        this.state.currentPage = app.id;
        this.updateStatus(app.name);
    },
    
    // اجرای دستور
    executeCommand(command = null) {
        const input = document.getElementById('command-input');
        const cmd = command || input.value.trim();
        
        if (!cmd) {
            this.showNotification('لطفاً دستور وارد کنید', 'warning');
            return;
        }
        
        console.log('🎯 اجرای دستور:', cmd);
        input.value = '';
        
        // دستورات اصلی
        if (cmd.includes('باز کن') || cmd.includes('باز کردن')) {
            const appName = cmd.replace('باز کن', '').replace('باز کردن', '').trim();
            this.openAppByName(appName);
        } 
        else if (cmd === 'خانه' || cmd === 'home') {
            this.showHomePage();
        }
        else if (cmd === 'تنظیمات' || cmd === 'settings') {
            this.showSettings();
        }
        else if (cmd === 'راهنما' || cmd === 'help') {
            this.showHelp();
        }
        else if (cmd === 'حالت تاریک' || cmd === 'dark mode') {
            this.toggleDarkMode();
        }
        else {
            // جستجوی اپ
            const found = this.state.apps.find(app => 
                app.name.includes(cmd) || 
                app.id === cmd || 
                app.category.includes(cmd)
            );
            
            if (found) {
                this.openApp(found.id);
            } else {
                this.showNotification(`دستور "${cmd}" شناخته نشد`, 'error');
            }
        }
    },
    
    // باز کردن اپ با نام
    openAppByName(name) {
        const apps = this.state.apps.filter(app => 
            app.name.includes(name) || 
            app.id === name
        );
        
        if (apps.length === 0) {
            this.showNotification(`اپ "${name}" یافت نشد`, 'error');
        } else if (apps.length === 1) {
            this.openApp(apps[0].id);
        } else {
            // چند اپ پیدا شد
            this.showNotification(`چندین اپ پیدا شد. لطفاً دقیق‌تر مشخص کنید`, 'info');
        }
    },
    
    // نمایش تنظیمات
    showSettings() {
        const container = document.getElementById('app-container');
        
        const html = `
            <div class="settings-page">
                <div class="page-header">
                    <button class="btn-back" onclick="App.showHomePage()">
                        <i class="fas fa-arrow-right"></i> بازگشت
                    </button>
                    <h2><i class="fas fa-cog"></i> تنظیمات</h2>
                </div>
                
                <div class="settings-list">
                    <div class="setting-item">
                        <label>حالت تاریک</label>
                        <label class="switch">
                            <input type="checkbox" ${this.state.darkMode ? 'checked' : ''} 
                                   onchange="App.toggleDarkMode()">
                            <span class="slider"></span>
                        </label>
                    </div>
                    
                    <div class="setting-item">
                        <label>زبان</label>
                        <select onchange="App.changeLanguage(this.value)">
                            <option value="fa" ${this.state.language === 'fa' ? 'selected' : ''}>فارسی</option>
                            <option value="en" ${this.state.language === 'en' ? 'selected' : ''}>English</option>
                        </select>
                    </div>
                    
                    <div class="setting-item">
                        <label>ذخیره‌سازی</label>
                        <button class="btn-clear" onclick="App.clearStorage()">
                            <i class="fas fa-trash"></i> پاک کردن داده‌ها
                        </button>
                    </div>
                    
                    <div class="setting-item">
                        <label>درباره</label>
                        <div class="about-info">
                            <p>سازنده ۲۵ اپ موبایل</p>
                            <p>نسخه ۱.۰.۰</p>
                            <p>توسعه‌دهنده: وارتان اشکانیان</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
        this.state.currentPage = 'settings';
        this.updateStatus('تنظیمات');
    },
    
    // نمایش راهنما
    showHelp() {
        const container = document.getElementById('app-container');
        
        const html = `
            <div class="help-page">
                <div class="page-header">
                    <button class="btn-back" onclick="App.showHomePage()">
                        <i class="fas fa-arrow-right"></i> بازگشت
                    </button>
                    <h2><i class="fas fa-question-circle"></i> راهنما</h2>
                </div>
                
                <div class="help-content">
                    <h3>🎯 دستورات اصلی:</h3>
                    <ul>
                        <li><code>باز کن [نام اپ]</code> - باز کردن اپ</li>
                        <li><code>خانه</code> - بازگشت به صفحه اصلی</li>
                        <li><code>تنظیمات</code> - تنظیمات برنامه</li>
                        <li><code>راهنما</code> - نمایش این صفحه</li>
                    </ul>
                    
                    <h3>📱 اپ‌های موجود:</h3>
                    <div class="apps-help">
                        ${this.state.apps.map(app => `
                            <div class="app-help-item">
                                <span class="app-icon">${app.icon}</span>
                                <span class="app-name">${app.name}</span>
                                <code class="app-command">باز کن ${app.name}</code>
                            </div>
                        `).join('')}
                    </div>
                    
                    <h3>🔧 نکات:</h3>
                    <ul>
                        <li>می‌توانید روی اپ‌ها کلیک کنید</li>
                        <li>دستورات را می‌توانید تایپ یا کلیک کنید</li>
                        <li>از کلید Enter برای اجرای دستور استفاده کنید</li>
                    </ul>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
        this.state.currentPage = 'help';
        this.updateStatus('راهنما');
    },
    
    // تغییر حالت تاریک
    toggleDarkMode() {
        this.state.darkMode = !this.state.darkMode;
        document.body.classList.toggle('dark-mode', this.state.darkMode);
        localStorage.setItem('darkMode', this.state.darkMode);
        
        this.showNotification(
            `حالت ${this.state.darkMode ? 'تاریک' : 'روشن'} فعال شد`,
            'info'
        );
    },
    
    // تغییر زبان
    changeLanguage(lang) {
        this.state.language = lang;
        localStorage.setItem('language', lang);
        this.showNotification('زبان تغییر کرد. صفحه رفرش می‌شود...', 'info');
        
        setTimeout(() => {
            location.reload();
        }, 1000);
    },
    
    // پاک کردن ذخیره‌سازی
    clearStorage() {
        if (confirm('⚠️ آیا مطمئن هستید؟ همه داده‌ها پاک خواهند شد.')) {
            localStorage.clear();
            this.showNotification('✅ همه داده‌ها پاک شدند', 'success');
            setTimeout(() => location.reload(), 1000);
        }
    },
    
    // نمایش اعلان
    showNotification(message, type = 'info') {
        const container = document.getElementById('notifications');
        const id = 'notif-' + Date.now();
        
        const icon = {
            'success': '✅',
            'error': '❌',
            'warning': '⚠️',
            'info': 'ℹ️'
        }[type];
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.id = id;
        notification.innerHTML = `
            <span class="notif-icon">${icon}</span>
            <span class="notif-text">${message}</span>
            <button class="notif-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        container.appendChild(notification);
        
        // حذف خودکار بعد از ۳ ثانیه
        setTimeout(() => {
            const elem = document.getElementById(id);
            if (elem) elem.remove();
        }, 3000);
    },
    
    // به‌روزرسانی وضعیت
    updateStatus(text) {
        const statusEl = document.getElementById('app-status');
        if (statusEl) {
            statusEl.textContent = text;
        }
    },
    
    // به‌روزرسانی زمان
    updateTime() {
        const timeEl = document.getElementById('current-time');
        if (timeEl) {
            const now = new Date();
            const time = now.toLocaleTimeString('fa-IR', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            timeEl.textContent = time;
        }
    },
    
    // رویدادهای کیبورد
    setupKeyboard() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+K یا / برای فوکوس روی دستور
            if ((e.ctrlKey && e.key === 'k') || e.key === '/') {
                e.preventDefault();
                document.getElementById('command-input').focus();
            }
            
            // Enter برای اجرای دستور
            if (e.key === 'Enter' && document.activeElement.id === 'command-input') {
                this.executeCommand();
            }
            
            // Escape برای پاک کردن دستور
            if (e.key === 'Escape') {
                document.getElementById('command-input').value = '';
            }
        });
        
        // اتوفوکوس روی input
        document.getElementById('command-input').focus();
    },
    
    // به‌روزرسانی شمارنده
    updateCounter() {
        const counter = document.getElementById('app-counter');
        if (counter) {
            counter.textContent = `${this.state.apps.length}/25`;
        }
    }
};

// صادر کردن به window
window.App = App;
