/**
 * 🚀 سیستم اصلی اجرای برنامه
 * مدیریت ۲۵ اپلیکیشن + رابط کاربری + ذخیره‌سازی
 */

// ==================== سیستم مدیریت اپ‌ها ====================
const AppManager = {
    apps: {
        // اپ‌های اصلی (۵ تای اول)
        'note': { name: 'یادداشت حرفه‌ای', icon: '📝', category: 'ابزار', component: 'NoteApp' },
        'calculator': { name: 'ماشین حساب مهندسی', icon: '🧮', category: 'ابزار', component: 'CalculatorApp' },
        'todo': { name: 'لیست کارها', icon: '✅', category: 'کاربردی', component: 'TodoApp' },
        'timer': { name: 'تایمر و کرنومتر', icon: '⏱️', category: 'ابزار', component: 'TimerApp' },
        'weather': { name: 'هواشناسی', icon: '🌤️', category: 'کاربردی', component: 'WeatherApp' },
        
        // اپ‌های مالی
        'expense': { name: 'مدیریت هزینه', icon: '💰', category: 'مالی', component: 'ExpenseApp' },
        'budget': { name: 'بودجه‌بندی', icon: '📊', category: 'مالی' },
        'currency': { name: 'مبدل ارز', icon: '💱', category: 'مالی' },
        
        // اپ‌های ابزاری
        'flashlight': { name: 'چراغ قوه', icon: '🔦', category: 'ابزار' },
        'compass': { name: 'قطب‌نما', icon: '🧭', category: 'ابزار' },
        'measure': { name: 'خط‌کش دیجیتال', icon: '📏', category: 'ابزار' },
        'qr': { name: 'ساخت QR کد', icon: '🔳', category: 'ابزار' },
        'barcode': { name: 'خواندن بارکد', icon: '📷', category: 'ابزار' },
        
        // اپ‌های رسانه‌ای
        'camera': { name: 'دوربین', icon: '📸', category: 'رسانه' },
        'recorder': { name: 'ضبط صوت', icon: '🎤', category: 'رسانه' },
        'music': { name: 'پخش موسیقی', icon: '🎵', category: 'رسانه' },
        'paint': { name: 'نقاشی', icon: '🎨', category: 'رسانه' },
        
        // اپ‌های آموزشی
        'translator': { name: 'مترجم', icon: '🌐', category: 'آموزشی' },
        'dictionary': { name: 'فرهنگ لغت', icon: '📚', category: 'آموزشی' },
        'converter': { name: 'مبدل واحدها', icon: '🔄', category: 'آموزشی' },
        'formula': { name: 'فرمول‌های علمی', icon: '🧪', category: 'آموزشی' },
        
        // اپ‌های سلامت
        'bmi': { name: 'محاسبه BMI', icon: '⚖️', category: 'سلامت' },
        'health': { name: 'پیگیری سلامت', icon: '❤️', category: 'سلامت' },
        'meditation': { name: 'مدیتیشن', icon: '🧘', category: 'سلامت' },
        
        // اپ‌های کاربردی
        'alarm': { name: 'زنگ هشدار', icon: '⏰', category: 'کاربردی' },
        'calendar': { name: 'تقویم', icon: '📅', category: 'کاربردی' },
        'password': { name: 'مدیر رمز عبور', icon: '🔐', category: 'کاربردی' }
    },
    
    // دریافت لیست اپ‌ها بر اساس دسته‌بندی
    getAppsByCategory(category = 'all') {
        if (category === 'all') {
            return Object.entries(this.apps).map(([id, app]) => ({ id, ...app }));
        }
        return Object.entries(this.apps)
            .filter(([_, app]) => app.category === category)
            .map(([id, app]) => ({ id, ...app }));
    },
    
    // جستجوی اپ
    searchApps(query) {
        query = query.toLowerCase();
        return Object.entries(this.apps)
            .filter(([id, app]) => 
                app.name.toLowerCase().includes(query) ||
                app.category.toLowerCase().includes(query) ||
                id.toLowerCase().includes(query)
            )
            .map(([id, app]) => ({ id, ...app }));
    },
    
    // باز کردن اپ
    openApp(appId, params = {}) {
        const app = this.apps[appId];
        if (!app) {
            console.error('اپ یافت نشد:', appId);
            return null;
        }
        
        console.log(`📱 باز کردن اپ: ${app.name}`, params);
        
        // ثبت در تاریخچه
        this.addToHistory(appId, params);
        
        // ایجاد نمونه اپ
        if (app.component && window[app.component]) {
            try {
                const appInstance = new window[app.component](params);
                return appInstance;
            } catch (error) {
                console.error('خطا در ایجاد اپ:', error);
                return null;
            }
        }
        
        // اگر کامپوننت خاصی ندارد، صفحه عمومی بساز
        return this.createGenericApp(app, params);
    },
    
    // ایجاد اپ عمومی
    createGenericApp(app, params) {
        return {
            name: app.name,
            icon: app.icon,
            id: app.id || Date.now().toString(),
            generateCode() {
                return {
                    html: this.generateHTML(),
                    css: this.generateCSS(),
                    js: this.generateJS()
                };
            },
            generateHTML() {
                return `
                    <div class="app-container">
                        <header class="app-header">
                            <h1>${app.icon} ${app.name}</h1>
                            <button class="back-btn" onclick="showHomePage()">← خانه</button>
                        </header>
                        <main class="app-content">
                            <div class="app-placeholder">
                                <div class="placeholder-icon">${app.icon}</div>
                                <h2>${app.name}</h2>
                                <p>این اپ در حال توسعه است و به زودی اضافه خواهد شد.</p>
                                <p>دسته‌بندی: ${app.category}</p>
                            </div>
                        </main>
                    </div>
                `;
            },
            generateCSS() {
                return `
                    .app-container {
                        padding: 20px;
                        max-width: 800px;
                        margin: 0 auto;
                    }
                    .app-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 30px;
                    }
                    .app-placeholder {
                        text-align: center;
                        padding: 40px 20px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        border-radius: 20px;
                        color: white;
                    }
                    .placeholder-icon {
                        font-size: 4rem;
                        margin-bottom: 20px;
                    }
                `;
            },
            generateJS() {
                return `
                    console.log('اپ ${app.name} بارگذاری شد');
                    // کدهای اختصاصی اپ
                `;
            }
        };
    },
    
    // تاریخچه
    history: JSON.parse(localStorage.getItem('appHistory') || '[]'),
    
    addToHistory(appId, params) {
        const app = this.apps[appId];
        if (!app) return;
        
        const entry = {
            id: Date.now(),
            appId,
            appName: app.name,
            timestamp: new Date().toISOString(),
            params
        };
        
        this.history.unshift(entry);
        
        // محدود کردن به ۲۰ مورد
        if (this.history.length > 20) {
            this.history.pop();
        }
        
        localStorage.setItem('appHistory', JSON.stringify(this.history));
        this.updateHistoryDisplay();
    },
    
    updateHistoryDisplay() {
        const historyList = document.getElementById('history-list');
        if (!historyList) return;
        
        if (this.history.length === 0) {
            historyList.innerHTML = '<p class="empty-history">تاریخچه‌ای وجود ندارد</p>';
            return;
        }
        
        historyList.innerHTML = this.history.map((entry, index) => `
            <div class="history-item" onclick="AppManager.openApp('${entry.appId}', ${JSON.stringify(entry.params)})">
                <span class="history-index">${index + 1}.</span>
                <span class="history-app">${entry.appName}</span>
                <span class="history-time">${new Date(entry.timestamp).toLocaleTimeString('fa-IR')}</span>
            </div>
        `).join('');
    },
    
    // آمار
    stats: JSON.parse(localStorage.getItem('appStats') || '{"totalOpens": 0, "lastOpen": null}'),
    
    updateStats(appId) {
        this.stats.totalOpens++;
        this.stats.lastOpen = new Date().toISOString();
        this.stats[appId] = (this.stats[appId] || 0) + 1;
        
        localStorage.setItem('appStats', JSON.stringify(this.stats));
        this.updateStatsDisplay();
    },
    
    updateStatsDisplay() {
        const statsEl = document.getElementById('app-stats');
        if (!statsEl) return;
        
        const total = this.stats.totalOpens || 0;
        const today = new Date().toDateString();
        const todayOpens = Object.values(this.history)
            .filter(h => new Date(h.timestamp).toDateString() === today)
            .length;
        
        statsEl.innerHTML = `
            <div class="stat-item">
                <div class="stat-value">${total}</div>
                <div class="stat-label">تعداد بازدیدها</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${todayOpens}</div>
                <div class="stat-label">امروز</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${Object.keys(this.apps).length}</div>
                <div class="stat-label">تعداد اپ‌ها</div>
            </div>
        `;
    }
};

