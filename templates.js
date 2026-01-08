// templates.js - سیستم تمپلیت‌ها
export class TemplateManager {
    constructor() {
        this.templates = new Map();
        this.categories = new Map();
        this.userTemplates = new Map();
        this.init();
    }

    init() {
        this.loadDefaultTemplates();
        this.loadUserTemplates();
        this.setupCategories();
    }

    setupCategories() {
        this.categories.set('اپ‌ها', [
            'todo',
            'notes',
            'calculator',
            'weather',
            'expense',
            'habit',
            'timer',
            'converter'
        ]);
        
        this.categories.set('فرم‌ها', [
            'contact',
            'signup',
            'login',
            'feedback',
            'order',
            'survey'
        ]);
        
        this.categories.set('صفحات', [
            'landing',
            'dashboard',
            'profile',
            'settings',
            'about',
            'pricing'
        ]);
        
        this.categories.set('ویژه', [
            'restaurant',
            'shop',
            'portfolio',
            'blog',
            'event',
            'news'
        ]);
    }

    loadDefaultTemplates() {
        // تمپلیت Todo App
        this.addTemplate({
            id: 'todo',
            name: 'برنامه کارها',
            category: 'اپ‌ها',
            description: 'اپلیکیشن مدیریت کارهای روزانه',
            html: `
                <div class="todo-app">
                    <header>
                        <h1>📝 کارهای من</h1>
                        <div class="stats">
                            <span id="total-tasks">0 کار</span>
                            <span id="completed-tasks">0 انجام شده</span>
                        </div>
                    </header>
                    
                    <div class="add-task">
                        <input type="text" id="new-task" placeholder="کار جدید...">
                        <button id="add-btn">➕ افزودن</button>
                    </div>
                    
                    <div class="filters">
                        <button class="filter active" data-filter="all">همه</button>
                        <button class="filter" data-filter="pending">در انتظار</button>
                        <button class="filter" data-filter="completed">انجام شده</button>
                    </div>
                    
                    <ul id="task-list" class="task-list"></ul>
                </div>
            `,
            css: `
                .todo-app {
                    max-width: 500px;
                    margin: 0 auto;
                    padding: 20px;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }
                
                header {
                    text-align: center;
                    margin-bottom: 30px;
                }
                
                .stats {
                    display: flex;
                    justify-content: center;
                    gap: 20px;
                    margin-top: 10px;
                    color: #666;
                    font-size: 14px;
                }
                
                .add-task {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 20px;
                }
                
                #new-task {
                    flex: 1;
                    padding: 12px;
                    border: 2px solid #ddd;
                    border-radius: 8px;
                    font-size: 16px;
                }
                
                #add-btn {
                    padding: 12px 24px;
                    background: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 16px;
                }
                
                .filters {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 20px;
                }
                
                .filter {
                    flex: 1;
                    padding: 8px;
                    background: #f0f0f0;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                }
                
                .filter.active {
                    background: #2196F3;
                    color: white;
                }
                
                .task-list {
                    list-style: none;
                    padding: 0;
                }
                
                .task-item {
                    display: flex;
                    align-items: center;
                    padding: 12px;
                    margin-bottom: 8px;
                    background: white;
                    border: 1px solid #eee;
                    border-radius: 8px;
                }
                
                .task-item.completed {
                    opacity: 0.6;
                    text-decoration: line-through;
                }
                
                .task-checkbox {
                    margin-right: 12px;
                }
                
                .task-text {
                    flex: 1;
                }
                
                .delete-task {
                    background: none;
                    border: none;
                    color: #f44336;
                    cursor: pointer;
                    font-size: 18px;
                }
            `,
            javascript: `
                class TodoApp {
                    constructor() {
                        this.tasks = JSON.parse(localStorage.getItem('todo_tasks')) || [];
                        this.filter = 'all';
                        this.init();
                    }
                    
                    init() {
                        this.render();
                        this.bindEvents();
                        this.updateStats();
                    }
                    
                    bindEvents() {
                        document.getElementById('add-btn').addEventListener('click', () => this.addTask());
                        document.getElementById('new-task').addEventListener('keypress', (e) => {
                            if (e.key === 'Enter') this.addTask();
                        });
                        
                        document.querySelectorAll('.filter').forEach(btn => {
                            btn.addEventListener('click', (e) => {
                                document.querySelectorAll('.filter').forEach(b => b.classList.remove('active'));
                                e.target.classList.add('active');
                                this.filter = e.target.dataset.filter;
                                this.render();
                            });
                        });
                    }
                    
                    addTask() {
                        const input = document.getElementById('new-task');
                        const text = input.value.trim();
                        
                        if (text) {
                            this.tasks.push({
                                id: Date.now(),
                                text: text,
                                completed: false,
                                createdAt: new Date().toISOString()
                            });
                            
                            input.value = '';
                            this.save();
                            this.render();
                            this.updateStats();
                        }
                    }
                    
                    toggleTask(id) {
                        const task = this.tasks.find(t => t.id === id);
                        if (task) {
                            task.completed = !task.completed;
                            this.save();
                            this.render();
                            this.updateStats();
                        }
                    }
                    
                    deleteTask(id) {
                        this.tasks = this.tasks.filter(t => t.id !== id);
                        this.save();
                        this.render();
                        this.updateStats();
                    }
                    
                    save() {
                        localStorage.setItem('todo_tasks', JSON.stringify(this.tasks));
                    }
                    
                    render() {
                        const list = document.getElementById('task-list');
                        let filteredTasks = this.tasks;
                        
                        if (this.filter === 'pending') {
                            filteredTasks = this.tasks.filter(t => !t.completed);
                        } else if (this.filter === 'completed') {
                            filteredTasks = this.tasks.filter(t => t.completed);
                        }
                        
                        list.innerHTML = filteredTasks.map(task => \`
                            <li class="task-item \${task.completed ? 'completed' : ''}" data-id="\${task.id}">
                                <input type="checkbox" 
                                       class="task-checkbox" 
                                       \${task.completed ? 'checked' : ''}
                                       onchange="todoApp.toggleTask(\${task.id})">
                                <span class="task-text">\${task.text}</span>
                                <button class="delete-task" onclick="todoApp.deleteTask(\${task.id})">🗑️</button>
                            </li>
                        \`).join('');
                    }
                    
                    updateStats() {
                        const total = this.tasks.length;
                        const completed = this.tasks.filter(t => t.completed).length;
                        
                        document.getElementById('total-tasks').textContent = \`\${total} کار\`;
                        document.getElementById('completed-tasks').textContent = \`\${completed} انجام شده\`;
                    }
                }
                
                const todoApp = new TodoApp();
                window.todoApp = todoApp;
            `,
            dependencies: [],
            tags: ['todo', 'tasks', 'productivity'],
            rating: 4.8,
            downloads: 1250
        });

        // تمپلیت Notes App
        this.addTemplate({
            id: 'notes',
            name: 'یادداشت‌نگار',
            category: 'اپ‌ها',
            description: 'اپلیکیشن یادداشت‌برداری ساده',
            html: `
                <div class="notes-app">
                    <div class="sidebar">
                        <div class="sidebar-header">
                            <h2>📓 یادداشت‌ها</h2>
                            <button id="new-note-btn">➕ جدید</button>
                        </div>
                        <div class="search-box">
                            <input type="text" id="search-notes" placeholder="جستجو...">
                        </div>
                        <div id="notes-list" class="notes-list"></div>
                    </div>
                    
                    <div class="editor">
                        <div class="editor-header">
                            <input type="text" id="note-title" placeholder="عنوان یادداشت">
                            <div class="editor-actions">
                                <button id="save-note">💾 ذخیره</button>
                                <button id="delete-note">🗑️ حذف</button>
                            </div>
                        </div>
                        <textarea id="note-content" placeholder="متن یادداشت را اینجا بنویسید..."></textarea>
                    </div>
                </div>
            `,
            css: `
                .notes-app {
                    display: flex;
                    height: 100vh;
                    font-family: 'Vazirmatn', sans-serif;
                }
                
                .sidebar {
                    width: 300px;
                    background: #f8f9fa;
                    border-left: 1px solid #dee2e6;
                    display: flex;
                    flex-direction: column;
                }
                
                .sidebar-header {
                    padding: 20px;
                    border-bottom: 1px solid #dee2e6;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                #new-note-btn {
                    padding: 8px 16px;
                    background: #28a745;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                }
                
                .search-box {
                    padding: 15px 20px;
                    border-bottom: 1px solid #dee2e6;
                }
                
                #search-notes {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ced4da;
                    border-radius: 6px;
                    font-size: 14px;
                }
                
                .notes-list {
                    flex: 1;
                    overflow-y: auto;
                    padding: 10px;
                }
                
                .note-item {
                    padding: 15px;
                    margin-bottom: 10px;
                    background: white;
                    border: 1px solid #dee2e6;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .note-item:hover {
                    background: #e9ecef;
                }
                
                .note-item.active {
                    background: #007bff;
                    color: white;
                    border-color: #007bff;
                }
                
                .note-title {
                    font-weight: bold;
                    margin-bottom: 5px;
                }
                
                .note-preview {
                    font-size: 12px;
                    color: #666;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                }
                
                .editor {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }
                
                .editor-header {
                    padding: 20px;
                    border-bottom: 1px solid #dee2e6;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                #note-title {
                    flex: 1;
                    padding: 10px;
                    font-size: 24px;
                    font-weight: bold;
                    border: none;
                    outline: none;
                }
                
                .editor-actions {
                    display: flex;
                    gap: 10px;
                }
                
                .editor-actions button {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                }
                
                #save-note {
                    background: #28a745;
                    color: white;
                }
                
                #delete-note {
                    background: #dc3545;
                    color: white;
                }
                
                #note-content {
                    flex: 1;
                    padding: 20px;
                    border: none;
                    outline: none;
                    resize: none;
                    font-size: 16px;
                    line-height: 1.6;
                    font-family: 'Vazirmatn', sans-serif;
                }
            `,
            javascript: `
                class NotesApp {
                    constructor() {
                        this.notes = JSON.parse(localStorage.getItem('simple_notes')) || [];
                        this.currentNote = null;
                        this.init();
                    }
                    
                    init() {
                        this.renderNotesList();
                        this.bindEvents();
                        this.selectFirstNote();
                    }
                    
                    bindEvents() {
                        document.getElementById('new-note-btn').addEventListener('click', () => this.createNote());
                        document.getElementById('save-note').addEventListener('click', () => this.saveNote());
                        document.getElementById('delete-note').addEventListener('click', () => this.deleteNote());
                        document.getElementById('search-notes').addEventListener('input', (e) => this.searchNotes(e.target.value));
                    }
                    
                    createNote() {
                        const note = {
                            id: Date.now(),
                            title: 'یادداشت جدید',
                            content: '',
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                        };
                        
                        this.notes.unshift(note);
                        this.selectNote(note.id);
                        this.save();
                        this.renderNotesList();
                    }
                    
                    selectNote(id) {
                        this.currentNote = this.notes.find(n => n.id === id);
                        if (this.currentNote) {
                            document.getElementById('note-title').value = this.currentNote.title;
                            document.getElementById('note-content').value = this.currentNote.content;
                            
                            document.querySelectorAll('.note-item').forEach(item => {
                                item.classList.remove('active');
                                if (parseInt(item.dataset.id) === id) {
                                    item.classList.add('active');
                                }
                            });
                        }
                    }
                    
                    saveNote() {
                        if (!this.currentNote) return;
                        
                        this.currentNote.title = document.getElementById('note-title').value.trim() || 'بدون عنوان';
                        this.currentNote.content = document.getElementById('note-content').value;
                        this.currentNote.updatedAt = new Date().toISOString();
                        
                        this.save();
                        this.renderNotesList();
                    }
                    
                    deleteNote() {
                        if (!this.currentNote) return;
                        
                        if (confirm('آیا از حذف این یادداشت اطمینان دارید؟')) {
                            this.notes = this.notes.filter(n => n.id !== this.currentNote.id);
                            this.currentNote = null;
                            
                            document.getElementById('note-title').value = '';
                            document.getElementById('note-content').value = '';
                            
                            this.save();
                            this.renderNotesList();
                            this.selectFirstNote();
                        }
                    }
                    
                    searchNotes(query) {
                        const filtered = this.notes.filter(note => 
                            note.title.includes(query) || 
                            note.content.includes(query)
                        );
                        
                        this.renderNotesList(filtered);
                    }
                    
                    renderNotesList(notes = this.notes) {
                        const list = document.getElementById('notes-list');
                        
                        list.innerHTML = notes.map(note => \`
                            <div class="note-item \${this.currentNote?.id === note.id ? 'active' : ''}" 
                                 data-id="\${note.id}"
                                 onclick="notesApp.selectNote(\${note.id})">
                                <div class="note-title">\${note.title}</div>
                                <div class="note-preview">\${note.content.substring(0, 100)}</div>
                                <div class="note-date">\${new Date(note.updatedAt).toLocaleDateString('fa-IR')}</div>
                            </div>
                        \`).join('');
                    }
                    
                    selectFirstNote() {
                        if (this.notes.length > 0) {
                            this.selectNote(this.notes[0].id);
                        }
                    }
                    
                    save() {
                        localStorage.setItem('simple_notes', JSON.stringify(this.notes));
                    }
                }
                
                const notesApp = new NotesApp();
                window.notesApp = notesApp;
            `,
            dependencies: [],
            tags: ['notes', 'text', 'editor'],
            rating: 4.7,
            downloads: 980
        });

        // تمپلیت Calculator
        this.addTemplate({
            id: 'calculator',
            name: 'ماشین حساب',
            category: 'اپ‌ها',
            description: 'ماشین حساب ساده و علمی',
            html: `
                <div class="calculator">
                    <div class="display">
                        <div class="history" id="calc-history"></div>
                        <div class="current" id="calc-display">0</div>
                    </div>
                    
                    <div class="memory-info" id="memory-display"></div>
                    
                    <div class="buttons">
                        <div class="row">
                            <button class="btn func" data-action="MC">MC</button>
                            <button class="btn func" data-action="MR">MR</button>
                            <button class="btn func" data-action="M+">M+</button>
                            <button class="btn func" data-action="M-">M-</button>
                            <button class="btn op" data-action="C">C</button>
                            <button class="btn op" data-action="CE">CE</button>
                            <button class="btn op" data-action="⌫">⌫</button>
                            <button class="btn op" data-action="÷">÷</button>
                        </div>
                        
                        <div class="row">
                            <button class="btn sci" data-action="sin">sin</button>
                            <button class="btn sci" data-action="cos">cos</button>
                            <button class="btn sci" data-action="tan">tan</button>
                            <button class="btn num" data-action="7">7</button>
                            <button class="btn num" data-action="8">8</button>
                            <button class="btn num" data-action="9">9</button>
                            <button class="btn op" data-action="×">×</button>
                        </div>
                        
                        <div class="row">
                            <button class="btn sci" data-action="log">log</button>
                            <button class="btn sci" data-action="ln">ln</button>
                            <button class="btn sci" data-action="√">√</button>
                            <button class="btn num" data-action="4">4</button>
                            <button class="btn num" data-action="5">5</button>
                            <button class="btn num" data-action="6">6</button>
                            <button class="btn op" data-action="-">-</button>
                        </div>
                        
                        <div class="row">
                            <button class="btn sci" data-action="x²">x²</button>
                            <button class="btn sci" data-action="x³">x³</button>
                            <button class="btn sci" data-action="1/x">1/x</button>
                            <button class="btn num" data-action="1">1</button>
                            <button class="btn num" data-action="2">2</button>
                            <button class="btn num" data-action="3">3</button>
                            <button class="btn op" data-action="+">+</button>
                        </div>
                        
                        <div class="row">
                            <button class="btn sci" data-action="π">π</button>
                            <button class="btn sci" data-action="e">e</button>
                            <button class="btn sci" data-action="%">%</button>
                            <button class="btn num zero" data-action="0">0</button>
                            <button class="btn num" data-action=".">.</button>
                            <button class="btn eq" data-action="=">=</button>
                        </div>
                    </div>
                </div>
            `,
            css: `
                .calculator {
                    max-width: 400px;
                    margin: 0 auto;
                    background: #2c3e50;
                    border-radius: 20px;
                    padding: 20px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                }
                
                .display {
                    background: #34495e;
                    border-radius: 10px;
                    padding: 20px;
                    margin-bottom: 20px;
                    text-align: right;
                    min-height: 100px;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-end;
                }
                
                .history {
                    color: #7f8c8d;
                    font-size: 14px;
                    min-height: 20px;
                    word-break: break-all;
                }
                
                .current {
                    color: white;
                    font-size: 36px;
                    font-weight: bold;
                    word-break: break-all;
                }
                
                .memory-info {
                    color: #3498db;
                    font-size: 14px;
                    margin-bottom: 10px;
                    text-align: right;
                    min-height: 20px;
                }
                
                .buttons {
                    display: grid;
                    grid-template-rows: repeat(5, 1fr);
                    gap: 10px;
                }
                
                .row {
                    display: grid;
                    grid-template-columns: repeat(8, 1fr);
                    gap: 8px;
                }
                
                .btn {
                    border: none;
                    border-radius: 10px;
                    font-size: 18px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.2s;
                    padding: 15px 5px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .btn:active {
                    transform: scale(0.95);
                }
                
                .num {
                    background: #34495e;
                    color: white;
                    grid-column: span 2;
                }
                
                .num:hover {
                    background: #3d566e;
                }
                
                .zero {
                    grid-column: span 4;
                }
                
                .op {
                    background: #e67e22;
                    color: white;
                }
                
                .op:hover {
                    background: #f39c12;
                }
                
                .func {
                    background: #16a085;
                    color: white;
                    font-size: 14px;
                }
                
                .func:hover {
                    background: #1abc9c;
                }
                
                .sci {
                    background: #8e44ad;
                    color: white;
                    font-size: 14px;
                }
                
                .sci:hover {
                    background: #9b59b6;
                }
                
                .eq {
                    background: #27ae60;
                    color: white;
                    grid-column: span 2;
                }
                
                .eq:hover {
                    background: #2ecc71;
                }
            `,
            javascript: `
                class CalculatorApp {
                    constructor() {
                        this.current = '0';
                        this.previous = null;
                        this.operation = null;
                        this.memory = 0;
                        this.history = [];
                        this.init();
                    }
                    
                    init() {
                        this.updateDisplay();
                        this.bindEvents();
                        this.loadMemory();
                    }
                    
                    bindEvents() {
                        document.querySelectorAll('.btn').forEach(btn => {
                            btn.addEventListener('click', (e) => {
                                const action = e.target.dataset.action;
                                this.handleInput(action);
                            });
                        });
                        
                        document.addEventListener('keydown', (e) => {
                            const key = e.key;
                            const actions = {
                                '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
                                '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
                                '.': '.', '+': '+', '-': '-', '*': '×', '/': '÷',
                                'Enter': '=', 'Escape': 'C', 'Backspace': '⌫',
                                '%': '%'
                            };
                            
                            if (actions[key] !== undefined) {
                                e.preventDefault();
                                this.handleInput(actions[key]);
                            }
                        });
                    }
                    
                    handleInput(action) {
                        if (this.isNumber(action)) {
                            this.inputNumber(action);
                        } else if (action === '.') {
                            this.inputDecimal();
                        } else if (this.isOperator(action)) {
                            this.inputOperator(action);
                        } else if (action === '=' || action === 'Enter') {
                            this.calculate();
                        } else if (action === 'C') {
                            this.clear();
                        } else if (action === 'CE') {
                            this.clearEntry();
                        } else if (action === '⌫') {
                            this.backspace();
                        } else if (action.startsWith('M')) {
                            this.handleMemory(action);
                        } else {
                            this.handleScientific(action);
                        }
                        
                        this.updateDisplay();
                        this.updateMemoryDisplay();
                    }
                    
                    inputNumber(num) {
                        if (this.current === '0' || this.operation === '=') {
                            this.current = num;
                            if (this.operation === '=') this.operation = null;
                        } else {
                            this.current += num;
                        }
                    }
                    
                    inputDecimal() {
                        if (!this.current.includes('.')) {
                            this.current += '.';
                        }
                    }
                    
                    inputOperator(op) {
                        if (this.operation && this.previous !== null) {
                            this.calculate();
                        }
                        
                        this.previous = parseFloat(this.current);
                        this.operation = op;
                        this.current = '0';
                        
                        this.addHistory(\`\${this.previous} \${op}\`);
                    }
                    
                    calculate() {
                        if (this.operation === null || this.previous === null) return;
                        
                        const currentNum = parseFloat(this.current);
                        let result;
                        
                        switch (this.operation) {
                            case '+': result = this.previous + currentNum; break;
                            case '-': result = this.previous - currentNum; break;
                            case '×': result = this.previous * currentNum; break;
                            case '÷': result = this.previous / currentNum; break;
                            case '%': result = this.previous % currentNum; break;
                            default: result = currentNum;
                        }
                        
                        this.addHistory(\`\${this.current} = \${result}\`);
                        
                        this.current = result.toString();
                        this.previous = null;
                        this.operation = '=';
                    }
                    
                    clear() {
                        this.current = '0';
                        this.previous = null;
                        this.operation = null;
                    }
                    
                    clearEntry() {
                        this.current = '0';
                    }
                    
                    backspace() {
                        if (this.current.length > 1) {
                            this.current = this.current.slice(0, -1);
                        } else {
                            this.current = '0';
                        }
                    }
                    
                    handleMemory(action) {
                        const num = parseFloat(this.current);
                        
                        switch (action) {
                            case 'MC':
                                this.memory = 0;
                                break;
                            case 'MR':
                                this.current = this.memory.toString();
                                break;
                            case 'M+':
                                this.memory += num;
                                break;
                            case 'M-':
                                this.memory -= num;
                                break;
                        }
                        
                        this.saveMemory();
                    }
                    
                    handleScientific(action) {
                        const num = parseFloat(this.current);
                        let result;
                        
                        switch (action) {
                            case 'sin': result = Math.sin(num * Math.PI / 180); break;
                            case 'cos': result = Math.cos(num * Math.PI / 180); break;
                            case 'tan': result = Math.tan(num * Math.PI / 180); break;
                            case 'log': result = Math.log10(num); break;
                            case 'ln': result = Math.log(num); break;
                            case '√': result = Math.sqrt(num); break;
                            case 'x²': result = num * num; break;
                            case 'x³': result = num * num * num; break;
                            case '1/x': result = 1 / num; break;
                            case 'π': result = Math.PI; break;
                            case 'e': result = Math.E; break;
                            default: return;
                        }
                        
                        this.addHistory(\`\${action}(\${num}) = \${result}\`);
                        this.current = result.toString();
                    }
                    
                    addHistory(entry) {
                        this.history.unshift(entry);
                        if (this.history.length > 5) this.history.pop();
                    }
                    
                    updateDisplay() {
                        document.getElementById('calc-display').textContent = this.current;
                        document.getElementById('calc-history').textContent = this.history.join(' | ');
                    }
                    
                    updateMemoryDisplay() {
                        const memDisplay = document.getElementById('memory-display');
                        memDisplay.textContent = this.memory !== 0 ? \`M: \${this.memory}\` : '';
                    }
                    
                    isNumber(str) {
                        return /^[0-9]$/.test(str);
                    }
                    
                    isOperator(str) {
                        return ['+', '-', '×', '÷', '%'].includes(str);
                    }
                    
                    saveMemory() {
                        localStorage.setItem('calc_memory', this.memory.toString());
                    }
                    
                    loadMemory() {
                        const saved = localStorage.getItem('calc_memory');
                        if (saved) {
                            this.memory = parseFloat(saved);
                        }
                    }
                }
                
                const calcApp = new CalculatorApp();
                window.calcApp = calcApp;
            `,
            dependencies: [],
            tags: ['calculator', 'math', 'scientific'],
            rating: 4.9,
            downloads: 2150
        });
    }

