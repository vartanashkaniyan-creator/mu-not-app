
const Engine = {
    calc(expr){
        try { return Function('"use strict";return ('+expr+')')(); }
        catch(e){ return 'خطا'; }
    },
    todoList:[],
    todoAdd(task){ this.todoList.push({task,done:false}); },
    todoGetAll(){ return this.todoList; }
};
window.Engine=Engine;
