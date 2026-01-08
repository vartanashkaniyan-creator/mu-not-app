/**
 * AppBuilder Core Library - AP.Library.js
 * Version: 3.0.0
 * Main utility library for AppBuilder
 */

const AP = (function() {
    'use strict';
    
    // Version info
    const VERSION = '3.0.0';
    const BUILD_DATE = '2024';
    
    // Utility Functions
    const utils = {
        // DOM Manipulation
        $: (selector, parent = document) => parent.querySelector(selector),
        $$: (selector, parent = document) => Array.from(parent.querySelectorAll(selector)),
        
        // Element creation with attributes
        createElement: (tag, attributes = {}, children = []) => {
            const element = document.createElement(tag);
            
            // Set attributes
            Object.entries(attributes).forEach(([key, value]) => {
                if (key.startsWith('on') && typeof value === 'function') {
                    element.addEventListener(key.substring(2).toLowerCase(), value);
                } else if (key === 'className') {
                    element.className = value;
                } else if (key === 'html') {
                    element.innerHTML = value;
                } else if (key === 'text') {
                    element.textContent = value;
                } else if (value !== null && value !== undefined) {
                    element.setAttribute(key, value);
                }
            });
            
            // Append children
            children.forEach(child => {
                if (typeof child === 'string') {
                    element.appendChild(document.createTextNode(child));
                } else if (child instanceof Node) {
                    element.appendChild(child);
                }
            });
            
            return element;
        },
        
        // Async sleep
        sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
        
        // Debounce function
        debounce: (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        
        // Throttle function
        throttle: (func, limit) => {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },
        
        // Deep clone
        deepClone: (obj) => {
            if (obj === null || typeof obj !== 'object') return obj;
            if (obj instanceof Date) return new Date(obj.getTime());
            if (obj instanceof Array) return obj.reduce((arr, item, i) => {
                arr[i] = utils.deepClone(item);
                return arr;
            }, []);
            if (typeof obj === 'object') return Object.keys(obj).reduce((newObj, key) => {
                newObj[key] = utils.deepClone(obj[key]);
                return newObj;
            }, {});
        },
        
        // Generate unique ID
        generateId: (length = 8) => {
            return Math.random().toString(36).substring(2, 2 + length);
        },
        
        // Format bytes
        formatBytes: (bytes, decimals = 2) => {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const dm = decimals < 0 ? 0 : decimals;
            const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
        },
        
        // Format date
        formatDate: (date, format = 'fa-IR') => {
            const d = new Date(date);
            return d.toLocaleDateString(format, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        },
        
        // Validate email
        validateEmail: (email) => {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        },
        
        // Validate URL
        validateURL: (url) => {
            try {
                new URL(url);
                return true;
            } catch {
                return false;
            }
        },
        
        // Safe JSON parse
        safeParse: (json, fallback = {}) => {
            try {
                return JSON.parse(json);
            } catch {
                return fallback;
            }
        },
        
        // Safe stringify
        safeStringify: (obj, fallback = '{}') => {
            try {
                return JSON.stringify(obj);
            } catch {
                return fallback;
            }
        }
    };
    
    // Storage Manager
    const storage = {
        // Local Storage with fallback
        set: (key, value) => {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                console.error('Storage error:', error);
                return false;
            }
        },
        
        get: (key, fallback = null) => {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : fallback;
            } catch {
                return fallback;
            }
        },
        
        remove: (key) => {
            localStorage.removeItem(key);
        },
        
        clear: () => {
            localStorage.clear();
        },
        
        // IndexedDB wrapper
        db: {
            open: (name = 'appbuilder', version = 1) => {
                return new Promise((resolve, reject) => {
                    if (!window.indexedDB) {
                        reject(new Error('IndexedDB not supported'));
                        return;
                    }
                    
                    const request = indexedDB.open(name, version);
                    
                    request.onerror = () => reject(request.error);
                    request.onsuccess = () => resolve(request.result);
                    
                    request.onupgradeneeded = (event) => {
                        const db = event.target.result;
                        if (!db.objectStoreNames.contains('apps')) {
                            db.createObjectStore('apps', { keyPath: 'id' });
                        }
                        if (!db.objectStoreNames.contains('templates')) {
                            db.createObjectStore('templates', { keyPath: 'id' });
                        }
                    };
                });
            },
            
            save: async (storeName, data) => {
                const db = await storage.db.open();
                return new Promise((resolve, reject) => {
                    const transaction = db.transaction([storeName], 'readwrite');
                    const store = transaction.objectStore(storeName);
                    const request = store.put(data);
                    
                    request.onerror = () => reject(request.error);
                    request.onsuccess = () => resolve(request.result);
                });
            },
            
            get: async (storeName, id) => {
                const db = await storage.db.open();
                return new Promise((resolve, reject) => {
                    const transaction = db.transaction([storeName], 'readonly');
                    const store = transaction.objectStore(storeName);
                    const request = store.get(id);
                    
                    request.onerror = () => reject(request.error);
                    request.onsuccess = () => resolve(request.result);
                });
            },
            
            getAll: async (storeName) => {
                const db = await storage.db.open();
                return new Promise((resolve, reject) => {
                    const transaction = db.transaction([storeName], 'readonly');
                    const store = transaction.objectStore(storeName);
                    const request = store.getAll();
                    
                    request.onerror = () => reject(request.error);
                    request.onsuccess = () => resolve(request.result);
                });
            },
            
            delete: async (storeName, id) => {
                const db = await storage.db.open();
                return new Promise((resolve, reject) => {
                    const transaction = db.transaction([storeName], 'readwrite');
                    const store = transaction.objectStore(storeName);
                    const request = store.delete(id);
                    
                    request.onerror = () => reject(request.error);
                    request.onsuccess = () => resolve(request.result);
                });
            }
        }
    };
    
    // UI Components
    const ui = {
        // Modal system
        modal: {
            show: (options = {}) => {
                const {
                    title = 'Modal',
                    content = '',
                    buttons = [],
                    size = 'md', // sm, md, lg
                    onClose = () => {}
                } = options;
                
                // Remove existing modal
                ui.modal.hide();
                
                // Create modal
                const modal = utils.createElement('div', {
                    className: 'ap-modal',
                    style: 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; justify-content: center; align-items: center;'
                });
                
                const modalContent = utils.createElement('div', {
                    className: `ap-modal-content size-${size}`,
                    style: 'background: white; border-radius: 8px; max-width: 90%; max-height: 90%; overflow: auto;'
                });
                
                // Header
                const header = utils.createElement('div', {
                    className: 'ap-modal-header',
                    style: 'padding: 15px 20px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;'
                }, [
                    utils.createElement('h3', { style: 'margin: 0;' }, [title]),
                    utils.createElement('button', {
                        className: 'ap-modal-close',
                        html: '&times;',
                        onclick: () => ui.modal.hide(),
                        style: 'background: none; border: none; font-size: 24px; cursor: pointer; color: #666;'
                    })
                ]);
                
                // Body
                const body = utils.createElement('div', {
                    className: 'ap-modal-body',
                    style: 'padding: 20px;'
                });
                
                if (typeof content === 'string') {
                    body.innerHTML = content;
                } else {
                    body.appendChild(content);
                }
                
                // Footer
                const footer = utils.createElement('div', {
                    className: 'ap-modal-footer',
                    style: 'padding: 15px 20px; border-top: 1px solid #eee; display: flex; justify-content: flex-end; gap: 10px;'
                });
                
                buttons.forEach(btn => {
                    const button = utils.createElement('button', {
                        className: `btn ${btn.primary ? 'btn-primary' : 'btn-outline'}`,
                        text: btn.text,
                        onclick: () => {
                            if (btn.handler) btn.handler();
                            if (btn.close !== false) ui.modal.hide();
                        },
                        style: 'padding: 8px 16px; border-radius: 4px; border: 1px solid #ddd; background: white; cursor: pointer;'
                    });
                    footer.appendChild(button);
                });
                
                // Assemble
                modalContent.appendChild(header);
                modalContent.appendChild(body);
                modalContent.appendChild(footer);
                modal.appendChild(modalContent);
                document.body.appendChild(modal);
                
                // Store reference
                ui.modal.current = modal;
                ui.modal.onClose = onClose;
                
                return modal;
            },
            
            hide: () => {
                if (ui.modal.current) {
                    ui.modal.current.remove();
                    ui.modal.current = null;
                    if (ui.modal.onClose) ui.modal.onClose();
                }
            },
            
            current: null,
            onClose: null
        },
        
        // Toast notifications
        toast: (message, type = 'info', duration = 3000) => {
            const toast = utils.createElement('div', {
                className: `ap-toast toast-${type}`,
                style: `
                    position: fixed;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
                    color: white;
                    padding: 12px 24px;
                    border-radius: 25px;
                    z-index: 1000;
                    animation: ap-toast-fade 0.3s ease;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                `
            }, [message]);
            
            // Add animation if not exists
            if (!document.querySelector('#ap-toast-animation')) {
                const style = document.createElement('style');
                style.id = 'ap-toast-animation';
                style.textContent = `
                    @keyframes ap-toast-fade {
                        from { opacity: 0; transform: translateX(-50%) translateY(20px); }
                        to { opacity: 1; transform: translateX(-50%) translateY(0); }
                    }
                `;
                document.head.appendChild(style);
            }
            
            document.body.appendChild(toast);
            
            // Auto remove
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.style.opacity = '0';
                    toast.style.transform = 'translateX(-50%) translateY(-20px)';
                    setTimeout(() => toast.remove(), 300);
                }
            }, duration);
        },
        
        // Loading spinner
        showLoader: (text = 'در حال بارگذاری...') => {
            ui.hideLoader();
            
            const loader = utils.createElement('div', {
                className: 'ap-loader',
                style: `
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.7);
                    z-index: 9999;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    color: white;
                `
            });
            
            const spinner = utils.createElement('div', {
                className: 'ap-spinner',
                style: `
                    width: 50px;
                    height: 50px;
                    border: 3px solid rgba(255,255,255,0.3);
                    border-radius: 50%;
                    border-top-color: white;
                    animation: ap-spin 1s linear infinite;
                    margin-bottom: 20px;
                `
            });
            
            const textEl = utils.createElement('div', {
                text: text,
                style: 'font-size: 16px;'
            });
            
            loader.appendChild(spinner);
            loader.appendChild(textEl);
            document.body.appendChild(loader);
            
            // Add animation if not exists
            if (!document.querySelector('#ap-spin-animation')) {
                const style = document.createElement('style');
                style.id = 'ap-spin-animation';
                style.textContent = `
                    @keyframes ap-spin {
                        to { transform: rotate(360deg); }
                    }
                `;
                document.head.appendChild(style);
            }
            
            ui.loader = loader;
            return loader;
        },
        
        hideLoader: () => {
            if (ui.loader && ui.loader.parentNode) {
                ui.loader.remove();
                ui.loader = null;
            }
        },
        
        loader: null
    };
    
    // Export Manager
    const exporter = {
        // Export to JSON file
        toJSON: (data, filename = 'export.json') => {
            const json = JSON.stringify(data, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            exporter.downloadFile(blob, filename);
        },
        
        // Export to CSV
        toCSV: (data, filename = 'export.csv') => {
            if (!Array.isArray(data) || data.length === 0) {
                console.error('Invalid data for CSV export');
                return;
            }
            
            const headers = Object.keys(data[0]);
            const csv = [
                headers.join(','),
                ...data.map(row => headers.map(header => {
                    const cell = row[header];
                    return typeof cell === 'string' ? `"${cell.replace(/"/g, '""')}"` : cell;
                }).join(','))
            ].join('\n');
            
            const blob = new Blob([csv], { type: 'text/csv' });
            exporter.downloadFile(blob, filename);
        },
        
        // Download file
        downloadFile: (blob, filename) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        },
        
        // Generate QR Code
        generateQR: async (text, size = 200) => {
            // This would require a QR library
            console.log('QR Generation would go here');
            return null;
        }
    };
    
    // Validation System
    const validator = {
        // Field validators
        required: (value) => {
            if (value === null || value === undefined) return false;
            if (typeof value === 'string') return value.trim().length > 0;
            if (Array.isArray(value)) return value.length > 0;
            return true;
        },
        
        minLength: (value, min) => {
            if (!value) return false;
            return value.length >= min;
        },
        
        maxLength: (value, max) => {
            if (!value) return true;
            return value.length <= max;
        },
        
        between: (value, min, max) => {
            if (typeof value === 'number') return value >= min && value <= max;
            if (typeof value === 'string') return value.length >= min && value.length <= max;
            return false;
        },
        
        pattern: (value, pattern) => {
            if (!value) return false;
            const regex = new RegExp(pattern);
            return regex.test(value);
        },
        
        // Form validation
        validateForm: (formData, rules) => {
            const errors = {};
            
            Object.entries(rules).forEach(([field, fieldRules]) => {
                const value = formData[field];
                
                for (const [rule, param] of Object.entries(fieldRules)) {
                    let isValid = true;
                    
                    switch(rule) {
                        case 'required':
                            isValid = validator.required(value);
                            break;
                        case 'minLength':
                            isValid = validator.minLength(value, param);
                            break;
                        case 'maxLength':
                            isValid = validator.maxLength(value, param);
                            break;
                        case 'pattern':
                            isValid = validator.pattern(value, param);
                            break;
                        case 'email':
                            isValid = utils.validateEmail(value);
                            break;
                        case 'url':
                            isValid = utils.validateURL(value);
                            break;
                    }
                    
                    if (!isValid) {
                        errors[field] = errors[field] || [];
                        errors[field].push(rule);
                        break;
                    }
                }
            });
            
            return {
                isValid: Object.keys(errors).length === 0,
                errors
            };
        }
    };
    
    // Public API
    return {
        // Core
        version: VERSION,
        buildDate: BUILD_DATE,
        
        // Modules
        utils,
        storage,
        ui,
        exporter,
        validator,
        
        // Initialization
        init: () => {
            console.log(`AP Library v${VERSION} initialized`);
            return true;
        },
        
        // Compatibility check
        checkCompatibility: () => {
            const features = {
                indexedDB: !!window.indexedDB,
                localStorage: !!window.localStorage,
                serviceWorker: 'serviceWorker' in navigator,
                fetch: !!window.fetch,
                promise: !!window.Promise,
                es6: (() => {
                    try {
                        new Function('class Foo {}');
                        return true;
                    } catch {
                        return false;
                    }
                })()
            };
            
            const missing = Object.entries(features)
                .filter(([_, supported]) => !supported)
                .map(([name]) => name);
            
            return {
                supported: missing.length === 0,
                features,
                missing
            };
        },
        
        // Debug mode
        debug: {
            enabled: false,
            log: (...args) => {
                if (AP.debug.enabled) {
                    console.log('[AP Debug]', ...args);
                }
            },
            error: (...args) => {
                if (AP.debug.enabled) {
                    console.error('[AP Debug]', ...args);
                }
            }
        }
    };
})();

// Auto-initialize
if (typeof window !== 'undefined') {
    window.AP = AP;
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => AP.init());
    } else {
        AP.init();
    }
}

// Export for Node.js/ESM
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AP;
        }
