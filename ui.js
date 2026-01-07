const UI = {
  init() {
    const saveBtn = document.getElementById('saveBtn');
    const titleInput = document.getElementById('title');
    const contentInput = document.getElementById('content');
    const list = document.getElementById('notesList');

    if (!saveBtn) {
      console.error('Save button not found');
      return;
    }

    saveBtn.addEventListener('click', () => {
      const title = titleInput.value.trim();
      const content = contentInput.value.trim();

      if (!title && !content) {
        alert('یادداشت خالی است');
        return;
      }

      Storage.save({
        title,
        content,
        date: new Date().toLocaleString('fa-IR')
      });

      titleInput.value = '';
      contentInput.value = '';

      UI.render();
    });

    this.render();
  },

  render() {
    const list = document.getElementById('notesList');
    if (!list) return;

    const notes = Storage.getAll();
    list.innerHTML = '';

    notes.forEach(note => {
      const div = document.createElement('div');
      div.className = 'note';
      div.innerHTML = `
        <h4>${note.title}</h4>
        <p>${note.content}</p>
        <small>${note.date}</small>
        <hr/>
      `;
      list.appendChild(div);
    });
  }
};

window.UI = UI;
