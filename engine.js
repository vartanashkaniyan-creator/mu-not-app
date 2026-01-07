
/**
 * 🏗️ Engine.js – موتور پردازش و اجرای اپ‌ها
 * نسخه 3.0.0
 * مدیریت حلقه اصلی، پردازش دستورات، و اجرای کد اپ‌ها
 */

class AppEngine {
    constructor(core) {
        if (!core) throw new Error('AppCore لازم است');
        this.core = core;
        this.loopInterval = null;
        this.fps = 60; // تعداد فریم در ثانیه
        this.tasksQueue = [];
    }

    // افزودن تسک به صف اجرا
    enqueue(task) {
        if (typeof task !== 'function') return this.core.error('تسک نامعتبر', task);
        this.tasksQueue.push(task);
        this.core.log('enqueueTask', { task });
    }

    // اجرای یک تسک فوری
    runTask(task) {
        try {
            task();
            this.core.log('runTask', { task });
        } catch (err) {
            this.core.error('خطا در اجرای تسک', err.message);
        }
    }

    // حلقه اصلی موتور
    startLoop() {
        if (this.loopInterval) return; // اگر در حال اجراست، دوباره شروع نکن
        const interval = 1000 / this.fps;
        this.loopInterval = setInterval(() => {
            this.processQueue();
            this.updateApps();
        }, interval);
        this.core.log('engineStartLoop', { fps: this.fps });
    }

    // توقف حلقه اصلی
    stopLoop() {
        if (this.loopInterval) clearInterval(this.loopInterval);
        this.loopInterval = null;
        this.core.log('engineStopLoop', {});
    }

    // پردازش صف تسک‌ها
    processQueue() {
        while (this.tasksQueue.length > 0) {
            const task = this.tasksQueue.shift();
            this.runTask(task);
        }
    }

    // بروزرسانی اپ‌های فعال
    updateApps() {
        const currentApp = this.core.currentApp;
        if (currentApp && typeof currentApp.update === 'function') {
            try {
                currentApp.update();
            } catch (err) {
                this.core.error('خطا در آپدیت اپ', { app: currentApp.name, error: err.message });
            }
        }
    }

    // اجرای یک اپ به صورت مستقل
    runApp(appId) {
        const app = this.core.launchApp(appId);
        if (!app) return;
        if (typeof app.run === 'function') app.run();
    }
}

// ثبت در سطح جهانی
window.AppEngine = new AppEngine(window.AppCore);

console.log('✅ Engine.js بارگذاری شد و آماده اجرای اپ‌ها');
