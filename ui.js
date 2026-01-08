const UI = {
    container: null,

    init(containerId = 'app') {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        this.bindGlobalEvents();
        this.load('home');
    },

    bindGlobalEvents() {
        document.body.addEventListener('click', e => {
            const target = e.target.closest('[data-route]');
            if (target) {
                e.preventDefault();
                const route = target.getAttribute('data-route');
                if (route) Router.navigate(route);
            }
        });
    },

    load(screen, data = {}) {
        if (!this.container) return;
        this.container.innerHTML = '';

        switch(screen) {
            case 'home': this.container.innerHTML = Templates.home(data.apps || []); break;
            case 'notes': this.container.innerHTML = Templates.notes(); this.bindNotesEvents(); this.renderNotes(); break;
            case 'calculator': this.container.innerHTML = Templates.calculator(); this.bindCalculatorEvents(); break;
            case 'todo': this.container.innerHTML = Templates.todo(); this.bindTodoEvents(); this.renderTodo(); break;
            default: this.container.innerHTML = `<p class="center">صفحه یافت نشد</p>`;
        }
    },

    bindNotesEvents() {
        const titleInput = document.getElementById('note-title');
        const contentInput = document.getElementById('note-content');
        const categorySelect = document.getElementById('note-category');
        document.getElementById('save-note').onclick = () => {
            const note = { title: titleInput.value.trim(), content: contentInput.value.trim(), category: categorySelect.value, id: Date.now(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
            if (!note.title && !note.content) return alert('یادداشت خالی است');
            Storage.save(note);
            this.renderNotes();
            titleInput.value = ''; contentInput.value = '';
        };
        document.getElementById('clear-note').onclick = () => { titleInput.value=''; contentInput.value=''; };
    },

    renderNotes() {
        const container = document.getElementById('notes-list');
        if (!container) return;
        const notes = Storage.getAll();
        container.innerHTML = '';
        if (!notes.length) { container.innerHTML = '<p class="center">📝 هنوز یادداشتی ندارید</p>'; return; }
        notes.forEach(note => {
            const div = document.createElement('div'); div.className='note-card';
            div.innerHTML = `<h4>${note.title}</h4><p>${note.content.substring(0,100)}${note.content.length>100?'...':''}</p><small>${new Date(note.updatedAt).toLocaleDateString('fa-IR')}</small><div class="note-actions"><button class="delete-btn">🗑️ حذف</button></div>`;
            div.querySelector('.delete-btn').onclick = () => { if(confirm('آیا مطمئن هستید؟')) { Storage.remove(note.id); this.renderNotes(); } };
            container.appendChild(div);
        });
    },

    bindCalculatorEvents() {
        const input = document.getElementById('calc-input');
        const resultDiv = document.getElementById('calc-result');
        document.getElementById('calc-run').onclick = () => { resultDiv.textContent = Engine.calc(input.value.trim()); };
    },

    bindTodoEvents() {
        const input = document.getElementById('todo-input');
        document.getElementById('todo-add').onclick = () => { Engine.todoAdd(input.value.trim()); input.value=''; this.renderTodo(); };
    },

    renderTodo() {
        const list = document.getElementById('todo-list');
        if(!list) return;
        list.innerHTML=''; Engine.todoGetAll().forEach(todo=>{ const li=document.createElement('div'); li.className='list-item'; li.textContent=todo.task; list.appendChild(li); });
    }
};

window.UI = UI;
console.log('✅ UI.js آماده شد');
