// storage.js
// لایه ذخیره‌سازی مرکزی App Builder
// Mobile-first | Offline-ready | قابل ارتقا

const Storage = (() => {
    const PREFIX = 'APP_BUILDER_';

    // ---------- ابزار داخلی ----------
    function buildKey(key) {
        return `${PREFIX}${key}`;
    }

    function safeParse(value, fallback = null) {
        try {
            return JSON.parse(value);
        } catch {
            return fallback;
        }
    }

    // ---------- API عمومی ----------
    return {
        // ذخیره داده
        set(key, value) {
            try {
                localStorage.setItem(buildKey(key), JSON.stringify(value));
                return true;
            } catch (err) {
                console.error('❌ Storage set error:', err);
                return false;
            }
        },

        // دریافت داده
        get(key, defaultValue = null) {
            const raw = localStorage.getItem(buildKey(key));
            if (raw === null) return defaultValue;
            return safeParse(raw, defaultValue);
        },

        // حذف کلید
        remove(key) {
            localStorage.removeItem(buildKey(key));
        },

        // پاکسازی کل برنامه
        clearAll() {
            Object.keys(localStorage)
                .filter(k => k.startsWith(PREFIX))
                .forEach(k => localStorage.removeItem(k));
        },

        // ---------- اپ‌ها ----------
        saveApp(appId, appData) {
            return this.set(`APP_${appId}`, {
                data: appData,
                updatedAt: new Date().toISOString()
            });
        },

        loadApp(appId) {
            return this.get(`APP_${appId}`);
        },

        listApps() {
            return Object.keys(localStorage)
                .filter(k => k.startsWith(`${PREFIX}APP_`))
                .map(k => k.replace(`${PREFIX}APP_`, ''));
        },

        deleteApp(appId) {
            this.remove(`APP_${appId}`);
        },

        // ---------- تنظیمات ----------
        saveSettings(settings) {
            return this.set('SETTINGS', settings);
        },

        loadSettings() {
            return this.get('SETTINGS', {
                theme: 'auto',
                language: 'fa',
                autosave: true
            });
        },

        // ---------- بکاپ ----------
        exportAll() {
            const data = {};
            Object.keys(localStorage)
                .filter(k => k.startsWith(PREFIX))
                .forEach(k => {
                    data[k] = safeParse(localStorage.getItem(k));
                });

            return {
                meta: {
                    exportedAt: new Date().toISOString(),
                    engine: 'App Builder'
                },
                data
            };
        },

        importAll(payload) {
            if (!payload || !payload.data) return false;

            try {
                Object.entries(payload.data).forEach(([key, value]) => {
                    localStorage.setItem(key, JSON.stringify(value));
                });
                return true;
            } catch (err) {
                console.error('❌ Import failed:', err);
                return false;
            }
        },

        // ---------- وضعیت ----------
        info() {
            return {
                totalKeys: Object.keys(localStorage).filter(k => k.startsWith(PREFIX)).length,
                storageUsage: JSON.stringify(localStorage).length
            };
        }
    };
})();

// صادر کردن سراسری
window.Storage = Storage;

console.log('💾 Storage layer loaded');
