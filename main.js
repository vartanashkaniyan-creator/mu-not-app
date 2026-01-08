
/**
 * AppBuilder - Main Entry Point
 * Bootstrap and configuration loader
 */

(function() {
    'use strict';
    
    // Check for critical browser features
    function checkBrowserSupport() {
        const requiredFeatures = [
            'Promise' in window,
            'localStorage' in window,
            'indexedDB' in window,
            'serviceWorker' in navigator,
            'fetch' in window,
            'customElements' in window
        ];
        
        const missingFeatures = requiredFeatures.filter(supported => !supported);
        
        if (missingFeatures.length > 0) {
            showBrowserError();
            return false;
        }
        
        return true;
    }
    
    // Show browser compatibility error
    function showBrowserError() {
        const errorHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                padding: 20px;
                text-align: center;
                font-family: Tahoma, Arial, sans-serif;
            ">
                <div style="max-width: 600px;">
                    <h1 style="font-size: 2.5rem; margin-bottom: 20px;">⚠️ مرورگر شما پشتیبانی نمی‌شود</h1>
                    <p style="font-size: 1.2rem; line-height: 1.6; margin-bottom: 30px;">
                        برای استفاده از AppBuilder، لطفاً مرورگر خود را به آخرین نسخه بروزرسانی کنید یا از مرورگرهای زیر استفاده نمایید:
                    </p>
                    <div style="
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                        gap: 20px;
                        margin-bottom: 40px;
                    ">
                        <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px;">
                            <div style="font-size: 3rem; margin-bottom: 10px;">🌐</div>
                            <h3>Google Chrome</h3>
                            <p>نسخه ۷۰ به بالا</p>
                        </div>
                        <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px;">
                            <div style="font-size: 3rem; margin-bottom: 10px;">🔥</div>
                            <h3>Mozilla Firefox</h3>
                            <p>نسخه ۸۰ به بالا</p>
                        </div>
                        <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px;">
                            <div style="font-size: 3rem; margin-bottom: 10px;">🦁</div>
                            <h3>Safari</h3>
                            <p>نسخه ۱۴ به بالا</p>
                        </div>
                    </div>
                    <button onclick="location.reload()" style="
                        background: white;
                        color: #667eea;
                        border: none;
                        padding: 15px 40px;
                        font-size: 1.1rem;
                        border-radius: 50px;
                        cursor: pointer;
                        font-weight: bold;
                    ">
                        🔄 تلاش مجدد
                    </button>
                </div>
            </div>
        `;
        
        document.body.innerHTML = errorHTML;
    }
    
    // Load CSS dynamically
    function loadStyles() {
        // Check if CSS is already loaded
        if (document.querySelector('link[href*="style.css"]')) {
            return Promise.resolve();
        }
        
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'style.css';
            link.onload = resolve;
            link.onerror = reject;
            document.head.appendChild(link);
        });
    }
    
    // Load JavaScript modules
    async function loadModules() {
        const modules = [
            'core.js',
            'engine.js',
            'ui.js',
            'router.js',
            'storage.js',
            'i18n.js',
            'app.js',
            'templates.js',
            'calculator.js',
            'notes.js'
        ];
        
        // Load modules sequentially
        for (const module of modules) {
            try {
                await loadScript(module);
                console.log(`✅ Module loaded: ${module}`);
            } catch (error) {
                console.error(`❌ Failed to load module: ${module}`, error);
                throw new Error(`Failed to load required module: ${module}`);
            }
        }
    }
    
    // Load individual script
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            // Check if already loaded
            if (document.querySelector(`script[src*="${src}"]`)) {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = src;
            script.async = false;
            script.onload = () => {
                // Give time for module to register
                setTimeout(resolve, 50);
            };
            script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
            document.head.appendChild(script);
        });
    }
    
    // Register Service Worker
    async function registerServiceWorker() {
        if (!('serviceWorker' in navigator)) {
            console.warn('Service Worker not supported');
            return null;
        }
        
        try {
            const registration = await navigator.serviceWorker.register('service.worker.js', {
                scope: '/'
            });
            
            console.log('✅ Service Worker registered:', registration);
            
            // Check for updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                console.log('🔄 Service Worker update found');
                
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // New update available
                        showUpdateNotification();
                    }
                });
            });
            
            return registration;
        } catch (error) {
            console.error('❌ Service Worker registration failed:', error);
            return null;
        }
    }
    
    // Show update notification
    function showUpdateNotification() {
        if (!window.AppUI) return;
        
        const notification = {
            title: 'بروزرسانی جدید',
            message: 'نسخه جدیدی از AppBuilder موجود است. می‌خواهید بارگذاری کنید؟',
            type: 'info',
            duration: 0, // No auto-dismiss
            actions: [
                {
                    text: 'بارگذاری',
                    handler: () => {
                        window.location.reload();
                        notification.hide();
                    },
                    primary: true
                },
                {
                    text: 'بعداً',
                    handler: () => notification.hide()
                }
            ]
        };
        
        // Show using AppUI if available
        setTimeout(() => {
            if (window.AppUI && window.AppUI.showNotification) {
                window.AppUI.showNotification(notification);
            }
        }, 3000);
    }
    
    // Initialize PWA
    function initPWA() {
        // Set theme color meta
        let themeColor = document.querySelector('meta[name="theme-color"]');
        if (!themeColor) {
            themeColor = document.createElement('meta');
            themeColor.name = 'theme-color';
            themeColor.content = '#2196f3';
            document.head.appendChild(themeColor);
        }
        
        // Add to home screen prompt
        let deferredPrompt;
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            
            // Show install button after 5 seconds
            setTimeout(() => {
                showInstallPrompt();
            }, 5000);
        });
        
        function showInstallPrompt() {
            if (!deferredPrompt || !window.AppUI) return;
            
            window.AppUI.showToast(
                'نصب AppBuilder روی صفحه اصلی',
                'info',
                10000,
                [
                    {
                        text: 'نصب',
                        action: () => {
                            deferredPrompt.prompt();
                            deferredPrompt.userChoice.then((choiceResult) => {
                                deferredPrompt = null;
                            });
                        }
                    }
                ]
            );
        }
        
        // Track app launch
        window.addEventListener('appinstalled', () => {
            console.log('App installed successfully');
            if (window.gtag) {
                gtag('event', 'install');
            }
        });
    }
    
    // Show loading screen
    function showLoadingScreen() {
        const loadingHTML = `
            <div id="app-loading" style="
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                font-family: Tahoma, Arial, sans-serif;
                transition: opacity 0.3s;
            ">
                <div style="text-align: center; margin-bottom: 40px;">
                    <div style="
                        width: 100px;
                        height: 100px;
                        margin: 0 auto 20px;
                        border-radius: 20px;
                        background: rgba(255,255,255,0.1);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 40px;
                    ">
                        📱
                    </div>
                    <h1 style="font-size: 2.5rem; margin-bottom: 10px;">AppBuilder</h1>
                    <p style="opacity: 0.8;">ساخت اپ موبایل بدون نیاز به کدنویسی</p>
                </div>
                
                <div style="width: 200px; height: 4px; background: rgba(255,255,255,0.2); border-radius: 2px; overflow: hidden;">
                    <div id="loading-progress" style="
                        width: 0%;
                        height: 100%;
                        background: white;
                        border-radius: 2px;
                        transition: width 0.3s;
                    "></div>
                </div>
                
                <div id="loading-status" style="margin-top: 20px; font-size: 0.9rem; opacity: 0.8;">
                    در حال بارگذاری...
                </div>
                
                <div style="position: absolute; bottom: 20px; font-size: 0.8rem; opacity: 0.6;">
                    نسخه ۳.۰.۰
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('afterbegin', loadingHTML);
    }
    
    // Update loading progress
    function updateLoadingProgress(percent, status) {
        const progressBar = document.getElementById('loading-progress');
        const statusText = document.getElementById('loading-status');
        
        if (progressBar) {
            progressBar.style.width = `${percent}%`;
        }
        
        if (statusText) {
            statusText.textContent = status;
        }
    }
    
    // Hide loading screen
    function hideLoadingScreen() {
        const loadingScreen = document.getElementById('app-loading');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.remove();
            }, 300);
        }
    }
    
    // Main initialization
    async function main() {
        try {
            // Step 1: Check browser support
            updateLoadingProgress(10, 'در حال بررسی مرورگر...');
            if (!checkBrowserSupport()) {
                return;
            }
            
            // Step 2: Show loading screen
            showLoadingScreen();
            
            // Step 3: Load CSS
            updateLoadingProgress(20, 'در حال بارگذاری استایل‌ها...');
            await loadStyles();
            
            // Step 4: Load modules
            updateLoadingProgress(40, 'در حال بارگذاری ماژول‌ها...');
            await loadModules();
            
            // Step 5: Register Service Worker
            updateLoadingProgress(60, 'در حال راه‌اندازی حالت آفلاین...');
            await registerServiceWorker();
            
            // Step 6: Initialize PWA
            updateLoadingProgress(80, 'در حال پیکربندی اپ...');
            initPWA();
            
            // Step 7: Initialize AppBuilder
            updateLoadingProgress(90, 'در حال راه‌اندازی سیستم...');
            
            // Wait for AppBuilder to be available
            let attempts = 0;
            while (!window.AppBuilder && attempts < 50) {
                await new Promise(resolve => setTimeout(resolve, 100));
                attempts++;
            }
            
            if (!window.AppBuilder) {
                throw new Error('AppBuilder failed to load');
            }
            
            // Initialize AppBuilder
            await window.AppBuilder.init();
            
            // Step 8: Complete
            updateLoadingProgress(100, 'آماده!');
            setTimeout(hideLoadingScreen, 500);
            
        } catch (error) {
            console.error('Fatal error during initialization:', error);
            
            // Show error to user
            const errorElement = document.createElement('div');
            errorElement.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: #f44336;
                color: white;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                padding: 40px;
                text-align: center;
                font-family: Tahoma, Arial, sans-serif;
                z-index: 10000;
            `;
            
            errorElement.innerHTML = `
                <h1 style="font-size: 2rem; margin-bottom: 20px;">خطا در راه‌اندازی</h1>
                <p style="margin-bottom: 30px; font-size: 1.1rem;">${error.message}</p>
                <button onclick="location.reload()" style="
                    background: white;
                    color: #f44336;
                    border: none;
                    padding: 12px 30px;
                    font-size: 1rem;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: bold;
                ">
                    🔄 بارگذاری مجدد
                </button>
            `;
            
            document.body.appendChild(errorElement);
        }
    }
    
    // Start everything
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();
