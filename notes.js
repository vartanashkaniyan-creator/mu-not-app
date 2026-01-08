// notes.js - ادامه
        if (saved.notes) {
            saved.notes.forEach(note => {
                this.notes.set(note.id, note);
                this.indexNote(note);
            });
        }
        
        if (saved.categories) {
            saved.categories.forEach(cat => this.categories.add(cat));
        }
        
        if (saved.tags) {
            Object.entries(saved.tags).forEach(([tag, count]) => {
                this.tags.set(tag, count);
            });
        }
    }

    async saveNotes() {
        const data = {
            notes: Array.from(this.notes.values()),
            categories: Array.from(this.categories),
            tags: Object.fromEntries(this.tags),
            timestamp: Date.now()
        };
        
        await storage.saveToDB('notes', data);
    }

    setupAutoSave() {
        let saveTimeout;
        const save = () => {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => this.saveNotes(), 2000);
        };
        
        window.addEventListener('beforeunload', () => this.saveNotes());
        
        // ذخیره خودکار هر 30 ثانیه
        setInterval(save, 30000);
        
        return save;
    }

    createNote(title = '', content = '', category = 'عمومی', tags = []) {
        const id = 'note_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        const now = Date.now();
        
        const note = {
            id,
            title: title.trim() || 'یادداشت جدید',
            content: content.trim(),
            category,
            tags: Array.isArray(tags) ? tags : [tags],
            created: now,
            modified: now,
            pinned: false,
            favorite: false,
            color: '#ffffff',
            reminder: null,
            attachments: [],
            wordCount: this.countWords(content)
        };
        
        this.notes.set(id, note);
        this.updateCategories(category);
        this.updateTags(tags);
        this.indexNote(note);
        this.saveNotes();
        
        this.currentNote = id;
        return note;
    }

    updateNote(id, updates) {
        const note = this.notes.get(id);
        if (!note) return null;
        
        if (updates.content !== undefined) {
            updates.wordCount = this.countWords(updates.content);
        }
        
        if (updates.category && updates.category !== note.category) {
            this.updateCategories(updates.category);
        }
        
        if (updates.tags) {
            this.updateTags(updates.tags);
        }
        
        const updatedNote = {
            ...note,
            ...updates,
            modified: Date.now()
        };
        
        this.notes.set(id, updatedNote);
        this.indexNote(updatedNote);
        this.saveNotes();
        
        return updatedNote;
    }

    deleteNote(id) {
        const note = this.notes.get(id);
        if (!note) return false;
        
        // حذف از ایندکس جستجو
        this.searchIndex.delete(id);
        
        // آپدیت تگ‌ها
        note.tags.forEach(tag => {
            const count = this.tags.get(tag) || 0;
            if (count > 1) {
                this.tags.set(tag, count - 1);
            } else {
                this.tags.delete(tag);
            }
        });
        
        this.notes.delete(id);
        this.saveNotes();
        return true;
    }

    getNote(id) {
        return this.notes.get(id);
    }

    getAllNotes(sortBy = 'modified', order = 'desc') {
        const notes = Array.from(this.notes.values());
        
        notes.sort((a, b) => {
            let valueA, valueB;
            
            switch (sortBy) {
                case 'title':
                    valueA = a.title.toLowerCase();
                    valueB = b.title.toLowerCase();
                    return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
                case 'created':
                    valueA = a.created;
                    valueB = b.created;
                    break;
                case 'modified':
                default:
                    valueA = a.modified;
                    valueB = b.modified;
                    break;
                case 'wordCount':
                    valueA = a.wordCount || 0;
                    valueB = b.wordCount || 0;
                    break;
            }
            
            return order === 'asc' ? valueA - valueB : valueB - valueA;
        });
        
        return notes;
    }

    getNotesByCategory(category) {
        return Array.from(this.notes.values())
            .filter(note => note.category === category)
            .sort((a, b) => b.modified - a.modified);
    }

    getNotesByTag(tag) {
        return Array.from(this.notes.values())
            .filter(note => note.tags.includes(tag))
            .sort((a, b) => b.modified - a.modified);
    }

    getPinnedNotes() {
        return Array.from(this.notes.values())
            .filter(note => note.pinned)
            .sort((a, b) => b.modified - a.modified);
    }

    getFavoriteNotes() {
        return Array.from(this.notes.values())
            .filter(note => note.favorite)
            .sort((a, b) => b.modified - a.modified);
    }

    searchNotes(query, options = {}) {
        query = query.toLowerCase().trim();
        if (!query) return [];
        
        const results = [];
        const weightMap = new Map();
        
        options = {
            searchInTitle: true,
            searchInContent: true,
            searchInTags: true,
            matchWholeWord: false,
            caseSensitive: false,
            ...options
        };
        
        const searchText = options.caseSensitive ? query : query.toLowerCase();
        
        this.notes.forEach((note, id) => {
            let weight = 0;
            
            // جستجو در عنوان
            if (options.searchInTitle) {
                const title = options.caseSensitive ? note.title : note.title.toLowerCase();
                if (options.matchWholeWord) {
                    if (title === searchText) weight += 100;
                    else if (title.includes(' ' + searchText + ' ')) weight += 80;
                    else if (title.startsWith(searchText + ' ')) weight += 70;
                    else if (title.endsWith(' ' + searchText)) weight += 70;
                } else {
                    if (title.includes(searchText)) {
                        weight += title.indexOf(searchText) === 0 ? 90 : 60;
                    }
                }
            }
            
            // جستجو در محتوا
            if (options.searchInContent && weight < 100) {
                const content = options.caseSensitive ? note.content : note.content.toLowerCase();
                if (content.includes(searchText)) {
                    const count = (content.match(new RegExp(searchText, 'g')) || []).length;
                    weight += Math.min(count * 10, 50);
                }
            }
            
            // جستجو در تگ‌ها
            if (options.searchInTags) {
                note.tags.forEach(tag => {
                    const tagLower = options.caseSensitive ? tag : tag.toLowerCase();
                    if (tagLower === searchText) weight += 40;
                    else if (tagLower.includes(searchText)) weight += 20;
                });
            }
            
            // جستجو در دسته‌بندی
            const category = options.caseSensitive ? note.category : note.category.toLowerCase();
            if (category === searchText) weight += 30;
            
            if (weight > 0) {
                weightMap.set(id, weight);
                results.push({
                    ...note,
                    searchWeight: weight,
                    matches: this.highlightMatches(note, searchText, options)
                });
            }
        });
        
        // مرتب‌سازی بر اساس وزن
        results.sort((a, b) => {
            if (b.searchWeight !== a.searchWeight) {
                return b.searchWeight - a.searchWeight;
            }
            return b.modified - a.modified;
        });
        
        return results;
    }

    highlightMatches(note, query, options) {
        const matches = {
            title: [],
            content: [],
            tags: []
        };
        
        const regex = new RegExp(
            options.matchWholeWord ? `\\b${query}\\b` : query,
            options.caseSensitive ? 'g' : 'gi'
        );
        
        // عنوان
        const titleMatches = note.title.match(regex);
        if (titleMatches) {
            matches.title = titleMatches;
        }
        
        // محتوا
        const contentMatches = note.content.match(regex);
        if (contentMatches) {
            matches.content = contentMatches;
        }
        
        // تگ‌ها
        note.tags.forEach(tag => {
            const tagMatches = tag.match(regex);
            if (tagMatches) {
                matches.tags.push(...tagMatches);
            }
        });
        
        return matches;
    }

    buildSearchIndex() {
        this.searchIndex.clear();
        
        this.notes.forEach((note, id) => {
            this.indexNote(note);
        });
    }

    indexNote(note) {
        const indexEntry = {
            id: note.id,
            title: note.title.toLowerCase(),
            content: note.content.toLowerCase(),
            tags: note.tags.map(t => t.toLowerCase()),
            category: note.category.toLowerCase(),
            words: this.extractWords(note.title + ' ' + note.content)
        };
        
        this.searchIndex.set(note.id, indexEntry);
    }

    extractWords(text) {
        const words = text.toLowerCase()
            .replace(/[^\u0600-\u06FF\uFB8A\u067E\u0686\u06AFa-z0-9\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 2);
        
        return [...new Set(words)];
    }

    updateCategories(category) {
        this.categories.add(category);
    }

    updateTags(newTags) {
        const tags = Array.isArray(newTags) ? newTags : [newTags];
        
        tags.forEach(tag => {
            if (tag && tag.trim()) {
                const count = this.tags.get(tag) || 0;
                this.tags.set(tag, count + 1);
            }
        });
    }

    deleteCategory(category) {
        if (category === 'عمومی') return false;
        
        // انتقال یادداشت‌ها به دسته عمومی
        this.notes.forEach(note => {
            if (note.category === category) {
                note.category = 'عمومی';
                this.indexNote(note);
            }
        });
        
        this.categories.delete(category);
        this.saveNotes();
        return true;
    }

    deleteTag(tag) {
        // حذف تگ از همه یادداشت‌ها
        this.notes.forEach(note => {
            if (note.tags.includes(tag)) {
                note.tags = note.tags.filter(t => t !== tag);
                this.indexNote(note);
            }
        });
        
        this.tags.delete(tag);
        this.saveNotes();
        return true;
    }

    countWords(text) {
        if (!text) return 0;
        const persianWords = text.match(/[\u0600-\u06FF\uFB8A\u067E\u0686\u06AF]+/g) || [];
        const englishWords = text.match(/\b[a-z]+\b/gi) || [];
        return persianWords.length + englishWords.length;
    }

    countCharacters(text) {
        return text ? text.length : 0;
    }

    getStats() {
        const notes = Array.from(this.notes.values());
        
        return {
            totalNotes: notes.length,
            totalWords: notes.reduce((sum, note) => sum + (note.wordCount || 0), 0),
            totalCharacters: notes.reduce((sum, note) => sum + this.countCharacters(note.content), 0),
            byCategory: this.getCategoryStats(),
            byTag: this.getTagStats(),
            last30Days: this.getRecentStats(30),
            last7Days: this.getRecentStats(7)
        };
    }

    getCategoryStats() {
        const stats = {};
        
        this.notes.forEach(note => {
            stats[note.category] = (stats[note.category] || 0) + 1;
        });
        
        return stats;
    }

    getTagStats() {
        return Object.fromEntries(this.tags);
    }

    getRecentStats(days) {
        const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
        const recentNotes = Array.from(this.notes.values())
            .filter(note => note.created >= cutoff);
        
        return {
            created: recentNotes.length,
            modified: recentNotes.filter(note => note.modified >= cutoff).length,
            words: recentNotes.reduce((sum, note) => sum + (note.wordCount || 0), 0)
        };
    }

    exportNotes(format = 'json') {
        const data = {
            notes: Array.from(this.notes.values()),
            categories: Array.from(this.categories),
            tags: Object.fromEntries(this.tags),
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        
        let blob;
        
        switch (format) {
            case 'json':
                blob = new Blob([JSON.stringify(data, null, 2)], {
                    type: 'application/json'
                });
                break;
                
            case 'md':
                const markdown = this.convertToMarkdown(data.notes);
                blob = new Blob([markdown], {
                    type: 'text/markdown'
                });
                break;
                
            case 'txt':
                const text = this.convertToText(data.notes);
                blob = new Blob([text], {
                    type: 'text/plain'
                });
                break;
                
            default:
                throw new Error('فرمت پشتیبانی نمی‌شود');
        }
        
        return URL.createObjectURL(blob);
    }

    convertToMarkdown(notes) {
        let md = '# یادداشت‌های من\n\n';
        
        notes.forEach(note => {
            const date = new Date(note.created).toLocaleString('fa-IR');
            md += `## ${note.title}\n`;
            md += `**دسته:** ${note.category}  \n`;
            md += `**تاریخ:** ${date}  \n`;
            
            if (note.tags.length > 0) {
                md += `**برچسب‌ها:** ${note.tags.join(', ')}  \n`;
            }
            
            md += `\n${note.content}\n\n`;
            md += '---\n\n';
        });
        
        return md;
    }

    convertToText(notes) {
        let text = 'یادداشت‌های من\n';
        text += '='.repeat(30) + '\n\n';
        
        notes.forEach(note => {
            const date = new Date(note.created).toLocaleString('fa-IR');
            text += `عنوان: ${note.title}\n`;
            text += `دسته: ${note.category}\n`;
            text += `تاریخ: ${date}\n`;
            
            if (note.tags.length > 0) {
                text += `برچسب‌ها: ${note.tags.join(', ')}\n`;
            }
            
            text += `\n${note.content}\n\n`;
            text += '-'.repeat(40) + '\n\n';
        });
        
        return text;
    }

    async importNotes(file) {
        try {
            const text = await file.text();
            const data = JSON.parse(text);
            
            if (!data.notes || !Array.isArray(data.notes)) {
                throw new Error('فرمت فایل نامعتبر است');
            }
            
            let imported = 0;
            let skipped = 0;
            
            data.notes.forEach(note => {
                if (!this.notes.has(note.id)) {
                    this.notes.set(note.id, note);
                    this.indexNote(note);
                    imported++;
                } else {
                    skipped++;
                }
            });
            
            if (data.categories) {
                data.categories.forEach(cat => this.categories.add(cat));
            }
            
            if (data.tags) {
                Object.entries(data.tags).forEach(([tag, count]) => {
                    const current = this.tags.get(tag) || 0;
                    this.tags.set(tag, current + count);
                });
            }
            
            await this.saveNotes();
            
            return {
                success: true,
                imported,
                skipped,
                total: this.notes.size
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    setReminder(noteId, dateTime) {
        const note = this.getNote(noteId);
        if (!note) return false;
        
        note.reminder = dateTime;
        this.updateNote(noteId, { reminder: dateTime });
        
        // TODO: ایجاد نوتیفیکیشن
        this.scheduleReminder(noteId, dateTime);
        
        return true;
    }

    scheduleReminder(noteId, dateTime) {
        const note = this.getNote(noteId);
        if (!note) return;
        
        const time = new Date(dateTime).getTime() - Date.now();
        
        if (time > 0) {
            setTimeout(() => {
                this.triggerReminder(noteId);
            }, time);
        }
    }

    triggerReminder(noteId) {
        const note = this.getNote(noteId);
        if (!note) return;
        
        // نمایش نوتیفیکیشن
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`یادآوری: ${note.title}`, {
                body: note.content.substring(0, 100) + '...',
                icon: '/icon.png',
                tag: `note_${noteId}`
            });
        }
        
        // آپدیت وضعیت ریمایندر
        note.reminder = null;
        this.updateNote(noteId, { reminder: null });
    }

    getUpcomingReminders() {
        const now = Date.now();
        const upcoming = [];
        
        this.notes.forEach(note => {
            if (note.reminder) {
                const reminderTime = new Date(note.reminder).getTime();
                if (reminderTime > now) {
                    upcoming.push({
                        ...note,
                        reminderTime: reminderTime
                    });
                }
            }
        });
        
        upcoming.sort((a, b) => a.reminderTime - b.reminderTime);
        return upcoming;
    }

    attachFile(noteId, file) {
        const note = this.getNote(noteId);
        if (!note) return null;
        
        const attachment = {
            id: 'att_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            name: file.name,
            type: file.type,
            size: file.size,
            date: Date.now()
        };
        
        // ذخیره فایل در IndexedDB
        this.saveAttachment(attachment.id, file);
        
        note.attachments.push(attachment);
        this.updateNote(noteId, { attachments: note.attachments });
        
        return attachment;
    }

    async saveAttachment(id, file) {
        const reader = new FileReader();
        
        return new Promise((resolve, reject) => {
            reader.onload = async (e) => {
                try {
                    await storage.saveToDB('attachment_' + id, e.target.result);
                    resolve(true);
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }

    async getAttachment(id) {
        try {
            const data = await storage.loadFromDB('attachment_' + id);
            return data ? new Blob([data]) : null;
        } catch (error) {
            return null;
        }
    }

    removeAttachment(noteId, attachmentId) {
        const note = this.getNote(noteId);
        if (!note) return false;
        
        note.attachments = note.attachments.filter(att => att.id !== attachmentId);
        this.updateNote(noteId, { attachments: note.attachments });
        
        // حذف فایل از دیتابیس
        storage.removeFromDB('attachment_' + attachmentId);
        
        return true;
    }

    duplicateNote(noteId) {
        const original = this.getNote(noteId);
        if (!original) return null;
        
        const duplicate = { ...original };
        duplicate.id = 'note_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        duplicate.title = 'کپی - ' + original.title;
        duplicate.created = Date.now();
        duplicate.modified = Date.now();
        duplicate.reminder = null;
        
        this.notes.set(duplicate.id, duplicate);
        this.indexNote(duplicate);
        this.saveNotes();
        
        return duplicate;
    }

    mergeNotes(noteIds) {
        if (noteIds.length < 2) return null;
        
        const notes = noteIds.map(id => this.getNote(id)).filter(Boolean);
        if (notes.length === 0) return null;
        
        const mainNote = notes[0];
        let content = mainNote.content;
        
        // اضافه کردن محتوای یادداشت‌های دیگر
        for (let i = 1; i < notes.length; i++) {
            content += '\n\n---\n\n';
            content += `**${notes[i].title}**\n\n`;
            content += notes[i].content;
            
            // حذف یادداشت‌های ادغام شده
            this.deleteNote(notes[i].id);
        }
        
        // آپدیت یادداشت اصلی
        const updatedNote = this.updateNote(mainNote.id, {
            content,
            title: mainNote.title + ' (ادغام شده)'
        });
        
        return updatedNote;
    }
}

export const notes = new NotesManager();
