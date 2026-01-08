/**
 * AppBuilder - Main Execution Script
 * Version: 3.0.0
 * Description: Core initialization and app orchestration
 */

const AppBuilder = (function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        DEBUG: true,
        VERSION: '3.0.0',
        DEFAULT_APP: 'dashboard',
        SUPPORTED_LANGUAGES: ['fa', 'en', 'ar', 'tr'],
        THEMES: ['light', 'dark', 'blue', 'auto']
    };
    
    // State Management
    const state = {
        currentApp: null,
        currentView: 'home',
        language: 'fa',
        theme: 'light',
        userPrefs: {},
        initialized: false,
        apps: []
    };
    
    // Core Modules Cache
    const modules = {
        router: null,
        storage: null,
        ui: null,
        engine: null,
        i18n: null
    };
    
    // Initialize AppBuilder
    async function init() {
        if (state.initialized) {
            console.warn('AppBuilder already initialized');
            return;
        }
        
        try {
            // Load core modules
            await loadCoreModules();
            
            // Initialize modules
            await initializeModules();
            
            // Load user preferences
            await loadUserPrefs();
            
            // Apply preferences
            applyUserPrefs();
            
            // Load available apps
            await loadApps();
            
            // Setup event listeners
            setupEventListeners();
            
            // Start router
            modules.router.start();
            
            state.initialized = true;
            log('AppBuilder initialized successfully');
            
            // Dispatch initialized event
            window.dispatchEvent(new CustomEvent('appbuilder:ready'));
            
        } catch (error) {
            console.error('Failed to initialize AppBuilder:', error);
            showError('خطا در راه‌اندازی سیستم', error.message);
        }
    }
    
    // Load core modules
    async function loadCoreModules() {
        modules.storage = window.AppStorage;
        modules.ui = window.AppUI;
        modules.engine = window.AppEngine;
        modules.router = window.AppRouter;
        modules.i18n = window.AppI18n;
        
        // Verify all modules are loaded
        const missingModules = Object.entries(modules)
            .filter(([name, module]) => !module)
            .map(([name]) => name);
            
        if (missingModules.length > 0) {
            throw new Error(`Missing modules: ${missingModules.join(', ')}`);
        }
    }
    
    // Initialize modules
    async function initializeModules() {
        // Order matters
        await modules.storage.init();
        await modules.i18n.init();
        await modules.ui.init();
        await modules.engine.init();
    }
    
    // Load user preferences
    async function loadUserPrefs() {
        try {
            const prefs = await modules.storage.get('user_preferences') || {};
            state.userPrefs = prefs;
            state.language = prefs.language || 'fa';
            state.theme = prefs.theme || 'light';
        } catch (error) {
            log('Using default preferences');
        }
    }
    
    // Apply user preferences
    function applyUserPrefs() {
        // Apply language
        modules.i18n.setLanguage(state.language);
        
        // Apply theme
        modules.ui.setTheme(state.theme);
        
        // Apply other UI preferences
        if (state.userPrefs.fontSize) {
            document.documentElement.style.fontSize = state.userPrefs.fontSize;
        }
    }
    
    // Load available apps
    async function loadApps() {
        try {
            // Load from storage or use default apps
            const savedApps = await modules.storage.get('user_apps');
            
            if (savedApps && savedApps.length > 0) {
                state.apps = savedApps;
            } else {
                // Load default apps from engine
                const defaultApps = modules.engine.getDefaultApps();
                state.apps = defaultApps;
                await modules.storage.set('user_apps', defaultApps);
            }
            
            log(`Loaded ${state.apps.length} apps`);
        } catch (error) {
            console.error('Failed to load apps:', error);
            state.apps = [];
        }
    }
    
    // Setup global event listeners
    function setupEventListeners() {
        // App navigation
        document.addEventListener('app:navigate', (e) => {
            const { appId, view } = e.detail;
            navigateToApp(appId, view);
        });
        
        // Language change
        document.addEventListener('language:change', (e) => {
            changeLanguage(e.detail.language);
        });
        
        // Theme change
        document.addEventListener('theme:change', (e) => {
            changeTheme(e.detail.theme);
        });
        
        // App created/updated/deleted
        document.addEventListener('app:created', handleAppChange);
        document.addEventListener('app:updated', handleAppChange);
        document.addEventListener('app:deleted', handleAppChange);
        
        // Online/offline detection
        window.addEventListener('online', handleOnlineStatus);
        window.addEventListener('offline', handleOnlineStatus);
        
        // Service Worker updates
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('controllerchange', handleSWUpdate);
        }
    }
    
    // Navigation handler
    function navigateToApp(appId, view = 'main') {
        const app = state.apps.find(a => a.id === appId);
        
        if (!app) {
            console.error(`App not found: ${appId}`);
            modules.router.navigate('/apps');
            return;
        }
        
        state.currentApp = appId;
        state.currentView = view;
        
        // Update URL
        modules.router.navigate(`/app/${appId}/${view}`);
        
        // Load app interface
        loadAppInterface(app, view);
    }
    
    // Load app interface
    async function loadAppInterface(app, view) {
        try {
            // Show loading
            modules.ui.showLoader('در حال بارگذاری برنامه...');
            
            // Get app template
            const template = await modules.engine.getAppTemplate(app, view);
            
            // Render app
            modules.ui.renderApp(app, template, view);
            
            // Initialize app specific scripts
            if (app.scripts && app.scripts[view]) {
                await executeAppScript(app.scripts[view], app.id);
            }
            
            // Update title
            document.title = `${app.name} - AppBuilder`;
            
            // Hide loader
            modules.ui.hideLoader();
            
            // Dispatch event
            window.dispatchEvent(new CustomEvent('app:loaded', {
                detail: { app, view }
            }));
            
        } catch (error) {
            console.error('Failed to load app interface:', error);
            modules.ui.showError('خطا در بارگذاری برنامه', error.message);
            modules.router.navigate('/apps');
        }
    }
    
    // Execute app script
    async function executeAppScript(script, appId) {
        try {
            // Create isolated context for app script
            const context = {
                appId,
                storage: modules.storage,
                ui: modules.ui,
                i18n: modules.i18n,
                utils: modules.engine.utils,
                console: CONFIG.DEBUG ? console : { log: () => {}, error: () => {} }
            };
            
            // Execute in isolated function
            const func = new Function(...Object.keys(context), script);
            func(...Object.values(context));
            
        } catch (error) {
            console.error(`Error executing script for app ${appId}:`, error);
        }
    }
    
    // Language change handler
    async function changeLanguage(lang) {
        if (!CONFIG.SUPPORTED_LANGUAGES.includes(lang)) {
            console.error(`Unsupported language: ${lang}`);
            return;
        }
        
        try {
            await modules.i18n.setLanguage(lang);
            state.language = lang;
            
            // Save preference
            state.userPrefs.language = lang;
            await modules.storage.set('user_preferences', state.userPrefs);
            
            // Reload current view if needed
            if (state.currentApp) {
                modules.ui.updateTexts();
            }
            
            log(`Language changed to: ${lang}`);
            
        } catch (error) {
            console.error('Failed to change language:', error);
        }
    }
    
    // Theme change handler
    async function changeTheme(theme) {
        if (!CONFIG.THEMES.includes(theme)) {
            console.error(`Unsupported theme: ${theme}`);
            return;
        }
        
        try {
            await modules.ui.setTheme(theme);
            state.theme = theme;
            
            // Save preference
            state.userPrefs.theme = theme;
            await modules.storage.set('user_preferences', state.userPrefs);
            
            log(`Theme changed to: ${theme}`);
            
        } catch (error) {
            console.error('Failed to change theme:', error);
        }
    }
    
    // App change handler
    async function handleAppChange(e) {
        // Reload apps
        await loadApps();
        
        // If current app was deleted, navigate to apps list
        if (e.type === 'app:deleted' && e.detail.appId === state.currentApp) {
            modules.router.navigate('/apps');
        }
    }
    
    // Online status handler
    function handleOnlineStatus() {
        const isOnline = navigator.onLine;
        modules.ui.showToast(
            isOnline ? 'آنلاین شدید' : 'آفلاین شدید',
            isOnline ? 'success' : 'warning'
        );
        
        // Update UI
        document.documentElement.classList.toggle('online', isOnline);
        document.documentElement.classList.toggle('offline', !isOnline);
    }
    
    // Service Worker update handler
    function handleSWUpdate() {
        modules.ui.showToast(
            'بروزرسانی جدید بارگیری شد',
            'info'
        );
    }
    
    // Error display
    function showError(title, message) {
        modules.ui.showError(title, message);
    }
    
    // Logging utility
    function log(message, data = null) {
        if (CONFIG.DEBUG) {
            console.log(`[AppBuilder] ${message}`, data || '');
        }
    }
    
    // Public API
    return {
        // Core methods
        init,
        
        // State accessors
        getState: () => ({ ...state }),
        getConfig: () => ({ ...CONFIG }),
        getModules: () => ({ ...modules }),
        
        // App management
        getApps: () => [...state.apps],
        getCurrentApp: () => state.currentApp,
        
        // Utility methods
        createApp: async (appConfig) => {
            try {
                const newApp = await modules.engine.createApp(appConfig);
                state.apps.push(newApp);
                await modules.storage.set('user_apps', state.apps);
                
                window.dispatchEvent(new CustomEvent('app:created', {
                    detail: { app: newApp }
                }));
                
                return newApp;
            } catch (error) {
                throw error;
            }
        },
        
        deleteApp: async (appId) => {
            try {
                state.apps = state.apps.filter(app => app.id !== appId);
                await modules.storage.set('user_apps', state.apps);
                
                window.dispatchEvent(new CustomEvent('app:deleted', {
                    detail: { appId }
                }));
                
                return true;
            } catch (error) {
                throw error;
            }
        },
        
        // Export/Import
        exportData: async () => {
            return await modules.storage.exportData();
        },
        
        importData: async (data) => {
            return await modules.storage.importData(data);
        },
        
        // Build
        buildAPK: async (appId) => {
            return await modules.engine.buildAPK(appId);
        },
        
        buildPWA: async (appId) => {
            return await modules.engine.buildPWA(appId);
        },
        
        // Utility
        reset: async () => {
            if (confirm('آیا از ریست کردن همه تنظیمات اطمینان دارید؟')) {
                await modules.storage.clear();
                state.initialized = false;
                window.location.reload();
            }
        }
    };
})();

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        AppBuilder.init();
    });
} else {
    AppBuilder.init();
}

// Global access
window.AppBuilder = AppBuilder;

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppBuilder;
    }