// ==================== سیستم اجرای دستورات ====================
const CommandEngine = {
    patterns: {
        // دستورات اصلی
        'خانه|home|start|main': 'showHomePage',
        'بازگشت|back|return': 'goBack',
        
        // دستورات اپ‌ها
        'صفحه\\s+(.+)|اپ\\s+(.+)|برنامه\\s+(.+)': 'openAppPage',
        'یادداشت|note|notes': 'openAppPage note',
        'ماشین\\s+حساب|calculator|calc': 'openAppPage calculator',
        'لیست\\s+کار|todo|کارها|tasks': 'openAppPage todo',
        'تایمر|timer|کرنومتر|stopwatch': 'openAppPage timer',
        'هوا|weather|آب\\s+وهوا': 'openAppPage weather',
        
        // دستورات جستجو
        'جستجو\\s+(.+)|search\\s+(.+)': 'searchApps',
        'دسته\\s+(.+)|category\\s+(.+)': 'filterByCategory',
        
        // دستورات مدیریتی
        'تنظیمات|settings|options': 'openSettings',
        'راهنما|help|کمک': 'openHelp',
        'تاریخچه|history|log': 'showHistory',
        'پاک\\s+کن|clear|پاکسازی': 'clearHistory',
        
        // دستورات توسعه
        'کد\\s+(.+)|code\\s+(.+)': 'showAppCode',
        'دمو\\s+(.+)|demo\\s+(.+)': 'runDemo',
        'تست\\s+(.+)|test\\s+(.+)': 'runTest'
    },
    
    execute(command) {
        console.log('🎯 اجرای دستور:', command);
        
        if (!command || command.trim() === '') {
            return this.showError('لطفاً یک دستور وارد کنید');
        }
        
        // نرمال‌سازی دستور
        const normalized = command.toLowerCase().trim();
        
        // بررسی الگوها
        for (const [pattern, action] of Object.entries(this.patterns)) {
            const regex = new RegExp(pattern, 'i');
            const match = command.match(regex);
            
            if (match) {
                return this.handleAction(action, match, command);
            }
        }
        
        // اگر الگویی پیدا نشد، سعی کن اپ را مستقیماً باز کنی
        return this.tryDirectAppOpen(command);
    },
    
    handleAction(action, match, originalCommand) {
        const params = match.slice(1).filter(Boolean);
        
        switch (action) {
            case 'showHomePage':
                return showHomePage();
                
            case 'openAppPage':
                const appName = params[0] || params[1] || params[2];
                return openAppPage(appName);
                
            case 'searchApps':
                return searchApps(params[0]);
                
            case 'filterByCategory':
                return filterByCategory(params[0]);
                
            case 'openSettings':
                return openSettings();
                
            case 'openHelp':
                return openHelp();
                
            case 'showHistory':
                return showHistory();
                
            case 'clearHistory':
                return clearHistory();
                
            case 'showAppCode':
                return showAppCode(params[0]);
                
            case 'runDemo':
                return runDemo(params[0]);
                
            case 'runTest':
                return runTest(params[0]);
                
            default:
                return this.tryDirectAppOpen(originalCommand);
        }
    },
    
    tryDirectAppOpen(command) {
        // حذف کلمات اضافی
        const cleanCommand = command
            .replace(/(باز|کن|اپ|برنامه|صفحه)\s+/g, '')
            .trim();
        
        // جستجوی اپ
        const foundApps = AppManager.searchApps(cleanCommand);
        
        if (foundApps.length === 0) {
            return this.showError(`دستور "${command}" شناخته نشد.`);
        }
        
        if (foundApps.length === 1) {
            return openAppPage(foundApps[0].id);
        }
        
        // اگر چندین اپ پیدا شد، لیست نشان بده
        return this.showAppList(foundApps, command);
    },
    
    showAppList(apps, originalCommand) {
        const container = document.getElementById('app');
        if (!container) return;
        
        container.innerHTML = `
            <div class="app-list-container">
                <h2>🔍 چندین اپ پیدا شد برای: "${originalCommand}"</h2>
                <div class="apps-grid">
                    ${apps.map(app => `
                        <div class="app-card" onclick="openAppPage('${app.id}')">
                            <div class="app-icon">${app.icon}</div>
                            <div class="app-name">${app.name}</div>
                            <div class="app-category">${app.category}</div>
                        </div>
                    `).join('')}
                </div>
                <button class="btn" onclick="showHomePage()">🏠 بازگشت به خانه</button>
            </div>
        `;
    },
    
    showError(message) {
        const container = document.getElementById('app');
        if (!container) return;
        
        container.innerHTML = `
            <div class="error-container">
                <div class="error-icon">⚠️</div>
                <h2>خطا در اجرای دستور</h2>
                <p>${message}</p>
                <div class="error-help">
                    <p>دستورات معتبر:</p>
                    <ul>
                        <li><code>صفحه یادداشت</code> - باز کردن اپ یادداشت</li>
                        <li><code>خانه</code> - بازگشت به صفحه اصلی</li>
                        <li><code>جستجوی [نام]</code> - جستجوی اپ</li>
                        <li><code>تنظیمات</code> - تنظیمات برنامه</li>
                    </ul>
                </div>
                <button class="btn" onclick="showHomePage()">🏠 بازگشت به خانه</button>
            </div>
        `;
    },
    
    // پیشنهادات هوشمند
    getSuggestions(input) {
        if (!input || input.length < 2) return [];
        
        const suggestions = [];
        
        // جستجو در اپ‌ها
        const appMatches = AppManager.searchApps(input);
        appMatches.forEach(app => {
            suggestions.push({
                text: `صفحه ${app.name}`,
                command: `صفحه ${app.id}`,
                type: 'app'
            });
        });
        
        // دستورات متداول
        const commonCommands = [
            'خانه', 'تنظیمات', 'راهنما', 'تاریخچه',
            'صفحه یادداشت', 'صفحه ماشین حساب', 'صفحه لیست کارها'
        ];
        
        commonCommands.forEach(cmd => {
            if (cmd.includes(input) || input.includes(cmd)) {
                suggestions.push({
                    text: cmd,
                    command: cmd,
                    type: 'command'
                });
            }
        });
        
        return suggestions.slice(0, 5); // فقط ۵ پیشنهاد
    }
};

