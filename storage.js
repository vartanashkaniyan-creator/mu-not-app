const Storage = {
  key: 'notes_data',

  getAll() {
    const raw = localStorage.getItem(this.key);
    return raw ? JSON.parse(raw) : [];
  },

  save(note) {
    const notes = this.getAll();
    notes.unshift(note);
    localStorage.setItem(this.key, JSON.stringify(notes));
  },

  clear() {
    localStorage.removeItem(this.key);
  }
};

window.Storage = Storage;
