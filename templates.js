/**
 * 🧩 Templates.js – موتور قالب اپلیکیشن
 * نسخه 3.1.0 – اصلاح‌شده
 */

const Templates = (() => {

    function baseTemplate({ title = '', body = '', scripts = '' }) {
        return `
        <div class="card">
            <h2 class="center">${title}</h2>
            <div class="card-body">${body}</div>
        </div>
        ${scripts}
        `;
    }

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
                    <button id="save-note" class="btn-primary">💾 ذخیره</button>
                    <button id="clear-note" class="btn-danger">🗑️ پاک کردن</button>
                </div>
                <div class="list" id="notes-list"></div>
            `
        });
    }

    function calculatorTemplate() {
        return baseTemplate({
            title: '🧮 ماشین حساب',
            body: `
                <input id="calc-input" placeholder="مثال: 2+3×4">
                <button class="btn-primary" id="calc-run">محاسبه</button>
                <div class="card center" id="calc-result">---</div>
            `
        });
    }

    function todoTemplate() {
        return baseTemplate({
            title: '✅ لیست کارها',
            body: `
                <input id="todo-input" placeholder="کار جدید...">
                <button class="btn-primary" id="todo-add">افزودن</button>
                <div class="list" id="todo-list"></div>
            `
        });
    }

    function homeTemplate(apps = []) {
        return `
        <div class="app-grid">
            ${apps.map(app => `
                <div class="app-tile" data-route="${app.id}">
                    <span>${app.icon || '📱'}</span>
                    <p>${app.name}</p>
                </div>
            `).join('')}
        </div>
        `;
    }

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

    return {
        base: baseTemplate,
        home: homeTemplate,
        notes: notesTemplate,
        calculator: calculatorTemplate,
        todo: todoTemplate,
        preview: previewTemplate
    };

})();

window.Templates = Templates;
console.log('🧩 Templates.js اصلاح‌شده بارگذاری شد');
