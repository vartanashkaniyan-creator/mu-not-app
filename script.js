
// script.js
// اسکریپت عمومی پروژه – اتصال UI، Router و Engine

(function () {
    'use strict';

    console.log('📜 script.js loaded');

    // اطمینان از لود شدن DOM
    document.addEventListener('DOMContentLoaded', () => {
        initApp();
    });

    function initApp() {
        // بررسی وجود ماژول‌های اصلی
        if (!window.Engine) {
            console.error('❌ Engine لود نشده');
            return;
        }
        if (!window.Router) {
            console.error('❌ Router لود نشده');
            return;
        }
        if (!window.UI) {
            console.error('❌ UI لود نشده');
            return;
        }

        console.log('✅ ماژول‌ها آماده‌اند');

        // مقداردهی اولیه UI
        UI.init();

        // تعریف مسیرها
        Router.register('/home', () => {
            UI.load('home');
        });

        Router.register('/notes', () => {
            UI.load('notes');
        });

        Router.register('/calculator', () => {
            UI.load('calculator');
        });

        Router.register('/preview', () => {
            UI.load('preview');
        });

        // مسیر پیش‌فرض
        Router.setDefault('/home');

        // راه‌اندازی Router
        Router.init();

        // اتصال دکمه‌های ناوبری (موبایل‌فرندلی)
        bindNavigation();
    }

    function bindNavigation() {
        document.body.addEventListener('click', (e) => {
            const target = e.target.closest('[data-route]');
            if (!target) return;

            e.preventDefault();
            const route = target.getAttribute('data-route');
            if (route) {
                Router.navigate(route);
            }
        });
    }

})();
