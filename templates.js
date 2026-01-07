
/* ==================================================
   App Builder - Templates Engine
   Mobile First | Extendable | Professional
   ================================================== */

const Templates = (() => {

    /* ---------- Base Template ---------- */
    function baseAppTemplate({ title, body, scripts = '' }) {
        return `
        <div class="card">
            <h2 class="center">${title}</h2>
            ${body}
        </div>
        ${scripts}
        `;
    }

    /* ---------- Notes App ---------- */
    function notesTemplate() {
        return baseAppTemplate({
            title: '📝 یادداشت‌ها',
            body: `
                <input id="note-title" placeholder="عنوان یادداشت">
                <textarea id="note-content" placeholder="متن یادداشت..."></textarea>
                <button class="btn-primary" onclick="Engine.notes.save()">ذخیره</button>
                <div class="list" id="notes-list"></div>
            `
        });
    }

    /* ---------- Calculator App ---------- */
    function calculatorTemplate() {
        return baseAppTemplate({
            title: '🧮 ماشین حساب',
            body: `
                <input id="calc-input" placeholder="مثال: 2+3×4">
                <button class="btn-primary" onclick="Engine.calculator.run()">محاسبه</button>
                <div class="card center" id="calc-result">---</div>
            `
        });
    }

    /* ---------- Todo App ---------- */
    function todoTemplate() {
        return baseAppTemplate({
            title: '✅ لیست کارها',
            body: `
                <input id="todo-input" placeholder="کار جدید...">
                <button class="btn-primary" onclick="Engine.todo.add()">افزودن</button>
                <div class="list" id="todo-list"></div>
            `
        });
    }

    /* ---------- Home ---------- */
    function homeTemplate(apps) {
        return `
        <div class="app-grid">
            ${apps.map(app => `
                <div class="app-tile" onclick="Router.navigate('${app.id}')">
                    <span>${app.icon}</span>
                    <p>${app.name}</p>
                </div>
            `).join('')}
        </div>
        `;
    }

    /* ---------- Preview ---------- */
    function previewTemplate(html) {
        return `
        <div class="card">
            <h2 class="center">🔍 پیش‌نمایش</h2>
            <iframe style="width:100%;height:60vh;border:none;border-radius:12px"
                srcdoc="${html.replace(/"/g, '&quot;')}">
            </iframe>
        </div>
        `;
    }

    /* ---------- Public API ---------- */
    return {
        home: homeTemplate,
        notes: notesTemplate,
        calculator: calculatorTemplate,
        todo: todoTemplate,
        preview: previewTemplate
    };

})();

/* ---------- Export ---------- */
window.Templates = Templates;

console.log('🧩 Templates Engine Loaded');
