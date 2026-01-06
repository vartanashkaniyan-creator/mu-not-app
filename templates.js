/**
 * 📦 بانک تمپلیت ۲۵ اپ موبایل
 * هر اپ شامل: metadata + generator
 */

const AppTemplates = {
    // ==================== اطلاعات ۲۵ اپ ====================
    APPS_META: [
        // ۱-۵: اپ‌های ابزاری
        { id: 'note', name: 'یادداشت', category: 'ابزار', icon: '📝', color: '#4CAF50' },
        { id: 'calculator', name: 'ماشین حساب', category: 'ابزار', icon: '🧮', color: '#2196F3' },
        { id: 'timer', name: 'تایمر', category: 'ابزار', icon: '⏱️', color: '#FF9800' },
        { id: 'calendar', name: 'تقویم', category: 'ابزار', icon: '📅', color: '#9C27B0' },
        { id: 'converter', name: 'مبدل واحد', category: 'ابزار', icon: '🔄', color: '#009688' },
        
        // ۶-۱۰: اپ‌های داده‌ای
        { id: 'todo', name: 'لیست کارها', category: 'داده', icon: '✅', color: '#4CAF50' },
        { id: 'contacts', name: 'مخاطبین', category: 'داده', icon: '👥', color: '#3F51B5' },
        { id: 'expenses', name: 'مدیریت هزینه', category: 'داده', icon: '💰', color: '#FF5722' },
        { id: 'notes_advanced', name: 'یادداشت پیشرفته', category: 'داده', icon: '📚', color: '#795548' },
        { id: 'bookmarks', name: 'نشان‌ها', category: 'داده', icon: '🔖', color: '#E91E63' },
        
        // ۱۱-۱۵: اپ‌های رسانه‌ای
        { id: 'gallery', name: 'گالری', category: 'رسانه', icon: '🖼️', color: '#00BCD4' },
        { id: 'audio_player', name: 'پخش صوت', category: 'رسانه', icon: '🎵', color: '#9C27B0' },
        { id: 'video_player', name: 'پخش ویدیو', category: 'رسانه', icon: '🎬', color: '#F44336' },
        { id: 'camera', name: 'دوربین', category: 'رسانه', icon: '📷', color: '#607D8B' },
        { id: 'recorder', name: 'ضبط صدا', category: 'رسانه', icon: '🎤', color: '#673AB7' },
        
        // ۱۶-۲۰: اپ‌های ارتباطی
        { id: 'messenger', name: 'پیام‌رسان', category: 'ارتباط', icon: '💬', color: '#00BFA5' },
        { id: 'email_client', name: 'ایمیل', category: 'ارتباط', icon: '📧', color: '#4285F4' },
        { id: 'sms_sender', name: 'ارسال SMS', category: 'ارتباط', icon: '📱', color: '#34A853' },
        { id: 'call_log', name: 'تماس‌ها', category: 'ارتباط', icon: '📞', color: '#EA4335' },
        { id: 'social_feed', name: 'فید اجتماعی', category: 'ارتباط', icon: '📱', color: '#1DA1F2' },
        
        // ۲۱-۲۵: اپ‌های پیشرفته
        { id: 'weather', name: 'آب و هوا', category: 'پیشرفته', icon: '🌤️', color: '#03A9F4' },
        { id: 'map', name: 'نقشه', category: 'پیشرفته', icon: '🗺️', color: '#4CAF50' },
        { id: 'translator', name: 'مترجم', category: 'پیشرفته', icon: '🌐', color: '#FFC107' },
        { id: 'finance', name: 'مالی', category: 'پیشرفته', icon: '💹', color: '#8BC34A' },
        { id: 'health', name: 'سلامتی', category: 'پیشرفته', icon: '❤️', color: '#F44336' }
    ],

    // ==================== ژنراتورهای ۲۵ اپ ====================

    // ۱. یادداشت
    generateNote(config = {}) {
        return {
            meta: {
                type: 'note',
                title: config.title || '📝 یادداشت',
                version: '1.0'
            },
            schema: {
                title: config.title || '📝 یادداشت',
                components: [
                    {
                        type: 'textarea',
                        id: 'note_content',
                        placeholder: 'متن خود را اینجا بنویسید...',
                        rows: 8,
                        value: config.content || ''
                    },
                    {
                        type: 'button_group',
                        buttons: [
                            { id: 'save_note', label: '💾 ذخیره', action: 'save_note' },
                            { id: 'load_last', label: '📂 آخرین', action: 'load_last_note' },
                            { id: 'clear_note', label: '🗑️ پاک', action: 'clear_note' }
                        ]
                    },
                    {
                        type: 'notes_list',
                        id: 'saved_notes',
                        title: 'یادداشت‌های ذخیره شده'
                    },
                    {
                        type: 'stats',
                        items: [
                            { label: 'تعداد', value: '?' },
                            { label: 'کاراکتر', value: '?' },
                            { label: 'کلمات', value: '?' }
                        ]
                    }
                ]
            },
            logic: `
                // منطق یادداشت
                function updateNoteStats() {
                    const text = document.getElementById('note_content').value;
                    const chars = text.length;
                    const words = text.trim() ? text.trim().split(/\\s+/).length : 0;
                    
                    document.querySelectorAll('.stat-value')[0].textContent = Object.keys(window.AppState?.data?.notes || {}).length;
                    document.querySelectorAll('.stat-value')[1].textContent = chars;
                    document.querySelectorAll('.stat-value')[2].textContent = words;
                }
                
                document.getElementById('note_content').addEventListener('input', updateNoteStats);
                updateNoteStats();
            `
        };
    },

    // ۲. ماشین حساب
    generateCalculator(config = {}) {
        return {
            meta: {
                type: 'calculator',
                title: config.title || '🧮 ماشین حساب',
                version: '1.0'
            },
            schema: {
                title: config.title || '🧮 ماشین حساب',
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
                            ['C', '⌫', '%', '÷'],
                            ['7', '8', '9', '×'],
                            ['4', '5', '6', '-'],
                            ['1', '2', '3', '+'],
                            ['0', '.', '=', '📜']
                        ]
                    },
                    {
                        type: 'history',
                        id: 'calc_history',
                        title: 'تاریخچه محاسبات'
                    }
                ]
            },
            logic: `
                // منطق ماشین حساب پیشرفته
                let calcExpression = '';
                let calcHistory = [];
                
                function handleCalcKey(key) {
                    const display = document.getElementById('calc_display');
                    
                    if (key === '=') {
                        calculate();
                    } else if (key === 'C') {
                        display.value = '0';
                        calcExpression = '';
                    } else if (key === '⌫') {
                        if (display.value.length > 1) {
                            display.value = display.value.slice(0, -1);
                            calcExpression = display.value;
                        } else {
                            display.value = '0';
                            calcExpression = '';
                        }
                    } else if (key === '📜') {
                        showHistory();
                    } else {
                        if (display.value === '0' && !isOperator(key)) {
                            display.value = key;
                        } else {
                            display.value += key;
                        }
                        calcExpression = display.value;
                    }
                }
                
                function calculate() {
                    const display = document.getElementById('calc_display');
                    try {
                        let expr = display.value
                            .replace(/÷/g, '/')
                            .replace(/×/g, '*')
                            .replace(/%/g, '/100');
                        
                        const result = eval(expr);
                        const rounded = Math.round(result * 100000000) / 100000000;
                        
                        // ذخیره در تاریخچه
                        calcHistory.unshift({
                            expr: display.value,
                            result: rounded,
                            time: new Date().toLocaleTimeString('fa-IR')
                        });
                        
                        if (calcHistory.length > 10) calcHistory.pop();
                        updateHistoryDisplay();
                        
                        display.value = rounded;
                        calcExpression = rounded.toString();
                    } catch {
                        display.value = 'خطا';
                        calcExpression = '';
                    }
                }
                
                function isOperator(key) {
                    return ['+', '-', '×', '÷', '%', '.'].includes(key);
                }
                
                function showHistory() {
                    if (calcHistory.length === 0) {
                        alert('تاریخچه‌ای موجود نیست');
                        return;
                    }
                    
                    let msg = 'تاریخچه محاسبات:\\n\\n';
                    calcHistory.forEach((item, i) => {
                        msg += \`\${i+1}. \${item.expr} = \${item.result} (\${item.time})\\n\`;
                    });
                    alert(msg);
                }
                
                function updateHistoryDisplay() {
                    const historyEl = document.getElementById('calc_history');
                    if (!historyEl) return;
                    
                    if (calcHistory.length === 0) {
                        historyEl.innerHTML = '<p>هیچ تاریخچه‌ای وجود ندارد</p>';
                    } else {
                        let html = '<ul>';
                        calcHistory.forEach(item => {
                            html += \`<li>\${item.expr} = <b>\${item.result}</b></li>\`;
                        });
                        html += '</ul>';
                        historyEl.innerHTML = html;
                    }
                }
                
                // متصل کردن دکمه‌ها
                document.querySelectorAll('.calc-key').forEach(btn => {
                    btn.onclick = () => handleCalcKey(btn.textContent);
                });
                
                updateHistoryDisplay();
            `
        };
    },

    // ۳. تایمر
    generateTimer(config = {}) {
        return {
            meta: {
                type: 'timer',
                title: config.title || '⏱️ تایمر',
                version: '1.0'
            },
            schema: {
                title: config.title || '⏱️ تایمر',
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
                            { id: 'lap_timer', label: '⏱️ دور', action: 'lap_timer' },
                            { id: 'reset_timer', label: '🔄 بازنشانی', action: 'reset_timer' }
                        ]
                    },
                    {
                        type: 'time_setter',
                        hours: 0,
                        minutes: 0,
                        seconds: 0
                    },
                    {
                        type: 'laps_list',
                        id: 'timer_laps',
                        title: 'زمان‌های دور'
                    }
                ]
            },
            logic: `
                // منطق تایمر
                let timerInterval = null;
                let startTime = 0;
                let elapsed = 0;
                let isRunning = false;
                let laps = [];
                
                function updateDisplay() {
                    const totalSeconds = Math.floor(elapsed / 1000);
                    const hours = Math.floor(totalSeconds / 3600);
                    const minutes = Math.floor((totalSeconds % 3600) / 60);
                    const seconds = totalSeconds % 60;
                    
                    const display = document.getElementById('timer_display');
                    if (display) {
                        display.textContent = 
                            String(hours).padStart(2, '0') + ':' +
                            String(minutes).padStart(2, '0') + ':' +
                            String(seconds).padStart(2, '0');
                    }
                }
                
                function startTimer() {
                    if (isRunning) return;
                    
                    isRunning = true;
                    startTime = Date.now() - elapsed;
                    
                    timerInterval = setInterval(() => {
                        elapsed = Date.now() - startTime;
                        updateDisplay();
                    }, 100);
                }
                
                function pauseTimer() {
                    if (!isRunning) return;
                    
                    isRunning = false;
                    clearInterval(timerInterval);
                }
                
                function resetTimer() {
                    pauseTimer();
                    elapsed = 0;
                    laps = [];
                    updateDisplay();
                    updateLapsList();
                }
                
                function addLap() {
                    if (!isRunning) return;
                    
                    const totalSeconds = Math.floor(elapsed / 1000);
                    const hours = Math.floor(totalSeconds / 3600);
                    const minutes = Math.floor((totalSeconds % 3600) / 60);
                    const seconds = totalSeconds % 60;
                    
                    laps.unshift({
                        time: elapsed,
                        display: \`\${String(hours).padStart(2, '0')}:\${String(minutes).padStart(2, '0')}:\${String(seconds).padStart(2, '0')}\`,
                        number: laps.length + 1
                    });
                    
                    updateLapsList();
                }
                
                function updateLapsList() {
                    const lapsEl = document.getElementById('timer_laps');
                    if (!lapsEl) return;
                    
                    if (laps.length === 0) {
                        lapsEl.innerHTML = '<p>هنوز دوری ثبت نشده</p>';
                    } else {
                        let html = '<ol>';
                        laps.forEach(lap => {
                            html += \`<li>دور \${lap.number}: \${lap.display}</li>\`;
                        });
                        html += '</ol>';
                        lapsEl.innerHTML = html;
                    }
                }
                
                // مقداردهی اولیه
                updateDisplay();
            `
        };
    },

    // ۴. تقویم
    generateCalendar(config = {}) {
        const today = new Date();
        const persianMonths = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
        
        return {
            meta: {
                type: 'calendar',
                title: config.title || '📅 تقویم',
                version: '1.0'
            },
            schema: {
                title: config.title || '📅 تقویم',
                components: [
                    {
                        type: 'calendar_header',
                        year: today.getFullYear(),
                        month: persianMonths[today.getMonth()],
                        today: today.toLocaleDateString('fa-IR')
                    },
                    {
                        type: 'calendar_grid',
                        id: 'calendar_days',
                        days: ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']
                    },
                    {
                        type: 'events_list',
                        id: 'calendar_events',
                        title: 'رویدادهای امروز'
                    },
                    {
                        type: 'event_form',
                        id: 'add_event_form',
                        placeholder: 'افزودن رویداد جدید...'
                    }
                ]
            },
            logic: `
                // منطق تقویم
                const events = JSON.parse(localStorage.getItem('calendar_events') || '{}');
                const todayStr = new Date().toLocaleDateString('fa-IR');
                
                function generateCalendar() {
                    const now = new Date();
                    const year = now.getFullYear();
                    const month = now.getMonth();
                    const firstDay = new Date(year, month, 1);
                    const lastDay = new Date(year, month + 1, 0);
                    
                    let calendarHTML = '<div class="calendar-grid">';
                    
                    // روزهای هفته
                    calendarHTML += '<div class="weekdays">';
                    ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'].forEach(day => {
                        calendarHTML += \`<div class="weekday">\${day}</div>\`;
                    });
                    calendarHTML += '</div>';
                    
                    // روزهای ماه
                    calendarHTML += '<div class="days">';
                    for (let i = 0; i < firstDay.getDay(); i++) {
                        calendarHTML += '<div class="day empty"></div>';
                    }
                    
                    for (let day = 1; day <= lastDay.getDate(); day++) {
                        const dateStr = \`\${year}-\${month+1}-\${day}\`;
                        const hasEvent = events[dateStr];
                        const isToday = day === now.getDate();
                        
                        calendarHTML += \`
                            <div class="day \${isToday ? 'today' : ''} \${hasEvent ? 'has-event' : ''}" 
                                 onclick="selectDate('\${dateStr}')">
                                \${day}
                                \${hasEvent ? '<span class="event-dot">●</span>' : ''}
                            </div>
                        \`;
                    }
                    
                    calendarHTML += '</div></div>';
                    
                    document.getElementById('calendar_days').innerHTML = calendarHTML;
                }
                
                function updateEventsList() {
                    const eventsList = document.getElementById('calendar_events');
                    const todayEvents = events[todayStr] || [];
                    
                    if (todayEvents.length === 0) {
                        eventsList.innerHTML = '<p>هیچ رویدادی برای امروز ثبت نشده</p>';
                    } else {
                        let html = '<ul>';
                        todayEvents.forEach((event, index) => {
                            html += \`
                                <li>
                                    <span>\${event}</span>
                                    <button onclick="removeEvent(\${index})">🗑️</button>
                                </li>
                            \`;
                        });
                        html += '</ul>';
                        eventsList.innerHTML = html;
                    }
                }
                
                function addEvent() {
                    const input = document.querySelector('#add_event_form input');
                    const text = input.value.trim();
                    
                    if (!text) {
                        alert('لطفاً متن رویداد را وارد کنید');
                        return;
                    }
                    
                    if (!events[todayStr]) {
                        events[todayStr] = [];
                    }
                    
                    events[todayStr].push(text);
                    localStorage.setItem('calendar_events', JSON.stringify(events));
                    
                    input.value = '';
                    updateEventsList();
                    generateCalendar();
                }
                
                function removeEvent(index) {
                    if (events[todayStr]) {
                        events[todayStr].splice(index, 1);
                        localStorage.setItem('calendar_events', JSON.stringify(events));
                        updateEventsList();
                        generateCalendar();
                    }
                }
                
                function selectDate(dateStr) {
                    alert('انتخاب تاریخ: ' + dateStr);
                }
                
                // مقداردهی اولیه
                generateCalendar();
                updateEventsList();
                
                // صادر کردن توابع
                window.addEvent = addEvent;
                window.removeEvent = removeEvent;
                window.selectDate = selectDate;
            `
        };
    },

    // ۵. مبدل واحد
    generateConverter(config = {}) {
        return {
            meta: {
                type: 'converter',
                title: config.title || '🔄 مبدل واحد',
                version: '1.0'
            },
            schema: {
                title: config.title || '🔄 مبدل واحد',
                components: [
                    {
                        type: 'converter_input',
                        id: 'convert_value',
                        placeholder: 'مقدار را وارد کنید',
                        value: '1'
                    },
                    {
                        type: 'category_selector',
                        categories: ['طول', 'وزن', 'دما', 'حجم', 'سرعت', 'مساحت']
                    },
                    {
                        type: 'unit_from',
                        id: 'unit_from',
                        units: ['سانتی‌متر', 'متر', 'کیلومتر']
                    },
                    {
                        type: 'unit_to',
                        id: 'unit_to',
                        units: ['سانتی‌متر', 'متر', 'کیلومتر']
                    },
                    {
                        type: 'result_display',
                        id: 'convert_result',
                        label: 'نتیجه'
                    },
                    {
                        type: 'history',
                        id: 'convert_history',
                        title: 'تبدیل‌های اخیر'
                    }
                ]
            },
            logic: `
                // منطق مبدل واحد
                const conversionRates = {
                    'طول': {
                        'سانتی‌متر': 1,
                        'متر': 100,
                        'کیلومتر': 100000,
                        'اینچ': 2.54,
                        'پا': 30.48
                    },
                    'وزن': {
                        'گرم': 1,
                        'کیلوگرم': 1000,
                        'تن': 1000000,
                        'پوند': 453.592
                    },
                    'دما': {
                        'سلسیوس': 'c',
                        'فارنهایت': 'f',
                        'کلوین': 'k'
                    }
                };
                
                let convertHistory = [];
                let currentCategory = 'طول';
                
                function updateUnits() {
                    const units = Object.keys(conversionRates[currentCategory] || {});
                    
                    // به‌روزرسانی selectها
                    const fromSelect = document.getElementById('unit_from');
                    const toSelect = document.getElementById('unit_to');
                    
                    if (fromSelect && toSelect) {
                        fromSelect.innerHTML = units.map(u => \`<option>\${u}</option>\`).join('');
                        toSelect.innerHTML = units.map(u => \`<option>\${u}</option>\`).join('');
                        
                        // تنظیم مقادیر پیش‌فرض
                        if (units.length >= 2) {
                            fromSelect.value = units[0];
                            toSelect.value = units[1];
                        }
                    }
                    
                    convert();
                }
                
                function convert() {
                    const valueInput = document.getElementById('convert_value');
                    const fromSelect = document.getElementById('unit_from');
                    const toSelect = document.getElementById('unit_to');
                    const resultEl = document.getElementById('convert_result');
                    
                    if (!valueInput || !fromSelect || !toSelect || !resultEl) return;
                    
                    const value = parseFloat(valueInput.value) || 0;
                    const fromUnit = fromSelect.value;
                    const toUnit = toSelect.value;
                    
                    if (currentCategory === 'دما') {
                        // تبدیل دما
                        let result;
                        if (fromUnit === 'سلسیوس' && toUnit === 'فارنهایت') {
                            result = (value * 9/5) + 32;
                        } else if (fromUnit === 'فارنهایت' && toUnit === 'سلسیوس') {
                            result = (value - 32) * 5/9;
                        } else if (fromUnit === 'سلسیوس' && toUnit === 'کلوین') {
                            result = value + 273.15;
                        } else if (fromUnit === 'کلوین' && toUnit === 'سلسیوس') {
                            result = value - 273.15;
                        } else {
                            result = value;
                        }
                        
                        resultEl.textContent = result.toFixed(2) + ' ' + toUnit;
                        
                        // ذخیره در تاریخچه
                        addToHistory(value, fromUnit, result, toUnit);
                        
                    } else {
                        // تبدیل سایر واحدها
                        const rates = conversionRates[currentCategory];
                        if (rates && rates[fromUnit] && rates[toUnit]) {
                            const baseValue = value * rates[fromUnit];
                            const result = baseValue / rates[toUnit];
                            
                            resultEl.textContent = result.toFixed(4) + ' ' + toUnit;
                            
                            // ذخیره در تاریخچه
                            addToHistory(value, fromUnit, result, toUnit);
                        }
                    }
                }
                
                function addToHistory(value, fromUnit, result, toUnit) {
                    convertHistory.unshift({
                        from: \`\${value} \${fromUnit}\`,
                        to: \`\${result.toFixed(2)} \${toUnit}\`,
                        time: new Date().toLocaleTimeString('fa-IR')
                    });
                    
                    if (convertHistory.length > 5) convertHistory.pop();
                    updateHistoryDisplay();
                }
                
                function updateHistoryDisplay() {
                    const historyEl = document.getElementById('convert_history');
                    if (!historyEl) return;
                    
                    if (convertHistory.length === 0) {
                        historyEl.innerHTML = '<p>هیچ تبدیلی انجام نشده</p>';
                    } else {
                        let html = '<ul>';
                        convertHistory.forEach(item => {
                            html += \`<li>\${item.from} → \${item.to}</li>\`;
                        });
                        html += '</ul>';
                        historyEl.innerHTML = html;
                    }
                }
                
                function changeCategory(category) {
                    currentCategory = category;
                    updateUnits();
                }
                
                // رویدادها
                document.getElementById('convert_value').addEventListener('input', convert);
                document.getElementById('unit_from').addEventListener('change', convert);
                document.getElementById('unit_to').addEventListener('change', convert);
                
                // دکمه‌های دسته‌بندی
                document.querySelectorAll('.category-btn').forEach(btn => {
                    btn.onclick = () => changeCategory(btn.dataset.category);
                });
                
                // مقداردهی اولیه
                updateUnits();
                updateHistoryDisplay();
            `
        };
    },

    // ۶. لیست کارها (بروزرسانی شده)
    generateTodo(config = {}) {
        return {
            meta: {
                type: 'todo',
                title: config.title || '✅ لیست کارها',
                version: '1.0'
            },
            schema: {
                title: config.title || '✅ لیست کارها',
                components: [
                    {
                        type: 'input',
                        id: 'todo_input',
                        placeholder: 'کار جدید...',
                        buttonText: '➕ اضافه'
                    },
                    {
                        type: 'filter_buttons',
                        filters: ['همه', 'فعال', 'انجام شده']
                    },
                    {
                        type: 'todo_list',
                        id: 'todos_list',
                        items: []
                    },
                    {
                        type: 'stats',
                        items: [
                            { label: 'کل', value: '0' },
                            { label: 'فعال', value: '0' },
                            { label: 'انجام شده', value: '0' }
                        ]
                    },
                    {
                        type: 'actions',
                        buttons: [
                            { id: 'clear_completed', label: '🗑️ حذف انجام شده‌ها', action: 'clear_completed' },
                            { id: 'save_todos', label: '💾 ذخیره', action: 'save_todos' }
                        ]
                    }
                ]
            },
            logic: `
                // منطق لیست کارها
                let todos = JSON.parse(localStorage.getItem('todos')) || [];
                let currentFilter = 'همه';
                
                function renderTodos() {
                    const filtered = todos.filter(todo => {
                        if (currentFilter === 'فعال') return !todo.completed;
                        if (currentFilter === 'انجام شده') return todo.completed;
                        return true;
                    });
                    
                    const listEl = document.getElementById('todos_list');
                    if (!listEl) return;
                    
                    if (filtered.length === 0) {
                        listEl.innerHTML = \`
                            <div class="empty-state">
                                <p>📭 \${currentFilter === 'همه' ? 'لیست کارها خالی است' : 
                                   currentFilter === 'فعال' ? 'هیچ کاری فعال نیست' : 
                                   'هیچ کاری انجام نشده'}</p>
                            </div>
                        \`;
                    } else {
                        let html = '<ul>';
                        filtered.forEach(todo => {
                            html += \`
                                <li class="todo-item \${todo.completed ? 'completed' : ''}">
                                    <input type="checkbox" 
                                           \${todo.completed ? 'checked' : ''}
                                           onchange="toggleTodo(\${todo.id})"
                                           class="todo-checkbox">
                                    <span class="todo-text">\${todo.text}</span>
                                    <div class="todo-actions">
                                        <button onclick="editTodo(\${todo.id})" class="edit-btn">✏️</button>
                                        <button onclick="deleteTodo(\${todo.id})" class="delete-btn">🗑️</button>
                                    </div>
                                </li>
                            \`;
                        });
                        html += '</ul>';
                        listEl.innerHTML = html;
                    }
                    
                    updateStats();
                }
                
                function addTodo() {
                    const input = document.getElementById('todo_input');
                    const text = input.value.trim();
                    
                    if (!text) {
                        alert('لطفاً متن کار را وارد کنید');
                        return;
                    }
                    
                    const newTodo = {
                        id: Date.now(),
                        text: text,
                        completed: false,
                        created: new Date().toISOString()
                    };
                    
                    todos.unshift(newTodo);
                    localStorage.setItem('todos', JSON.stringify(todos));
                    
                    input.value = '';
                    renderTodos();
                }
                
                function toggleTodo(id) {
                    const todo = todos.find(t => t.id === id);
                    if (todo) {
                        todo.completed = !todo.completed;
                        todo.updated = new Date().toISOString();
                        localStorage.setItem('todos', JSON.stringify(todos));
                        renderTodos();
                    }
                }
                
                function editTodo(id) {
                    const todo = todos.find(t => t.id === id);
                    if (!todo) return;
                    
                    const newText = prompt('ویرایش کار:', todo.text);
                    if (newText !== null && newText.trim()) {
                        todo.text = newText.trim();
                        todo.updated = new Date().toISOString();
                        localStorage.setItem('todos', JSON.stringify(todos));
                        renderTodos();
                    }
                }
                
                function deleteTodo(id) {
                    if (confirm('آیا مطمئن هستید؟')) {
                        todos = todos.filter(t => t.id !== id);
                        localStorage.setItem('todos', JSON.stringify(todos));
                        renderTodos();
                    }
                }
                
                function clearCompleted() {
                    if (confirm('حذف همه کارهای انجام شده؟')) {
                        todos = todos.filter(t => !t.completed);
                        localStorage.setItem('todos', JSON.stringify(todos));
                        renderTodos();
                    }
                }
                
                function updateStats() {
                    const total = todos.length;
                    const completed = todos.filter(t => t.completed).length;
                    const active = total - completed;
                    
                    const stats = document.querySelectorAll('.stat-value');
                    if (stats.length >= 3) {
                        stats[0].textContent = total;
                        stats[1].textContent = active;
                        stats[2].textContent = completed;
                    }
                }
                
                function changeFilter(filter) {
                    currentFilter = filter;
                    renderTodos();
                    
                    // فعال کردن دکمه فیلتر
                    document.querySelectorAll('.filter-btn').forEach(btn => {
                        btn.classList.toggle('active', btn.dataset.filter === filter);
                    });
                }
                
                // رویدادها
                document.getElementById('todo_input').addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') addTodo();
                });
                
                // دکمه‌های فیلتر
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.onclick = () => changeFilter(btn.dataset.filter);
                });
                
                // صادر کردن توابع
                window.addTodo = addTodo;
                window.toggleTodo = toggleTodo;
                window.editTodo = editTodo;
                window.deleteTodo = deleteTodo;
                window.clearCompleted = clearCompleted;
                
                // مقداردهی اولیه
                renderTodos();
            `
        };
    },

    // ۷. مخاطبین
    generateContacts(config = {}) {
        return {
            meta: {
                type: 'contacts',
                title: config.title || '👥 مخاطبین',
                version: '1.0'
            },
            schema: {
                title: config.title || '👥 مخاطبین',
                components: [
                    {
                        type: 'search',
                        id: 'contact_search',
                        placeholder: 'جستجوی مخاطب...'
                    },
                    {
                        type: 'contact_list',
                        id: 'contacts_list',
                        groups: ['A', 'B', 'C']
                    },
                    {
                        type: 'contact_form',
                        fields: [
                            { name: 'نام', type: 'text', id: 'contact_name' },
                            { name: 'شماره', type: 'tel', id: 'contact_phone' },
                            { name: 'ایمیل', type: 'email', id: 'contact_email' }
                        ]
                    }
                ]
            },
            logic: `
                // منطق مخاطبین
                let contacts = JSON.parse(localStorage.getItem('contacts')) || [];
                
                function renderContacts(searchTerm = '') {
                    const filtered = contacts.filter(contact => {
                        return !searchTerm || 
                               contact.name.includes(searchTerm) ||
                               contact.phone.includes(searchTerm);
                    });
                    
                    // گروه‌بندی بر اساس حرف اول
                    const grouped = {};
                    filtered.forEach(contact => {
                        const firstLetter = contact.name.charAt(0).toUpperCase();
                        if (!grouped[firstLetter]) {
                            grouped[firstLetter] = [];
                        }
                        grouped[firstLetter].push(contact);
                    });
                    
                    // مرتب‌سازی حروف
                    const sortedLetters = Object.keys(grouped).sort();
                    
                    const listEl = document.getElementById('contacts_list');
                    if (!listEl) return;
                    
                    if (sortedLetters.length === 0) {
                        listEl.innerHTML = \`
                            <div class="empty-state">
                                <p>📇 مخاطبی یافت نشد</p>
                            </div>
                        \`;
                    } else {
                        let html = '';
                        sortedLetters.forEach(letter => {
                            html += \`
                                <div class="contact-group">
                                    <h3>\${letter}</h3>
                                    <div class="group-contacts">
                            \`;
                            
                            grouped[letter].forEach(contact => {
                                html += \`
                                    <div class="contact-item" onclick="showContact(\${contact.id})">
                                        <div class="contact-avatar">\${contact.name.charAt(0)}</div>
                                        <div class="contact-info">
                                            <strong>\${contact.name}</strong>
                                            <small>\${contact.phone}</small>
                                        </div>
                                    </div>
                                \`;
                            });
                            
                            html += '</div></div>';
                        });
                        
                        listEl.innerHTML = html;
                    }
                }
                
                function searchContacts() {
                    const searchInput = document.getElementById('contact_search');
                    renderContacts(searchInput.value);
                }
                
                function addContact() {
                    const name = document.getElementById('contact_name').value.trim();
                    const phone = document.getElementById('contact_phone').value.trim();
                    const email = document.getElementById('contact_email').value.trim();
                    
                    if (!name || !phone) {
                        alert('نام و شماره تماس الزامی است');
                        return;
                    }
                    
                    const newContact = {
                        id: Date.now(),
                        name: name,
                        phone: phone,
                        email: email,
                        created: new Date().toISOString()
                    };
                    
                    contacts.push(newContact);
                    // مرتب‌سازی بر اساس نام
                    contacts.sort((a, b) => a.name.localeCompare(b.name));
                    
                    localStorage.setItem('contacts', JSON.stringify(contacts));
                    
                    // پاک کردن فرم
                    document.getElementById('contact_name').value = '';
                    document.getElementById('contact_phone').value = '';
                    document.getElementById('contact_email').