    loadUserTemplates() {
        const saved = storage.get('user_templates', []);
        saved.forEach(template => {
            this.userTemplates.set(template.id, template);
        });
    }

    saveUserTemplates() {
        const templates = Array.from(this.userTemplates.values());
        storage.set('user_templates', templates);
    }

    addTemplate(template) {
        if (!template.id || !template.name) {
            throw new Error('تمپلیت باید id و name داشته باشد');
        }
        
        const fullTemplate = {
            id: template.id,
            name: template.name,
            category: template.category || 'عمومی',
            description: template.description || '',
            html: template.html || '',
            css: template.css || '',
            javascript: template.javascript || '',
            dependencies: template.dependencies || [],
            tags: template.tags || [],
            rating: template.rating || 0,
            downloads: template.downloads || 0,
            created: template.created || Date.now(),
            modified: Date.now(),
            author: template.author || 'system',
            isUserTemplate: template.isUserTemplate || false
        };
        
        if (fullTemplate.isUserTemplate) {
            this.userTemplates.set(fullTemplate.id, fullTemplate);
            this.saveUserTemplates();
        } else {
            this.templates.set(fullTemplate.id, fullTemplate);
        }
        
        return fullTemplate;
    }

    getTemplate(id) {
        return this.userTemplates.get(id) || this.templates.get(id);
    }

