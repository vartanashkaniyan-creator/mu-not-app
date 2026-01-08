document.addEventListener('DOMContentLoaded',()=>{
    if(!window.Engine||!window.Router||!window.UI) return console.error('ماژول‌ها آماده نیستند');
    UI.init();
    Router.register('/home',()=>UI.load('home',{apps:[{id:'notes',name:'یادداشت‌ها',icon:'📝'},{id:'calculator',name:'ماشین حساب',icon:'🧮'},{id:'todo',name:'لیست کارها',icon:'✅'}]}));
    Router.register('/notes',()=>UI.load('notes'));
    Router.register('/calculator',()=>UI.load('calculator'));
    Router.register('/todo',()=>UI.load('todo'));
    Router.register('/preview',()=>UI.load('preview'));
    Router.setDefault('/home');
    Router.init();
});
