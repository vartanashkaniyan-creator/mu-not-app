/**
 * ⚙️ core.js – توابع کمکی و هسته اپ
 */

const Core = (() => {

    const apps = [
        { id: '/notes', name: '📝 یادداشت‌ها', icon: '📝' },
        { id: '/calculator', name: '🧮 ماشین حساب', icon: '🧮' },
        { id: '/todo', name: '✅ لیست کارها', icon: '✅' }
    ];

    function log(msg, ...args) {
        console.log('Core:', msg, ...args);
    }

    function getApps() {
        return apps;
    }

    return {
        log,
        getApps
    };

})();

window.Engine = Core;
console.log('✅ Core.js آماده شد');
