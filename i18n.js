class I18n {
    constructor(defaultLang='fa'){
        this.languages={fa:{},en:{}};
        this.currentLang=defaultLang;
    }
    addTranslations(lang,translations={}){
        if(!this.languages[lang]) this.languages[lang]={};
        Object.assign(this.languages[lang],translations);
        this.updateUI();
    }
    setLanguage(lang){
        if(!this.languages[lang]) return console.error('زبان پشتیبانی نمی‌شود',lang);
        this.currentLang=lang; this.updateUI();
    }
    t(key){ return (this.languages[this.currentLang] && this.languages[this.currentLang][key]) || key; }
    updateUI(root=document.body){
        root.querySelectorAll('[data-i18n]').forEach(node=>{
            const key=node.getAttribute('data-i18n');
            if(node.tagName==='INPUT'||node.tagName==='TEXTAREA') node.placeholder=this.t(key);
            else node.textContent=this.t(key);
        });
    }
}
window.I18n=new I18n('fa');
window.I18n.addTranslations('fa',{
    welcome:'خوش آمدید',save:'💾 ذخیره',delete:'🗑️ حذف',search:'جستجو...',title:'عنوان',
    content:'محتوا',your_notes:'یادداشت‌های شما',personal:'شخصی',work:'کاری',idea:'ایده',
    shopping:'خرید',app_version:'نسخه 1.0.0',categories:'دسته‌بندی‌ها',stats:'آمار'
});
window.I18n.addTranslations('en',{
    welcome:'Welcome',save:'💾 Save',delete:'🗑️ Delete',search:'Search...',title:'Title',
    content:'Content',your_notes:'Your Notes',personal:'Personal',work:'Work',idea:'Idea',
    shopping:'Shopping',app_version:'Version 1.0.0',categories:'Categories',stats:'Stats'
});
