const Core = {
    apps: {},
    init() {
        // Load موجودیت‌ها
        this.loadApps();
    },

    loadApps() {
        const available = AppLibrary.AppFactory.getAvailableApps();
        available.forEach(appInfo => {
            try {
                const appInstance = AppLibrary.AppFactory.createApp(appInfo.id);
                this.apps[appInfo.id] = appInstance;
            } catch (err) {
                console.warn('خطا در ساخت اپ:', appInfo.name, err);
            }
        });
        console.log('✅ همه اپ‌ها بارگذاری شدند:', Object.keys(this.apps));
    },

    getApp(id) {
        return this.apps[id] || null;
    }
};

window.Core = Core;
