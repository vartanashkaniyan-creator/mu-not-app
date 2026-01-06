/**
 * 🎨 سیستم رندر و مدیریت وضعیت
 * تبدیل schema به رابط کاربری
 */

// ==================== وضعیت برنامه ====================
const AppState = {
    current: null,
    history: [],
    data: {
        notes: {},
        todos: [],
        calculator: {
            display: '0',
            history: []
        },
        timer: {
            running: false,
            startTime: 0,
            elapsed: 0,
            interval: null
        }
    },
    
    // ذخیره وضعیت
    save() {
        try {
            const state = {
                current: this.current,
                history: this.history.slice(-10), // 10 مورد آخر
                data: this.data,
                timestamp: Date.now()
            };
            localStorage.setItem('app_state', JSON.stringify(state));
            console.log('💾 وضعیت ذخیره شد');
        } catch (error) {
            console.error('خطا در ذخیره وضعیت:', error);
        }
    },
    
    // بارگذاری وضعیت
    load() {
        try {
            const saved = localStorage.getItem('app_state');
            if (saved) {
                const parsed = JSON.parse(saved);
                this.current = parsed.current;
                this.history = parsed.history || [];
                this.data = parsed.data || this.data;
                console.log('📂 وضعیت بارگذاری شد');
            }
        } catch (error) {
            console.error('خطا در بارگذاری وضعیت:', error);
        }
    },
    
    // اضافه کردن به تاریخچه
    addToHistory(command, result) {
        this.history.push({
            id: Date.now(),
            command: command,
            result: result.meta.type,
            timestamp: new Date().toISOString()
        });
        
        // محدود کردن تاریخچه
        if (this.history.length > 50) {
            this.history = this.history.slice(-50);
        }
        
        this.save();
    },
    
    // دریافت یادداشت‌ها
    getNotes() {
        return this.data.notes;
    },
    
    // ذخیره یادداشت
    saveNote(id, content) {
        if (!content.trim()) return false;
        
        this.data.notes[id] = {
            content: content,
            created: Date.now(),
            updated: Date.now()
        };
        
        this.save();
        return true;
    },
    
    // حذف یادداشت
    deleteNote(id) {
        if (this.data.notes[id]) {
            delete this.data.notes[id];
            this.save();
            return true;
        }
        return false;
    },
    
    // مدیریت TODO
    getTodos() {
        return this.data.todos;
    },
    
    addTodo(text) {
        if (!text.trim()) return null;
        
        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            created: Date.now()
        };
        
        this.data.todos.unshift(todo);
        this.save();
        return todo;
    },
    
    toggleTodo(id) {
        const todo = this.data.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            todo.updated = Date.now();
            this.save();
            return true;
        }
        return false;
    },
    
    deleteTodo(id) {
        const index = this.data.todos.findIndex(t => t.id === id);
        if (index > -1) {
            this.data.todos.splice(index, 1);
            this.save();
            return true;
        }
        return false;
    },
    
    clearCompletedTodos() {
        this.data.todos = this.data.todos.filter(t => !t.completed);
        this.save();
    },
    
    // ماشین حساب
    getCalculatorState() {
        return this.data.calculator;
    },
    
    updateCalculator(value) {
        this.data.calculator.display = value;
        this.save();
    },
    
    addToCalculatorHistory(expression, result) {
        this.data.calculator.history.unshift({
            expression,
            result,
            timestamp: Date.now()
        });
        
        if (this.data.calculator.history.length > 20) {
            this.data.calculator.history.pop();
        }
        
        this.save();
    },
    
    // تایمر
    getTimerState() {
        return this.data.timer;
    },
    
    startTimer() {
        if (this.data.timer.running) return;
        
        this.data.timer.running = true;
        this.data.timer.startTime = Date.now() - this.data.timer.elapsed;
        
        this.data.timer.interval = setInterval(() => {
            this.data.timer.elapsed = Date.now() - this.data.timer.startTime;
            this.updateTimerDisplay();
        }, 100);
        
        this.save();
    },
    
    pauseTimer() {
        if (!this.data.timer.running) return;
        
        this.data.timer.running = false;
        this.data.timer.elapsed = Date.now() - this.data.timer.startTime;
        
        if (this.data.timer.interval) {
            clearInterval(this.data.timer.interval);
            this.data.timer.interval = null;
        }
        
        this.save();
    },
    
    resetTimer() {
        this.data.timer.running = false;
        this.data.timer.elapsed = 0;
        this.data.timer.startTime = 0;
        
        if (this.data.timer.interval) {
            clearInterval(this.data.timer.interval);
            this.data.timer.interval = null;
        }
        
        this.updateTimerDisplay();
        this.save();
    },
    
    updateTimerDisplay() {
        if (!this.data.timer) return;
        
        const elapsed = this.data.timer.elapsed;
        const hours = Math.floor(elapsed / 3600000);
        const minutes = Math.floor((elapsed % 3600000) / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        
        const display = 
            String(hours).padStart(2, '0') + ':' +
            String(minutes).padStart(2, '0') + ':' +
            String(seconds).padStart(2, '0');
        
        // به‌روزرسانی نمایشگر
        const displayEl = document.getElementById('timer_display');
        if (displayEl) {
            displayEl.textContent = display;
        }
    }
};

