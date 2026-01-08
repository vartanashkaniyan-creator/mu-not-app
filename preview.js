document.addEventListener('DOMContentLoaded',()=>{
    const noteData=JSON.parse(sessionStorage.getItem('previewNote')||'null');
    const app=document.getElementById('app');
    if(!noteData){ app.innerHTML='<p class="center">هیچ یادداشتی برای پیش‌نمایش یافت نشد.</p>'; return; }
    app.innerHTML=`<h2 class="center">${noteData.title||'بدون عنوان'}</h2><p>${noteData.content||''}</p><span>دسته‌بندی: ${noteData.category||'عمومی'}</span><br><span>تاریخ: ${new Date(noteData.updatedAt).toLocaleDateString('fa-IR')}</span>`;
});
