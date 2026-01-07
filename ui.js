
/* ==================================================
   UI Controller
   Mobile First | Simple | Extendable
   ================================================== */

const UI = (() => {

    const appContainerId = 'app';

    function getContainer() {
        return document.getElementById(appContainerId);
    }

    /* ---------- Render ---------- */
    function render(html) {
        const container = getContainer();
        if (!container) {
            console.error('UI: app container not found');
            return;
        }
        container.innerHTML = html;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /* ---------- Loading ---------- */
    function loading(text = 'در حال بارگذاری...') {
        render(`
            <div class="card center">
                <div class="spinner"></div>
                <p>${text}</p>
            </div>
        `);
    }

    /* ---------- Error ---------- */
    function error(message) {
        render(`
            <div class="card">
                <h3>❌ خطا</h3>
                <p>${message}</p>
            </div>
        `);
    }

    /* ---------- Home ---------- */
    function showHome() {
        loading();
        const apps = Engine.listApps();
        render(Templates.home(apps));
    }

    /* ---------- Notes ---------- */
    function showNotes() {
        render(Templates.notes());
        Engine.notes.render();
    }

    /* ---------- Calculator ---------- */
    function showCalculator() {
        render(Templates.calculator());
    }

    /* ---------- Todo ---------- */
    function showTodo() {
        render(Templates.todo());
        Engine.todo.render();
    }

    /* ---------- Preview ---------- */
    function showPreview(html) {
        render(Templates.preview(html));
    }

    /* ---------- Notifications ---------- */
    function notify(message, type = 'info') {
        const notif = document.createElement('div');
        notif.className = `notification ${type}`;
        notif.innerText = message;
        document.body.appendChild(notif);

        setTimeout(() => notif.remove(), 3000);
    }

    /* ---------- Public API ---------- */
    return {
        render,
        loading,
        error,
        home: showHome,
        notes: showNotes,
        calculator: showCalculator,
        todo: showTodo,
        preview: showPreview,
        notify
    };

})();

/* ---------- Export ---------- */
window.UI = UI;

console.log('🎨 UI Controller Loaded');
