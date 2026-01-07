document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    const commandSection = document.getElementById('command-section');
    const appOutput = document.getElementById('app-output');

    // init هسته اپ‌ها
    if (window.AppTemplates && AppTemplates.generateApp) {
        window.Core = {
            apps: {},
            init() {
                const available = AppTemplates.listApps();
                available.forEach(appInfo => {
                    try {
                        this.apps[appInfo.id] = AppTemplates.generateApp(appInfo.id);
                    } catch (err) {
                        console.warn(`اپ ${appInfo.name} بارگذاری نشد`, err);
                    }
                });
            },
            getApp(id) {
                return this.apps[id] || null;
            }
        };
        Core.init();
    } else {
        console.error("هسته AppTemplates بارگذاری نشده است!");
    }

    // شبیه‌سازی زمان بارگذاری
    setTimeout(() => {
        loader.style.display = 'none';
        commandSection.style.display = 'flex';
    }, 800); // ۰.۸ ثانیه

    // دکمه اجرا
    document.getElementById('run-command').addEventListener('click', () => {
        const cmd = document.getElementById('command-input').value.trim();
        if (!cmd) return;

        if (cmd.includes('باز') && cmd.includes('یادداشت')) {
            const noteApp = Core.getApp('note');
            if (noteApp) {
                appOutput.innerHTML = '<iframe src="notes.html"></iframe>';
            } else {
                appOutput.innerHTML = '<p>اپ یادداشت بارگذاری نشد!</p>';
            }
        } else if (cmd.includes('باز') && cmd.includes('ماشین حساب')) {
            const calcApp = Core.getApp('calculator');
            if (calcApp) {
                appOutput.innerHTML = '<iframe src="calculator.html"></iframe>';
            } else {
                appOutput.innerHTML = '<p>اپ ماشین حساب بارگذاری نشد!</p>';
            }
        } else {
            appOutput.innerHTML = `<p>دستور نامعتبر: ${cmd}</p>`;
        }
    });
});