// ==================== توابع اصلی رابط کاربری ====================

// اجرای دستور
function runApp(command) {
    console.log('🚀 اجرای برنامه:', command);
    
    // به‌روزرسانی وضعیت
    updateStatus(`در حال اجرا: ${command.substring(0, 30)}...`);
    
    // اجرای دستور
    CommandEngine.execute(command);
    
    // ذخیره در تاریخچه دستورات
    saveToCommandHistory(command);
    
    // فوکوس مجدد روی input
    setTimeout(() => {
        const input = document.getElementById('command-input');
        if (input) input.focus();
    }, 100);
}

// باز کردن صفحه اپ
function openAppPage(appId) {
    console.log(`📱 باز کردن صفحه اپ: ${appId}`);
    
    const app = AppManager.apps[appId];
    if (!app) {
        return showError(`اپ "${appId}" یافت نشد.`);
    }
    
    // پنهان کردن صفحه اصلی
    const homePage = document.getElementById('home-page');
    if (homePage) homePage.classList.remove('active');
    
    // نمایش صفحه اپ
    const appPages = document.getElementById('app-pages');
    if (appPages) {
        appPages.classList.add('active');
        appPages.innerHTML = '<div class="loading">در حال بارگذاری اپ...</div>';
    }
    
    // ایجاد اپ
    setTimeout(() => {
        createApp(appId);
    }, 300);
}