    getTemplatesByCategory(category) {
        const allTemplates = [...this.templates.values(), ...this.userTemplates.values()];
        return allTemplates.filter(t => t.category === category);
    }

    searchTemplates(query, options = {}) {
        query = query.toLowerCase().trim();
        if (!query) return [];
        
        const allTemplates = [...this.templates.values(), ...this.userTemplates.values()];
        const results = [];
        
        allTemplates.forEach(template => {
            let score = 0;
            
            // نام
            if (template.name.toLowerCase().includes(query)) {
                score += 30;
            }
            
            // توضیحات
            if (template.description.toLowerCase().includes(query)) {
                score += 20;
            }
            
            // تگ‌ها
            template.tags.forEach(tag => {
                if (tag.toLowerCase().includes(query)) {
                    score += 10;
                }
            });
            
            // دسته‌بندی
            if (template.category.toLowerCase().includes(query)) {
                score += 15;
            }
            
            if (score > 0) {
                results.push({
                    ...template,
                    searchScore: score
                });
            }
        });
        
        // مرتب‌سازی
        results.sort((a, b) => {
            if (b.searchScore !== a.searchScore) {
                return b.searchScore - a.searchScore;
            }
            
            if (options.sortBy === 'downloads') {
                return b.downloads - a.downloads;
            } else if (options.sortBy === 'rating') {
                return b.rating - a.rating;
            } else {
                return b.modified - a.modified;
            }
        });
        
        return results;
    }

