/**
 * 🎨 UI.js – رابط کاربری پیشرفته App Builder
 * نسخه 3.1.0 – ماژولار و واکنش‌گرا
 */

const UI = {
    init() {
        this.app = document.getElementById('app');
        if (!this.app) {
            console.error('❌ عنصر #app پیدا نشد');
            return;
        }

        console.log('⚡ UI initialized');

        // بارگذاری صفحه اولیه
        this.load('home');
    },

    load(screen) {
        if (!window.Engine) return;
        Engine.screen = screen;
        this.render();
    },

    render() {
        const screen = Engine.screen;
        this.app.innerHTML = ''; // پاکسازی صفحه

        // ===== خروجی‌ها =====
        if (Engine.output.length) {
            const out = document.createElement('div');
            out.className = 'card';
            Engine.output.forEach(t => {
                const p = document.createElement('div');
                p.textContent = t;
                out.appendChild(p);
            });
            this.app.appendChild(out);
        }

        // ===== HOME =====
        if (screen === 'home') {
            this.renderHome();
        }

        // ===== NOTE =====
        if (screen === 'note') {
            this.renderNotes();
        }

        // ===== LIST =====
        if (screen === 'list') {
            this.renderList();
        }

        // ===== CALCULATOR =====
        if (screen === 'calculator') {
            this.renderCalculator();
        }
    },

    renderHome() {
        const grid = document.createElement('div');
        grid.className = 'app-grid';

        const apps = [
            { id: 'note', name: '📝 یادداشت‌ها', icon: '📝' },
            { id: 'list', name: '✅ لیست', icon: '✅' },
            { id: 'calculator', name: '🧮 ماشین حساب', icon: '🧮' }
        ];

        apps.forEach(app => {
            const tile = document.createElement('div');
            tile.className = 'app-tile';
            tile.onclick = () => UI.load(app.id);
            tile.innerHTML = `<span>${app.icon}</span><p>${app.name}</p>`;
            grid.appendChild(tile);
        });

        this.app.appendChild(grid);
    },

    renderNotes() {
        const html = Templates.notes(); // استفاده از موتور قالب
        this.app.innerHTML = html;

        // اتصال به Engine.notes (یا Storage)
        if (!Engine.modules.notes) Engine.registerModule('notes', new NoteManager());
    },

    renderList() {
        const html = Templates.todo();
        this.app.innerHTML = html;

        if (!Engine.modules.todo) Engine.registerModule('todo', {
            add() {
                const input = document.getElementById('todo-input');
                const val = input.value.trim();
                if (!val) return;
                const list = document.getElementById('todo-list');
                const li = document.createElement('div');
                li.className = 'list-item';
                li.textContent = val;
                list.appendChild(li);
                input.value = '';
            }
        });
    },

    renderCalculator() {
        const html = Templates.calculator();
        this.app.innerHTML = html;

        const input = document.getElementById('calc-input');
        const btn = this.app.querySelector('button');

        btn.onclick = () => {
            const val = input.value.trim();
            const res = Engine.calculate(val);
            document.getElementById('calc-result').textContent = res !== null ? res : 'خطا';
        };
    }
};

// ثبت جهانی
window.UI = UI;
console.log('✅ UI.js 3.1.0 Loaded');