// ایجاد اپ
function createApp(appId) {
    const container = document.getElementById('app-pages');
    if (!container) return;
    
    // ایجاد نمونه اپ
    const appInstance = AppManager.openApp(appId);
    if (!appInstance) {
        container.innerHTML = `
            <div class="app-error">
                <h2>⚠️ خطا در ایجاد اپ</h2>
                <p>متاسفانه اپ "${appId}" قابل بارگذاری نیست.</p>
                <button class="btn" onclick="showHomePage()">🏠 بازگشت به خانه</button>
            </div>
        `;
        return;
    }
    
    // تولید کدهای اپ
    const appCode = appInstance.generateCode();
    
    // نمایش HTML
    container.innerHTML = appCode.html;
    
    // اضافه کردن CSS
    const styleId = `app-style-${appId}`;
    let styleEl = document.getElementById(styleId);
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = styleId;
        document.head.appendChild(styleEl);
    }
    styleEl.textContent = appCode.css;
    
    // اجرای JavaScript
    const scriptId = `app-script-${appId}`;
    let scriptEl = document.getElementById(scriptId);
    if (scriptEl) scriptEl.remove();
    
    scriptEl = document.createElement('script');
    scriptEl.id = scriptId;
    scriptEl.textContent = appCode.js;
    document.body.appendChild(scriptEl);
    
    // به‌روزرسانی وضعیت
    updateStatus(`اپ ${appInstance.name} بارگذاری شد`);
    AppManager.updateStats(appId);
}

