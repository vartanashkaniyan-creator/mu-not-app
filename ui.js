// UI.js – رابط کاربری پیشرفته و ماژولار
const UI = {
    container: null,
    init(containerId = 'app') {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('❌ UI container not found');
            return;
        }

        // رویدادهای عمومی
        this.bindGlobalEvents();

        // رندر اولیه صفحه خانه
        this.load('home');
    },

    bindGlobalEvents() {
        document.body.addEventListener('click', e => {
            const target = e.target.closest('[data-route]');
            if (target) {
                e.preventDefault();
                const route = target.getAttribute('data-route');
                if (route) window.Router.navigate(route);
            }
        });
    },

    load(screen, data = {}) {
        if (!this.container) return;
        this.container.innerHTML = '';

        switch (screen) {
            case 'home':
                this.container.innerHTML = window.Templates.home(data.apps || []);
                break;
            case 'notes':
                this.container.innerHTML = window.Templates.notes();
                this.bindNotesEvents();
                UI.renderNotes();
                break;
            case 'calculator':
                this.container.innerHTML = window.Templates.calculator();
                this.bindCalculatorEvents();
                break;
            case 'todo':
                this.container.innerHTML = window.Templates.todo();
                this.bindTodoEvents();
                break;
            case 'preview':
                this.container.innerHTML = window.Templates.preview(data.html || '');
                break;
            default:
                this.container.innerHTML = `<p class="center">صفحه یافت نشد</p>`;
        }
    },

    /* ---------- Notes App ---------- */
    bindNotesEvents() {
        const saveBtn = document.getElementById('save-note');
        const clearBtn = document.getElementById('clear-note');
        const titleInput = document.getElementById('note-title');
        const contentInput = document.getElementById('note-content');
        const categorySelect = document.getElementById('note-category');

        if (!saveBtn) return;

        saveBtn.onclick = () => {
            const note = {
                id: Date.now(),
                title: titleInput.value.trim(),
                content: contentInput.value.trim(),
                category: categorySelect.value,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            if (!note.title && !note.content) return alert('یادداشت خالی است');
            window.Storage.save(note);
            this.renderNotes();
            titleInput.value = '';
            contentInput.value = '';
        };

        clearBtn.onclick = () => {
            titleInput.value = '';
            contentInput.value = '';
        };
    },

    renderNotes() {
        const container = document.getElementById('notes-list');
        if (!container) return;

        const notes = window.Storage.getAll();
        container.innerHTML = '';

        if (!notes.length) {
            container.innerHTML = '<p class="center">📝 هنوز یادداشتی ندارید</p>';
            return;
        }

        notes.forEach(note => {
            const div = document.createElement('div');
            div.className = 'note-card';
            div.innerHTML = `
                <h4>${note.title}</h4>
                <p>${note.content.substring(0, 100)}${note.content.length > 100 ? '...' : ''}</p>
                <small>${new Date(note.updatedAt).toLocaleDateString('fa-IR')}</small>
                <div class="note-actions">
                    <button class="edit-btn">✏️ ویرایش</button>
                    <button class="delete-btn">🗑️ حذف</button>
                </div>
            `;

            div.querySelector('.edit-btn').onclick = () => {
                document.getElementById('note-title').value = note.title;
                document.getElementById('note-content').value = note.content;
                document.getElementById('note-category').value = note.category;
                window.scrollTo({ top: 0, behavior: 'smooth' });
            };

            div.querySelector('.delete-btn').onclick = () => {
                if (!confirm('آیا مطمئن هستید؟')) return;
                window.Storage.delete(note.id);
                this.renderNotes();
            };

            container.appendChild(div);
        });
    },

    /* ---------- Calculator App ---------- */
    bindCalculatorEvents() {
        const input = document.getElementById('calc-input');
        const resultDiv = document.getElementById('calc-result');

        document.querySelector('button[onclick*="Engine.calculator.run"]').onclick = () => {
            const val = input.value.trim();
            if (!val) return;
            const res = window.Engine.calculator.calculate(val);
            resultDiv.textContent = res;
        };
    },

    /* ---------- Todo App ---------- */
    bindTodoEvents() {
        const input = document.getElementById('todo-input');
        const list = document.getElementById('todo-list');

        document.querySelector('button[onclick*="Engine.todo.add"]').onclick = () => {
            const val = input.value.trim();
            if (!val) return;
            window.Engine.todo.add(val);
            this.renderTodo();
            input.value = '';
        };
    },

    renderTodo() {
        const list = document.getElementById('todo-list');
        if (!list) return;

        list.innerHTML = '';
        const todos = window.Engine.todo.getAll() || [];
        todos.forEach(todo => {
            const li = document.createElement('div');
            li.className = 'list-item';
            li.textContent = todo;
            list.appendChild(li);
        });
    }
};

// ثبت در سطح جهانی
window.UI = UI;
console.log('✅ UI.js پیشرفته آماده شد');