// ==================== سیستم رندر ====================
const Renderer = {
    // رندر اصلی
    render(schema) {
        if (!schema || !schema.schema) {
            console.error('Schema نامعتبر');
            return;
        }
        
        const appContainer = document.getElementById('app');
        if (!appContainer) return;
        
        // پاک کردن محتوای قبلی
        appContainer.innerHTML = '';
        
        // ذخیره وضعیت فعلی
        AppState.current = schema;
        
        // رندر عنوان
        this.renderTitle(appContainer, schema.schema.title);
        
        // رندر کامپوننت‌ها
        schema.schema.components.forEach(component => {
            this.renderComponent(appContainer, component);
        });
        
        // نمایش هشدارها
        if (schema.meta && schema.meta.alerts && schema.meta.alerts.length > 0) {
            this.showAlerts(schema.meta.alerts);
        }
        
        // به‌روزرسانی وضعیت در نوار
        this.updateStatusBar(schema);
        
        console.log('🎨 صفحه رندر شد:', schema.meta.type);
    },
    
    // رندر عنوان
    renderTitle(container, title) {
        const titleEl = document.createElement('h1');
        titleEl.className = 'app-title';
        titleEl.textContent = title;
        container.appendChild(titleEl);
    },
    
    // رندر کامپوننت بر اساس نوع
    renderComponent(container, component) {
        const { type } = component;
        
        switch (type) {
            case 'welcome':
                this.renderWelcome(container, component);
                break;
                
            case 'quick_grid':
                this.renderQuickGrid(container, component);
                break;
                
            case 'command_input':
                this.renderCommandInput(container, component);
                break;
                
            case 'textarea':
                this.renderTextarea(container, component);
                break;
                
            case 'button':
                this.renderButton(container, component);
                break;
                
            case 'button_group':
                this.renderButtonGroup(container, component);
                break;
                
            case 'notes_list':
                this.renderNotesList(container, component);
                break;
                
            case 'todo_list':
                this.renderTodoList(container, component);
                break;
                
            case 'display':
                this.renderDisplay(container, component);
                break;
                
            case 'calc_grid':
                this.renderCalcGrid(container, component);
                break;
                
            case 'timer_display':
                this.renderTimerDisplay(container, component);
                break;
                
            case 'timer_controls':
                this.renderTimerControls(container, component);
                break;
                
            case 'input':
                this.renderInput(container, component);
                break;
                
            case 'stats':
                this.renderStats(container, component);
                break;
                
            case 'error_list':
                this.renderErrorList(container, component);
                break;
                
            case 'help_text':
                this.renderHelpText(container, component);
                break;
                
            case 'coming_soon':
                this.renderComingSoon(container, component);
                break;
                
            default:
                console.warn('کامپوننت ناشناخته:', type);
        }
    },
    
    // ============ رندر کامپوننت‌های خاص ============
    
    renderWelcome(container, component) {
        const div = document.createElement('div');
        div.className = 'welcome-message';
        div.innerHTML = `
            <div class="welcome-content">
                <p>${component.content}</p>
            </div>
        `;
        container.appendChild(div);
    },
    
    renderQuickGrid(container, component) {
        const grid = document.createElement('div');
        grid.className = 'quick-grid';
        
        component.items.forEach(item => {
            const button = document.createElement('button');
            button.className = 'grid-item';
            button.innerHTML = `
                <span class="item-icon">${item.label.split(' ')[0]}</span>
                <span class="item-text">${item.label.split(' ').slice(1).join(' ')}</span>
            `;
            button.onclick = () => {
                if (window.runCommand) {
                    window.runCommand(item.command);
                }
            };
            grid.appendChild(button);
        });
        
        container.appendChild(grid);
    },
    
    renderCommandInput(container, component) {
        const wrapper = document.createElement('div');
        wrapper.className = 'command-input-wrapper';
        wrapper.innerHTML = `
            <input type="text" 
                   class="command-input" 
                   placeholder="${component.placeholder}"
                   id="dynamic-command-input">
            <button class="command-button" onclick="executeDynamicCommand()">
                ${component.buttonText}
            </button>
        `;
        container.appendChild(wrapper);
    },
    
    renderTextarea(container, component) {
        const wrapper = document.createElement('div');
        wrapper.className = 'textarea-wrapper';
        
        const textarea = document.createElement('textarea');
        textarea.id = component.id;
        textarea.placeholder = component.placeholder || '';
        textarea.rows = component.rows || 4;
        textarea.className = 'app-textarea';
        
        // اگر یادداشت ذخیره‌شده‌ای دارد، بارگذاری کن
        if (component.id === 'note_content' && AppState.current?.meta?.type === 'note') {
            const notes = AppState.getNotes();
            const latestNote = Object.values(notes)[0];
            if (latestNote) {
                textarea.value = latestNote.content;
            }
        }
        
        wrapper.appendChild(textarea);
        container.appendChild(wrapper);
    },
    
    renderButton(container, component) {
        const button = document.createElement('button');
        button.id = component.id;
        button.className = 'app-button';
        button.textContent = component.label;
        
        if (component.action) {
            button.onclick = () => handleAction(component.action, component.id);
        }
        
        container.appendChild(button);
    },
    
    renderButtonGroup(container, component) {
        const group = document.createElement('div');
        group.className = 'button-group';
        
        component.buttons.forEach(btn => {
            const button = document.createElement('button');
            button.id = btn.id;
            button.className = 'group-button';
            button.textContent = btn.label;
            
            if (btn.action) {
                button.onclick = () => handleAction(btn.action, btn.id);
            }
            
            group.appendChild(button);
        });
        
        container.appendChild(group);
    },
    
    renderNotesList(container, component) {
        const wrapper = document.createElement('div');
        wrapper.className = 'notes-list-wrapper';
        
        const title = document.createElement('h3');
        title.textContent = component.title;
        title.className = 'list-title';
        wrapper.appendChild(title);
        
        const list = document.createElement('div');
        list.id = component.id;
        list.className = 'notes-list';
        
        // بارگذاری یادداشت‌ها
        const notes = AppState.getNotes();
        const noteEntries = Object.entries(notes);
        
        if (noteEntries.length === 0) {
            list.innerHTML = '<p class="empty-message">📝 هنوز یادداشتی وجود ندارد</p>';
        } else {
            noteEntries.sort((a, b) => b[1].updated - a[1].updated).forEach(([id, note]) => {
                const noteEl = document.createElement('div');
                noteEl.className = 'note-item';
                noteEl.innerHTML = `
                    <div class="note-content">${note.content.substring(0, 100)}${note.content.length > 100 ? '...' : ''}</div>
                    <div class="note-actions">
                        <button class="small-btn" onclick="loadNote('${id}')">📖 نمایش</button>
                        <button class="small-btn delete-btn" onclick="deleteNote('${id}')">🗑️ حذف</button>
                    </div>
                `;
                list.appendChild(noteEl);
            });
        }
        
        wrapper.appendChild(list);
        container.appendChild(wrapper);
    },
    
    renderTodoList(container, component) {
        const wrapper = document.createElement('div');
        wrapper.className = 'todo-list-wrapper';
        
        const list = document.createElement('div');
        list.id = component.id;
        list.className = 'todo-list';
        
        // بارگذاری TODOها
        const todos = AppState.getTodos();
        
        if (todos.length === 0) {
            list.innerHTML = '<p class="empty-message">✅ لیست کارها خالی است</p>';
        } else {
            todos.forEach(todo => {
                const todoEl = document.createElement('div');
                todoEl.className = `todo-item ${todo.completed ? 'completed' : ''}`;
                todoEl.innerHTML = `
                    <input type="checkbox" 
                           ${todo.completed ? 'checked' : ''} 
                           onchange="toggleTodo(${todo.id})"
                           class="todo-checkbox">
                    <span class="todo-text">${todo.text}</span>
                    <button class="todo-delete" onclick="deleteTodoItem(${todo.id})">🗑️</button>
                `;
                list.appendChild(todoEl);
            });
        }
        
        wrapper.appendChild(list);
        container.appendChild(wrapper);
    },
    
    renderDisplay(container, component) {
        const display = document.createElement('div');
        display.className = 'calc-display';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.id = component.id;
        input.className = 'display-input';
        input.value = component.value || '0';
        input.readOnly = true;
        
        // اگر نمایشگر ماشین حساب است، مقدار ذخیره‌شده را بگذار
        if (component.id === 'calc_display') {
            const calcState = AppState.getCalculatorState();
            input.value = calcState.display;
        }
        
        display.appendChild(input);
        container.appendChild(display);
    },
    
    renderCalcGrid(container, component) {
        const grid = document.createElement('div');
        grid.className = 'calc-grid';
        
        component.rows.forEach(row => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'calc-row';
            
            row.forEach(key => {
                const button = document.createElement('button');
                button.className = `calc-key ${['/', '*', '-', '+', '='].includes(key) ? 'calc-operator' : ''}`;
                button.textContent = key;
                button.onclick = () => handleCalculatorKey(key);
                rowDiv.appendChild(button);
            });
            
            grid.appendChild(rowDiv);
        });
        
        container.appendChild(grid);
    },
    
    renderTimerDisplay(container, component) {
        const display = document.createElement('div');
        display.className = 'timer-display';
        
        const time = document.createElement('div');
        time.id = component.id;
        time.className = 'time-text';
        time.textContent = component.value;
        
        // به‌روزرسانی از وضعیت ذخیره‌شده
        const timerState = AppState.getTimerState();
        AppState.updateTimerDisplay();
        
        display.appendChild(time);
        container.appendChild(display);
    },
    
    renderTimerControls(container, component) {
        this.renderButtonGroup(container, component);
    },
    
    renderInput(container, component) {
        const wrapper = document.createElement('div');
        wrapper.className = 'input-with-button';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.id = component.id;
        input.placeholder = component.placeholder || '';
        input.className = 'app-input';
        
        const button = document.createElement('button');
        button.className = 'input-button';
        button.textContent = component.buttonText;
        
        if (component.id === 'todo_input') {
            button.onclick = () => addTodoFromInput();
            input.onkeypress = (e) => {
                if (e.key === 'Enter') addTodoFromInput();
            };
        }
        
        wrapper.appendChild(input);
        wrapper.appendChild(button);
        container.appendChild(wrapper);
    },
    
    renderStats(container, component) {
        const stats = document.createElement('div');
        stats.className = 'stats-container';
        
        component.items.forEach(stat => {
            const statEl = document.createElement('div');
            statEl.className = 'stat-item';
            statEl.innerHTML = `
                <div class="stat-label">${stat.label}</div>
                <div class="stat-value">${stat.value}</div>
            `;
            stats.appendChild(statEl);
        });
        
        container.appendChild(stats);
    },
    
    renderErrorList(container, component) {
        const list = document.createElement('div');
        list.className = 'error-list';
        
        component.errors.forEach(error => {
            const errorEl = document.createElement('div');
            errorEl.className = 'error-item';
            errorEl.innerHTML = `
                <div class="error-line">خط ${error.line}:</div>
                <div class="error-command">${error.command}</div>
                <div class="error-suggestion">${error.suggestion}</div>
            `;
            list.appendChild(errorEl);
        });
        
        container.appendChild(list);
    },
    
    renderHelpText(container, component) {
        const help = document.createElement('div');
        help.className = 'help-text';
        help.textContent = component.content;
        container.appendChild(help);
    },
    
    renderComingSoon(container, component) {
        const soon = document.createElement('div');
        soon.className = 'coming-soon';
        soon.innerHTML = `
            <div class="soon-icon">🚧</div>
            <div class="soon-text">${component.message}</div>
        `;
        container.appendChild(soon);
    },
    
    // ============ توابع کمکی ============
    
    showAlerts(alerts) {
        alerts.forEach(alert => {
            setTimeout(() => {
                if (window.showAlert) {
                    window.showAlert(alert.message);
                } else {
                    alert(alert.message);
                }
            }, 300);
        });
    },
    
    updateStatusBar(schema) {
        // به‌روزرسانی وضعیت
        if (window.updateStatus) {
            const type = schema.meta.type;
            const title = schema.meta.title || '';
            window.updateStatus(`${title} | ${type}`);
        }
        
        // به‌روزرسانی شمارنده
        const appCounter = document.getElementById('app-counter');
        if (appCounter) {
            const historyCount = AppState.history.length;
            appCounter.textContent = `${historyCount}/۲۵`;
        }
    }
};