// نمایش صفحه اصلی
function showHomePage() {
    console.log('🏠 بازگشت به صفحه اصلی');
    
    // پنهان کردن همه صفحات
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // نمایش صفحه اصلی
    const homePage = document.getElementById('home-page');
    if (homePage) homePage.classList.add('active');
    
    // به‌روزرسانی وضعیت
    updateStatus('آماده');
    
    // بارگذاری اپ‌ها
    renderAppGrid();
    AppManager.updateHistoryDisplay();
    AppManager.updateStatsDisplay();
}

// رندر شبکه اپ‌ها
function renderAppGrid() {
    const container = document.getElementById('apps-container');
    if (!container) return;
    
    const apps = AppManager.getAppsByCategory();
    
    container.innerHTML = apps.map((app, index) => `
        <div class="app-card fade-in" 
             style="animation-delay: ${index * 0.05}s"
             onclick="openAppPage('${app.id}')"
             data-category="${app.category}">
            <div class="app-icon">${app.icon}</div>
            <div class="app-name">${app.name}</div>
            <div class="app-category">${app.category}</div>
            ${app.component ? '<div class="app-badge">آماده</div>' : ''}
        </div>
    `).join('');
}

// فیلتر اپ‌ها بر اساس دسته‌بندی
function filterByCategory(category) {
    const apps = AppManager.getAppsByCategory(category);
    const container = document.getElementById('apps-container');
    if (!container) return;
    
    if (apps.length === 0) {
        container.innerHTML = `
            <div class="empty-category">
                <p>📭 هیچ اپی در دسته "${category}" یافت نشد.</p>
                <button class="btn" onclick="renderAppGrid()">نمایش همه اپ‌ها</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = apps.map(app => `
        <div class="app-card" onclick="openAppPage('${app.id}')">
            <div class="app-icon">${app.icon}</div>
            <div class="app-name">${app.name}</div>
            <div class="app-category">${app.category}</div>
        </div>
    `).join('');
}

// جستجوی اپ‌ها
function searchApps(query) {
    const results = AppManager.searchApps(query);
    const container = document.getElementById('apps-container');
    if (!container) return;
    
    if (results.length === 0) {
        container.innerHTML = `
            <div class="search-results">
                <h3>🔍 نتیجه‌ای برای "${query}" یافت نشد</h3>
                <button class="btn" onclick="renderAppGrid()">نمایش همه اپ‌ها</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="search-results">
            <h3>🔍 نتایج جستجو برای "${query}":</h3>
            <div class="apps-grid">
                ${results.map(app => `
                    <div class="app-card" onclick="openAppPage('${app.id}')">
                        <div class="app-icon">${app.icon}</div>
                        <div class="app-name">${app.name}</div>
                        <div class="app-category">${app.category}</div>
                    </div>
                `).join('')}
            </div>
            <button class="btn" onclick="renderAppGrid()">← نمایش همه اپ‌ها</button>
        </div>
    `;
}

// نمایش تاریخچه
function showHistory() {
    const container = document.getElementById('app');
    if (!container) return;
    
    const history = AppManager.history;
    
    container.innerHTML = `
        <div class="history-container">
            <h2>📜 تاریخچه اپ‌ها</h2>
            <div class="history-stats">
                <div class="stat">تعداد کل: ${history.length}</div>
                <div class="stat">امروز: ${history.filter(h => 
                    new Date(h.timestamp).toDateString() === new Date().toDateString()
                ).length}</div>
            </div>
            <div class="history-list">
                ${history.length === 0 ? 
                    '<p class="empty-history">تاریخچه‌ای وجود ندارد</p>' : 
                    history.map((entry, index) => `
                        <div class="history-item" onclick="openAppPage('${entry.appId}')">
                            <div class="history-index">${index + 1}.</div>
                            <div class="history-app">${entry.appName}</div>
                            <div class="history-time">
                                ${new Date(entry.timestamp).toLocaleString('fa-IR')}
                            </div>
                        </div>
                    `).join('')
                }
            </div>
            <div class="history-actions">
                <button class="btn" onclick="clearHistory()">🗑️ پاک کردن تاریخچه</button>
                <button class="btn" onclick="showHomePage()">🏠 خانه</button>
            </div>
        </div>
    `;
}

// پاک کردن تاریخچه
function clearHistory() {
    if (confirm('آیا مطمئن هستید که می‌خواهید تاریخچه را پاک کنید؟')) {
        AppManager.history = [];
        localStorage.setItem('appHistory', JSON.stringify([]));
        showHistory();
    }
}

// تنظیمات
function openSettings() {
    const container = document.getElementById('app');
    if (!container) return;
    
    const isDark = document.body.classList.contains('dark-mode');
    const lang = localStorage.getItem('language') || 'fa';
    
    container.innerHTML = `
        <div class="settings-container">
            <h2>⚙️ تنظیمات</h2>
            
            <div class="settings-section">
                <h3>🎨 نمایش</h3>
                <div class="setting-item">
                    <label>
                        <input type="checkbox" ${isDark ? 'checked' : ''} 
                               onchange="toggleDarkMode()">
                        حالت تاریک
                    </label>
                </div>
            </div>
            
            <div class="settings-section">
                <h3>🌐 زبان</h3>
                <select class="language-select" onchange="changeLanguage(this.value)">
                    <option value="fa" ${lang === 'fa' ? 'selected' : ''}>🇮🇷 فارسی</option>
                    <option value="en" ${lang === 'en' ? 'selected' : ''}>🇺🇸 English</option>
                </select>
            </div>
            
            <div class="settings-section">
                <h3>💾 ذخیره‌سازی</h3>
                <div class="storage-info">
                    <p>حجم ذخیره شده: ${calculateStorageSize()} KB</p>
                    <button class="btn" onclick="clearStorage()">🗑️ پاک کردن داده‌ها</button>
                </div>
            </div>
            
            <div class="settings-actions">
                <button class="btn" onclick="exportData()">📤 صادرات داده‌ها</button>
                <button class="btn" onclick="showHomePage()">🏠 خانه</button>
            </div>
        </div>
    `;
}

// راهنما
function openHelp() {
    const container = document.getElementById('app');
    if (!container) return;
    
    container.innerHTML = `
        <div class="help-container">
            <h2>❓ راهنمای استفاده</h2>
            
            <div class="help-section">
                <h3>🎯 دستورات اصلی</h3>
                <div class="help-commands">
                    <div class="command-item">
                        <code>خانه</code>
                        <span>بازگشت به صفحه اصلی</span>
                    </div>
                    <div class="command-item">
                        <code>صفحه [نام اپ]</code>
                        <span>باز کردن اپ خاص (مثال: صفحه یادداشت)</span>
                    </div>
                    <div class="command-item">
                        <code>جستجو [کلمه]</code>
                        <span>جستجوی اپ‌ها</span>
                    </div>
                    <div class="command-item">
                        <code>دسته [نام دسته]</code>
                        <span>فیلتر اپ‌ها بر اساس دسته</span>
                    </div>
                </div>
            </div>
            
            <div class="help-section">
                <h3>📱 اپ‌های موجود</h3>
                <div class="apps-list">
                    ${Object.entries(AppManager.apps).slice(0, 10).map(([id, app]) => `
                        <div class="app-help-item">
                            <span class="app-icon">${app.icon}</span>
                            <span class="app-name">${app.name}</span>
                            <code class="app-command">صفحه ${id}</code>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="help-section">
                <h3>🔧 نکات فنی</h3>
                <ul>
                    <li>می‌توانید روی اپ‌ها کلیک کنید یا از دستورات استفاده کنید</li>
                    <li>از فلش بالا برای تکرار دستورات قبلی استفاده کنید</li>
                    <li>Ctrl+K برای فوکوس روی جعبه دستورات</li>
                    <li>اپ‌ها به صورت PWA قابل نصب هستند</li>
                </ul>
            </div>
            
            <button class="btn" onclick="showHomePage()">🏠 خانه</button>
        </div>
    `;
}

// ==================== توابع کمکی ====================

// به‌روزرسانی وضعیت
function updateStatus(text) {
    const statusEl = document.getElementById('app-status');
    if (statusEl) {
        statusEl.textContent = text;
    }
}

// ذخیره دستور در تاریخچه
function saveToCommandHistory(command) {
    let history = JSON.parse(localStorage.getItem('commandHistory') || '[]');
    history.unshift({
        command: command,
        timestamp: new Date().toISOString()
    });
    
    if (history.length > 50) {
        history = history.slice(0, 50);
    }
    
    localStorage.setItem('commandHistory', JSON.stringify(history));
}

// نمایش اعلان
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()">✕</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // حذف خودکار
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// نمایش خطا
function showError(message) {
    showNotification(`❌ ${message}`, 'error');
}

// تغییر حالت تاریک
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    
    showNotification(`حالت ${isDark ? 'تاریک' : 'روشن'} فعال شد`);
}

// تغییر زبان
function changeLanguage(lang) {
    localStorage.setItem('language', lang);
    showNotification('زبان تغییر کرد. صفحه در حال بارگذاری مجدد...');
    setTimeout(() => location.reload(), 1000);
}

// محاسبه حجم ذخیره‌سازی
function calculateStorageSize() {
    let total = 0;
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            total += (localStorage[key].length * 2) / 1024; // به KB
        }
    }
    return Math.round(total * 100) / 100;
}