    updateTemplate(id, updates) {
        const template = this.getTemplate(id);
        if (!template) return null;
        
        const updated = {
            ...template,
            ...updates,
            modified: Date.now()
        };
        
        if (template.isUserTemplate) {
            this.userTemplates.set(id, updated);
            this.saveUserTemplates();
        } else {
            this.templates.set(id, updated);
        }
        
        return updated;
    }

    deleteTemplate(id) {
        if (this.userTemplates.has(id)) {
            this.userTemplates.delete(id);
            this.saveUserTemplates();
            return true;
        }
        
        if (this.templates.has(id)) {
            // فقط کاربران می‌توانند تمپلیت‌های پیش‌فرض را حذف کنند
            return false;
        }
        
        return false;
    }

    duplicateTemplate(id, newName = null) {
        const template = this.getTemplate(id);
        if (!template) return null;
        
        const duplicate = { ...template };
        duplicate.id = 'template_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        duplicate.name = newName || 'کپی - ' + template.name;
        duplicate.created = Date.now();
        duplicate.modified = Date.now();
        duplicate.isUserTemplate = true;
        duplicate.downloads = 0;
        duplicate.rating = 0;
        
        this.userTemplates.set(duplicate.id, duplicate);
        this.saveUserTemplates();
        
        return duplicate;
    }

