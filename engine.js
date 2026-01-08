/**
 * 🏎️ Engine.js – موتور مرکزی App Builder
 * نسخه 3.1.0 – پیشرفته و ماژولار
 */

class Engine {
    constructor() {
        this.screen = 'home';
        this.output = [];
        this.modules = {}; // ماژول‌های جداگانه (note, list, calculator, todo)
        console.log('⚡ Engine initialized');
    }

    // ثبت ماژول
    registerModule(name, module) {
        if (this.modules[name]) {
            console.warn(`Module "${name}" قبلاً ثبت شده`);
            return;
        }
        this.modules[name] = module;
        console.log(`✅ Module "${name}" registered`);
    }

    // اجرای دستور عمومی
    run(input = '') {
        input = input.trim();

        if (!input) return this.clearOutput();

        // شناسایی ماژول‌های اختصاصی
        if (/^note/i.test(input) || /یادداشت/.test(input)) {
            this.screen = 'note';
        } else if (/^list/i.test(input) || /لیست/.test(input)) {
            this.screen = 'list';
        } else if (/^calc/i.test(input) || /محاسبه/.test(input)) {
            this.screen = 'calculator';
        } else {
            this.screen = 'home';
        }

        // دستور print
        if (/^print /i.test(input)) {
            const text = input.replace(/^print /i, '');
            this.output.push(text);
        }

        return { screen: this.screen, output: this.output };
    }

    // محاسبات ریاضی امن
    calculate(expr) {
        try {
            if (!expr) throw new Error('عبارت خالی است');

            // جایگزینی نمادها
            const safeExpr = expr
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/π/g, Math.PI)
                .replace(/e/g, Math.E)
                .replace(/√/g, 'Math.sqrt')
                .replace(/sin/g, 'Math.sin')
                .replace(/cos/g, 'Math.cos')
                .replace(/tan/g, 'Math.tan')
                .replace(/log/g, 'Math.log10')
                .replace(/ln/g, 'Math.log');

            // امنیت اولیه
            if (!/^[0-9+\-*/().\sMathsqrtsincostantlogπe]+$/.test(safeExpr)) {
                throw new Error('عبارت نامعتبر');
            }

            const result = Function('"use strict";return(' + safeExpr + ')')();
            const rounded = Math.round(result * 1e8) / 1e8;

            // ذخیره در خروجی
            this.output.unshift(`= ${rounded}`);
            return rounded;
        } catch (err) {
            const msg = `⚠️ خطا: ${err.message}`;
            this.output.unshift(msg);
            console.error(msg);
            return null;
        }
    }

    // پاکسازی خروجی
    clearOutput() {
        this.output = [];
        return this.output;
    }

    // دریافت وضعیت
    getStatus() {
        return {
            screen: this.screen,
            outputCount: this.output.length,
            modules: Object.keys(this.modules)
        };
    }
}

// نمونه جهانی
window.Engine = new Engine();
console.log('✅ Engine.js 3.1.0 Loaded');
