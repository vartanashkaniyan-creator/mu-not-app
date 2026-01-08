
const Storage={
    prefix:'AppBuilder_',
    getAll(type='notes'){ return JSON.parse(localStorage.getItem(this.prefix+type)||'[]'); },
    save(item,type='notes'){ item.id=item.id||Date.now(); item.updatedAt=new Date().toISOString(); const list=this.getAll(type); list.unshift(item); localStorage.setItem(this.prefix+type,JSON.stringify(list)); return item; },
    update(id,data,type='notes'){ const list=this.getAll(type); const idx=list.findIndex(i=>i.id===id); if(idx===-1) return null; list[idx]={...list[idx],...data,updatedAt:new Date().toISOString()}; localStorage.setItem(this.prefix+type,JSON.stringify(list)); return list[idx]; },
    remove(id,type='notes'){ let list=this.getAll(type); list=list.filter(i=>i.id!==id); localStorage.setItem(this.prefix+type,JSON.stringify(list)); return list; },
    get(id,type='notes'){ return this.getAll(type).find(i=>i.id===id)||null; },
    clear(type='notes'){ localStorage.removeItem(this.prefix+type); },
    clearAll(){ Object.keys(localStorage).forEach(k=>{ if(k.startsWith(this.prefix)) localStorage.removeItem(k); }); }
};
window.Storage=Storage;
