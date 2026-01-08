const UI={
    container:null,
    init(containerId='app'){ this.container=document.getElementById(containerId); if(!this.container) return console.error('UI container not found'); this.bindGlobalEvents(); this.load('home'); },
    bindGlobalEvents(){ document.body.addEventListener('click',e=>{ const t=e.target.closest('[data-route]'); if(t){ e.preventDefault(); const r=t.getAttribute('data-route'); if(r) window.Router.navigate(r); } }); },
    load(screen,data={}){ if(!this.container) return; this.container.innerHTML=''; switch(screen){
        case 'home': this.container.innerHTML=Templates.home(data.apps||[]); break;
        case 'notes': this.container.innerHTML=Templates.notes(); this.bindNotesEvents(); this.renderNotes(); break;
        case 'calculator': this.container.innerHTML=Templates.calculator(); this.bindCalculatorEvents(); break;
        case 'todo': this.container.innerHTML=Templates.todo(); this.bindTodoEvents(); this.renderTodo(); break;
        case 'preview': this.container.innerHTML=Templates.preview(data.html||''); break;
        default: this.container.innerHTML='<p class="center">صفحه یافت نشد</p>'; }
    },
    bindNotesEvents(){ const saveBtn=document.getElementById('save-note'); const clearBtn=document.getElementById('clear-note'); const titleInput=document.getElementById('note-title'); const contentInput=document.getElementById('note-content'); const categorySelect=document.getElementById('note-category'); if(!saveBtn||!clearBtn) return;
        saveBtn.onclick=()=>{ const note={id:Date.now(),title:titleInput.value.trim(),content:contentInput.value.trim(),category:categorySelect.value,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()}; if(!note.title&&!note.content) return alert('یادداشت خالی است'); Storage.save(note); this.renderNotes(); titleInput.value=''; contentInput.value=''; };
        clearBtn.onclick=()=>{ titleInput.value=''; contentInput.value=''; };
    },
    renderNotes(){ const c=document.getElementById('notes-list'); if(!c) return; const notes=Storage.getAll(); c.innerHTML=''; if(!notes.length){ c.innerHTML='<p class="center">📝 هنوز یادداشتی ندارید</p>'; return; } notes.forEach(n=>{ const div=document.createElement('div'); div.className='note-card'; div.innerHTML=`<h4>${n.title}</h4><p>${n.content.substring(0,100)}${n.content.length>100?'...':''}</p><small>${new Date(n.updatedAt).toLocaleDateString('fa-IR')}</small><div class="note-actions"><button class="delete-btn">🗑️ حذف</button></div>`; div.querySelector('.delete-btn').onclick=()=>{ if(!confirm('آیا مطمئن هستید؟')) return; Storage.remove(n.id); this.renderNotes(); }; c.appendChild(div); });
    },
    bindCalculatorEvents(){ const input=document.getElementById('calc-input'); const resultDiv=document.getElementById('calc-result'); const runBtn=document.getElementById('calc-run'); if(!runBtn) return; runBtn.onclick=()=>{ const val=input.value.trim(); if(!val) return; resultDiv.textContent=Engine.calc(val); }; },
    bindTodoEvents(){ const input=document.getElementById('todo-input'); const list=document.getElementById('todo-list'); const addBtn=document.getElementById('todo-add'); if(!addBtn) return; addBtn.onclick=()=>{ const val=input.value.trim(); if(!val) return; Engine.todoAdd(val); this.renderTodo(); input.value=''; }; },
    renderTodo(){ const list=document.getElementById('todo-list'); if(!list) return; list.innerHTML=''; const todos=Engine.todoGetAll(); todos.forEach(t=>{ const li=document.createElement('div'); li.className='list-item'; li.textContent=t.task; list.appendChild(li); }); }
};
window.UI=UI;
