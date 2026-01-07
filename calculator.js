/**
 * 🧮 CalculatorApp – ماشین حساب مهندسی حرفه‌ای
 * نسخه 3.0.0
 * موبایل + وب
 */

class CalculatorApp extends AppLibrary.MobileApp {
    constructor(config = {}) {
        super({ name: 'ماشین حساب مهندسی', ...config });
        this.history = [];
        this.memory = 0;
    }

    // محاسبه عبارت ریاضی
    calculate(expr) {
        try {
            // جایگزینی نمادهای رایج
            let safeExpr = expr
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

            // بررسی امنیت اولیه
            if (!/^[0-9+\-*/().\sMathsqrtsincostantlogπe]+$/.test(safeExpr)) {
                throw new Error('عبارت نامعتبر');
            }

            const result = Function('"use strict";return(' + safeExpr + ')')();
            const rounded = Math.round(result * 100000000) / 100000000;

            // ذخیره در تاریخچه
            this.history.unshift({
                expression: expr,
                result: rounded,
                timestamp: new Date().toISOString()
            });
            if (this.history.length > 50) this.history.pop();

            this.log('calculate', { expression: expr, result: rounded });
            return rounded;
        } catch (err) {
            return this.error('خطای محاسبه', err.message);
        }
    }

    // حافظه
    memoryStore(value) {
        this.memory = value;
        this.log('memoryStore', value);
    }

    memoryRecall() {
        this.log('memoryRecall', this.memory);
        return this.memory;
    }

    memoryClear() {
        this.memory = 0;
        this.log('memoryClear', 0);
    }

    getHistory(limit = 50) {
        return this.history.slice(0, limit);
    }
}

// ثبت در کتابخانه عمومی
window.CalculatorApp = CalculatorApp;

console.log('✅ CalculatorApp بارگذاری شد');