// ==================== مدیریت اکشن‌ها ====================
function handleAction(action, elementId) {
    console.log('🔧 اکشن:', action, 'المنت:', elementId);
    
    switch (action) {
        case 'go_home':
            runApp('خانه');
            break;
            
        case 'save_note':
            saveCurrentNote();
            break;
            
        case 'load_note':
            loadNoteFromStorage();
            break;
            
        case 'clear_note':
            clearNote();
            break;
            
        case 'clear_calc':
            clearCalculator();
            break;
            
        case 'backspace':
            calculatorBackspace();
            break;
            
        case 'show_history':
            showCalculatorHistory();
            break;
            
        case 'clear_done':
            clearCompletedTodos();
            break;
            
        case 'clear_all':
            clearAllTodos();
            break;
            
        case 'start_timer':
            AppState.startTimer();
            break;
            
        case 'pause_timer':
            AppState.pauseTimer();
            break;
            
        case 'reset_timer':
            AppState.resetTimer();
            break;
            
        default:
            console.warn('اکشن ناشناخته:', action);
    }
}

// ==================== توابع اصلی ====================

// اجرای برنامه
function runApp(input) {
    if (!input || typeof input !== 'string') {
        console.error('ورودی نامعتبر');
        return;
    }
    
    // پردازش توسط موتور
    const result = runEngine(input);
    
    // ذخیره در تاریخچه
    AppState.addToHistory(input, result);
    
    // رندر نتیجه
    Renderer.render(result);
    
    // به‌روزرسانی تایمر اگر فعال است
    if (AppState.getTimerState().running) {
        AppState.updateTimerDisplay();
    }
}

