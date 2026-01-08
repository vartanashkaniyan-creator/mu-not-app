/**
 * 🏗️ app.js – هسته اپلیکیشن
 * مدیریت ماژول‌ها، راه‌اندازی UI و Router
 */

(function () {
    'use strict';

    console.log('📱 app.js loaded');

    document.addEventListener('DOMContentLoaded', () => {
        initApp();
    });

    function initApp() {
        if (!window.Engine || !window.UI || !window.Router || !window.Storage) {
            console.error('❌ یکی از ماژول‌های اصلی آماده نیست');
            return;
        }

        UI.init();
        Router.register('/home', () => UI.load('home', { apps: Engine.getApps() }));
        Router.register('/notes', () => UI.load('notes'));
        Router.register('/calculator', () => UI.load('calculator'));
        Router.register('/todo', () => UI.load('todo'));
        Router.register('/preview', () => UI.load('preview'));

        Router.setDefault('/home');
        Router.init();

        console.log('✅ App Initialized');
    }

    window.App = {
        init: initApp
    };

})();