// پاک کردن ذخیره‌سازی
function clearStorage() {
    if (confirm('⚠️ آیا مطمئن هستید؟ همه داده‌های ذخیره شده پاک خواهند شد.')) {
        localStorage.clear();
        showNotification('✅ همه داده‌ها پاک شدند');
        setTimeout(() => location.reload(), 1000);
    }
}

// صادرات داده‌ها
function exportData() {
    const data = {
        apps: AppManager.apps,
        history: AppManager.history,
        stats: AppManager.stats,
        timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `app-builder-backup-${new Date().getTime()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('✅ داده‌ها با موفقیت صادر شدند');
}

// ==================== مقداردهی اولیه ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 برنامه در حال راه‌اندازی...');
    
    // بارگذاری تنظیمات
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
    
    // بارگذاری زبان
    const lang = localStorage.getItem('language') || 'fa';
    if (typeof changeLanguage === 'function') {
        changeLanguage(lang);
    }
    
    // بارگذاری تاریخچه
    AppManager.updateHistoryDisplay();
    AppManager.updateStatsDisplay();
    
    // رندر اپ‌ها
    renderAppGrid();
    
    // رویدادهای کیبورد
    document.addEventListener('keydown', function(e) {
        // Ctrl+K برای فوکوس روی دستور
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const input = document.getElementById('command-input');
            if (input) input.focus();
        }
        
        // Escape برای پاک کردن دستور
        if (e.key === 'Escape') {
            const input = document.getElementById('command-input');
            if (input) input.value = '';
        }
        
        // فلش بالا برای تاریخچه دستورات
        if (e.key === 'ArrowUp' && e.target.id === 'command-input') {
            e.preventDefault();
            const history = JSON.parse(localStorage.getItem('commandHistory') || '[]');
            if (history.length > 0) {
                document.getElementById('command-input').value = history[0].command;
            }
        }
    });
    
    // پیشنهادات هوشمند
    const commandInput = document.getElementById('command-input');
    if (commandInput) {
        commandInput.addEventListener('input', function(e) {
            const suggestions = CommandEngine.getSuggestions(e.target.value);
            showSuggestions(suggestions);
        });
        
        commandInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                executeCommand();
            }
        });
    }
    
    console.log('✅ برنامه آماده است. دستور بدهید!');
});

// ==================== صادر کردن توابع ====================
window.runApp = runApp;
window.openAppPage = openAppPage;
window.showHomePage = showHomePage;
window.filterByCategory = filterByCategory;
window.searchApps = searchApps;
window.showHistory = showHistory;
window.clearHistory = clearHistory;
window.openSettings = openSettings;
window.openHelp = openHelp;
window.toggleDarkMode = toggleDarkMode;
window.showNotification = showNotification;
window.showError = showError;

window.AppManager = AppManager;
window.CommandEngine = CommandEngine;

// اجرای دستور از پنل پایین
window.executeCommand = function() {
    const input = document.getElementById('command-input');
    if (input && input.value.trim()) {
        runApp(input.value);
        input.value = '';
    }
};

// اجرای دستور سریع
window.runCommand = function(command) {
    if (command) {
        document.getElementById('command-input').value = command;
        executeCommand();
    }
};

// تابع اجرای دستورات صوتی (شبیه‌سازی)
window.startVoiceCommand = function() {
    showNotification('🎤 در حال گوش دادن... دستور خود را بگویید');
    
    // شبیه‌سازی تشخیص صدا
    setTimeout(() => {
        const commands = [
            'صفحه یادداشت',
            'صفحه ماشین حساب',
            'خانه',
            'تنظیمات',
            'راهنما'
        ];
        const randomCommand = commands[Math.floor(Math.random() * commands.length)];
        
        document.getElementById('command-input').value = randomCommand;
        showNotification(`🎤 تشخیص: ${randomCommand}`);
    }, 2000);
};

// نمایش پیشنهادات
window.showSuggestions = function(suggestions) {
    const container = document.getElementById('command-suggestions');
    if (!container) return;
    
    if (suggestions.length === 0) {
        container.style.display = 'none';
        return;
    }
    
    container.innerHTML = suggestions.map(s => `
        <div class="suggestion-item" onclick="runCommand('${s.command}')">
            <span class="suggestion-text">${s.text}</span>
            <span class="suggestion-type">${s.type === 'app' ? '📱' : '🎯'}</span>
        </div>
    `).join('');
    
    container.style.display = 'block';
};

// مخفی کردن پیشنهادات
window.hideSuggestions = function() {
    const container = document.getElementById('command-suggestions');
    if (container) {
        container.style.display = 'none';
    }
};

// کلیک خارج از پیشنهادات
document.addEventListener('click', function(e) {
    if (!e.target.closest('#command-suggestions') && !e.target.closest('#command-input')) {
        hideSuggestions();
    }
});
