// ==================== storage.js ====================

class StorageManager {
    constructor(dbName = 'AppBuilderDB', version = 1) {
        this.dbName = dbName;
        this.dbVersion = version;
        this.db = null;
    }

    // ==================== IndexedDB ====================
    initDB() {
        return new Promise((resolve, reject) => {
            if (!('indexedDB' in window)) {
                console.warn('IndexedDB پشتیبانی نمی‌شود، از LocalStorage استفاده می‌کنیم');
                resolve(false);
                return;
            }

            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('apps')) {
                    db.createObjectStore('apps', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('notes')) {
                    db.createObjectStore('notes', { keyPath: 'id' });
                }
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(true);
            };

            request.onerror = (event) => {
                console.error('خطا در باز کردن IndexedDB:', event.target.error);
                reject(event.target.error);
            };
        });
    }

    save(storeName, data) {
        return new Promise((resolve, reject) => {
            if (!this.db) return reject('DB آماده نیست');

            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(data);

            request.onsuccess = () => resolve(true);
            request.onerror = (e) => reject(e.target.error);
        });
    }

    get(storeName, id) {
        return new Promise((resolve, reject) => {
            if (!this.db) return reject('DB آماده نیست');

            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(id);

            request.onsuccess = (e) => resolve(e.target.result);
            request.onerror = (e) => reject(e.target.error);
        });
    }

    getAll(storeName) {
        return new Promise((resolve, reject) => {
            if (!this.db) return reject('DB آماده نیست');

            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();

            request.onsuccess = (e) => resolve(e.target.result);
            request.onerror = (e) => reject(e.target.error);
        });
    }

    delete(storeName, id) {
        return new Promise((resolve, reject) => {
            if (!this.db) return reject('DB آماده نیست');

            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(id);

            request.onsuccess = () => resolve(true);
            request.onerror = (e) => reject(e.target.error);
        });
    }

    clear(storeName) {
        return new Promise((resolve, reject) => {
            if (!this.db) return reject('DB آماده نیست');

            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.clear();

            request.onsuccess = () => resolve(true);
            request.onerror = (e) => reject(e.target.error);
        });
    }

    // ==================== LocalStorage fallback ====================
    saveLS(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (err) {
            console.error('خطا در LocalStorage:', err);
            return false;
        }
    }

    getLS(key) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (err) {
            console.error('خطا در LocalStorage:', err);
            return null;
        }
    }

    removeLS(key) {
        localStorage.removeItem(key);
    }

    clearLS() {
        localStorage.clear();
    }
}

// نمونه‌سازی و در دسترس قرار دادن
const storageManager = new StorageManager();
window.storageManager = storageManager;

// آماده‌سازی IndexedDB
storageManager.initDB().then(() => {
    console.log('✅ StorageManager آماده و IndexedDB فعال شد');
}).catch((err) => {
    console.warn('⚠️ StorageManager فقط با LocalStorage کار می‌کند:', err);
});
