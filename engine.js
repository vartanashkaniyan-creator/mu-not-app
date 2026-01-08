/**
 * 🏗️ Engine.js – هسته پیشرفته اپ‌ها
 * نسخه 3.1.0
 * Mobile + Web | Modular | History & Memory
 */

class Engine {
    constructor() {
        this.history = [];
        this.memory = 0;
        this.notes = [];
        this.todo = [];
        this.core = window.AppCore || null;
    }

    /* ---------- Calculator ---------- */
    calc(expr) {
        try {
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

            if (!/^[0-9+\-*/().\sMathsqrtsincostantlogπe]+$/.test(safeExpr))
                throw new Error('عبارت نامعتبر');

            const result = Function('"use strict";return(' + safeExpr + ')')();
            const rounded = Math.round(result * 1e8) / 1e8;

            this.history.unshift({ type: 'calc', expr, result: rounded, ts: new Date().toISOString() });
            if (this.history.length > 100) this.history.pop();

            this.log('Calculator', { expr, result: rounded });
            return rounded;
        } catch (err) {
            return this.error('Calc Error', err.message);
        }
    }

    /* ---------- Memory ---------- */
    memStore(value) { this.memory = value; this.log('Memory Store', value); }
    memRecall() { this.log('Memory Recall', this.memory); return this.memory; }
    memClear() { this.memory = 0; this.log('Memory Clear', 0); }

    /* ---------- Notes ---------- */
    notesAdd(title, content, category = 'عمومی') {
        if (!title && !content) return this.error('Note Error', 'یادداشت خالی');
        const note = { id: Date.now(), title, content, category, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        this.notes.unshift(note);
        if (this.notes.length > 100) this.notes.pop();
        this.log('Notes Add', note);
        return note;
    }
    notesEdit(id, title, content, category) {
        const note = this.notes.find(n => n.id === id);
        if (!note) return this.error('Note Error', 'یادداشت یافت نشد');
        note.title = title; note.content = content; note.category = category; note.updatedAt = new Date().toISOString();
        this.log('Notes Edit', note);
        return note;
    }
    notesDelete(id) {
        this.notes = this.notes.filter(n => n.id !== id);
        this.log('Notes Delete', { id });
    }

    /* ---------- Todo ---------- */
    todoAdd(task) {
        if (!task) return this.error('Todo Error', 'کار خالی است');
        const item = { id: Date.now(), task, done: false };
        this.todo.unshift(item);
        this.log('Todo Add', item);
        return item;
    }
    todoToggle(id) {
        const item = this.todo.find(t => t.id === id);
        if (!item) return this.error('Todo Error', 'آیتم یافت نشد');
        item.done = !item.done;
        this.log('Todo Toggle', item);
        return item;
    }
    todoDelete(id) {
        this.todo = this.todo.filter(t => t.id !== id);
        this.log('Todo Delete', { id });
    }

    /* ---------- History ---------- */
    getHistory(limit = 50) { return this.history.slice(0, limit); }

    /* ---------- Logging & Error ---------- */
    log(module, data) {
        const entry = { ts: new Date().toISOString(), module, data };
        if (this.core) this.core.logs.push(entry);
        console.log(`🟢 [Engine] ${module}`, data);
    }
    error(module, msg) {
        const err = { id: `ERR_${Date.now()}`, module, msg, ts: new Date().toISOString() };
        if (this.core) this.core.errors.push(err);
        console.error(`🔴 [Engine] ${module}:`, msg);
        return err;
    }

    /* ---------- Export State ---------- */
    toJSON() {
        return { history: this.history, memory: this.memory, notes: this.notes, todo: this.todo };
    }
}

// نمونه آماده و ثبت در سطح جهانی
window.Engine = new Engine();
console.log('⚡ Engine.js پیشرفته بارگذاری شد');