// ==================== توابع مربوط به یادداشت ====================
function saveCurrentNote() {
    const textarea = document.getElementById('note_content');
    if (!textarea) return;
    
    const content = textarea.value.trim();
    if (!content) {
        alert('⚠️ لطفاً متن یادداشت را وارد کنید');
        return;
    }
    
    const noteId = 'note_' + Date.now();
    const success = AppState.saveNote(noteId, content);
    
    if (success) {
        alert('✅ یادداشت ذخیره شد');
        // رندر مجدد لیست
        if (AppState.current?.meta?.type === 'note') {
            runApp('صفحه note');
        }
    } else {
        alert('❌ خطا در ذخیره یادداشت');
    }
}

function loadNoteFromStorage() {
    const notes = AppState.getNotes();
    const latestNote = Object.values(notes)[0];
    
    if (latestNote) {
        const textarea = document.getElementById('note_content');
        if (textarea) {
            textarea.value = latestNote.content;
            alert('📝 آخرین یادداشت بارگذاری شد');
        }
    } else {
        alert('📭 یادداشتی برای بارگذاری وجود ندارد');
    }
}

function clearNote() {
    if (confirm('آیا مطمئن هستید که می‌خواهید متن فعلی را پاک کنید؟')) {
        const textarea = document.getElementById('note_content');
        if (textarea) {
            textarea.value = '';
        }
    }
}

