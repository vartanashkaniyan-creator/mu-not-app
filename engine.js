// engine.js - موتور پردازش و کامپایل اپ‌ساز
// Version 1.0 - فارسی/انگلیسی - مخصوص موبایل

class AppBuilderEngine {
    constructor() {
        this.version = '2.1.0';
        this.supportedPlatforms = ['android', 'pwa', 'web'];
        this.currentPlatform = 'android';
        this.compilerOptions = {
            minify: true,
            transpile: true,
            optimizeImages: true,
            generateAPK: false
        };
        this.componentsLibrary = {};
        this.templatesCache = {};
        this.initEngine();
    }

    // راه‌اندازی موتور
    initEngine() {
        console.log(`🚀 AppBuilder Engine v${this.version} initialized`);
        this.loadComponentLibrary();
        this.loadTemplates();
        this.setupCompiler();
        this.detectPlatform();
        this.setupHotReload();
    }

    // تشخیص پلتفرم
    detectPlatform() {
        const ua = navigator.userAgent.toLowerCase();
        
        if (ua.includes('android')) {
            this.currentPlatform = 'android';
            console.log('📱 Platform: Android detected');
        } else if (ua.includes('iphone') || ua.includes('ipad')) {
            this.currentPlatform = 'ios';
            console.log('📱 Platform: iOS detected');
        } else {
            this.currentPlatform = 'web';
            console.log('🌐 Platform: Web detected');
        }
        
        this.applyPlatformOptimizations();
    }

    // بهینه‌سازی‌های پلتفرم
    applyPlatformOptimizations() {
        switch(this.currentPlatform) {
            case 'android':
                this.compilerOptions.generateAPK = true;
                this.compilerOptions.touchOptimized = true;
                this.compilerOptions.offlineSupport = true;
                break;
            case 'ios':
                this.compilerOptions.safariCompatible = true;
                this.compilerOptions.touchOptimized = true;
                this.compilerOptions.pwaSupport = true;
                break;
            case 'web':
                this.compilerOptions.pwaSupport = true;
                this.compilerOptions.seoOptimized = true;
                break;
        }
    }

    // کتابخانه کامپوننت‌ها
    loadComponentLibrary() {
        this.componentsLibrary = {
            // کامپوننت‌های پایه
            layout: {
                container: this.createContainerComponent(),
                grid: this.createGridComponent(),
                card: this.createCardComponent(),
                list: this.createListComponent(),
                modal: this.createModalComponent()
            },
            
            // کامپوننت‌های فرم
            form: {
                input: this.createInputComponent(),
                button: this.createButtonComponent(),
                select: this.createSelectComponent(),
                checkbox: this.createCheckboxComponent(),
                radio: this.createRadioComponent(),
                slider: this.createSliderComponent(),
                switch: this.createSwitchComponent()
            },
            
            // کامپوننت‌های نمایش
            display: {
                text: this.createTextComponent(),
                image: this.createImageComponent(),
                icon: this.createIconComponent(),
                avatar: this.createAvatarComponent(),
                badge: this.createBadgeComponent(),
                progress: this.createProgressComponent(),
                spinner: this.createSpinnerComponent()
            },
            
            // کامپوننت‌های ناوبری
            navigation: {
                navbar: this.createNavbarComponent(),
                tabbar: this.createTabbarComponent(),
                drawer: this.createDrawerComponent(),
                breadcrumb: this.createBreadcrumbComponent(),
                menu: this.createMenuComponent()
            },
            
            // کامپوننت‌های خاص
            special: {
                calculator: this.createCalculatorComponent(),
                notes: this.createNotesComponent(),
                todo: this.createTodoComponent(),
                weather: this.createWeatherComponent(),
                map: this.createMapComponent(),
                chart: this.createChartComponent(),
                editor: this.createEditorComponent()
            }
        };
        
        console.log(`📚 Loaded ${Object.keys(this.componentsLibrary).length} component categories`);
    }

