// calculator.js - ماشین حساب پیشرفته
export class Calculator {
    constructor() {
        this.history = [];
        this.memory = 0;
        this.lastResult = 0;
        this.currentInput = '0';
        this.operation = null;
        this.waitingForOperand = false;
        this.maxHistory = 50;
        
        this.init();
    }

    init() {
        this.loadMemory();
        this.loadHistory();
        
        window.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    input(value) {
        if (this.isNumber(value)) {
            this.handleNumber(value);
        } else if (this.isOperator(value)) {
            this.handleOperator(value);
        } else if (value === '.') {
            this.handleDecimal();
        } else if (value === '=' || value === 'Enter') {
            this.handleEquals();
        } else if (value === 'C' || value === 'Escape') {
            this.clear();
        } else if (value === 'CE') {
            this.clearEntry();
        } else if (value === '⌫' || value === 'Backspace') {
            this.backspace();
        } else if (value === 'M+') {
            this.memoryAdd();
        } else if (value === 'M-') {
            this.memorySubtract();
        } else if (value === 'MR') {
            this.memoryRecall();
        } else if (value === 'MC') {
            this.memoryClear();
        }
        
        this.saveHistory();
        return this.currentInput;
    }

    handleNumber(num) {
        if (this.waitingForOperand) {
            this.currentInput = num;
            this.waitingForOperand = false;
        } else {
            this.currentInput = this.currentInput === '0' ? num : this.currentInput + num;
        }
    }

    handleOperator(op) {
        const inputValue = parseFloat(this.currentInput);
        
        if (this.operation !== null && !this.waitingForOperand) {
            this.lastResult = this.calculate(this.lastResult, inputValue, this.operation);
            this.currentInput = String(this.lastResult);
            this.addHistory(`${this.lastResult} ${op}`);
        } else {
            this.lastResult = inputValue;
        }
        
        this.waitingForOperand = true;
        this.operation = op;
    }

    handleEquals() {
        if (this.operation === null || this.waitingForOperand) return;
        
        const inputValue = parseFloat(this.currentInput);
        this.lastResult = this.calculate(this.lastResult, inputValue, this.operation);
        
        this.addHistory(`${this.currentInput} = ${this.lastResult}`);
        this.currentInput = String(this.lastResult);
        this.operation = null;
        this.waitingForOperand = true;
    }

    calculate(a, b, op) {
        let result;
        
        switch (op) {
            case '+': result = a + b; break;
            case '-': result = a - b; break;
            case '×':
            case '*': result = a * b; break;
            case '÷':
            case '/': 
                if (b === 0) throw new Error('Division by zero');
                result = a / b; 
                break;
            case '%': result = a % b; break;
            case '^': result = Math.pow(a, b); break;
            default: result = b;
        }
        
        if (!isFinite(result)) throw new Error('Invalid calculation');
        
        const precision = 1e12;
        return Math.round(result * precision) / precision;
    }

    handleDecimal() {
        if (this.waitingForOperand) {
            this.currentInput = '0.';
            this.waitingForOperand = false;
        } else if (!this.currentInput.includes('.')) {
            this.currentInput += '.';
        }
    }

    clear() {
        this.currentInput = '0';
        this.lastResult = 0;
        this.operation = null;
        this.waitingForOperand = false;
    }

    clearEntry() {
        this.currentInput = '0';
    }

    backspace() {
        if (this.currentInput.length > 1) {
            this.currentInput = this.currentInput.slice(0, -1);
        } else {
            this.currentInput = '0';
        }
    }

    memoryAdd() {
        this.memory += parseFloat(this.currentInput);
        this.saveMemory();
    }

    memorySubtract() {
        this.memory -= parseFloat(this.currentInput);
        this.saveMemory();
    }

    memoryRecall() {
        this.currentInput = String(this.memory);
    }

    memoryClear() {
        this.memory = 0;
        this.saveMemory();
    }

    addHistory(entry) {
        this.history.unshift({
            entry,
            timestamp: Date.now()
        });
        
        if (this.history.length > this.maxHistory) {
            this.history.pop();
        }
    }

    getHistory() {
        return [...this.history];
    }

    clearHistory() {
        this.history = [];
        storage.remove('calc_history');
    }

    saveHistory() {
        storage.set('calc_history', this.history);
    }

    loadHistory() {
        this.history = storage.get('calc_history', []);
    }

    saveMemory() {
        storage.set('calc_memory', this.memory);
    }

    loadMemory() {
        this.memory = storage.get('calc_memory', 0);
    }

    // محاسبات علمی
    scientific(op) {
        const value = parseFloat(this.currentInput);
        let result;
        
        switch (op) {
            case 'sin': result = Math.sin(value * Math.PI / 180); break;
            case 'cos': result = Math.cos(value * Math.PI / 180); break;
            case 'tan': result = Math.tan(value * Math.PI / 180); break;
            case 'sinh': result = Math.sinh(value); break;
            case 'cosh': result = Math.cosh(value); break;
            case 'tanh': result = Math.tanh(value); break;
            case 'log': result = Math.log10(value); break;
            case 'ln': result = Math.log(value); break;
            case '√': result = Math.sqrt(value); break;
            case 'x²': result = value * value; break;
            case 'x³': result = value * value * value; break;
            case '10^x': result = Math.pow(10, value); break;
            case 'e^x': result = Math.exp(value); break;
            case '1/x': result = 1 / value; break;
            case 'abs': result = Math.abs(value); break;
            case 'floor': result = Math.floor(value); break;
            case 'ceil': result = Math.ceil(value); break;
            case 'round': result = Math.round(value); break;
            case 'rand': result = Math.random(); break;
            case 'π': result = Math.PI; break;
            case 'e': result = Math.E; break;
            default: result = value;
        }
        
        if (!isFinite(result)) throw new Error('Invalid scientific operation');
        
        this.addHistory(`${op}(${value}) = ${result}`);
        this.currentInput = String(result);
        this.waitingForOperand = true;
        
        return this.currentInput;
    }

    // محاسبات مالی
    financial(op, ...args) {
        const value = parseFloat(this.currentInput);
        let result;
        
        switch (op) {
            case 'tax':
                const rate = args[0] || 9;
                result = value * (1 + rate / 100);
                this.addHistory(`Add ${rate}% tax to ${value} = ${result}`);
                break;
            case 'discount':
                const discount = args[0] || 10;
                result = value * (1 - discount / 100);
                this.addHistory(`${discount}% discount on ${value} = ${result}`);
                break;
            case 'tip':
                const tip = args[0] || 15;
                result = value * (tip / 100);
                this.addHistory(`${tip}% tip on ${value} = ${result}`);
                break;
            case 'interest':
                const rate = args[0] || 5;
                const years = args[1] || 1;
                result = value * Math.pow(1 + rate / 100, years);
                this.addHistory(`${value} at ${rate}% for ${years} years = ${result}`);
                break;
        }
        
        this.currentInput = String(result);
        return this.currentInput;
    }

    // تبدیل واحد
    convert(value, fromUnit, toUnit) {
        const conversions = {
            length: {
                mm: 0.001,
                cm: 0.01,
                m: 1,
                km: 1000,
                inch: 0.0254,
                foot: 0.3048,
                yard: 0.9144,
                mile: 1609.34
            },
            weight: {
                mg: 0.000001,
                g: 0.001,
                kg: 1,
                ton: 1000,
                ounce: 0.0283495,
                pound: 0.453592
            },
            temperature: {
                c: {
                    toF: (c) => c * 9/5 + 32,
                    toK: (c) => c + 273.15
                },
                f: {
                    toC: (f) => (f - 32) * 5/9,
                    toK: (f) => (f - 32) * 5/9 + 273.15
                },
                k: {
                    toC: (k) => k - 273.15,
                    toF: (k) => (k - 273.15) * 9/5 + 32
                }
            }
        };
        
        let result;
        
        for (const category in conversions) {
            const units = conversions[category];
            
            if (category === 'temperature') {
                if (units[fromUnit] && units[fromUnit]['to' + toUnit.toUpperCase()]) {
                    result = units[fromUnit]['to' + toUnit.toUpperCase()](value);
                    break;
                }
            } else if (units[fromUnit] && units[toUnit]) {
                result = value * units[fromUnit] / units[toUnit];
                break;
            }
        }
        
        if (result === undefined) {
            throw new Error('Conversion not supported');
        }
        
        this.addHistory(`${value} ${fromUnit} = ${result} ${toUnit}`);
        return result;
    }

    handleKeyboard(e) {
        const key = e.key;
        
        if (this.isNumber(key) || 
            ['+', '-', '*', '/', '%', '.', 'Enter', '=', 'Escape', 'Backspace'].includes(key)) {
            e.preventDefault();
            this.input(key === '*' ? '×' : key === '/' ? '÷' : key);
        }
    }

    isNumber(value) {
        return /^[0-9]$/.test(value);
    }

    isOperator(value) {
        return ['+', '-', '×', '÷', '%', '^'].includes(value);
    }

    getCurrentDisplay() {
        return this.currentInput;
    }

    getMemoryDisplay() {
        return this.memory !== 0 ? 'M' : '';
    }

    exportHistory() {
        const data = {
            history: this.history,
            memory: this.memory,
            timestamp: Date.now()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: 'application/json'
        });
        
        return URL.createObjectURL(blob);
    }

    importHistory(data) {
        try {
            const parsed = JSON.parse(data);
            this.history = parsed.history || [];
            this.memory = parsed.memory || 0;
            this.saveHistory();
            this.saveMemory();
            return true;
        } catch (error) {
            return false;
        }
    }
}

export const calculator = new Calculator();
