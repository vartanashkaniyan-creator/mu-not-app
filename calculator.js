/**
 * 🧮 calculator.js – ماشین حساب ساده
 */

const Calculator = (() => {

    function calc(expression) {
        try {
            // تبدیل × و ÷ به * و /
            const sanitized = expression.replace(/×/g, '*').replace(/÷/g, '/');
            const result = eval(sanitized);
            return result ?? 'خطا';
        } catch (err) {
            return 'خطا';
        }
    }

    return {
        calc
    };

})();

window.Calculator = Calculator;
console.log('✅ Calculator.js آماده شد');