    // ایجاد کامپوننت کانتینر
    createContainerComponent() {
        return {
            name: 'container',
            version: '1.0',
            mobileOptimized: true,
            props: {
                direction: { type: 'string', default: 'column', values: ['row', 'column'] },
                padding: { type: 'number', default: 16 },
                margin: { type: 'number', default: 8 },
                background: { type: 'string', default: '#ffffff' },
                borderRadius: { type: 'number', default: 12 }
            },
            template: function(props) {
                return `
                <div class="container" 
                     style="display: flex; 
                            flex-direction: ${props.direction}; 
                            padding: ${props.padding}px; 
                            margin: ${props.margin}px; 
                            background: ${props.background}; 
                            border-radius: ${props.borderRadius}px;
                            overflow: hidden;">
                    {{children}}
                </div>`;
            },
            styles: `
                .container {
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    transition: all 0.3s ease;
                }
                .container:active {
                    transform: scale(0.98);
                }
                @media (max-width: 768px) {
                    .container {
                        margin: 4px;
                        padding: 12px;
                    }
                }
            `
        };
    }

    // ایجاد کامپوننت دکمه
    createButtonComponent() {
        return {
            name: 'button',
            version: '1.2',
            mobileOptimized: true,
            props: {
                text: { type: 'string', default: 'Button' },
                type: { type: 'string', default: 'primary', values: ['primary', 'secondary', 'danger', 'success'] },
                size: { type: 'string', default: 'medium', values: ['small', 'medium', 'large'] },
                disabled: { type: 'boolean', default: false },
                loading: { type: 'boolean', default: false },
                icon: { type: 'string', default: '' }
            },
            template: function(props) {
                const loadingHTML = props.loading ? 
                    `<span class="button-spinner"></span>` : '';
                const iconHTML = props.icon ? 
                    `<span class="button-icon">${props.icon}</span>` : '';
                
                return `
                <button class="btn btn-${props.type} btn-${props.size}" 
                        ${props.disabled ? 'disabled' : ''}
                        style="touch-action: manipulation; user-select: none;">
                    ${loadingHTML}
                    ${iconHTML}
                    <span class="button-text">${props.text}</span>
                </button>`;
            },
            styles: `
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
                }
                .btn:active {
                    transform: translateY(2px);
                }
                .btn-small { padding: 8px 16px; font-size: 14px; }
                .btn-medium { padding: 12px 24px; font-size: 16px; }
                .btn-large { padding: 16px 32px; font-size: 18px; }
                .btn-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
                .btn-secondary { background: #f1f5f9; color: #64748b; }
                .btn-danger { background: #ef4444; color: white; }
                .btn-success { background: #10b981; color: white; }
                .btn:disabled { opacity: 0.5; cursor: not-allowed; }
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
                @media (max-width: 768px) {
                    .btn { min-height: 44px; } /* حداقل ارتفاع برای تاچ */
                }
            `
        };
    }

