const Storage = {
    save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (err) {
            console.error('خطا در ذخیره‌سازی', err);
        }
    },

    load(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (err) {
            console.error('خطا در بازیابی', err);
            return defaultValue;
        }
    }
};

window.Storage = Storage;
