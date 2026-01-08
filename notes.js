const Notes=(()=>{
    const notes=Storage.getAll();
    function render(){ const c=document.getElementById('app'); if(!c) return; c.innerHTML=''; notes.forEach(n=>{ const div=document.createElement('div'); div.innerHTML=`<h4>${n.title}</h4><p>${n.content}</p>`; c.appendChild(div); }); }
    return {render};
})();
window.Notes=Notes;