    // ایجاد کامپوننت ماشین حساب
    createCalculatorComponent() {
        return {
            name: 'calculator',
            version: '2.0',
            mobileOptimized: true,
            props: {
                theme: { type: 'string', default: 'light', values: ['light', 'dark'] },
                mode: { type: 'string', default: 'basic', values: ['basic', 'scientific', 'programmer'] },
                vibration: { type: 'boolean', default: true }
            },
            template: function(props) {
                const buttons = [
                    'C', '±', '%', '÷',
                    '7', '8', '9', '×',
                    '4', '5', '6', '-',
                    '1', '2', '3', '+',
                    '0', '.', '='
                ];
                
                return `
                <div class="calculator calculator-${props.theme}">
                    <div class="calculator-display">
                        <div class="calculator-expression">0</div>
                        <div class="calculator-result">0</div>
                    </div>
                    <div class="calculator-buttons">
                        ${buttons.map(btn => `
                            <button class="calculator-btn ${btn === '=' ? 'equals' : ''} ${['÷','×','-','+','='].includes(btn) ? 'operator' : ''}"
                                    data-action="${btn}"
                                    style="touch-action: manipulation;">
                                ${btn}
                            </button>
                        `).join('')}
                    </div>
                </div>`;
            },
            styles: `
                .calculator {
                    width: 100%;
                    max-width: 400px;
                    margin: 0 auto;
                    border-radius: 20px;
                    overflow: hidden;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                }
                .calculator-light { background: #f8f9fa; }
                .calculator-dark { background: #1a1a1a; color: white; }
                .calculator-display {
                    padding: 30px 20px;
                    text-align: right;
                    min-height: 120px;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-end;
                }
                .calculator-expression {
                    font-size: 18px;
                    opacity: 0.7;
                    min-height: 27px;
                }
                .calculator-result {
                    font-size: 48px;
                    font-weight: 300;
                    word-break: break-all;
                }
                .calculator-buttons {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 1px;
                    background: rgba(0,0,0,0.1);
                }
                .calculator-btn {
                    border: none;
                    padding: 20px;
                    font-size: 24px;
                    background: white;
                    cursor: pointer;
                    transition: all 0.1s;
                    user-select: none;
                }
                .calculator-dark .calculator-btn {
                    background: #2d2d2d;
                    color: white;
                }
                .calculator-btn:active {
                    filter: brightness(0.9);
                    transform: scale(0.95);
                }
                .calculator-btn.operator {
                    background: #f0f0f0;
                    color: #ff9500;
                }
                .calculator-dark .calculator-btn.operator {
                    background: #3d3d3d;
                }
                .calculator-btn.equals {
                    background: linear-gradient(135deg, #ff9500, #ff5e3a);
                    color: white;
                    grid-column: span 2;
                }
                @media (max-width: 768px) {
                    .calculator-btn { 
                        padding: 25px 20px; 
                        font-size: 28px; 
                        min-height: 70px;
                    }
                }
            `,
            logic: `
                class CalculatorLogic {
                    constructor(element) {
                        this.element = element;
                        this.currentInput = '0';
                        this.previousInput = '';
                        this.operation = null;
                        this.shouldResetScreen = false;
                        this.init();
                    }
                    
                    init() {
                        this.element.querySelectorAll('.calculator-btn').forEach(btn => {
                            btn.addEventListener('click', (e) => {
                                this.handleButton(e.target.dataset.action);
                                if(this.props.vibration && navigator.vibrate) {
                                    navigator.vibrate(10);
                                }
                            });
                            btn.addEventListener('touchstart', (e) => {
                                e.currentTarget.style.transform = 'scale(0.95)';
                            });
                            btn.addEventListener('touchend', (e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                            });
                        });
                    }
                    
                    handleButton(value) {
                        if (value >= '0' && value <= '9' || value === '.') {
                            this.appendNumber(value);
                        } else if (['÷','×','-','+'].includes(value)) {
                            this.chooseOperation(value);
                        } else if (value === '=') {
                            this.compute();
                        } else if (value === 'C') {
                            this.clear();
                        } else if (value === '±') {
                            this.negate();
                        } else if (value === '%') {
                            this.percentage();
                        }
                        this.updateDisplay();
                    }
                    
                    appendNumber(number) {
                        if (this.shouldResetScreen) {
                            this.currentInput = '';
                            this.shouldResetScreen = false;
                        }
                        if (number === '.' && this.currentInput.includes('.')) return;
                        this.currentInput = this.currentInput === '0' ? number : this.currentInput + number;
                    }
                    
                    chooseOperation(op) {
                        if (this.currentInput === '') return;
                        if (this.previousInput !== '') {
                            this.compute();
                        }
                        this.operation = op;
                        this.previousInput = this.currentInput;
                        this.shouldResetScreen = true;
                    }
                    
                    compute() {
                        let computation;
                        const prev = parseFloat(this.previousInput);
                        const current = parseFloat(this.currentInput);
                        if (isNaN(prev) || isNaN(current)) return;
                        
                        switch (this.operation) {
                            case '+': computation = prev + current; break;
                            case '-': computation = prev - current; break;
                            case '×': computation = prev * current; break;
                            case '÷': computation = prev / current; break;
                            default: return;
                        }
                        
                        this.currentInput = computation.toString();
                        this.operation = undefined;
                        this.previousInput = '';
                    }
                    
                    clear() {
                        this.currentInput = '0';
                        this.previousInput = '';
                        this.operation = null;
                    }
                    
                    negate() {
                        this.currentInput = (parseFloat(this.currentInput) * -1).toString();
                    }
                    
                    percentage() {
                        this.currentInput = (parseFloat(this.currentInput) / 100).toString();
                    }
                    
                    updateDisplay() {
                        const expressionEl = this.element.querySelector('.calculator-expression');
                        const resultEl = this.element.querySelector('.calculator-result');
                        
                        resultEl.textContent = this.currentInput;
                        expressionEl.textContent = this.previousInput + (this.operation || '');
                    }
                }
            `
        };
    }

