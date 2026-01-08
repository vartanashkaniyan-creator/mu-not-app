// notes.js – مدیریت یادداشت‌ها (پیشرفته)
const Notes = {
    notes: [],
    currentNote: null,

    init() {
        this.load();
        this.render();
        this.bindEvents();
    },

    load() {
        this.notes = JSON.parse(localStorage.getItem('notes')) || [];
    },

    save() {
        const title = document.getElementById('note-title').value.trim();
        const content = document.getElementById('note-content').value.trim();
        const category = document.getElementById('note-category').value;

        if (!title && !content) return alert('یادداشت خالی است');

        const note = this.currentNote || { id: Date.now(), createdAt: new Date().toISOString() };
        note.title = title;
        note.content = content;
        note.category = category;
        note.updatedAt = new Date().toISOString();

        if (!this.currentNote) this.notes.unshift(note);

        localStorage.setItem('notes', JSON.stringify(this.notes));
        this.currentNote = null;
        this.render();
        this.clearEditor();
    },

    delete(id) {
        if (!confirm('آیا مطمئن هستید؟')) return;
        this.notes = this.notes.filter(n => n.id !== id);
        localStorage.setItem('notes', JSON.stringify(this.notes));
        this.render();
    },

    edit(id) {
        const note = this.notes.find(n => n.id === id);
        if (!note) return;

        document.getElementById('note-title').value = note.title;
        document.getElementById('note-content').value = note.content;
        document.getElementById('note-category').value = note.category;

        this.currentNote = note;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    clearEditor() {
        document.getElementById('note-title').value = '';
        document.getElementById('note-content').value = '';
        this.currentNote = null;
    },

    bindEvents() {
        document.getElementById('save-note').onclick = () => this.save();
        document.getElementById('clear-note').onclick = () => this.clearEditor();
    },

    render() {
        const container = document.getElementById('notes-list');
        if (!container) return;

        container.innerHTML = '';
        if (!this.notes.length) {
            container.innerHTML = '<p class="center">📝 هنوز یادداشتی ندارید</p>';
            return;
        }

        this.notes.forEach(note => {
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

            div.querySelector('.edit-btn').onclick = () => this.edit(note.id);
            div.querySelector('.delete-btn').onclick = () => this.delete(note.id);

            container.appendChild(div);
        });
    }
};

// راه‌اندازی
Notes.init();
window.Notes = Notes;
console.log('✅ Notes.js پیشرفته آماده شد');
