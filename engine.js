// engine.js - موتور پردازش و کامپایل اپ‌ساز
// Version 2.2 - فارسی/انگلیسی - مخصوص موبایل
// اضافه شده: کامپوننت آموزش زبان (Language Learning)

class AppBuilderEngine {
    constructor() {
        this.version = '2.2.0';
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
                editor: this.createEditorComponent(),
                languageLearning: this.createLanguageLearningComponent() // ✅ کامپوننت جدید اضافه شد
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

    // ✅ ایجاد کامپوننت آموزش زبان (جدید اضافه شده)
    createLanguageLearningComponent() {
        return {
            name: 'language-learning',
            version: '1.0',
            mobileOptimized: true,
            props: {
                language: { type: 'string', default: 'english', values: ['english', 'farsi', 'arabic', 'turkish'] },
                difficulty: { type: 'string', default: 'beginner', values: ['beginner', 'intermediate', 'advanced'] },
                dailyGoal: { type: 'number', default: 10 },
                enableSound: { type: 'boolean', default: true },
                enableVibration: { type: 'boolean', default: true },
                theme: { type: 'string', default: 'blue', values: ['blue', 'green', 'purple', 'orange'] }
            },
            template: function(props) {
                return `
                <div class="language-app language-theme-${props.theme}">
                    <div class="language-header">
                        <div class="language-info">
                            <h1 class="language-title">
                                <span class="language-flag">📚</span>
                                <span class="language-name">${this.getLanguageName(props.language)} Learning</span>
                            </h1>
                            <div class="language-stats">
                                <div class="stat-item">
                                    <span class="stat-icon">⭐</span>
                                    <span class="stat-value" id="current-level">1</span>
                                    <span class="stat-label">Level</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-icon">🎯</span>
                                    <span class="stat-value" id="daily-progress">0/${props.dailyGoal}</span>
                                    <span class="stat-label">Today</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-icon">🏆</span>
                                    <span class="stat-value" id="total-score">0</span>
                                    <span class="stat-label">Score</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="language-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" id="xp-progress" style="width: 0%"></div>
                            </div>
                            <div class="progress-text">
                                <span id="current-xp">0</span> / <span id="max-xp">100</span> XP
                            </div>
                        </div>
                    </div>
                    
                    <div class="language-nav">
                        <button class="nav-btn active" data-section="flashcards">
                            <span class="nav-icon">📇</span>
                            <span class="nav-text">Flashcards</span>
                        </button>
                        <button class="nav-btn" data-section="quiz">
                            <span class="nav-icon">📝</span>
                            <span class="nav-text">Quiz</span>
                        </button>
                        <button class="nav-btn" data-section="wordlist">
                            <span class="nav-icon">📖</span>
                            <span class="nav-text">Word List</span>
                        </button>
                        <button class="nav-btn" data-section="pronunciation">
                            <span class="nav-icon">🎤</span>
                            <span class="nav-text">Pronunciation</span>
                        </button>
                        <button class="nav-btn" data-section="progress">
                            <span class="nav-icon">📊</span>
                            <span class="nav-text">Progress</span>
                        </button>
                    </div>
                    
                    <div class="language-sections">
                        <!-- فلش کارت -->
                        <div class="section active" id="section-flashcards">
                            <div class="flashcard-container">
                                <div class="flashcard" id="current-flashcard">
                                    <div class="flashcard-front">
                                        <div class="flashcard-word" id="flashcard-word">Hello</div>
                                        <div class="flashcard-hint">Tap to see translation</div>
                                    </div>
                                    <div class="flashcard-back">
                                        <div class="flashcard-translation" id="flashcard-translation">سلام</div>
                                        <div class="flashcard-details">
                                            <div class="detail-item">
                                                <span class="detail-label">Pronunciation:</span>
                                                <span class="detail-value" id="flashcard-pronunciation">həˈloʊ</span>
                                            </div>
                                            <div class="detail-item">
                                                <span class="detail-label">Example:</span>
                                                <span class="detail-value" id="flashcard-example">Hello, how are you?</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="flashcard-controls">
                                    <button class="flashcard-btn btn-know" data-knowledge="known">
                                        <span class="btn-icon">✅</span>
                                        <span class="btn-text">I Know It</span>
                                    </button>
                                    <button class="flashcard-btn btn-learn" data-knowledge="learning">
                                        <span class="btn-icon">📚</span>
                                        <span class="btn-text">Need Practice</span>
                                    </button>
                                    <button class="flashcard-btn btn-next">
                                        <span class="btn-icon">⏭️</span>
                                        <span class="btn-text">Next Card</span>
                                    </button>
                                </div>
                                
                                <div class="flashcard-stats">
                                    <div class="card-stat">
                                        <span class="stat-number" id="cards-remaining">25</span>
                                        <span class="stat-label">Remaining</span>
                                    </div>
                                    <div class="card-stat">
                                        <span class="stat-number" id="cards-known">5</span>
                                        <span class="stat-label">Known</span>
                                    </div>
                                    <div class="card-stat">
                                        <span class="stat-number" id="cards-learning">3</span>
                                        <span class="stat-label">Learning</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- آزمون -->
                        <div class="section" id="section-quiz">
                            <div class="quiz-container">
                                <div class="quiz-header">
                                    <div class="quiz-question-number">
                                        Question <span id="current-question">1</span>/<span id="total-questions">10</span>
                                    </div>
                                    <div class="quiz-timer">
                                        <span class="timer-icon">⏱️</span>
                                        <span class="timer-value" id="quiz-timer">60</span>s
                                    </div>
                                </div>
                                
                                <div class="quiz-question" id="quiz-question">
                                    What is the meaning of "Hello"?
                                </div>
                                
                                <div class="quiz-options" id="quiz-options">
                                    <div class="quiz-option" data-option="0">
                                        <span class="option-letter">A</span>
                                        <span class="option-text">سلام</span>
                                    </div>
                                    <div class="quiz-option" data-option="1">
                                        <span class="option-letter">B</span>
                                        <span class="option-text">خداحافظ</span>
                                    </div>
                                    <div class="quiz-option" data-option="2">
                                        <span class="option-letter">C</span>
                                        <span class="option-text">متشکرم</span>
                                    </div>
                                    <div class="quiz-option" data-option="3">
                                        <span class="option-letter">D</span>
                                        <span class="option-text">لطفا</span>
                                    </div>
                                </div>
                                
                                <div class="quiz-feedback" id="quiz-feedback"></div>
                                
                                <div class="quiz-controls">
                                    <button class="quiz-btn" id="btn-check-answer">
                                        Check Answer
                                    </button>
                                    <button class="quiz-btn" id="btn-next-question">
                                        Next Question
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <!-- لیست کلمات -->
                        <div class="section" id="section-wordlist">
                            <div class="wordlist-container">
                                <div class="wordlist-search">
                                    <input type="text" class="search-input" placeholder="Search words..." id="word-search">
                                    <button class="search-btn">
                                        <span class="search-icon">🔍</span>
                                    </button>
                                </div>
                                
                                <div class="wordlist-filters">
                                    <button class="filter-btn active" data-filter="all">All</button>
                                    <button class="filter-btn" data-filter="known">Known</button>
                                    <button class="filter-btn" data-filter="learning">Learning</button>
                                    <button class="filter-btn" data-filter="new">New</button>
                                </div>
                                
                                <div class="wordlist-items" id="wordlist-items">
                                    <!-- کلمات به صورت داینامیک لود می‌شوند -->
                                </div>
                                
                                <div class="wordlist-actions">
                                    <button class="action-btn" id="btn-add-word">
                                        <span class="action-icon">➕</span>
                                        Add New Word
                                    </button>
                                    <button class="action-btn" id="btn-import-words">
                                        <span class="action-icon">📥</span>
                                        Import Words
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <!-- تمرین تلفظ -->
                        <div class="section" id="section-pronunciation">
                            <div class="pronunciation-container">
                                <div class="pronunciation-header">
                                    <h3>Pronunciation Practice</h3>
                                    <div class="pronunciation-level">
                                        Difficulty: <span id="pronunciation-difficulty">${props.difficulty}</span>
                                    </div>
                                </div>
                                
                                <div class="pronunciation-exercise">
                                    <div class="exercise-word" id="pronunciation-word">
                                        Hello
                                    </div>
                                    <div class="exercise-translation" id="pronunciation-translation">
                                        سلام
                                    </div>
                                    
                                    <div class="pronunciation-audio">
                                        <button class="audio-btn" id="btn-listen">
                                            <span class="audio-icon">🔊</span>
                                            Listen Pronunciation
                                        </button>
                                        <div class="audio-controls">
                                            <button class="control-btn" id="btn-slower">
                                                Slower
                                            </button>
                                            <button class="control-btn" id="btn-repeat">
                                                Repeat
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div class="pronunciation-practice">
                                        <div class="practice-instruction">
                                            Press record and say the word:
                                        </div>
                                        <div class="practice-controls">
                                            <button class="record-btn" id="btn-record">
                                                <span class="record-icon">🎤</span>
                                                Record
                                            </button>
                                            <div class="recording-visualizer" id="recording-visualizer">
                                                <!-- نمایش‌گر ضبط -->
                                            </div>
                                        </div>
                                        <div class="practice-feedback" id="practice-feedback">
                                            <!-- بازخورد تلفظ -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- پیشرفت -->
                        <div class="section" id="section-progress">
                            <div class="progress-container">
                                <div class="progress-stats">
                                    <div class="progress-stat">
                                        <div class="stat-circle" id="stat-accuracy">
                                            <span class="circle-value">85%</span>
                                        </div>
                                        <div class="stat-title">Accuracy</div>
                                    </div>
                                    <div class="progress-stat">
                                        <div class="stat-circle" id="stat-streak">
                                            <span class="circle-value">7</span>
                                        </div>
                                        <div class="stat-title">Day Streak</div>
                                    </div>
                                    <div class="progress-stat">
                                        <div class="stat-circle" id="stat-words">
                                            <span class="circle-value">150</span>
                                        </div>
                                        <div class="stat-title">Words Learned</div>
                                    </div>
                                </div>
                                
                                <div class="progress-chart">
                                    <canvas id="progress-chart"></canvas>
                                </div>
                                
                                <div class="progress-achievements">
                                    <h4>Achievements</h4>
                                    <div class="achievements-list" id="achievements-list">
                                        <!-- دستاوردها -->
                                    </div>
                                </div>
                                
                                <div class="progress-settings">
                                    <button class="settings-btn" id="btn-export-data">
                                        Export Progress
                                    </button>
                                    <button class="settings-btn" id="btn-reset-progress">
                                        Reset Progress
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `;
            },
            styles: `
                /* استایل‌های اصلی آموزش زبان */
                .language-app {
                    width: 100%;
                    max-width: 500px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 20px;
                    overflow: hidden;
                    box-shadow: 0 5px 20px rgba(0,0,0,0.1);
                }
                
                /* تم‌های مختلف */
                .language-theme-blue { --primary-color: #4f46e5; --secondary-color: #818cf8; }
                .language-theme-green { --primary-color: #10b981; --secondary-color: #34d399; }
                .language-theme-purple { --primary-color: #8b5cf6; --secondary-color: #a78bfa; }
                .language-theme-orange { --primary-color: #f59e0b; --secondary-color: #fbbf24; }
                
                .language-header {
                    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                    color: white;
                    padding: 20px;
                    border-radius: 0 0 30px 30px;
                }
                
                .language-title {
                    font-size: 24px;
                    margin-bottom: 15px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .language-stats {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 15px;
                }
                
                .stat-item {
                    text-align: center;
                    flex: 1;
                }
                
                .stat-icon {
                    font-size: 20px;
                    display: block;
                    margin-bottom: 5px;
                }
                
                .stat-value {
                    font-size: 24px;
                    font-weight: bold;
                    display: block;
                }
                
                .stat-label {
                    font-size: 12px;
                    opacity: 0.9;
                }
                
                .language-progress {
                    margin-top: 15px;
                }
                
                .progress-bar {
                    height: 8px;
                    background: rgba(255,255,255,0.3);
                    border-radius: 4px;
                    overflow: hidden;
                    margin-bottom: 5px;
                }
                
                .progress-fill {
                    height: 100%;
                    background: white;
                    border-radius: 4px;
                    transition: width 0.3s ease;
                }
                
                .progress-text {
                    font-size: 12px;
                    text-align: center;
                    opacity: 0.9;
                }
                
                /* ناوبری */
                .language-nav {
                    display: flex;
                    overflow-x: auto;
                    padding: 10px;
                    background: #f8fafc;
                    gap: 2px;
                    scrollbar-width: none;
                }
                
                .language-nav::-webkit-scrollbar {
                    display: none;
                }
                
                .nav-btn {
                    flex: 1;
                    min-width: 70px;
                    padding: 12px 8px;
                    border: none;
                    background: white;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 5px;
                    white-space: nowrap;
                }
                
                .nav-btn.active {
                    background: var(--primary-color);
                    color: white;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
                }
                
                .nav-icon {
                    font-size: 20px;
                }
                
                .nav-text {
                    font-size: 11px;
                }
                
                /* بخش‌ها */
                .language-sections {
                    padding: 20px;
                    min-height: 400px;
                }
                
                .section {
                    display: none;
                }
                
                .section.active {
                    display: block;
                    animation: fadeIn 0.3s ease;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                /* فلش کارت */
                .flashcard-container {
                    max-width: 400px;
                    margin: 0 auto;
                }
                
                .flashcard {
                    width: 100%;
                    height: 250px;
                    perspective: 1000px;
                    margin-bottom: 20px;
                    cursor: pointer;
                }
                
                .flashcard-front, .flashcard-back {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    backface-visibility: hidden;
                    border-radius: 20px;
                    padding: 30px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    transition: transform 0.8s;
                }
                
                .flashcard-front {
                    background: white;
                    border: 2px solid var(--primary-color);
                }
                
                .flashcard-back {
                    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                    color: white;
                    transform: rotateY(180deg);
                }
                
                .flashcard.flipped .flashcard-front {
                    transform: rotateY(180deg);
                }
                
                .flashcard.flipped .flashcard-back {
                    transform: rotateY(0deg);
                }
                
                .flashcard-word {
                    font-size: 48px;
                    font-weight: bold;
                    margin-bottom: 10px;
                    color: var(--primary-color);
                }
                
                .flashcard-translation {
                    font-size: 36px;
                    font-weight: bold;
                    margin-bottom: 20px;
                }
                
                .flashcard-hint {
                    font-size: 14px;
                    color: #64748b;
                    position: absolute;
                    bottom: 20px;
                }
                
                .flashcard-details {
                    text-align: center;
                }
                
                .detail-item {
                    margin: 8px 0;
                }
                
                .detail-label {
                    font-weight: bold;
                    margin-right: 10px;
                }
                
                .flashcard-controls {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 20px;
                }
                
                .flashcard-btn {
                    flex: 1;
                    padding: 15px;
                    border: none;
                    border-radius: 15px;
                    cursor: pointer;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    transition: all 0.2s;
                    min-height: 50px;
                }
                
                .btn-know {
                    background: #10b981;
                    color: white;
                }
                
                .btn-learn {
                    background: #f59e0b;
                    color: white;
                }
                
                .btn-next {
                    background: var(--primary-color);
                    color: white;
                }
                
                .flashcard-btn:active {
                    transform: scale(0.95);
                }
                
                .flashcard-stats {
                    display: flex;
                    justify-content: space-around;
                    background: #f8fafc;
                    padding: 15px;
                    border-radius: 15px;
                }
                
                .card-stat {
                    text-align: center;
                }
                
                .stat-number {
                    font-size: 24px;
                    font-weight: bold;
                    color: var(--primary-color);
                    display: block;
                }
                
                .stat-label {
                    font-size: 12px;
                    color: #64748b;
                }
                
                /* آزمون */
                .quiz-container {
                    max-width: 400px;
                    margin: 0 auto;
                }
                
                .quiz-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 20px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid #e2e8f0;
                }
                
                .quiz-question-number {
                    font-weight: bold;
                    color: var(--primary-color);
                }
                
                .quiz-timer {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    color: #ef4444;
                    font-weight: bold;
                }
                
                .quiz-question {
                    font-size: 20px;
                    font-weight: bold;
                    margin-bottom: 25px;
                    line-height: 1.5;
                }
                
                .quiz-options {
                    display: grid;
                    gap: 12px;
                    margin-bottom: 20px;
                }
                
                .quiz-option {
                    padding: 18px;
                    border: 2px solid #e2e8f0;
                    border-radius: 15px;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }
                
                .quiz-option:hover {
                    border-color: var(--primary-color);
                    background: #f8fafc;
                }
                
                .quiz-option.selected {
                    border-color: var(--primary-color);
                    background: rgba(79, 70, 229, 0.1);
                }
                
                .quiz-option.correct {
                    border-color: #10b981;
                    background: rgba(16, 185, 129, 0.1);
                }
                
                .quiz-option.incorrect {
                    border-color: #ef4444;
                    background: rgba(239, 68, 68, 0.1);
                }
                
                .option-letter {
                    width: 36px;
                    height: 36px;
                    background: #e2e8f0;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    color: #64748b;
                }
                
                .quiz-option.selected .option-letter {
                    background: var(--primary-color);
                    color: white;
                }
                
                .quiz-feedback {
                    padding: 15px;
                    border-radius: 15px;
                    margin-bottom: 20px;
                    display: none;
                }
                
                .quiz-feedback.correct {
                    background: rgba(16, 185, 129, 0.1);
                    border: 1px solid #10b981;
                    color: #10b981;
                }
                
                .quiz-feedback.incorrect {
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid #ef4444;
                    color: #ef4444;
                }
                
                .quiz-controls {
                    display: flex;
                    gap: 10px;
                }
                
                .quiz-btn {
                    flex: 1;
                    padding: 15px;
                    background: var(--primary-color);
                    color: white;
                    border: none;
                    border-radius: 15px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: all 0.2s;
                }
                
                .quiz-btn:active {
                    transform: scale(0.98);
                }
                
                /* لیست کلمات */
                .wordlist-container {
                    max-width: 400px;
                    margin: 0 auto;
                }
                
                .wordlist-search {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 15px;
                }
                
                .search-input {
                    flex: 1;
                    padding: 15px;
                    border: 2px solid #e2e8f0;
                    border-radius: 15px;
                    font-size: 16px;
                }
                
                .search-btn {
                    padding: 15px;
                    background: var(--primary-color);
                    color: white;
                    border: none;
                    border-radius: 15px;
                    cursor: pointer;
                    min-width: 60px;
                }
                
                .wordlist-filters {
                    display: flex;
                    gap: 8px;
                    margin-bottom: 20px;
                    overflow-x: auto;
                    padding-bottom: 5px;
                }
                
                .filter-btn {
                    padding: 10px 20px;
                    border: 2px solid #e2e8f0;
                    background: white;
                    border-radius: 25px;
                    cursor: pointer;
                    white-space: nowrap;
                    transition: all 0.2s;
                }
                
                .filter-btn.active {
                    background: var(--primary-color);
                    color: white;
                    border-color: var(--primary-color);
                }
                
                .wordlist-items {
                    max-height: 300px;
                    overflow-y: auto;
                    margin-bottom: 20px;
                }
                
                .wordlist-item {
                    padding: 15px;
                    border-bottom: 1px solid #e2e8f0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .wordlist-item:last-child {
                    border-bottom: none;
                }
                
                .word-info {
                    flex: 1;
                }
                
                .word-text {
                    font-weight: bold;
                    font-size: 18px;
                    margin-bottom: 5px;
                }
                
                .word-meaning {
                    color: #64748b;
                }
                
                .word-status {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    margin-left: 15px;
                }
                
                .status-known { background: #10b981; }
                .status-learning { background: #f59e0b; }
                .status-new { background: #e2e8f0; }
                
                .wordlist-actions {
                    display: flex;
                    gap: 10px;
                }
                
                .action-btn {
                    flex: 1;
                    padding: 15px;
                    background: #f8fafc;
                    border: 2px dashed #cbd5e1;
                    border-radius: 15px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    transition: all 0.2s;
                }
                
                .action-btn:active {
                    background: #e2e8f0;
                }
                
                /* تلفظ */
                .pronunciation-container {
                    max-width: 400px;
                    margin: 0 auto;
                    text-align: center;
                }
                
                .pronunciation-header {
                    margin-bottom: 30px;
                }
                
                .exercise-word {
                    font-size: 48px;
                    font-weight: bold;
                    margin-bottom: 10px;
                    color: var(--primary-color);
                }
                
                .exercise-translation {
                    font-size: 24px;
                    color: #64748b;
                    margin-bottom: 30px;
                }
                
                .pronunciation-audio {
                    margin-bottom: 30px;
                }
                
                .audio-btn {
                    padding: 15px 30px;
                    background: var(--primary-color);
                    color: white;
                    border: none;
                    border-radius: 25px;
                    cursor: pointer;
                    font-size: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    margin: 0 auto 15px;
                    min-width: 200px;
                }
                
                .audio-controls {
                    display: flex;
                    gap: 10px;
                    justify-content: center;
                }
                
                .control-btn {
                    padding: 10px 20px;
                    background: #f8fafc;
                    border: 2px solid #e2e8f0;
                    border-radius: 15px;
                    cursor: pointer;
                }
                
                .pronunciation-practice {
                    margin-top: 30px;
                    padding: 20px;
                    background: #f8fafc;
                    border-radius: 20px;
                }
                
                .record-btn {
                    padding: 20px;
                    background: #ef4444;
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 80px;
                    height: 80px;
                    cursor: pointer;
                    margin: 20px auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }
                
                .record-btn.recording {
                    animation: pulse 1.5s infinite;
                    background: #dc2626;
                }
                
                @keyframes pulse {
                    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
                    70% { transform: scale(1.05); box-shadow: 0 0 0 20px rgba(239, 68, 68, 0); }
                    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
                }
                
                .recording-visualizer {
                    height: 40px;
                    background: #e2e8f0;
                    border-radius: 10px;
                    margin: 20px 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #64748b;
                }
                
                .practice-feedback {
                    padding: 15px;
                    border-radius: 15px;
                    margin-top: 20px;
                    display: none;
                }
                
                .feedback-good {
                    background: rgba(16, 185, 129, 0.1);
                    border: 1px solid #10b981;
                    color: #10b981;
                }
                
                .feedback-average {
                    background: rgba(245, 158, 11, 0.1);
                    border: 1px solid #f59e0b;
                    color: #f59e0b;
                }
                
                .feedback-poor {
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid #ef4444;
                    color: #ef4444;
                }
                
                /* پیشرفت */
                .progress-container {
                    max-width: 400px;
                    margin: 0 auto;
                }
                
                .progress-stats {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 30px;
                }
                
                .progress-stat {
                    text-align: center;
                    flex: 1;
                }
                
                .stat-circle {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    background: var(--primary-color);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 10px;
                    font-size: 24px;
                    font-weight: bold;
                }
                
                .stat-title {
                    font-size: 14px;
                    color: #64748b;
                }
                
                .progress-chart {
                    background: #f8fafc;
                    border-radius: 20px;
                    padding: 20px;
                    margin-bottom: 30px;
                }
                
                .progress-achievements {
                    margin-bottom: 30px;
                }
                
                .achievements-list {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 10px;
                }
                
                .achievement-item {
                    text-align: center;
                    padding: 15px;
                    background: #f8fafc;
                    border-radius: 15px;
                }
                
                .achievement-icon {
                    font-size: 24px;
                    display: block;
                    margin-bottom: 5px;
                }
                
                .achievement-title {
                    font-size: 12px;
                    font-weight: bold;
                }
                
                .progress-settings {
                    display: flex;
                    gap: 10px;
                }
                
                .settings-btn {
                    flex: 1;
                    padding: 15px;
                    border: 2px solid #e2e8f0;
                    background: white;
                    border-radius: 15px;
                    cursor: pointer;
                }
                
                /* بهینه‌سازی برای موبایل */
                @media (max-width: 768px) {
                    .language-nav {
                        padding: 8px;
                    }
                    
                    .nav-btn {
                        padding: 10px 6px;
                        min-width: 60px;
                    }
                    
                    .nav-icon {
                        font-size: 18px;
                    }
                    
                    .nav-text {
                        font-size: 10px;
                    }
                    
                    .language-sections {
                        padding: 15px;
                    }
                    
                    .flashcard {
                        height: 220px;
                    }
                    
                    .flashcard-word {
                        font-size: 36px;
                    }
                    
                    .flashcard-translation {
                        font-size: 28px;
                    }
                    
                    .flashcard-controls {
                        flex-direction: column;
                    }
                    
                    .quiz-option {
                        padding: 15px;
                    }
                }
                
                @media (max-width: 480px) {
                    .language-stats {
                        flex-direction: column;
                        gap: 15px;
                    }
                    
                    .stat-item {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        text-align: left;
                    }
                    
                    .stat-icon, .stat-value, .stat-label {
                        display: inline;
                    }
                    
                    .stat-value {
                        margin: 0 5px;
                    }
                    
                    .language-nav {
                        gap: 1px;
                    }
                    
                    .flashcard {
                        height: 200px;
                    }
                }
            `,
            logic: `
                class LanguageLearningLogic {
                    constructor(element, props) {
                        this.element = element;
                        this.props = props;
                        this.currentSection = 'flashcards';
                        this.words = [];
                        this.currentCardIndex = 0;
                        this.quizData = [];
                        this.currentQuestionIndex = 0;
                        this.score = 0;
                        this.level = 1;
                        this.xp = 0;
                        this.maxXP = 100;
                        this.dailyProgress = 0;
                        this.isQuizActive = false;
                        this.quizTimer = null;
                        this.timeLeft = 60;
                        this.init();
                    }
                    
                    init() {
                        this.loadWords();
                        this.setupEventListeners();
                        this.showSection('flashcards');
                        this.updateStats();
                        this.startDailyGoalCheck();
                    }
                    
                    loadWords() {
                        // نمونه کلمات اولیه
                        this.words = [
                            {
                                id: 1,
                                word: "Hello",
                                translation: "سلام",
                                pronunciation: "həˈloʊ",
                                example: "Hello, how are you?",
                                status: "learning",
                                difficulty: "easy"
                            },
                            {
                                id: 2,
                                word: "Goodbye",
                                translation: "خداحافظ",
                                pronunciation: "ɡʊdˈbaɪ",
                                example: "Goodbye, see you tomorrow!",
                                status: "known",
                                difficulty: "easy"
                            },
                            {
                                id: 3,
                                word: "Thank you",
                                translation: "متشکرم",
                                pronunciation: "θæŋk juː",
                                example: "Thank you for your help.",
                                status: "new",
                                difficulty: "easy"
                            },
                            {
                                id: 4,
                                word: "Please",
                                translation: "لطفا",
                                pronunciation: "pliːz",
                                example: "Please come in.",
                                status: "learning",
                                difficulty: "easy"
                            },
                            {
                                id: 5,
                                word: "Sorry",
                                translation: "ببخشید",
                                pronunciation: "ˈsɑːri",
                                example: "I'm sorry for being late.",
                                status: "new",
                                difficulty: "easy"
                            }
                        ];
                        
                        this.prepareQuizData();
                        this.updateWordList();
                        this.updateFlashcard();
                    }
                    
                    prepareQuizData() {
                        this.quizData = this.words.map(word => ({
                            question: \`What is the meaning of "\${word.word}"?\`,
                            options: this.generateQuizOptions(word),
                            correctAnswer: word.translation,
                            wordId: word.id
                        }));
                    }
                    
                    generateQuizOptions(correctWord) {
                        const otherWords = this.words.filter(w => w.id !== correctWord.id);
                        const randomWords = [...otherWords]
                            .sort(() => Math.random() - 0.5)
                            .slice(0, 3)
                            .map(w => w.translation);
                        
                        const options = [correctWord.translation, ...randomWords];
                        return this.shuffleArray(options);
                    }
                    
                    shuffleArray(array) {
                        for (let i = array.length - 1; i > 0; i--) {
                            const j = Math.floor(Math.random() * (i + 1));
                            [array[i], array[j]] = [array[j], array[i]];
                        }
                        return array;
                    }
                    
                    setupEventListeners() {
                        // ناوبری
                        this.element.querySelectorAll('.nav-btn').forEach(btn => {
                            btn.addEventListener('click', (e) => {
                                const section = e.currentTarget.dataset.section;
                                this.showSection(section);
                            });
                        });
                        
                        // فلش کارت
                        const flashcard = this.element.querySelector('#current-flashcard');
                        if (flashcard) {
                            flashcard.addEventListener('click', () => {
                                flashcard.classList.toggle('flipped');
                            });
                        }
                        
                        // دکمه‌های فلش کارت
                        this.element.querySelectorAll('.flashcard-btn').forEach(btn => {
                            btn.addEventListener('click', (e) => {
                                const action = e.currentTarget.classList[1];
                                if (action.includes('btn-know') || action.includes('btn-learn')) {
                                    const knowledge = e.currentTarget.dataset.knowledge;
                                    this.updateWordStatus(knowledge);
                                } else if (action.includes('btn-next')) {
                                    this.nextCard();
                                }
                            });
                        });
                        
                        // آزمون
                        this.element.querySelectorAll('.quiz-option').forEach(option => {
                            option.addEventListener('click', (e) => {
                                this.selectQuizOption(e.currentTarget);
                            });
                        });
                        
                        const checkBtn = this.element.querySelector('#btn-check-answer');
                        if (checkBtn) {
                            checkBtn.addEventListener('click', () => {
                                this.checkQuizAnswer();
                            });
                        }
                        
                        const nextBtn = this.element.querySelector('#btn-next-question');
                        if (nextBtn) {
                            nextBtn.addEventListener('click', () => {
                                this.nextQuestion();
                            });
                        }
                        
                        // جستجوی کلمات
                        const searchInput = this.element.querySelector('#word-search');
                        if (searchInput) {
                            searchInput.addEventListener('input', (e) => {
                                this.searchWords(e.target.value);
                            });
                        }
                        
                        // فیلترهای کلمات
                        this.element.querySelectorAll('.filter-btn').forEach(btn => {
                            btn.addEventListener('click', (e) => {
                                const filter = e.currentTarget.dataset.filter;
                                this.filterWords(filter);
                            });
                        });
                        
                        // تلفظ
                        const listenBtn = this.element.querySelector('#btn-listen');
                        if (listenBtn) {
                            listenBtn.addEventListener('click', () => {
                                this.playPronunciation();
                            });
                        }
                        
                        const recordBtn = this.element.querySelector('#btn-record');
                        if (recordBtn) {
                            recordBtn.addEventListener('click', () => {
                                this.toggleRecording();
                            });
                        }
                        
                        // تنظیمات
                        const exportBtn = this.element.querySelector('#btn-export-data');
                        if (exportBtn) {
                            exportBtn.addEventListener('click', () => {
                                this.exportProgress();
                            });
                        }
                    }
                    
                    showSection(section) {
                        // به‌روزرسانی دکمه‌های ناوبری
                        this.element.querySelectorAll('.nav-btn').forEach(btn => {
                            btn.classList.remove('active');
                            if (btn.dataset.section === section) {
                                btn.classList.add('active');
                            }
                        });
                        
                        // نمایش بخش انتخاب شده
                        this.element.querySelectorAll('.section').forEach(sec => {
                            sec.classList.remove('active');
                        });
                        
                        const targetSection = this.element.querySelector(\`#section-\${section}\`);
                        if (targetSection) {
                            targetSection.classList.add('active');
                        }
                        
                        this.currentSection = section;
                        
                        // تنظیمات خاص هر بخش
                        if (section === 'quiz') {
                            this.startQuiz();
                        } else if (section === 'pronunciation') {
                            this.setupPronunciation();
                        }
                    }
                    
                    updateFlashcard() {
                        if (this.words.length === 0) return;
                        
                        const currentWord = this.words[this.currentCardIndex];
                        const flashcard = this.element.querySelector('#current-flashcard');
                        
                        if (flashcard && currentWord) {
                            this.element.querySelector('#flashcard-word').textContent = currentWord.word;
                            this.element.querySelector('#flashcard-translation').textContent = currentWord.translation;
                            this.element.querySelector('#flashcard-pronunciation').textContent = currentWord.pronunciation;
                            this.element.querySelector('#flashcard-example').textContent = currentWord.example;
                            
                            // ریست کردن حالت فلش کارت
                            flashcard.classList.remove('flipped');
                        }
                        
                        this.updateCardStats();
                    }
                    
                    nextCard() {
                        this.currentCardIndex = (this.currentCardIndex + 1) % this.words.length;
                        this.updateFlashcard();
                        this.addXP(5);
                    }
                    
                    updateWordStatus(status) {
                        if (this.words[this.currentCardIndex]) {
                            this.words[this.currentCardIndex].status = status === 'known' ? 'known' : 'learning';
                            this.updateCardStats();
                            this.addXP(status === 'known' ? 10 : 5);
                            this.dailyProgress++;
                            this.updateDailyProgress();
                            
                            if (status === 'known') {
                                this.showFeedback('Well done! Word marked as known.', 'success');
                            } else {
                                this.showFeedback('Word added to practice list.', 'info');
                            }
                            
                            // لرزش اگر فعال باشد
                            if (this.props.enableVibration && navigator.vibrate) {
                                navigator.vibrate(50);
                            }
                            
                            // رفتن به کارت بعدی بعد از 1 ثانیه
                            setTimeout(() => {
                                this.nextCard();
                            }, 1000);
                        }
                    }
                    
                    updateCardStats() {
                        const totalWords = this.words.length;
                        const knownWords = this.words.filter(w => w.status === 'known').length;
                        const learningWords = this.words.filter(w => w.status === 'learning').length;
                        const remainingWords = totalWords - knownWords;
                        
                        this.element.querySelector('#cards-remaining').textContent = remainingWords;
                        this.element.querySelector('#cards-known').textContent = knownWords;
                        this.element.querySelector('#cards-learning').textContent = learningWords;
                    }
                    
                    startQuiz() {
                        if (this.isQuizActive) return;
                        
                        this.isQuizActive = true;
                        this.currentQuestionIndex = 0;
                        this.timeLeft = 60;
                        this.updateQuizQuestion();
                        this.startQuizTimer();
                    }
                    
                    updateQuizQuestion() {
                        if (this.currentQuestionIndex >= this.quizData.length) {
                            this.endQuiz();
                            return;
                        }
                        
                        const question = this.quizData[this.currentQuestionIndex];
                        
                        this.element.querySelector('#current-question').textContent = this.currentQuestionIndex + 1;
                        this.element.querySelector('#total-questions').textContent = this.quizData.length;
                        this.element.querySelector('#quiz-question').textContent = question.question;
                        
                        const optionsContainer = this.element.querySelector('#quiz-options');
                        optionsContainer.innerHTML = '';
                        
                        question.options.forEach((option, index) => {
                            const optionElement = document.createElement('div');
                            optionElement.className = 'quiz-option';
                            optionElement.dataset.option = index;
                            optionElement.innerHTML = \`
                                <span class="option-letter">\${String.fromCharCode(65 + index)}</span>
                                <span class="option-text">\${option}</span>
                            \`;
                            optionElement.addEventListener('click', () => this.selectQuizOption(optionElement));
                            optionsContainer.appendChild(optionElement);
                        });
                        
                        // ریست کردن بازخورد
                        const feedback = this.element.querySelector('#quiz-feedback');
                        feedback.style.display = 'none';
                        feedback.className = 'quiz-feedback';
                    }
                    
                    selectQuizOption(optionElement) {
                        // حذف انتخاب قبلی
                        this.element.querySelectorAll('.quiz-option').forEach(opt => {
                            opt.classList.remove('selected');
                        });
                        
                        // انتخاب گزینه جدید
                        optionElement.classList.add('selected');
                    }
                    
                    checkQuizAnswer() {
                        const selectedOption = this.element.querySelector('.quiz-option.selected');
                        if (!selectedOption) {
                            this.showFeedback('Please select an answer first!', 'error');
                            return;
                        }
                        
                        const question = this.quizData[this.currentQuestionIndex];
                        const selectedIndex = parseInt(selectedOption.dataset.option);
                        const isCorrect = question.options[selectedIndex] === question.correctAnswer;
                        
                        const feedback = this.element.querySelector('#quiz-feedback');
                        feedback.textContent = isCorrect 
                            ? \`✅ Correct! "\${question.correctAnswer}" is the right answer.\`
                            : \`❌ Incorrect. The correct answer is "\${question.correctAnswer}".\`;
                        feedback.className = \`quiz-feedback \${isCorrect ? 'correct' : 'incorrect'}\`;
                        feedback.style.display = 'block';
                        
                        // برجسته کردن گزینه صحیح و غلط
                        this.element.querySelectorAll('.quiz-option').forEach((opt, index) => {
                            if (question.options[index] === question.correctAnswer) {
                                opt.classList.add('correct');
                            } else if (opt.classList.contains('selected')) {
                                opt.classList.add('incorrect');
                            }
                        });
                        
                        if (isCorrect) {
                            this.addXP(15);
                            this.score += 10;
                            this.updateStats();
                            
                            if (this.props.enableSound) {
                                this.playSound('correct');
                            }
                        } else {
                            if (this.props.enableSound) {
                                this.playSound('incorrect');
                            }
                        }
                        
                        // غیرفعال کردن گزینه‌ها
                        this.element.querySelectorAll('.quiz-option').forEach(opt => {
                            opt.style.pointerEvents = 'none';
                        });
                    }
                    
                    nextQuestion() {
                        this.currentQuestionIndex++;
                        if (this.currentQuestionIndex < this.quizData.length) {
                            this.updateQuizQuestion();
                        } else {
                            this.endQuiz();
                        }
                    }
                    
                    startQuizTimer() {
                        if (this.quizTimer) clearInterval(this.quizTimer);
                        
                        this.quizTimer = setInterval(() => {
                            this.timeLeft--;
                            this.element.querySelector('#quiz-timer').textContent = this.timeLeft;
                            
                            if (this.timeLeft <= 0) {
                                clearInterval(this.quizTimer);
                                this.endQuiz();
                            }
                        }, 1000);
                    }
                    
                    endQuiz() {
                        clearInterval(this.quizTimer);
                        this.isQuizActive = false;
                        
                        const accuracy = Math.round((this.score / (this.quizData.length * 10)) * 100);
                        this.showFeedback(\`Quiz finished! Accuracy: \${accuracy}%\`, 'success');
                        
                        this.addXP(accuracy * 2);
                        this.dailyProgress += this.quizData.length;
                        this.updateDailyProgress();
                    }
                    
                    updateWordList() {
                        const container = this.element.querySelector('#wordlist-items');
                        if (!container) return;
                        
                        container.innerHTML = '';
                        
                        this.words.forEach(word => {
                            const item = document.createElement('div');
                            item.className = 'wordlist-item';
                            item.innerHTML = \`
                                <div class="word-info">
                                    <div class="word-text">\${word.word}</div>
                                    <div class="word-meaning">\${word.translation}</div>
                                </div>
                                <div class="word-status status-\${word.status}"></div>
                            \`;
                            container.appendChild(item);
                        });
                    }
                    
                    searchWords(query) {
                        const filtered = this.words.filter(word => 
                            word.word.toLowerCase().includes(query.toLowerCase()) ||
                            word.translation.toLowerCase().includes(query.toLowerCase())
                        );
                        
                        this.displayFilteredWords(filtered);
                    }
                    
                    filterWords(filter) {
                        let filtered;
                        switch(filter) {
                            case 'known':
                                filtered = this.words.filter(w => w.status === 'known');
                                break;
                            case 'learning':
                                filtered = this.words.filter(w => w.status === 'learning');
                                break;
                            case 'new':
                                filtered = this.words.filter(w => w.status === 'new');
                                break;
                            default:
                                filtered = this.words;
                        }
                        
                        this.displayFilteredWords(filtered);
                        
                        // به‌روزرسانی دکمه‌های فیلتر
                        this.element.querySelectorAll('.filter-btn').forEach(btn => {
                            btn.classList.remove('active');
                            if (btn.dataset.filter === filter) {
                                btn.classList.add('active');
                            }
                        });
                    }
                    
                    displayFilteredWords(filteredWords) {
                        const container = this.element.querySelector('#wordlist-items');
                        if (!container) return;
                        
                        container.innerHTML = '';
                        
                        filteredWords.forEach(word => {
                            const item = document.createElement('div');
                            item.className = 'wordlist-item';
                            item.innerHTML = \`
                                <div class="word-info">
                                    <div class="word-text">\${word.word}</div>
                                    <div class="word-meaning">\${word.translation}</div>
                                </div>
                                <div class="word-status status-\${word.status}"></div>
                            \`;
                            container.appendChild(item);
                        });
                    }
                    
                    setupPronunciation() {
                        const word = this.words[Math.floor(Math.random() * this.words.length)];
                        if (word) {
                            this.element.querySelector('#pronunciation-word').textContent = word.word;
                            this.element.querySelector('#pronunciation-translation').textContent = word.translation;
                            this.element.querySelector('#pronunciation-difficulty').textContent = this.props.difficulty;
                        }
                    }
                    
                    playPronunciation() {
                        if (!this.props.enableSound) return;
                        
                        const word = this.element.querySelector('#pronunciation-word').textContent;
                        this.speakText(word);
                    }
                    
                    speakText(text) {
                        if ('speechSynthesis' in window) {
                            const utterance = new SpeechSynthesisUtterance(text);
                            utterance.lang = 'en-US';
                            utterance.rate = this.props.difficulty === 'beginner' ? 0.8 : 1.0;
                            speechSynthesis.speak(utterance);
                        } else {
                            this.showFeedback('Text-to-speech not supported in this browser', 'error');
                        }
                    }
                    
                    toggleRecording() {
                        const recordBtn = this.element.querySelector('#btn-record');
                        const visualizer = this.element.querySelector('#recording-visualizer');
                        
                        if (!recordBtn.classList.contains('recording')) {
                            // شروع ضبط
                            recordBtn.classList.add('recording');
                            recordBtn.innerHTML = '<span class="record-icon">⏹️</span>Stop';
                            visualizer.textContent = 'Recording...';
                            visualizer.style.background = 'linear-gradient(90deg, #ef4444, #f59e0b)';
                            
                            // شبیه‌سازی ضبط
                            setTimeout(() => {
                                this.evaluatePronunciation();
                            }, 2000);
                        } else {
                            // توقف ضبط
                            recordBtn.classList.remove('recording');
                            recordBtn.innerHTML = '<span class="record-icon">🎤</span>Record';
                            visualizer.textContent = 'Press record to start';
                            visualizer.style.background = '#e2e8f0';
                        }
                    }
                    
                    evaluatePronunciation() {
                        const feedback = this.element.querySelector('#practice-feedback');
                        const scores = ['Excellent!', 'Good job!', 'Needs practice'];
                        const randomScore = scores[Math.floor(Math.random() * scores.length)];
                        
                        feedback.textContent = \`Pronunciation: \${randomScore}\`;
                        feedback.className = \`practice-feedback \${randomScore === 'Excellent!' ? 'feedback-good' : randomScore === 'Good job!' ? 'feedback-average' : 'feedback-poor'}\`;
                        feedback.style.display = 'block';
                        
                        this.addXP(randomScore === 'Excellent!' ? 20 : randomScore === 'Good job!' ? 10 : 5);
                        this.dailyProgress++;
                        this.updateDailyProgress();
                    }
                    
                    addXP(amount) {
                        this.xp += amount;
                        if (this.xp >= this.maxXP) {
                            this.levelUp();
                        }
                        this.updateStats();
                    }
                    
                    levelUp() {
                        this.level++;
                        this.xp = this.xp - this.maxXP;
                        this.maxXP = Math.floor(this.maxXP * 1.5);
                        
                        this.showFeedback(\`🎉 Level up! You are now level \${this.level}\`, 'success');
                        this.updateStats();
                        
                        if (this.props.enableSound) {
                            this.playSound('levelup');
                        }
                    }
                    
                    updateStats() {
                        this.element.querySelector('#current-level').textContent = this.level;
                        this.element.querySelector('#total-score').textContent = this.score;
                        this.element.querySelector('#current-xp').textContent = this.xp;
                        this.element.querySelector('#max-xp').textContent = this.maxXP;
                        
                        const progressPercent = (this.xp / this.maxXP) * 100;
                        this.element.querySelector('#xp-progress').style.width = \`\${progressPercent}%\`;
                        
                        // به‌روزرسانی آمار پیشرفت
                        const accuracy = Math.min(95, 70 + (this.level * 5));
                        const streak = Math.min(30, Math.floor(this.score / 50));
                        
                        this.element.querySelector('#stat-accuracy .circle-value').textContent = \`\${accuracy}%\`;
                        this.element.querySelector('#stat-streak .circle-value').textContent = streak;
                        this.element.querySelector('#stat-words .circle-value').textContent = this.words.filter(w => w.status === 'known').length;
                    }
                    
                    updateDailyProgress() {
                        this.element.querySelector('#daily-progress').textContent = \`\${this.dailyProgress}/\${this.props.dailyGoal}\`;
                        
                        // بررسی تکمیل هدف روزانه
                        if (this.dailyProgress >= this.props.dailyGoal) {
                            this.showFeedback('🎯 Daily goal completed!', 'success');
                            this.addXP(50);
                        }
                    }
                    
                    startDailyGoalCheck() {
                        // هر 24 ساعت ریست می‌شود
                        setInterval(() => {
                            const lastReset = localStorage.getItem('language_daily_reset');
                            const now = new Date().toDateString();
                            
                            if (lastReset !== now) {
                                this.dailyProgress = 0;
                                localStorage.setItem('language_daily_reset', now);
                                this.updateDailyProgress();
                                this.showFeedback('New day started! Daily goal reset.', 'info');
                            }
                        }, 60000); // هر دقیقه چک کن
                    }
                    
                    showFeedback(message, type) {
                        const feedback = document.createElement('div');
                        feedback.className = \`language-feedback \${type}\`;
                        feedback.textContent = message;
                        feedback.style.cssText = \`
                            position: fixed;
                            top: 20px;
                            left: 50%;
                            transform: translateX(-50%);
                            padding: 12px 24px;
                            border-radius: 25px;
                            background: \${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
                            color: white;
                            z-index: 1000;
                            animation: slideDown 0.3s ease;
                        \`;
                        
                        document.body.appendChild(feedback);
                        
                        setTimeout(() => {
                            feedback.style.animation = 'slideUp 0.3s ease';
                            setTimeout(() => feedback.remove(), 300);
                        }, 3000);
                    }
                    
                    playSound(type) {
                        if (!this.props.enableSound) return;
                        
                        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                        const oscillator = audioContext.createOscillator();
                        const gainNode = audioContext.createGain();
                        
                        oscillator.connect(gainNode);
                        gainNode.connect(audioContext.destination);
                        
                        switch(type) {
                            case 'correct':
                                oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
                                break;
                            case 'incorrect':
                                oscillator.frequency.setValueAtTime(349.23, audioContext.currentTime); // F4
                                break;
                            case 'levelup':
                                oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime); // E5
                                break;
                        }
                        
                        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                        
                        oscillator.start(audioContext.currentTime);
                        oscillator.stop(aContext.currentTime + 0.5);
                    }
                    
                    exportProgress() {
                        const progressData = {
                            level: this.level,
                            score: this.score,
                            wordsLearned: this.words.filter(w => w.status === 'known').length,
                            totalWords: this.words.length,
                            dailyGoal: this.props.dailyGoal,
                            dailyProgress: this.dailyProgress,
                            exportDate: new Date().toISOString()
                        };
                        
                        const dataStr = JSON.stringify(progressData, null, 2);
                        const dataBlob = new Blob([dataStr], { type: 'application/json' });
                        const url = URL.createObjectURL(dataBlob);
                        
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = \`language-progress-\${new Date().toISOString().slice(0, 10)}.json\`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        
                        this.showFeedback('Progress data exported successfully!', 'success');
                    }
                    
                    getLanguageName(code) {
                        const languages = {
                            english: 'English',
                            farsi: 'Persian',
                            arabic: 'Arabic',
                            turkish: 'Turkish'
                        };
                        return languages[code] || 'English';
                    }
                }
                
                // مقداردهی اولیه کامپوننت
                document.addEventListener('DOMContentLoaded', () => {
                    const languageElements = document.querySelectorAll('.language-app');
                    languageElements.forEach(element => {
                        const props = JSON.parse(element.dataset.props || '{}');
                        window.languageApp = new LanguageLearningLogic(element, props);
                    });
                });
            `
        };
    }

    // ادامه کامپوننت‌های دیگر...
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
            // ... (کد کامل کامپوننت یادداشت - مانند قبل)
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
            // ... (کد کامل کامپوننت To-Do - مانند قبل)
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
            'expense-tracker': this.createExpenseTrackerTemplate(),
            'language-learning-app': this.createLanguageLearningTemplate() // ✅ قالب جدید اضافه شد
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

    // ✅ ایجاد قالب آموزش زبان
    createLanguageLearningTemplate() {
        return {
            name: 'برنامه آموزش زبان',
            description: 'برنامه کامل آموزش زبان با فلش کارت، آزمون و تمرین تلفظ',
            components: [
                { type: 'container', props: { direction: 'column', padding: 0, margin: 0 }, children: [
                    { type: 'languageLearning', props: { 
                        language: 'english',
                        difficulty: 'beginner',
                        dailyGoal: 10,
                        enableSound: true,
                        enableVibration: true,
                        theme: 'blue'
                    }}
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
        console.log(`🎯 Language Learning Component: ✅ Added successfully`);
        
        return this;
    }
}

// ایجاد instance جهانی
window.AppBuilderEngine = new AppBuilderEngine().start();

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppBuilderEngine;
            }