function loadNote(id) {
    const notes = AppState.getNotes();
    const note = notes[id];
    
    if (note && window.runApp) {
        const textarea = document.getElementById('note_content');
        if (textarea) {
            textarea.value = note.content;
        }
        alert('📖 یادداشت بارگذاری شد');
    }
}

function deleteNote(id) {
    if (confirm('آیا مطمئن هستید که می‌خواهید این یادداشت را حذف کنید؟')) {
        const success = AppState.deleteNote(id);
        if (success) {
            if (AppState.current?.meta?.type === 'note') {
                runApp('صفحه note');
            }
        }
    }
}

// ==================== توابع مربوط به ماشین حساب ====================
let calculatorExpression = '';

function handleCalculatorKey(key) {
    const display = document.getElementById('calc_display');
    if (!display) return;
    
    if (key === '=') {
        calculateResult();
    } else if (key === 'C') {
        clearCalculator();
    } else if (key === '⌫') {
        calculatorBackspace();
    } else {
        if (display.value === '0' && !['+', '-', '*', '/', '.'].includes(key)) {
            display.value = key;
        } else {
            display.value += key;
        }
        calculatorExpression = display.value;
        AppState.updateCalculator(display.value);
    }
}

function calculateResult() {
    const display = document.getElementById('calc_display');
    if (!display || !display.value.trim()) return;
    
    try {
        // جایگزینی نمادها
        let expression = display.value
            .replace(/÷/g, '/')
            .replace(/×/g, '*');
        
        // محاسبه ایمن
        const result = Function('"use strict"; return (' + expression + ')')();
        
        // گرد کردن
        const rounded = Math.round(result * 100000000) / 100000000;
        
        // ذخیره در تاریخچه
        AppState.addToCalculatorHistory(display.value, rounded.toString());
        
        // نمایش نتیجه
        display.value = rounded.toString();
        calculatorExpression = rounded.toString();
        AppState.updateCalculator(rounded.toString());
        
    } catch (error) {
        display.value = 'Error';
        calculatorExpression = '';
        AppState.updateCalculator('Error');
    }
}

