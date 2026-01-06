/**
 * 🚀 موتور دستورات فارسی/انگلیسی
 * تبدیل دستورات کاربر به ساختار اپ
 */

// ==================== سیستم ترجمه ====================
const TRANSLATIONS = {
    // کلمات فارسی به انگلیسی
    faToEn: {
        'صفحه': 'screen',
        'برو': 'go',
        'عنوان': 'title',
        'هشدار': 'alert',
        'یادداشت': 'note',
        'لیست': 'list',
        'کارها': 'todo',
        'ماشین حساب': 'calculator',
        'تایمر': 'timer',
        'تقویم': 'calendar',
        'ثبت': 'save',
        'پاک': 'clear',
        'بازگشت': 'back',
        'خانه': 'home',
        'سازنده': 'builder',
        'پیش نمایش': 'preview',
        'تنظیمات': 'settings',
        'رنگ': 'color',
        'سایز': 'size',
        'اضافه کن': 'add',
        'حذف کن': 'delete',
        'ویرایش': 'edit',
        'جستجو': 'search'
    },
    
    // کلمات انگلیسی به فارسی
    enToFa: {
        'screen': 'صفحه',
        'go': 'برو',
        'title': 'عنوان',
        'alert': 'هشدار',
        'note': 'یادداشت',
        'list': 'لیست',
        'todo': 'کارها',
        'calculator': 'ماشین حساب',
        'timer': 'تایمر',
        'calendar': 'تقویم',
        'save': 'ثبت',
        'clear': 'پاک',
        'back': 'بازگشت',
        'home': 'خانه',
        'builder': 'سازنده',
        'preview': 'پیش نمایش',
        'settings': 'تنظیمات',
        'color': 'رنگ',
        'size': 'سایز',
        'add': 'اضافه کن',
        'delete': 'حذف کن',
        'edit': 'ویرایش',
        'search': 'جستجو'
    }
};

// ==================== نرمالایز کردن دستور ====================
function normalizeCommand(command) {
    if (!command || typeof command !== 'string') return '';
    
    let normalized = command
        .trim()
        .toLowerCase()
        .replace(/\\n/g, ' ')        // خط جدید به فاصله
        .replace(/\s+/g, ' ')        // فاصله‌های تکراری
        .replace(/[،؛]/g, ',')       // ویرگول فارسی
        .replace(/\.{2,}/g, '.')     // نقطه تکراری
        .trim();
    
    // ترجمه کلمات فارسی به انگلیسی
    Object.keys(TRANSLATIONS.faToEn).forEach(faWord => {
        const regex = new RegExp(faWord, 'g');
        normalized = normalized.replace(regex, TRANSLATIONS.faToEn[faWord]);
    });
    
    return normalized;
}

// ==================== تجزیه دستور ====================
function parseCommand(input) {
    const lines = input.split('\n').filter(line => line.trim());
    const result = {
        screens: [],
        title: 'اپ موبایل',
        alerts: [],
        actions: [],
        errors: []
    };
    
    let currentScreen = 'home';
    
    lines.forEach((line, index) => {
        const normalizedLine = normalizeCommand(line);
        const parts = normalizedLine.split(' ').filter(p => p);
        
        if (parts.length === 0) return;
        
        const command = parts[0];
        const args = parts.slice(1);
        
        switch (command) {
            case 'screen':
            case 'go':
                if (args.length > 0) {
                    currentScreen = args[0];
                    result.screens.push({
                        name: currentScreen,
                        line: index + 1,
                        raw: line
                    });
                }
                break;
                
            case 'title':
                if (args.length > 0) {
                    result.title = args.join(' ');
                    // تبدیل به فارسی برای نمایش
                    const faTitle = translateToFarsi(result.title);
                    result.title = faTitle;
                }
                break;
                
            case 'alert':
                if (args.length > 0) {
                    result.alerts.push({
                        message: args.join(' '),
                        line: index + 1
                    });
                }
                break;
                
            case 'save':
                result.actions.push({
                    type: 'save',
                    target: args[0] || 'data',
                    line: index + 1
                });
                break;
                
            case 'add':
                result.actions.push({
                    type: 'add',
                    item: args.join(' '),
                    line: index + 1
                });
                break;
                
            default:
                // اگر دستور شناخته شده نیست
                if (command && !['home', 'back'].includes(command)) {
                    result.errors.push({
                        line: index + 1,
                        command: line,
                        suggestion: suggestCommand(command)
                    });
                }
        }
    });
    
    // اگر اسکرینی مشخص نشده، home قرار بده
    if (result.screens.length === 0) {
        result.screens.push({ name: 'home', line: 0, raw: 'خانه' });
    }
    
    return result;
}

// ==================== ترجمه به فارسی ====================
function translateToFarsi(text) {
    let translated = text;
    Object.keys(TRANSLATIONS.enToFa).forEach(enWord => {
        const regex = new RegExp(`\\b${enWord}\\b`, 'gi');
        translated = translated.replace(regex, TRANSLATIONS.enToFa[enWord]);
    });
    return translated;
}