    getCategories() {
        const categories = new Set();
        
        [...this.templates.values(), ...this.userTemplates.values()].forEach(template => {
            categories.add(template.category);
        });
        
        return Array.from(categories);
    }

    getPopularTags(limit = 20) {
        const tagCount = new Map();
        
        [...this.templates.values(), ...this.userTemplates.values()].forEach(template => {
            template.tags.forEach(tag => {
                const count = tagCount.get(tag) || 0;
                tagCount.set(tag, count + 1);
            });
        });
        
        return Array.from(tagCount.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([tag]) => tag);
    }

    getStats() {
        const allTemplates = [...this.templates.values(), ...this.userTemplates.values()];
        
        return {
            total: allTemplates.length,
            default: this.templates.size,
            user: this.userTemplates.size,
            byCategory: this.getCategoryStats(),
            totalDownloads: allTemplates.reduce((sum, t) => sum + t.downloads, 0),
            avgRating: allTemplates.length > 0 
                ? allTemplates.reduce((sum, t) => sum + t.rating, 0) / allTemplates.length 
                : 0
        };
    }

    getCategoryStats() {
        const stats = {};
        
        [...this.templates.values(), ...this.userTemplates.values()].forEach(template => {
            stats[template.category] = (stats[template.category] || 0) + 1;
        });
        
        return stats;
    }