function clearCalculator() {
    const display = document.getElementById('calc_display');
    if (display) {
        display.value = '0';
        calculatorExpression = '';
        AppState.updateCalculator('0');
    }
}

function calculatorBackspace() {
    const display = document.getElementById('calc_display');
    if (display && display.value.length > 1) {
        display.value = display.value.slice(0, -1);
        calculatorExpression = display.value;
        AppState.updateCalculator(display.value);
    } else if (display) {
        display.value = '0';
        calculatorExpression = '';
        AppState.updateCalculator('0');
    }
}

function showCalculatorHistory() {
    const history = AppState.getCalculatorState().history;
    if (history.length === 0) {
        alert('📜 تاریخچه‌ای وجود ندارد');
        return;
    }
    
    let message = '📜 تاریخچه محاسبات:\n\n';
    history.forEach((item, index) => {
        message += `${index + 1}. ${item.expression} = ${item.result}\n`;
    });
    
    alert(message);
}

// ==================== توابع مربوط به TODO ====================
function addTodoFromInput() {
    const input = document.getElementById('todo_input');
    if (!input) return;
    
    const text = input.value.trim();
    if (!text) {
        alert('⚠️ لطفاً متن کار را وارد کنید');
        return;
    }
    
    const todo = AppState.addTodo(text);
    if (todo) {
        input.value = '';
        // رندر مجدد لیست
        if (AppState.current?.meta?.type === 'todo') {
            runApp('صفحه todo');
        }
    }
}

