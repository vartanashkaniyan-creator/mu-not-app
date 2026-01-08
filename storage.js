/**
 * 🗄️ Storage.js – مدیریت داده‌های اپلیکیشن
 * نسخه 3.0.0
 * ذخیره‌سازی سریع و امن در LocalStorage
 */

const Storage = {
    prefix: 'AppBuilder_', // پیشوند برای همه کلیدها

    // دریافت تمام داده‌ها از نوع مشخص
    getAll(type = 'notes') {
        const raw = localStorage.getItem(this.prefix + type);
        return raw ? JSON.parse(raw) : [];
    },

    // ذخیره یک مورد جدید
    save(item, type = 'notes') {
        const list = this.getAll(type);
        item.id = item.id || Date.now();
        item.updatedAt = new Date().toISOString();
        list.unshift(item);
        localStorage.setItem(this.prefix + type, JSON.stringify(list));
        return item;
    },

    // بروزرسانی یک مورد بر اساس id
    update(id, data, type = 'notes') {
        const list = this.getAll(type);
        const index = list.findIndex(i => i.id === id);
        if (index === -1) return null;
        list[index] = { ...list[index], ...data, updatedAt: new Date().toISOString() };
        localStorage.setItem(this.prefix + type, JSON.stringify(list));
        return list[index];
    },

    // حذف یک مورد بر اساس id
    remove(id, type = 'notes') {
        let list = this.getAll(type);
        list = list.filter(i => i.id !== id);
        localStorage.setItem(this.prefix + type, JSON.stringify(list));
        return list;
    },

    // گرفتن یک مورد خاص
    get(id, type = 'notes') {
        const list = this.getAll(type);
        return list.find(i => i.id === id) || null;
    },

    // پاک کردن تمام داده‌ها از نوع مشخص
    clear(type = 'notes') {
        localStorage.removeItem(this.prefix + type);
    },

    // پاک کردن تمام داده‌های اپ
    clearAll() {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(this.prefix)) localStorage.removeItem(key);
        });
    }
};

// ثبت در سطح جهانی
window.Storage = Storage;

console.log('✅ Storage.js بارگذاری شد و آماده استفاده');