// ==================== پیشنهاد دستور ====================
function suggestCommand(wrongCommand) {
    const suggestions = {
        'scr': 'screen',
        'tit': 'title',
        'alt': 'alert',
        'not': 'note',
        'cal': 'calculator',
        'lst': 'list',
        'tim': 'timer'
    };
    
    return suggestions[wrongCommand] || 'screen';
}

// ==================== موتور اصلی ====================
function runEngine(input) {
    console.log('🔄 اجرای موتور با دستور:', input);
    
    if (!input || input.trim() === '') {
        return createHomeScreen();
    }
    
    const parsed = parseCommand(input);
    
    // اگر خطا وجود دارد
    if (parsed.errors.length > 0) {
        return createErrorScreen(parsed);
    }
    
    // آخرین اسکرین انتخاب شده
    const lastScreen = parsed.screens[parsed.screens.length - 1];
    const screenType = lastScreen ? lastScreen.name : 'home';
    
    // ایجاد اسکرین بر اساس نوع
    switch (screenType) {
        case 'note':
            return createNoteScreen(parsed);
            
        case 'calculator':
            return createCalculatorScreen(parsed);
            
        case 'todo':
        case 'list':
            return createTodoScreen(parsed);
            
        case 'timer':
            return createTimerScreen(parsed);
            
        case 'calendar':
            return createCalendarScreen(parsed);
            
        case 'builder':
            return createBuilderScreen(parsed);
            
        case 'preview':
            return createPreviewScreen(parsed);
            
        case 'settings':
            return createSettingsScreen(parsed);
            
        case 'home':
        default:
            return createHomeScreen(parsed);
    }
}

// ==================== ساخت اسکرین‌ها ====================

// اسکرین خانه
function createHomeScreen(parsed = null) {
    const title = parsed && parsed.title ? parsed.title : '🏠 خانه';
    
    return {
        meta: {
            type: 'home',
            title: title,
            alerts: parsed ? parsed.alerts : [],
            timestamp: new Date().toISOString()
        },
        schema: {
            title: title,
            components: [
                {
                    type: 'welcome',
                    content: 'خوش آمدید! یک دستور وارد کنید یا از گزینه‌ها انتخاب نمایید:'
                },
                {
                    type: 'quick_grid',
                    items: [
                        { id: 'note', label: '📝 یادداشت', command: 'صفحه note' },
                        { id: 'calculator', label: '🧮 ماشین حساب', command: 'صفحه calculator' },
                        { id: 'todo', label: '✅ لیست کارها', command: 'صفحه todo' },
                        { id: 'timer', label: '⏱️ تایمر', command: 'صفحه timer' },
                        { id: 'calendar', label: '📅 تقویم', command: 'صفحه calendar' },
                        { id: 'builder', label: '🛠️ سازنده اپ', command: 'صفحه builder' }
                    ]
                },
                {
                    type: 'command_input',
                    placeholder: 'دستور خود را وارد کنید...',
                    buttonText: '▶️ اجرا'
                }
            ]
        }
    };
}

// اسکرین یادداشت
function createNoteScreen(parsed) {
    const title = parsed.title || '📝 یادداشت‌ها';
    
    return {
        meta: {
            type: 'note',
            title: title,
            alerts: parsed.alerts,
            timestamp: new Date().toISOString()
        },
        schema: {
            title: title,
            components: [
                {
                    type: 'textarea',
                    id: 'note_content',
                    placeholder: 'متن یادداشت خود را اینجا بنویسید...',
                    rows: 6
                },
                {
                    type: 'button_group',
                    buttons: [
                        { id: 'save_note', label: '💾 ذخیره', action: 'save_note' },
                        { id: 'load_note', label: '📂 بارگذاری', action: 'load_note' },
                        { id: 'clear_note', label: '🗑️ پاک کردن', action: 'clear_note' }
                    ]
                },
                {
                    type: 'notes_list',
                    id: 'saved_notes',
                    title: 'یادداشت‌های ذخیره شده'
                },
                {
                    type: 'button',
                    id: 'back_home',
                    label: '🏠 بازگشت به خانه',
                    action: 'go_home'
                }
            ]
        }
    };
}

// اسکرین ماشین حساب
function createCalculatorScreen(parsed) {
    const title = parsed.title || '🧮 ماشین حساب';
    
    return {
        meta: {
            type: 'calculator',
            title: title,
            alerts: parsed.alerts,
            timestamp: new Date().toISOString()
        },
        schema: {
            title: title,
            components: [
                {
                    type: 'display',
                    id: 'calc_display',
                    value: '0',
                    readonly: true
                },
                {
                    type: 'calc_grid',
                    rows: [
                        ['7', '8', '9', '/'],
                        ['4', '5', '6', '*'],
                        ['1', '2', '3', '-'],
                        ['0', '.', '=', '+']
                    ]
                },
                {
                    type: 'button_group',
                    buttons: [
                        { id: 'clear_calc', label: 'C', action: 'clear_calc' },
                        { id: 'backspace', label: '⌫', action: 'backspace' },
                        { id: 'calc_history', label: '📜 تاریخچه', action: 'show_history' }
                    ]
                },
                {
                    type: 'button',
                    id: 'back_home',
                    label: '🏠 بازگشت',
                    action: 'go_home'
                }
            ]
        }
    };
}

