class CalculatorApp extends AppLibrary.MobileApp {
    constructor(config = {}) {
        super({ name: 'ماشین حساب مهندسی', ...config });
        this.history = [];
        this.memory = 0;
    }

    calculate(expr) {
        try {
            let safeExpr = expr
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/π/g, Math.PI)
                .replace(/e/g, Math.E)
                .replace(/√/g, 'Math.sqrt');

            const result = Function('"use strict";return(' + safeExpr + ')')();
            this.history.unshift({ expr, result, timestamp: new Date().toISOString() });
            if (this.history.length > 50) this.history.pop();
            this.log('calculate', { expr, result });
            return result;
        } catch (err) {
            return this.error('خطای محاسبه', err.message);
        }
    }
}

// ثبت در کتابخانه
window.CalculatorApp = CalculatorApp;
