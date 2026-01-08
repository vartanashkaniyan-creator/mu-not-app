/* =========================
   Engine.js – هسته منطقی اپ بیلدر
   نسخه 1.0.0
   وابسته به Storage.js
========================= */

const Engine = (() => {

    /* ---------- Calculator ---------- */
    function calc(expression) {
        try {
            const safe = expression
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/[^-()\d/*+.]/g, '');
            // eslint-disable-next-line no-eval
            return eval(safe);
        } catch (e) {
            return 'خطا';
        }
    }

    /* ---------- Todo ---------- */
    const TODO_KEY = 'todos';

    function todoGetAll() {
        return Storage.getAll(TODO_KEY);
    }

    function todoAdd(task) {
        const item = {
            id: Date.now(),
            task,
            done: false,
            updatedAt: new Date().toISOString()
        };
        Storage.save(item, TODO_KEY);
        return item;
    }

    function todoRemove(id) {
        Storage.remove(id, TODO_KEY);
    }

    function todoToggle(id) {
        const item = Storage.get(id, TODO_KEY);
        if (!item) return;
        item.done = !item.done;
        Storage.update(id, item, TODO_KEY);
    }

    /* ---------- Notes helpers ---------- */
    function notesGetAll() {
        return Storage.getAll('notes');
    }

    function notesRemove(id) {
        Storage.remove(id, 'notes');
    }

    /* ---------- Public API ---------- */
    return {
        calc,
        todoGetAll,
        todoAdd,
        todoRemove,
        todoToggle,
        notesGetAll,
        notesRemove
    };

})();

window.Engine = Engine;
console.log('⚙️ Engine.js بارگذاری شد');
