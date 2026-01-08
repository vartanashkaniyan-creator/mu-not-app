/**
 * 🛠 Engine.js – هسته عملیات اپ
 * نسخه 1.0 هماهنگ با UI و Router
 */

const Engine = (() => {
    const todos = [];

    function calc(expression) {
        try {
            // امن‌سازی: اجازه فقط اعداد و عملگرها
            if (/[^0-9+\-*/().٪×÷\s]/.test(expression)) return 'خطا';
            // جایگزینی کاراکترهای فارسی
            const sanitized = expression.replace(/×/g, '*').replace(/÷/g, '/').replace(/٪/g, '%');
            return eval(sanitized);
        } catch (e) {
            return 'خطا';
        }
    }

    function todoAdd(task) {
        if (!task) return;
        const todo = { id: Date.now(), task };
        todos.push(todo);
        return todo;
    }

    function todoGetAll() {
        return [...todos];
    }

    return {
        calc,
        todoAdd,
        todoGetAll
    };
})();

window.Engine = Engine;
console.log('✅ Engine.js آماده و هماهنگ شد');