    // ادامه کامپوننت‌ها...
    createNotesComponent() {
        return {
            name: 'notes',
            version: '1.5',
            mobileOptimized: true,
            props: {
                theme: { type: 'string', default: 'yellow', values: ['yellow', 'blue', 'green', 'pink'] },
                fontSize: { type: 'number', default: 16 },
                autoSave: { type: 'boolean', default: true }
            },
            // ... (کد کامل کامپوننت یادداشت)
        };
    }

    createTodoComponent() {
        return {
            name: 'todo',
            version: '1.3',
            mobileOptimized: true,
            props: {
                categories: { type: 'array', default: ['کار', 'شخصی', 'خرید'] },
                reminders: { type: 'boolean', default: true },
                sortBy: { type: 'string', default: 'date', values: ['date', 'priority', 'category'] }
            },
            // ... (کد کامل کامپوننت To-Do)
        };
    }

    // سیستم کامپایل
    setupCompiler() {
        this.compiler = {
            compile: (components, options = {}) => {
                const startTime = performance.now();
                
                // استخراج HTML
                let html = this.generateHTML(components);
                
                // استخراج CSS
                let css = this.generateCSS(components);
                
                // استخراج JavaScript
                let js = this.generateJS(components);
                
                // مینیفای
                if (options.minify) {
                    html = this.minifyHTML(html);
                    css = this.minifyCSS(css);
                    js = this.minifyJS(js);
                }
                
                // بهینه‌سازی برای موبایل
                if (this.currentPlatform === 'android' || this.currentPlatform === 'ios') {
                    html = this.optimizeForMobile(html);
                    css = this.addMobileCSS(css);
                    js = this.addMobileJS(js);
                }
                
                // تولید APK (اگر اندروید)
                if (this.compilerOptions.generateAPK && this.currentPlatform === 'android') {
                    this.generateAPK(html, css, js);
                }
                
                const endTime = performance.now();
                console.log(`⚡ Compilation completed in ${(endTime - startTime).toFixed(2)}ms`);
                
                return { html, css, js };
            },
            
            generateHTML: (components) => {
                let html = `<!DOCTYPE html><html lang="fa"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">`;
                html += `<title>اپ ساخته شده</title><style>{{css}}</style></head><body>`;
                html += `<div id="app">`;
                
                components.forEach(comp => {
                    html += this.renderComponent(comp);
                });
                
                html += `</div><script>{{js}}</script></body></html>`;
                return html;
            },
            
            renderComponent: (component) => {
                const compDef = this.getComponentDefinition(component.type);
                if (!compDef) return `<!-- کامپوننت ${component.type} یافت نشد -->`;
                
                let rendered = compDef.template(component.props || {});
                
                // اضافه کردن children
                if (component.children && component.children.length > 0) {
                    const childrenHTML = component.children.map(child => 
                        this.renderComponent(child)
                    ).join('');
                    rendered = rendered.replace('{{children}}', childrenHTML);
                }
                
                return rendered;
            },
            
            generateCSS: (components) => {
                let css = `* { box-sizing: border-box; margin: 0; padding: 0; }`;
                css += `body { font-family: 'Vazir', 'Segoe UI', sans-serif; line-height: 1.6; }`;
                css += `#app { max-width: 500px; margin: 0 auto; }`;
                
                // اضافه کردن استایل هر کامپوننت
                const uniqueComponents = [...new Set(components.map(c => c.type))];
                uniqueComponents.forEach(type => {
                    const compDef = this.getComponentDefinition(type);
                    if (compDef && compDef.styles) {
                        css += compDef.styles;
                    }
                });
                
                // استایل‌های responsive
                css += `
                @media (max-width: 768px) {
                    body { font-size: 14px; }
                    #app { padding: 10px; }
                }
                @media (max-width: 480px) {
                    body { font-size: 13px; }
                }
                `;
                
                return css;
            },
            
            generateJS: (components) => {
                let js = `document.addEventListener('DOMContentLoaded', function() {`;
                js += `console.log('اپ با موفقیت بارگذاری شد');`;
                
                // اضافه کردن منطق هر کامپوننت
                components.forEach(comp => {
                    const compDef = this.getComponentDefinition(comp.type);
                    if (compDef && compDef.logic) {
                        js += compDef.logic;
                    }
                });
                
                // منطق کلی
                js += `
                // مدیریت تاچ
                document.addEventListener('touchstart', function(e) {
                    if(e.touches.length > 1) e.preventDefault();
                }, { passive: false });
                
                // جلوگیری از زوم دوباره
                document.addEventListener('gesturestart', function(e) {
                    e.preventDefault();
                });
                
                // مدیریت back button
                window.addEventListener('popstate', function() {
                    if(confirm('آیا می‌خواهید خارج شوید؟')) {
                        window.close();
                    }
                });
                `;
                
                js += `});`;
                return js;
            },
            
            minifyHTML: (html) => {
                return html
                    .replace(/\n/g, ' ')
                    .replace(/\s+/g, ' ')
                    .replace(/<!--.*?-->/g, '')
                    .trim();
            },
            
            minifyCSS: (css) => {
                return css
                    .replace(/\n/g, ' ')
                    .replace(/\s+/g, ' ')
                    .replace(/\/\*.*?\*\//g, '')
                    .trim();
            },
            
            minifyJS: (js) => {
                return js
                    .replace(/\n/g, ' ')
                    .replace(/\s+/g, ' ')
                    .replace(/\/\/.*/g, '')
                    .trim();
            },
            
            optimizeForMobile: (html) => {
                // اضافه کردن meta tag برای موبایل
                html = html.replace(
                    '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
                    '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">'
                );
                
                // اضافه کردن touch icons
                html = html.replace(
                    '</head>',
                    '<link rel="apple-touch-icon" href="icon.png">\n<link rel="icon" href="icon.png">\n</head>'
                );
                
                return html;
            },
            
            addMobileCSS: (css) => {
                css += `
                /* بهینه‌سازی برای تاچ */
                button, input, select, textarea {
                    font-size: 16px; /* جلوگیری از زوم در iOS */
                }
                
                /* حداقل اندازه برای عناصر قابل کلیک */
                a, button, [role="button"] {
                    min-height: 44px;
                    min-width: 44px;
                }
                
                /* جلوگیری از highlight آبی در تاچ */
                * {
                    -webkit-tap-highlight-color: transparent;
                }
                
                /* پشتیبانی از notch */
                @supports (padding: max(0px)) {
                    body {
                        padding-left: max(12px, env(safe-area-inset-left));
                        padding-right: max(12px, env(safe-area-inset-right));
                        padding-bottom: max(12px, env(safe-area-inset-bottom));
                    }
                }
                `;
                return css;
            },
            
            addMobileJS: (js) => {
                js += `
                // تشخیص نوع دستگاه
                const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
                const isAndroid = /Android/i.test(navigator.userAgent);
                
                // مدیریت وضعیت شبکه
                window.addEventListener('online', () => {
                    showToast('اتصال اینترنت برقرار شد');
                });
                
                window.addEventListener('offline', () => {
                    showToast('اتصال اینترنت قطع شد');
                });
                
                // ذخیره‌سازی آفلاین
                if('serviceWorker' in navigator) {
                    navigator.serviceWorker.register('/service-worker.js');
                }
                
                // نمایش toast
                function showToast(message) {
                    const toast = document.createElement('div');
                    toast.textContent = message;
                    toast.style.cssText = \`
                        position: fixed;
                        bottom: 20px;
                        left: 50%;
                        transform: translateX(-50%);
                        background: rgba(0,0,0,0.8);
                        color: white;
                        padding: 12px 24px;
                        border-radius: 25px;
                        z-index: 1000;
                        animation: fadeInOut 3s;
                    \`;
                    document.body.appendChild(toast);
                    setTimeout(() => toast.remove(), 3000);
                }
                `;
                return js;
            }
        };
    }

    // تولید APK
    generateAPK(html, css, js) {
        console.log('🔨 Generating APK structure...');
        
        const apkStructure = {
            assets: {
                'index.html': html,
                'style.css': css,
                'app.js': js,
                'icon.png': 'base64_encoded_icon_here',
                'manifest.json': JSON.stringify({
                    name: 'ساخته شده با اپ‌ساز',
                    short_name: 'اپ‌ساز',
                    start_url: './index.html',
                    display: 'standalone',
                    background_color: '#ffffff',
                    theme_color: '#2196f3'
                }, null, 2)
            },
            config: {
                versionCode: 1,
                versionName: '1.0.0',
                packageName: 'com.appbuilder.generated',
                minSdkVersion: 21,
                targetSdkVersion: 33
            }
        };
        
        console.log('✅ APK structure ready for building');
        return apkStructure;
    }

    // سیستم Hot Reload
    setupHotReload() {
        if (window.WebSocket) {
            try {
                this.ws = new WebSocket('ws://localhost:8080');
                this.ws.onmessage = (event) => {
                    if (event.data === 'reload') {
                        window.location.reload();
                    }
                };
            } catch (e) {
                console.log('Hot reload disabled (not in development mode)');
            }
        }
    }

    // بارگذاری قالب‌ها
    loadTemplates() {
        this.templatesCache = {
            'notes-app': this.createNotesTemplate(),
            'calculator-app': this.createCalculatorTemplate(),
            'todo-app': this.createTodoTemplate(),
            'weather-app': this.createWeatherTemplate(),
            'expense-tracker': this.createExpenseTrackerTemplate()
        };
    }

    createNotesTemplate() {
        return {
            name: 'برنامه یادداشت',
            description: 'برنامه ساده برای نوشتن و مدیریت یادداشت‌ها',
            components: [
                { type: 'container', props: { direction: 'column' }, children: [
                    { type: 'navbar', props: { title: 'یادداشت‌ها', showBack: false } },
                    { type: 'input', props: { placeholder: 'عنوان یادداشت...' } },
                    { type: 'editor', props: { placeholder: 'متن یادداشت...', height: 300 } },
                    { type: 'button', props: { text: 'ذخیره', type: 'primary' } },
                    { type: 'list', props: { items: [], showIcons: true } }
                ]}
            ]
        };
    }

    // دریافت تعریف کامپوننت
    getComponentDefinition(type) {
        // جستجو در تمام دسته‌بندی‌ها
        for (const category in this.componentsLibrary) {
            if (this.componentsLibrary[category][type]) {
                return this.componentsLibrary[category][type];
            }
        }
        return null;
    }

    // کامپایل اپ از قالب
    compileFromTemplate(templateName, customizations = {}) {
        const template = this.templatesCache[templateName];
        if (!template) {
            throw new Error(`قالب ${templateName} یافت نشد`);
        }

        // اعمال تغییرات سفارشی
        const components = this.applyCustomizations(template.components, customizations);
        
        // کامپایل
        return this.compiler.compile(components, this.compilerOptions);
    }

    // اعمال تغییرات سفارشی
    applyCustomizations(components, customizations) {
        const applyToComponent = (comp) => {
            // اگر کامپوننت در تغییرات سفارشی وجود دارد
            if (customizations[comp.type]) {
                comp.props = { ...comp.props, ...customizations[comp.type] };
            }
            
            // اعمال به children
            if (comp.children) {
                comp.children = comp.children.map(child => applyToComponent(child));
            }
            
            return comp;
        };
        
        return components.map(comp => applyToComponent(comp));
    }

    // پیش‌نمایش زنده
    startLivePreview(containerId, templateName) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('کانتینر پیش‌نمایش یافت نشد');
            return;
        }

