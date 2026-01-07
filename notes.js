
// مدیریت یادداشت‌ها
class NoteManager {
    constructor() {
        this.notes = JSON.parse(localStorage.getItem('notes')) || [];
        this.currentNote = null;
        this.init();
    }

    init() {
        this.renderNotes();
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('save-note').addEventListener('click', () => this.saveNote());
        document.getElementById('clear-note').addEventListener('click', () => this.clearEditor());
        document.getElementById('note-title').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.saveNote();
        });
    }

    saveNote() {
        const title = document.getElementById('note-title').value.trim();
        const content = document.getElementById('note-content').value.trim();
        const category = document.getElementById('note-category').value;

        if (!title || !content) {
            alert('لطفاً عنوان و متن یادداشت را وارد کنید');
            return;
        }

        if (this.currentNote) {
            // بروزرسانی یادداشت موجود
            this.currentNote.title = title;
            this.currentNote.content = content;
            this.currentNote.category = category;
            this.currentNote.updatedAt = new Date().toISOString();
        } else {
            // ایجاد یادداشت جدید
            const note = {
                id: Date.now(),
                title,
                content,
                category,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            this.notes.unshift(note);
        }

        localStorage.setItem('notes', JSON.stringify(this.notes));
        this.renderNotes();
        this.clearEditor();
    }

    renderNotes() {
        const container = document.getElementById('notes-container');
        if (!this.notes.length) {
            container.innerHTML = '<p class="empty">📝 هنوز یادداشتی ندارید</p>';
            return;
        }

        container.innerHTML = '';
        this.notes.forEach(note => {
            const card = document.createElement('div');
            card.className = 'note-card';
            card.dataset.id = note.id;

            const date = new Date(note.updatedAt).toLocaleDateString('fa-IR');
            card.innerHTML = `
                <h3>${note.title}</h3>
                <p class="note-preview">${note.content.substring(0, 100)}${note.content.length > 100 ? '...' : ''}</p>
                <div class="note-meta">
                    <span class="category">${note.category}</span>
                    <span class="date">${date}</span>
                </div>
                <div class="note-actions">
                    <button class="edit-btn">✏️ ویرایش</button>
                    <button class="delete-btn">🗑️ حذف</button>
                </div>
            `;

            card.querySelector('.edit-btn').addEventListener('click', () => this.editNote(note.id));
            card.querySelector('.delete-btn').addEventListener('click', () => this.deleteNote(note.id));

            container.appendChild(card);
        });
    }

    editNote(id) {
        const note = this.notes.find(n => n.id === id);
        if (!note) return;

        document.getElementById('note-title').value = note.title;
        document.getElementById('note-content').value = note.content;
        document.getElementById('note-category').value = note.category;

        this.currentNote = note;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    deleteNote(id) {
        if (!confirm('آیا مطمئن هستید که می‌خواهید حذف شود؟')) return;

        this.notes = this.notes.filter(n => n.id !== id);
        localStorage.setItem('notes', JSON.stringify(this.notes));
        this.renderNotes();
    }

    clearEditor() {
        document.getElementById('note-title').value = '';
        document.getElementById('note-content').value = '';
        this.currentNote = null;
    }
}

// راه‌اندازی
const noteManager = new NoteManager();
window.noteManager = noteManager;