// اسکرین لیست کارها
function createTodoScreen(parsed) {
    const title = parsed.title || '✅ لیست کارها';
    
    return {
        meta: {
            type: 'todo',
            title: title,
            alerts: parsed.alerts,
            timestamp: new Date().toISOString()
        },
        schema: {
            title: title,
            components: [
                {
                    type: 'input',
                    id: 'todo_input',
                    placeholder: 'کار جدید...',
                    buttonText: '➕ اضافه'
                },
                {
                    type: 'todo_list',
                    id: 'todos',
                    items: []
                },
                {
                    type: 'stats',
                    items: [
                        { label: 'کل کارها', value: 0 },
                        { label: 'انجام شده', value: 0 },
                        { label: 'باقی‌مانده', value: 0 }
                    ]
                },
                {
                    type: 'button_group',
                    buttons: [
                        { id: 'clear_done', label: '🗑️ حذف انجام شده‌ها', action: 'clear_done' },
                        { id: 'clear_all', label: '⚠️ حذف همه', action: 'clear_all' }
                    ]
                },
                {
                    type: 'button',
                    id: 'back_home',
                    label: '🏠 بازگشت',
                    action: 'go_home'
                }
            ]
        }
    };
}

// اسکرین تایمر
function createTimerScreen(parsed) {
    const title = parsed.title || '⏱️ تایمر';
    
    return {
        meta: {
            type: 'timer',
            title: title,
            alerts: parsed.alerts,
            timestamp: new Date().toISOString()
        },
        schema: {
            title: title,
            components: [
                {
                    type: 'timer_display',
                    id: 'timer_display',
                    value: '00:00:00'
                },
                {
                    type: 'timer_controls',
                    buttons: [
                        { id: 'start_timer', label: '▶️ شروع', action: 'start_timer' },
                        { id: 'pause_timer', label: '⏸️ توقف', action: 'pause_timer' },
                        { id: 'reset_timer', label: '🔄 بازنشانی', action: 'reset_timer' }
                    ]
                },
                {
                    type: 'time_picker',
                    id: 'time_set',
                    hours: 0,
                    minutes: 0,
                    seconds: 0
                },
                {
                    type: 'button',
                    id: 'back_home',
                    label: '🏠 بازگشت',
                    action: 'go_home'
                }
            ]
        }
    };
}

// اسکرین خطا
function createErrorScreen(parsed) {
    return {
        meta: {
            type: 'error',
            title: '⚠️ خطا در دستور',
            alerts: parsed.alerts,
            errors: parsed.errors,
            timestamp: new Date().toISOString()
        },
        schema: {
            title: '⚠️ خطا در دستور',
            components: [
                {
                    type: 'error_list',
                    errors: parsed.errors.map(err => ({
                        line: err.line,
                        command: err.command,
                        suggestion: `پیشنهاد: ${err.suggestion}`
                    }))
                },
                {
                    type: 'help_text',
                    content: 'دستورات معتبر: صفحه [نام]، عنوان [متن]، هشدار [پیام]'
                },
                {
                    type: 'button',
                    id: 'back_home',
                    label: '🏠 بازگشت به خانه',
                    action: 'go_home'
                }
            ]
        }
    };
}

// اسکرین‌های دیگر (قالب)
function createCalendarScreen(parsed) {
    return createTemplateScreen('calendar', '📅 تقویم', parsed);
}

function createBuilderScreen(parsed) {
    return createTemplateScreen('builder', '🛠️ سازنده اپ', parsed);
}

function createPreviewScreen(parsed) {
    return createTemplateScreen('preview', '👁️ پیش‌نمایش', parsed);
}

function createSettingsScreen(parsed) {
    return createTemplateScreen('settings', '⚙️ تنظیمات', parsed);
}

// قالب عمومی برای اسکرین‌های در حال توسعه
function createTemplateScreen(type, defaultTitle, parsed) {
    const title = parsed.title || defaultTitle;
    
    return {
        meta: {
            type: type,
            title: title,
            alerts: parsed.alerts,
            timestamp: new Date().toISOString()
        },
        schema: {
            title: title,
            components: [
                {
                    type: 'coming_soon',
                    message: `صفحه "${title}" به زودی...`
                },
                {
                    type: 'button',
                    id: 'back_home',
                    label: '🏠 بازگشت به خانه',
                    action: 'go_home'
                }
            ]
        }
    };
}

// ==================== صادر کردن توابع ====================
window.normalizeCommand = normalizeCommand;
window.parseCommand = parseCommand;
window.translateToFarsi = translateToFarsi;
window.runEngine = runEngine;

console.log('✅ موتور دستورات بارگذاری شد');