    incrementDownloads(id) {
        const template = this.getTemplate(id);
        if (template) {
            template.downloads = (template.downloads || 0) + 1;
            
            if (template.isUserTemplate) {
                this.saveUserTemplates();
            }
        }
    }

    rateTemplate(id, rating) {
        const template = this.getTemplate(id);
        if (!template) return null;
        
        // فقط کاربران می‌توانند تمپلیت‌های کاربری را رتبه‌دهی کنند
        if (!template.isUserTemplate) return null;
        
        // میانگین گیری ساده
        const currentRating = template.rating || 0;
        const currentVotes = template.votes || 0;
        
        template.rating = (currentRating * currentVotes + rating) / (currentVotes + 1);
        template.votes = (template.votes || 0) + 1;
        
        this.saveUserTemplates();
        return template.rating;
    }

    exportTemplate(id) {
        const template = this.getTemplate(id);
        if (!template) return null;
        
        const exportData = {
            ...template,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });
        
        return URL.createObjectURL(blob);
    }

    importTemplate(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    if (!data.id || !data.name || !data.html) {
                        throw new Error('فرمت فایل نامعتبر است');
                    }
                    
                    // ایجاد ID جدید برای جلوگیری از تداخل
                    data.id = 'imported_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                    data.isUserTemplate = true;
                    data.created = Date.now();
                    data.modified = Date.now();
                    
                    this.userTemplates.set(data.id, data);
                    this.saveUserTemplates();
                    
                    resolve({
                        success: true,
                        template: data
                    });
                    
                } catch (error) {
                    reject({
                        success: false,
                        error: error.message
                    });
                }
            };
            
            reader.onerror = () => {
                reject({
                    success: false,
                    error: 'خطا در خواندن فایل'
                });
            };
            
            reader.readAsText(file);
        });
    }

    generateCode(templateId, options = {}) {
        const template = this.getTemplate(templateId);
        if (!template) return null;
        
        const { html, css, javascript } = template;
        
        let code = '';
        
        if (options.format === 'single-file') {
            code = \`
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>\${template.name}</title>
    <style>
        \${css}
    </style>
</head>
<body>
    \${html}
    <script>
        \${javascript}
    </script>
</body>
</html>
            \`.trim();
        } else if (options.format === 'component') {
            code = \`
// Component: \${template.name}
// Description: \${template.description}

export class \${template.name.replace(/[^a-zA-Z0-9]/g, '')}Component {
    constructor() {
        this.container = null;
        this.init();
    }
    
    init() {
        this.container = document.createElement('div');
        this.container.innerHTML = \`
            \${html}
        \`;
        
        const style = document.createElement('style');
        style.textContent = \`
            \${css}
        \`;
        this.container.appendChild(style);
        
        // اجرای جاوااسکریپت
        const scriptContent = \`
            (function() {
                \${javascript}
            })();
        \`;
        const script = document.createElement('script');
        script.textContent = scriptContent;
        this.container.appendChild(script);
    }
    
    render(container) {
        if (typeof container === 'string') {
            container = document.querySelector(container);
        }
        
        if (container) {
            container.appendChild(this.container);
        }
        
        return this.container;
    }
}
            \`.trim();
        } else {
            // فرمت استاندارد
            code = JSON.stringify({
                name: template.name,
                html: html,
                css: css,
                javascript: javascript,
                dependencies: template.dependencies
            }, null, 2);
        }
        
        return code;
    }

    validateTemplate(template) {
        const errors = [];
        
        if (!template.id) errors.push('آیدی تمپلیت ضروری است');
        if (!template.name) errors.push('نام تمپلیت ضروری است');
        if (!template.html) errors.push('کد HTML ضروری است');
        
        // بررسی HTML معتبر
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(template.html, 'text/html');
            const parseErrors = doc.querySelectorAll('parsererror');
            if (parseErrors.length > 0) {
                errors.push('HTML نامعتبر است');
            }
        } catch (e) {
            errors.push('خطا در تحلیل HTML');
        }
        
        // بررسی جاوااسکریپت معتبر
        if (template.javascript) {
            try {
                new Function(template.javascript);
            } catch (e) {
                errors.push('جاوااسکریپت نامعتبر است');
            }
        }
        
        return {
            valid: errors.length === 0,
            errors: errors
        };
    }

    previewTemplate(templateId, container) {
        const template = this.getTemplate(templateId);
        if (!template || !container) return false;
        
        container.innerHTML = template.html;
        
        const style = document.createElement('style');
        style.textContent = template.css;
        container.appendChild(style);
        
        if (template.javascript) {
            const script = document.createElement('script');
            script.textContent = template.javascript;
            container.appendChild(script);
        }
        
        this.incrementDownloads(templateId);
        return true;
    }

    createFromHtml(html, options = {}) {
        const id = 'generated_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        const template = {
            id,
            name: options.name || 'تمپلیت جدید',
            category: options.category || 'عمومی',
            description: options.description || '',
            html: html,
            css: options.css || '',
            javascript: options.javascript || '',
            isUserTemplate: true
        };
        
        const validation = this.validateTemplate(template);
        if (!validation.valid) {
            throw new Error(validation.errors.join(', '));
        }
        
        this.userTemplates.set(id, template);
        this.saveUserTemplates();
        
        return template;
    }

    convertToPWA(templateId) {
        const template = this.getTemplate(templateId);
        if (!template) return null;
        
        const pwaManifest = {
            name: template.name,
            short_name: template.name.substring(0, 12),
            description: template.description,
            start_url: './',
            display: 'standalone',
            background_color: '#ffffff',
            theme_color: '#007bff',
            icons: [
                {
                    src: 'icon-72x72.png',
                    sizes: '72x72',
                    type: 'image/png'
                },
                {
                    src: 'icon-96x96.png',
                    sizes: '96x96',
                    type: 'image/png'
                },
                {
                    src: 'icon-128x128.png',
                    sizes: '128x128',
                    type: 'image/png'
                },
                {
                    src: 'icon-144x144.png',
                    sizes: '144x144',
                    type: 'image/png'
                },
                {
                    src: 'icon-152x152.png',
                    sizes: '152x152',
                    type: 'image/png'
                },
                {
                    src: 'icon-192x192.png',
                    sizes: '192x192',
                    type: 'image/png'
                },
                {
                    src: 'icon-384x384.png',
                    sizes: '384x384',
                    type: 'image/png'
                },
                {
                    src: 'icon-512x512.png',
                    sizes: '512x512',
                    type: 'image/png'
                }
            ]
        };
        
        const serviceWorker = \`
// Service Worker for \${template.name}
const CACHE_NAME = '\${templateId}-v1';
const urlsToCache = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './manifest.json'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );
        })
    );
});
        \`;
        
        return {
            manifest: pwaManifest,
            serviceWorker: serviceWorker,
            html: this.generateCode(templateId, { format: 'single-file' })
        };
    }

    getTemplateUsage(id) {
        const template = this.getTemplate(id);
        if (!template) return null;
        
        return {
            downloads: template.downloads || 0,
            lastDownloaded: template.lastDownloaded || null,
            rating: template.rating || 0,
            votes: template.votes || 0,
            lastModified: template.modified,
            created: template.created
        };
    }

    backupTemplates() {
        const allTemplates = [...this.templates.values(), ...this.userTemplates.values()];
        const backup = {
            templates: allTemplates,
            backupDate: new Date().toISOString(),
            count: allTemplates.length
        };
        
        const blob = new Blob([JSON.stringify(backup, null, 2)], {
            type: 'application/json'
        });
        
        return URL.createObjectURL(blob);
    }

    restoreBackup(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = async (e) => {
                try {
                    const backup = JSON.parse(e.target.result);
                    
                    if (!backup.templates || !Array.isArray(backup.templates)) {
                        throw new Error('فرمت بک‌آپ نامعتبر است');
                    }
                    
                    let restored = 0;
                    let skipped = 0;
                    
                    for (const template of backup.templates) {
                        if (template.isUserTemplate) {
                            // فقط تمپلیت‌های کاربری را بازگردانی کن
                            template.id = 'restored_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                            this.userTemplates.set(template.id, template);
                            restored++;
                        } else {
                            skipped++;
                        }
                    }
                    
                    this.saveUserTemplates();
                    
                    resolve({
                        success: true,
                        restored,
                        skipped,
                        total: this.userTemplates.size
                    });
                    
                } catch (error) {
                    reject({
                        success: false,
                        error: error.message
                    });
                }
            };
            
            reader.onerror = () => {
                reject({
                    success: false,
                    error: 'خطا در خواندن فایل'
                });
            };
            
            reader.readAsText(file);
        });
    }
}

export const templates = new TemplateManager();
