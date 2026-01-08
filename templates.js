const Templates = (() => {
    function base({title='',body=''}){
        return `<div class="card"><h2 class="center">${title}</h2><div class="card-body">${body}</div></div>`;
    }

    function home(apps=[]){
        return `<div class="app-grid">${apps.map(a=>`<div class="app-tile" data-route="${a.id}"><span>${a.icon||'📱'}</span><p>${a.name}</p></div>`).join('')}</div>`;
    }

    function notes(){
        return base({title:'📝 یادداشت‌ها', body:`
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
        `});
    }

    function calculator(){ return base({title:'🧮 ماشین حساب', body:`
        <input id="calc-input" placeholder="مثال: 2+3×4">
        <button id="calc-run" class="btn-primary">محاسبه</button>
        <div id="calc-result" class="card center">---</div>
    `}); }

    function todo(){ return base({title:'✅ لیست کارها', body:`
        <input id="todo-input" placeholder="کار جدید...">
        <button id="todo-add" class="btn-primary">افزودن</button>
        <div id="todo-list" class="list"></div>
    `}); }

    function preview(html=''){ return base({title:'🔍 پیش‌نمایش', body:`<iframe srcdoc="${html.replace(/"/g,'&quot;')}" style="width:100%;height:60vh;border:none;border-radius:12px"></iframe>`}); }

    return {base,home,notes,calculator,todo,preview};
})();
window.Templates=Templates;