        const template = this.templatesCache[templateName];
        if (!template) return;

        // رندر اولیه
        this.renderPreview(container, template.components);

        // رندر مجدد هنگام تغییر
        this.setupPreviewUpdates(container, template.components);
    }

    renderPreview(container, components) {
        container.innerHTML = '';
        
        components.forEach(comp => {
            const compDef = this.getComponentDefinition(comp.type);
            if (compDef) {
                const element = document.createElement('div');
                element.innerHTML = compDef.template(comp.props || {});
                container.appendChild(element.firstElementChild);
            }
        });
    }

    setupPreviewUpdates(container, components) {
        // شبیه‌سازی رندر مجدد در تغییرات
        setInterval(() => {
            // در حالت واقعی اینجا تغییرات را تشخیص می‌دهیم
            this.renderPreview(container, components);
        }, 1000);
    }

    // دریافت اطلاعات سیستم
    getSystemInfo() {
        return {
            engineVersion: this.version,
            platform: this.currentPlatform,
            userAgent: navigator.userAgent,
            screenSize: `${window.innerWidth}x${window.innerHeight}`,
            dpr: window.devicePixelRatio,
            memory: performance.memory ? `${Math.round(performance.memory.usedJSHeapSize / 1048576)}MB` : 'N/A',
            componentsCount: Object.keys(this.componentsLibrary).reduce((sum, cat) => 
                sum + Object.keys(this.componentsLibrary[cat]).length, 0
            ),
            templatesCount: Object.keys(this.templatesCache).length
        };
    }

    // تست عملکرد
    runBenchmark() {
        const start = performance.now();
        
        // تست کامپایل
        const testComponents = [
            { type: 'container', props: { direction: 'column' } },
            { type: 'button', props: { text: 'تست', type: 'primary' } }
        ];
        
        this.compiler.compile(testComponents, { minify: false });
        
        const end = performance.now();
        return {
            compileTime: `${(end - start).toFixed(2)}ms`,
            performance: end - start < 100 ? 'عالی' : end - start < 500 ? 'خوب' : 'نیاز به بهبود'
        };
    }

    // به‌روزرسانی موتور
    updateEngine(newVersion) {
        console.log(`🔄 Updating engine to v${newVersion}...`);
        
        // ذخیره وضعیت فعلی
        const currentState = this.saveState();
        
        // به‌روزرسانی
        this.version = newVersion;
        
        // بارگذاری مجدد
        this.initEngine();
        
        // بازیابی وضعیت
        this.loadState(currentState);
        
        console.log(`✅ Engine updated to v${newVersion}`);
    }

    saveState() {
        return {
            platform: this.currentPlatform,
            options: this.compilerOptions,
            components: Object.keys(this.componentsLibrary)
        };
    }

    loadState(state) {
        if (state.platform) this.currentPlatform = state.platform;
        if (state.options) this.compilerOptions = { ...this.compilerOptions, ...state.options };
    }

    // راه‌اندازی
    start() {
        console.log(`🚀 AppBuilder Engine v${this.version} started`);
        console.log(`📱 Platform: ${this.currentPlatform}`);
        console.log(`📦 Components: ${this.getSystemInfo().componentsCount}`);
        
        return this;
    }
}

// ایجاد instance جهانی
window.AppBuilderEngine = new AppBuilderEngine().start();

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppBuilderEngine;
                                                                     }
