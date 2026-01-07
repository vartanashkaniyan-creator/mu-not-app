// preview.js
document.addEventListener('DOMContentLoaded', () => {
    const titleEl = document.getElementById('preview-title');
    const textEl = document.getElementById('preview-text');
    const categoryEl = document.getElementById('preview-category');
    const dateEl = document.getElementById('preview-date');
    const closeBtn = document.getElementById('close-preview');

    // دریافت داده یادداشت از localStorage یا sessionStorage
    const noteData = JSON.parse(sessionStorage.getItem('previewNote'));

    if (noteData) {
        titleEl.textContent = noteData.title || 'بدون عنوان';
        textEl.textContent = noteData.content || '';
        categoryEl.textContent = `دسته‌بندی: ${noteData.category || 'عمومی'}`;
        dateEl.textContent = `تاریخ: ${new Date(noteData.updatedAt).toLocaleDateString('fa-IR')}`;
    } else {
        textEl.textContent = 'هیچ یادداشتی برای پیش‌نمایش یافت نشد.';
    }

    // بستن پیش‌نمایش
    closeBtn.addEventListener('click', () => {
        window.close(); // در حالت وب پنجره را ببندد
        // در موبایل می‌توان به صفحه قبلی بازگردد:
        // history.back();
    });
});
