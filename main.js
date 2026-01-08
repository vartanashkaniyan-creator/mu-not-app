/**
 * 🏁 main.js – هسته راه‌اندازی اپ
 * نسخه 3.0.0
 */

(function () {
    'use strict';

    console.log('🚀 main.js loaded');

    document.addEventListener('DOMContentLoaded', () => {
        initApp();
    });

    function initApp() {
        if (!window.Engine || !window.Router || !window.UI) {
            console.error('❌ ماژول‌های اصلی آماده نیستند');
            return;
        }

        console.log('✅ ماژول‌ها آماده');

        // مقداردهی اولیه UI
        UI.init();

        // ثبت مسیرها
        Router.register('/home', () => UI.load('home'));
        Router.register('/notes', () => UI.load('notes'));
        Router.register('/calculator', () => UI.load('calculator'));
        Router.register('/preview', () => UI.load('preview'));

        // مسیر پیش‌فرض
        Router.setDefault('/home');

        // راه‌اندازی Router
        Router.init();

        // دکمه‌های ناوبری SPA (موبایل فرندلی)
        document.body.addEventListener('click', (e) => {
            const target = e.target.closest('[data-route]');
            if (!target) return;

            e.preventDefault();
            const route = target.getAttribute('data-route');
            if (route) Router.navigate(route);
        });

        console.log('🧩 App Initialized Successfully');
    }

})();
