/**
 * 🧩 Templates.js – موتور قالب اپلیکیشن
 * نسخه 3.0.0
 * Mobile-first | Extendable | UI-ready
 */

const Templates = (() => {

    /* ---------- قالب پایه ---------- */
    function baseTemplate({ title = '', body = '', scripts = '' }) {
        return `
        <div class="card">
            <h2 class="center">${title}</h2>
            <div class="card-body">${body}</div>
        </div>
        ${scripts}
        `;
    }

    /* ---------- صفحه یادداشت‌ها ---------- */
    function notesTemplate() {
        return baseTemplate({
            title: '📝 یادداشت‌ها',
            body: `
                <input id="note-title" placeholder="عنوان یادداشت">
                <textarea id="note-content" placeholder="متن یادداشت..."></textarea>
                <select id="note-category">
                    <option value="شخصی">شخصی</option>
                    <option value="کاری">کاری</option>
                    <option value="ایده">ایده</option>
                    <option value="خرید">خرید</option>
                </select>
                <div class="editor-actions">
                    <button class="btn-primary" onclick="Engine.notes.save()">💾 ذخیره</button>
                    <button class="btn-danger" onclick="Engine.notes.clearEditor()">🗑️ پاک کردن</button>
                </div>
                <div class="list" id="notes-list"></div>
            `
        });
    }

    /* ---------- ماشین حساب ---------- */
    function calculatorTemplate() {
        return baseTemplate({
            title: '🧮 ماشین حساب',
            body: `
                <input id="calc-input" placeholder="مثال: 2+3×4">
                <button class="btn-primary" onclick="Engine.calculator.run()">محاسبه</button>
                <div class="card center" id="calc-result">---</div>
            `
        });
    }

    /* ---------- لیست کارها ---------- */
    function todoTemplate() {
        return baseTemplate({
            title: '✅ لیست کارها',
            body: `
                <input id="todo-input" placeholder="کار جدید...">
                <button class="btn-primary" onclick="Engine.todo.add()">افزودن</button>
                <div class="list" id="todo-list"></div>
            `
        });
    }

    /* ---------- صفحه اصلی ---------- */
    function homeTemplate(apps = []) {
        return `
        <div class="app-grid">
            ${apps.map(app => `
                <div class="app-tile" onclick="Router.navigate('${app.id}')">
                    <span>${app.icon || '📱'}</span>
                    <p>${app.name}</p>
                </div>
            `).join('')}
        </div>
        `;
    }

    /* ---------- پیش‌نمایش HTML ---------- */
    function previewTemplate(html = '') {
        return `
        <div class="card">
            <h2 class="center">🔍 پیش‌نمایش</h2>
            <iframe style="width:100%;height:60vh;border:none;border-radius:12px"
                srcdoc="${html.replace(/"/g, '&quot;')}">
            </iframe>
        </div>
        `;
    }

    /* ---------- API عمومی ---------- */
    return {
        base: baseTemplate,
        home: homeTemplate,
        notes: notesTemplate,
        calculator: calculatorTemplate,
        todo: todoTemplate,
        preview: previewTemplate
    };

})();

// ثبت در سطح جهانی
window.Templates = Templates;

console.log('🧩 Templates.js بارگذاری شد و آماده استفاده');
