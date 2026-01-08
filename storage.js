// storage.js - سیستم مدیریت ذخیره‌سازی
export class StorageManager {
    constructor() {
        this.prefix = 'appbuilder_';
        this.encryptionKey = null;
        this.cache = new Map();
        this.maxCacheSize = 1000;
        this.init();
    }

    init() {
        this.checkQuota();
        this.migrateOldData();
        this.setupAutoCleanup();
    }

    // localStorage با تایپ‌های داده
    set(key, value, options = {}) {
        const fullKey = this.prefix + key;
        const data = {
            value: this.serialize(value),
            type: typeof value,
            timestamp: Date.now(),
            expires: options.expires ? Date.now() + options.expires : null,
            version: '1.0'
        };

        try {
            localStorage.setItem(fullKey, JSON.stringify(data));
            this.cache.set(fullKey, data);
            this.manageCacheSize();
            return true;
        } catch (e) {
            this.handleStorageError(e, key);
            return false;
        }
    }

    get(key, defaultValue = null) {
        const fullKey = this.prefix + key;
        
        if (this.cache.has(fullKey)) {
            const cached = this.cache.get(fullKey);
            if (!this.isExpired(cached)) {
                return this.deserialize(cached.value, cached.type);
            }
            this.remove(key);
        }

        const item = localStorage.getItem(fullKey);
        if (!item) return defaultValue;

        try {
            const data = JSON.parse(item);
            
            if (this.isExpired(data)) {
                this.remove(key);
                return defaultValue;
            }

            this.cache.set(fullKey, data);
            return this.deserialize(data.value, data.type);
        } catch (e) {
            console.error('Storage parse error:', e);
            return defaultValue;
        }
    }

    remove(key) {
        const fullKey = this.prefix + key;
        localStorage.removeItem(fullKey);
        this.cache.delete(fullKey);
    }

    clear(prefixOnly = true) {
        if (prefixOnly) {
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
        } else {
            localStorage.clear();
        }
        this.cache.clear();
    }

    // sessionStorage مدیریت
    setSession(key, value) {
        const data = {
            value: this.serialize(value),
            type: typeof value
        };
        sessionStorage.setItem(this.prefix + key, JSON.stringify(data));
    }

    getSession(key, defaultValue = null) {
        const item = sessionStorage.getItem(this.prefix + key);
        if (!item) return defaultValue;
        
        try {
            const data = JSON.parse(item);
            return this.deserialize(data.value, data.type);
        } catch (e) {
            return defaultValue;
        }
    }

    // IndexedDB برای داده‌های بزرگ
    async openDB(name = 'AppBuilderDB', version = 1) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(name, version);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('data')) {
                    db.createObjectStore('data', { keyPath: 'key' });
                }
            };
        });
    }

    async saveToDB(key, value) {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['data'], 'readwrite');
            const store = transaction.objectStore('data');
            
            const item = {
                key: this.prefix + key,
                value: this.serialize(value),
                timestamp: Date.now(),
                size: JSON.stringify(value).length
            };
            
            const request = store.put(item);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(true);
        });
    }

    async loadFromDB(key, defaultValue = null) {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['data'], 'readonly');
            const store = transaction.objectStore('data');
            
            const request = store.get(this.prefix + key);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                if (request.result) {
                    resolve(this.deserialize(request.result.value));
                } else {
                    resolve(defaultValue);
                }
            };
        });
    }

    // فایل‌های کوچک
    saveFile(key, content, type = 'text/plain') {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        this.set(key + '_url', url);
        return url;
    }

    // ابزارک‌های کمکی
    serialize(value) {
        if (value === undefined) return '__undefined__';
        if (value instanceof Date) return { __type: 'Date', value: value.toISOString() };
        if (value instanceof Map) return { __type: 'Map', value: Array.from(value.entries()) };
        if (value instanceof Set) return { __type: 'Set', value: Array.from(value) };
        if (typeof value === 'function') return { __type: 'Function', value: value.toString() };
        return value;
    }

    deserialize(data, type = null) {
        if (data === '__undefined__') return undefined;
        
        if (data && typeof data === 'object' && data.__type) {
            switch (data.__type) {
                case 'Date': return new Date(data.value);
                case 'Map': return new Map(data.value);
                case 'Set': return new Set(data.value);
                case 'Function': return eval(`(${data.value})`);
                default: return data.value;
            }
        }
        
        return data;
    }

    isExpired(data) {
        return data.expires && Date.now() > data.expires;
    }

    getAllKeys() {
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(this.prefix)) {
                keys.push(key.slice(this.prefix.length));
            }
        }
        return keys;
    }

    getSize(key = null) {
        if (key) {
            const item = localStorage.getItem(this.prefix + key);
            return item ? new Blob([item]).size : 0;
        }
        
        let total = 0;
        this.getAllKeys().forEach(k => {
            total += this.getSize(k);
        });
        return total;
    }

    checkQuota() {
        const used = this.getSize();
        const quota = 5 * 1024 * 1024; // 5MB
        if (used > quota * 0.9) {
            this.cleanupOldData();
        }
    }

    cleanupOldData(maxAge = 30 * 24 * 60 * 60 * 1000) {
        const cutoff = Date.now() - maxAge;
        this.getAllKeys().forEach(key => {
            const item = localStorage.getItem(this.prefix + key);
            if (item) {
                try {
                    const data = JSON.parse(item);
                    if (data.timestamp && data.timestamp < cutoff) {
                        this.remove(key);
                    }
                } catch (e) {
                    this.remove(key);
                }
            }
        });
    }

    manageCacheSize() {
        if (this.cache.size > this.maxCacheSize) {
            const entries = Array.from(this.cache.entries())
                .sort((a, b) => a[1].timestamp - b[1].timestamp);
            
            const toRemove = entries.slice(0, entries.length - this.maxCacheSize);
            toRemove.forEach(([key]) => this.cache.delete(key));
        }
    }

    handleStorageError(error, key) {
        if (error.name === 'QuotaExceededError') {
            this.cleanupOldData(7 * 24 * 60 * 60 * 1000);
            this.set(key, this.get(key));
        }
    }

    migrateOldData() {
        Object.keys(localStorage).forEach(key => {
            if (!key.startsWith(this.prefix) && key.startsWith('app_')) {
                const value = localStorage.getItem(key);
                this.set(key.replace('app_', ''), value);
                localStorage.removeItem(key);
            }
        });
    }

    setupAutoCleanup() {
        setInterval(() => this.cleanupOldData(), 24 * 60 * 60 * 1000);
    }

    exportData() {
        const data = {};
        this.getAllKeys().forEach(key => {
            data[key] = this.get(key);
        });
        return data;
    }

    importData(data) {
        Object.entries(data).forEach(([key, value]) => {
            this.set(key, value);
        });
    }
}

export const storage = new StorageManager();