function toggleTodo(id) {
    AppState.toggleTodo(id);
    // به‌روزرسانی آمار
    updateTodoStats();
}

function deleteTodoItem(id) {
    if (confirm('آیا مطمئن هستید که می‌خواهید این کار را حذف کنید؟')) {
        AppState.deleteTodo(id);
        // رندر مجدد لیست
        if (AppState.current?.meta?.type === 'todo') {
            runApp('صفحه todo');
        }
    }
}

function clearCompletedTodos() {
    if (confirm('آیا مطمئن هستید که می‌خواهید کارهای انجام شده را حذف کنید؟')) {
        AppState.clearCompletedTodos();
        if (AppState.current?.meta?.type === 'todo') {
            runApp('صفحه todo');
        }
    }
}

function clearAllTodos() {
    if (confirm('⚠️ آیا مطمئن هستید که می‌خواهید همه کارها را حذف کنید؟')) {
        AppState.data.todos = [];
        AppState.save();
        if (AppState.current?.meta?.type === 'todo') {
            runApp('صفحه todo');
        }
    }
}

function updateTodoStats() {
    const todos = AppState.getTodos();
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const remaining = total - completed;
    
    // به‌روزرسانی نمایشگر آمار
    const stats = document.querySelectorAll('.stat-value');
    if (stats.length >= 3) {
        stats[0].textContent = total;
        stats[1].textContent = completed;
        stats[2].textContent = remaining;
    }
}

// ==================== توابع کمکی ====================
function executeDynamicCommand() {
    const input = document.getElementById('dynamic-command-input');
    if (input && input.value.trim()) {
        runApp(input.value);
        input.value = '';
    }
}

function showAlert(message) {
    // ساخت alert سفارشی
    const alertDiv = document.createElement('div');
    alertDiv.className = 'custom-alert';
    alertDiv.innerHTML = `
        <div class="alert-content">
            <p>${message}</p>
            <button onclick="this.parentElement.parentElement.remove()">OK</button>
        </div>
    `;
    
    document.body.appendChild(alertDiv);
    
    // حذف خودکار بعد از 3 ثانیه
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 3000);
}

// ==================== مقداردهی اولیه ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 برنامه در حال راه‌اندازی...');
    
    // بارگذاری وضعیت ذخیره‌شده
    AppState.load();
    
    // شروع با صفحه خانه
    if (!AppState.current) {
        runApp('خانه');
    } else {
        Renderer.render(AppState.current);
    }
    
    // به‌روزرسانی تایمر اگر فعال است
    if (AppState.getTimerState().running) {
        AppState.startTimer(); // ادامه تایمر
    }
    
    // فوکوس روی input دستورات
    const commandInput = document.getElementById('command-input');
    if (commandInput) {
        commandInput.focus();
    }
    
    console.log('✅ برنامه آماده است');
});

// ==================== صادر کردن توابع ====================
window.runApp = runApp;
window.handleAction = handleAction;
window.saveCurrentNote = saveCurrentNote;
window.loadNote = loadNote;
window.deleteNote = deleteNote;
window.addTodoFromInput = addTodoFromInput;
window.toggleTodo = toggleTodo;
window.deleteTodoItem = deleteTodoItem;
window.clearCompletedTodos = clearCompletedTodos;
window.clearAllTodos = clearAllTodos;
window.executeDynamicCommand = executeDynamicCommand;
window.showAlert = showAlert;

window.AppState = AppState;
window.Renderer = Renderer;
