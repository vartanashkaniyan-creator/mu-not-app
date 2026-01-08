(function(){
    'use strict';
    document.addEventListener('DOMContentLoaded',()=>{
        if(!Engine||!UI||!Router){ console.error('ماژول‌ها آماده نیستند'); return; }
        UI.init();
        Router.register('/home',()=>UI.load('home',{apps:[
            {id:'notes',name:'یادداشت',icon:'📝'},
            {id:'calculator',name:'ماشین حساب',icon:'🧮'},
            {id:'todo',name:'کارها',icon:'✅'}
        ]}));
        Router.register('/notes',()=>UI.load('notes'));
        Router.register('/calculator',()=>UI.load('calculator'));
        Router.register('/todo',()=>UI.load('todo'));
        Router.setDefault('/home');
        Router.init();
    });
})();
