/**
 * 🏗️ کتابخانه کامل ۲۵ اپ حرفه‌ای موبایل
 * ساختار: کلاس‌بندی شده + MVC + Error Handling + Full Documentation
 */

// ==================== پایه کلاس اپ ====================
class MobileApp {
    constructor(config) {
        this.id = `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        this.name = config.name;
        this.version = config.version || '1.0.0';
        this.author = config.author || 'Advanced App Builder';
        this.icon = config.icon || '📱';
        this.category = config.category || 'ابزار';
        this.description = config.description || '';
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
        this.components = [];
        this.errors = [];
        this.logs = [];
        this.settings = {
            theme: 'auto',
            language: 'fa',
            offline: true,
            autoSave: true,
            notifications: true
        };
    }

    // سیستم لاگینگ
    log(action, data = {}, level = 'info') {
        const entry = {
            id: `log_${Date.now()}`,
            timestamp: new Date().toISOString(),
            app: this.name,
            action,
            data,
            level
        };
        this.logs.push(entry);
        
        if (level === 'error') {
            console.error(`🔴 [${this.name}] ${action}:`, data);
        } else if (level === 'warn') {
            console.warn(`🟡 [${this.name}] ${action}:`, data);
        } else {
            console.log(`🔵 [${this.name}] ${action}:`, data);
        }
        
        return entry;
    }

    // سیستم خطا
    error(message, details = {}, code = 'APP_ERROR') {
        const errorObj = {
            id: `err_${Date.now()}`,
            code,
            message,
            details,
            app: this.name,
            timestamp: new Date().toISOString(),
            stack: new Error().stack
        };
        
        this.errors.push(errorObj);
        this.log('ERROR', { message, code, details }, 'error');
        
        return errorObj;
    }

    // اعتبارسنجی
    validate() {
        const errors = [];
        
        if (!this.name || this.name.length < 2) {
            errors.push('نام اپ باید حداقل ۲ کاراکتر باشد');
        }
        
        if (!this.version.match(/^\d+\.\d+\.\d+$/)) {
            errors.push('فرمت نسخه نامعتبر (مثال: 1.0.0)');
        }
        
        if (this.components.length === 0) {
            this.log('هشدار: اپ بدون کامپوننت', {}, 'warn');
        }
        
        return {
            isValid: errors.length === 0,
            errors,
            warnings: this.logs.filter(l => l.level === 'warn').map(l => l.action)
        };
    }

    // تولید ID یکتا
    generateId(prefix = 'item') {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // ساخت کامپوننت
    createComponent(type, name, features = [], config = {}) {
        const component = {
            id: this.generateId(type),
            type,
            name,
            features,
            config,
            version: '1.0',
            created: new Date().toISOString(),
            dependencies: []
        };
        
        this.components.push(component);
        return component;
    }

    // خروجی JSON
    toJSON() {
        return {
            meta: {
                id: this.id,
                name: this.name,
                version: this.version,
                author: this.author,
                icon: this.icon,
                category: this.category,
                description: this.description,
                createdAt: this.createdAt,
                updatedAt: this.updatedAt
            },
            settings: this.settings,
            stats: {
                components: this.components.length,
                logs: this.logs.length,
                errors: this.errors.length
            },
            components: this.components,
            validation: this.validate()
        };
    }

    // خروجی کد کامل
    generateCode() {
        return {
            html: this.generateHTML(),
            css: this.generateCSS(),
            js: this.generateJS(),
            manifest: this.generateManifest(),
            serviceWorker: this.generateServiceWorker(),
            readme: this.generateReadme(),
            structure: this.toJSON()
        };
    }

    // قالب‌های پیش‌فرض (هر کلاس فرزند باید این‌ها را بازنویسی کند)
    generateHTML() {
        return `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.name}</title>
    <link rel="stylesheet" href="style.css">
    <link rel="manifest" href="manifest.json">
</head>
<body>
    <div id="app">
        <h1>${this.name}</h1>
        <p>${this.description}</p>
    </div>
    <script src="app.js"></script>
</body>
</html>`;
    }

    generateCSS() {
        return `/* استایل‌های ${this.name} */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Vazirmatn', sans-serif;
}

body {
    background: #f5f5f5;
    color: #333;
    line-height: 1.6;
}

#app {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}`;
    }

    generateJS() {
        return `// ${this.name} - نسخه ${this.version}
class App {
    constructor() {
        this.init();
    }

    init() {
        console.log('🚀 ${this.name} بارگذاری شد');
        this.setupEventListeners();
        this.loadData();
    }

    setupEventListeners() {
        // پیاده‌سازی در کلاس فرزند
    }

    loadData() {
        // بارگذاری داده‌های ذخیره شده
    }

    saveData() {
        // ذخیره داده‌ها
    }
}

// راه‌اندازی
new App();`;
    }

    generateManifest() {
        return JSON.stringify({
            name: this.name,
            short_name: this.name.substring(0, 12),
            description: this.description,
            version: this.version,
            manifest_version: 3,
            start_url: '/',
            display: 'standalone',
            theme_color: '#4CAF50',
            background_color: '#ffffff',
            icons: [
                {
                    src: 'icon-192.png',
                    sizes: '192x192',
                    type: 'image/png'
                },
                {
                    src: 'icon-512.png',
                    sizes: '512x512',
                    type: 'image/png'
                }
            ]
        }, null, 2);
    }

    generateServiceWorker() {
        return `// Service Worker برای ${this.name}
const CACHE_NAME = '${this.id}';
const urlsToCache = ['/', '/index.html', '/style.css', '/app.js'];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});`;
    }

    generateReadme() {
        return `# ${this.name}

${this.description}

## 📱 مشخصات
- **نسخه:** ${this.version}
- **دسته‌بندی:** ${this.category}
- **نویسنده:** ${this.author}
- **تاریخ ساخت:** ${new Date(this.createdAt).toLocaleDateString('fa-IR')}

## 🚀 نحوه اجرا
1. فایل index.html را در مرورگر باز کنید
2. یا با Live Server اجرا کنید

## 📁 ساختار پروژه
- \`index.html\` - ساختار اصلی
- \`style.css\` - استایل‌ها
- \`app.js\` - منطق برنامه
- \`manifest.json\` - تنظیمات PWA
- \`service-worker.js\` - کش آفلاین

## 🔧 کامپوننت‌ها
${this.components.map(c => `- **${c.name}:** ${c.features.join(', ')}`).join('\n')}

## 📄 لایسنس
ساخته شده با ❤️ توسط Advanced App Builder`;
    }
}

// ==================== ۱. اپ یادداشت حرفه‌ای ====================
class NoteApp extends MobileApp {
    constructor(config = {}) {
        super({
            name: 'یادداشت حرفه‌ای',
            version: '2.1.0',
            icon: '📝',
            category: 'ابزار',
            description: 'اپلیکیشن یادداشت‌نویسی پیشرفته با قابلیت‌های کامل',
            ...config
        });
        
        this.notes = new Map();
        this.categories = new Set(['شخصی', 'کاری', 'ایده', 'خرید', 'پروژه']);
        this.tags = new Map();
        this.searchIndex = new Map();
        this.init();
    }

    init() {
        this.log('آماده‌سازی اپ یادداشت');
        
        this.components = [
            this.createComponent('editor', 'ویرایشگر متن غنی', [
                'قالب‌بندی',
                'لیست‌ها',
                'لینک',
                'عکس',
                'ذخیره خودکار'
            ], { rows: 10, spellcheck: true }),
            
            this.createComponent('organizer', 'سازمان‌دهنده', [
                'دسته‌بندی',
                'برچسب',
                'ستاره‌دار',
                'آرشیو',
                'سطل زباله'
            ], { sortBy: 'updated', order: 'desc' }),
            
            this.createComponent('search', 'جستجوی پیشرفته', [
                'متن کامل',
                'تگ‌ها',
                'تاریخ',
                'دسته‌بندی',
                'فیلتر ترکیبی'
            ], { fuzzy: true, highlight: true }),
            
            this.createComponent('export', 'صادرات/واردات', [
                'PDF',
                'HTML',
                'Markdown',
                'JSON',
                'پرینت'
            ], { formats: ['pdf', 'html', 'md', 'json'] }),
            
            this.createComponent('sync', 'همگام‌سازی', [
                'ذخیره ابری',
                'دستگاه‌های چندگانه',
                'تاریخچه نسخه‌ها',
                'بازیابی'
            ], { autoSync: true, maxVersions: 10 })
        ];
    }

    createNote(title, content = '', options = {}) {
        const noteId = this.generateId('note');
        const now = new Date().toISOString();
        
        const note = {
            id: noteId,
            title: title.trim(),
            content: content.trim(),
            category: options.category || 'شخصی',
            tags: options.tags || [],
            isStarred: options.isStarred || false,
            isArchived: options.isArchived || false,
            isDeleted: false,
            createdAt: now,
            updatedAt: now,
            version: 1,
            metadata: {
                wordCount: content.trim() ? content.trim().split(/\s+/).length : 0,
                charCount: content.length,
                lineCount: content.split('\n').length,
                readTime: Math.ceil(content.split(/\s+/).length / 200) // دقیقه
            }
        };
        
        this.notes.set(noteId, note);
        this.updateSearchIndex(note);
        
        // مدیریت تگ‌ها
        note.tags.forEach(tag => {
            if (!this.tags.has(tag)) {
                this.tags.set(tag, new Set());
            }
            this.tags.get(tag).add(noteId);
        });
        
        this.log('ایجاد یادداشت', { id: noteId, title, category: note.category });
        return note;
    }

    updateNote(noteId, updates) {
        const note = this.notes.get(noteId);
        if (!note) {
            return this.error('یادداشت یافت نشد', { noteId });
        }
        
        // حذف تگ‌های قدیمی از ایندکس
        note.tags.forEach(tag => {
            if (this.tags.has(tag)) {
                this.tags.get(tag).delete(noteId);
            }
        });
        
        // اعمال تغییرات
        Object.assign(note, updates, {
            updatedAt: new Date().toISOString(),
            version: note.version + 1
        });
        
        // به‌روزرسانی تگ‌های جدید
        note.tags.forEach(tag => {
            if (!this.tags.has(tag)) {
                this.tags.set(tag, new Set());
            }
            this.tags.get(tag).add(noteId);
        });
        
        this.updateSearchIndex(note);
        this.log('به‌روزرسانی یادداشت', { noteId, updates });
        
        return note;
    }

    deleteNote(noteId, permanent = false) {
        const note = this.notes.get(noteId);
        if (!note) return false;
        
        if (permanent) {
            // حذف دائمی
            this.notes.delete(noteId);
            
            // حذف از تگ‌ها
            note.tags.forEach(tag => {
                if (this.tags.has(tag)) {
                    this.tags.get(tag).delete(noteId);
                    if (this.tags.get(tag).size === 0) {
                        this.tags.delete(tag);
                    }
                }
            });
            
            // حذف از ایندکس جستجو
            this.searchIndex.delete(noteId);
            
            this.log('حذف دائمی یادداشت', { noteId, title: note.title });
        } else {
            // انتقال به سطل زباله
            note.isDeleted = true;
            note.deletedAt = new Date().toISOString();
            this.log('انتقال به سطل زباله', { noteId });
        }
        
        return true;
    }

    restoreNote(noteId) {
        const note = this.notes.get(noteId);
        if (!note || !note.isDeleted) return false;
        
        note.isDeleted = false;
        note.deletedAt = null;
        note.restoredAt = new Date().toISOString();
        
        this.log('بازیابی یادداشت', { noteId });
        return true;
    }

    searchNotes(query, options = {}) {
        const startTime = Date.now();
        const queryLower = query.toLowerCase().trim();
        
        if (!queryLower) {
            return this.getNotes(options);
        }
        
        const results = [];
        const weights = new Map(); // وزن هر نتیجه
        
        // جستجو در ایندکس
        for (const [noteId, note] of this.notes.entries()) {
            if (note.isDeleted && !options.includeDeleted) continue;
            if (note.isArchived && !options.includeArchived) continue;
            
            let score = 0;
            
            // جستجو در عنوان (وزن بالا)
            if (note.title.toLowerCase().includes(queryLower)) {
                score += 10;
                if (note.title.toLowerCase() === queryLower) score += 5;
            }
            
            // جستجو در محتوا
            if (note.content.toLowerCase().includes(queryLower)) {
                score += 5;
                const occurrences = (note.content.toLowerCase().match(new RegExp(queryLower, 'g')) || []).length;
                score += Math.min(occurrences, 5);
            }
            
            // جستجو در تگ‌ها
            const tagMatch = note.tags.some(tag => tag.toLowerCase().includes(queryLower));
            if (tagMatch) score += 8;
            
            // جستجو در دسته‌بندی
            if (note.category.toLowerCase().includes(queryLower)) {
                score += 3;
            }
            
            if (score > 0) {
                results.push(note);
                weights.set(note.id, score);
            }
        }
        
        // مرتب‌سازی بر اساس وزن
        results.sort((a, b) => weights.get(b.id) - weights.get(a.id));
        
        // اعمال فیلترها
        let filteredResults = results;
        
        if (options.category) {
            filteredResults = filteredResults.filter(n => n.category === options.category);
        }
        
        if (options.tags && options.tags.length > 0) {
            filteredResults = filteredResults.filter(n => 
                options.tags.every(tag => n.tags.includes(tag))
            );
        }
        
        if (options.starredOnly) {
            filteredResults = filteredResults.filter(n => n.isStarred);
        }
        
        if (options.dateRange) {
            const { start, end } = options.dateRange;
            filteredResults = filteredResults.filter(n => {
                const noteDate = new Date(n.updatedAt);
                return (!start || noteDate >= new Date(start)) && 
                       (!end || noteDate <= new Date(end));
            });
        }
        
        const searchTime = Date.now() - startTime;
        this.log('جستجو اجرا شد', { 
            query, 
            results: filteredResults.length, 
            time: `${searchTime}ms`,
            filters: options 
        });
        
        return {
            query,
            results: filteredResults,
            total: filteredResults.length,
            time: searchTime,
            weights: Object.fromEntries(weights)
        };
    }

    updateSearchIndex(note) {
        if (note.isDeleted) {
            this.searchIndex.delete(note.id);
            return;
        }
        
        const index = {
            title: note.title.toLowerCase(),
            content: note.content.toLowerCase(),
            tags: note.tags.map(t => t.toLowerCase()),
            category: note.category.toLowerCase(),
            words: [
                ...note.title.toLowerCase().split(/\s+/),
                ...note.content.toLowerCase().split(/\s+/),
                ...note.tags.map(t => t.toLowerCase())
            ].filter(w => w.length > 2)
        };
        
        this.searchIndex.set(note.id, index);
    }

    getStats() {
        const notes = Array.from(this.notes.values());
        const activeNotes = notes.filter(n => !n.isDeleted && !n.isArchived);
        const archivedNotes = notes.filter(n => n.isArchived);
        const deletedNotes = notes.filter(n => n.isDeleted);
        
        const wordCount = notes.reduce((sum, n) => sum + n.metadata.wordCount, 0);
        const charCount = notes.reduce((sum, n) => sum + n.metadata.charCount, 0);
        const readTime = notes.reduce((sum, n) => sum + n.metadata.readTime, 0);
        
        const categoryStats = {};
        notes.forEach(n => {
            categoryStats[n.category] = (categoryStats[n.category] || 0) + 1;
        });
        
        const tagStats = {};
        notes.forEach(n => {
            n.tags.forEach(tag => {
                tagStats[tag] = (tagStats[tag] || 0) + 1;
            });
        });
        
        return {
            total: notes.length,
            active: activeNotes.length,
            archived: archivedNotes.length,
            deleted: deletedNotes.length,
            starred: notes.filter(n => n.isStarred).length,
            words: wordCount,
            characters: charCount,
            readTime: `${readTime} دقیقه`,
            categories: Object.entries(categoryStats).map(([name, count]) => ({ name, count })),
            tags: Object.entries(tagStats)
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => b.count - a.count),
            lastUpdated: notes.length > 0 
                ? new Date(Math.max(...notes.map(n => new Date(n.updatedAt))))
                : null
        };
    }

    exportNotes(format = 'json', options = {}) {
        const notes = Array.from(this.notes.values())
            .filter(n => options.includeDeleted || !n.isDeleted)
            .filter(n => options.includeArchived || !n.isArchived);
        
        switch (format.toLowerCase()) {
            case 'json':
                return JSON.stringify({
                    meta: {
                        app: this.name,
                        version: this.version,
                        exportDate: new Date().toISOString(),
                        format: 'json',
                        count: notes.length
                    },
                    notes,
                    categories: Array.from(this.categories),
                    tags: Array.from(this.tags.keys()),
                    stats: this.getStats()
                }, null, 2);
                
            case 'html':
                let html = `<!DOCTYPE html>
<html>
<head>
    <title>خروجی یادداشت‌ها</title>
    <style>
        body { font-family: 'Vazirmatn'; direction: rtl; padding: 20px; }
        .note { border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 5px; }
        .note-title { color: #333; font-size: 1.2em; }
        .note-meta { color: #666; font-size: 0.9em; margin: 5px 0; }
        .note-content { margin: 10px 0; line-height: 1.6; }
        .note-tags { margin-top: 10px; }
        .tag { display: inline-block; background: #e0e0e0; padding: 2px 8px; border-radius: 10px; margin: 2px; font-size: 0.8em; }
    </style>
</head>
<body>
    <h1>خروجی یادداشت‌ها</h1>
    <p>تعداد: ${notes.length} یادداشت | تاریخ صادرات: ${new Date().toLocaleDateString('fa-IR')}</p>
    <hr>`;
                
                notes.forEach(note => {
                    html += `
                    <div class="note">
                        <div class="note-title">${note.title}</div>
                        <div class="note-meta">
                            دسته: ${note.category} | 
                            تاریخ: ${new Date(note.updatedAt).toLocaleDateString('fa-IR')} |
                            کلمات: ${note.metadata.wordCount}
                        </div>
                        <div class="note-content">${note.content.replace(/\n/g, '<br>')}</div>
                        <div class="note-tags">
                            ${note.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    </div>`;
                });
                
                html += '</body></html>';
                return html;
                
            case 'markdown':
                let md = `# خروجی یادداشت‌ها\n\n`;
                md += `**تعداد:** ${notes.length} یادداشت\n`;
                md += `**تاریخ صادرات:** ${new Date().toLocaleDateString('fa-IR')}\n\n`;
                md += '---\n\n';
                
                notes.forEach((note, index) => {
                    md += `## ${index + 1}. ${note.title}\n\n`;
                    md += `**دسته‌بندی:** ${note.category}  \n`;
                    md += `**تاریخ:** ${new Date(note.updatedAt).toLocaleDateString('fa-IR')}  \n`;
                    md += `**برچسب‌ها:** ${note.tags.join(', ')}\n\n`;
                    md += `${note.content}\n\n`;
                    md += '---\n\n';
                });
                
                return md;
                
            default:
                throw new Error(`فرمت "${format}" پشتیبانی نمی‌شود`);
        }
    }

    importNotes(data, format = 'json') {
        try {
            let importedNotes = [];
            
            switch (format) {
                case 'json':
                    const parsed = JSON.parse(data);
                    importedNotes = parsed.notes || [];
                    break;
                    
                default:
                    throw new Error(`فرمت "${format}" پشتیبانی نمی‌شود`);
            }
            
            let successCount = 0;
            let errorCount = 0;
            
            importedNotes.forEach(noteData => {
                try {
                    const note = this.createNote(
                        noteData.title || 'بدون عنوان',
                        noteData.content || '',
                        {
                            category: noteData.category || 'وارد شده',
                            tags: noteData.tags || [],
                            isStarred: noteData.isStarred || false,
                            isArchived: noteData.isArchived || false
                        }
                    );
                    
                    if (noteData.createdAt) {
                        note.createdAt = noteData.createdAt;
                    }
                    
                    successCount++;
                } catch (err) {
                    errorCount++;
                    this.log('خطا در وارد کردن یادداشت', { error: err.message, noteData }, 'error');
                }
            });
            
            this.log('واردات کامل شد', { 
                total: importedNotes.length, 
                success: successCount, 
                errors: errorCount 
            });
            
            return {
                success: true,
                imported: successCount,
                errors: errorCount,
                total: importedNotes.length
            };
            
        } catch (error) {
            return this.error('خطا در وارد کردن داده‌ها', { error: error.message });
        }
    }

    generateHTML() {
        return `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.name}</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css">
    <link rel="stylesheet" href="style.css">
    <link rel="manifest" href="manifest.json">
</head>
<body>
    <div class="app-container">
        <!-- نوار بالایی -->
        <header class="app-header">
            <div class="header-left">
                <button class="menu-btn" id="menu-btn">☰</button>
                <h1 class="app-title">${this.name}</h1>
            </div>
            <div class="header-right">
                <div class="search-container">
                    <input type="text" id="search-input" placeholder="جستجوی یادداشت..." autocomplete="off">
                    <button id="search-btn" class="icon-btn">🔍</button>
                </div>
                <button id="new-note-btn" class="primary-btn">+ جدید</button>
            </div>
        </header>
        
        <!-- محتوای اصلی -->
        <div class="app-main">
            <!-- نوار کناری -->
            <aside class="sidebar" id="sidebar">
                <div class="sidebar-section">
                    <h3>📝 دسته‌بندی‌ها</h3>
                    <ul id="categories-list" class="categories-list"></ul>
                </div>
                
                <div class="sidebar-section">
                    <h3>🏷️ برچسب‌ها</h3>
                    <div id="tags-cloud" class="tags-cloud"></div>
                </div>
                
                <div class="sidebar-section">
                    <h3>📊 آمار</h3>
                    <div id="app-stats" class="stats-box"></div>
                </div>
            </aside>
            
            <!-- بخش مرکزی -->
            <main class="content-area">
                <!-- ویرایشگر -->
                <section class="editor-section" id="editor-section">
                    <div class="editor-header">
                        <input type="text" id="note-title" class="title-input" placeholder="عنوان یادداشت...">
                        <div class="editor-tools">
                            <button class="tool-btn" data-action="save">💾 ذخیره</button>
                            <button class="tool-btn" data-action="star">⭐ ستاره</button>
                            <button class="tool-btn" data-action="archive">📦 آرشیو</button>
                            <select id="note-category" class="category-select">
                                <option value="">انتخاب دسته</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="editor-body">
                        <textarea id="note-content" class="content-editor" 
                                  placeholder="متن خود را اینجا بنویسید..." 
                                  rows="15" spellcheck="true"></textarea>
                        
                        <div class="editor-footer">
                            <div class="tag-input-container">
                                <input type="text" id="tag-input" placeholder="افزودن برچسب..." class="tag-input">
                                <button id="add-tag-btn" class="small-btn">+</button>
                            </div>
                            <div id="note-tags" class="tags-container"></div>
                        </div>
                    </div>
                </section>
                
                <!-- لیست یادداشت‌ها -->
                <section class="notes-section" id="notes-section">
                    <div class="section-header">
                        <h2>📚 یادداشت‌های شما</h2>
                        <div class="view-controls">
                            <button class="view-btn active" data-view="grid">◼️</button>
                            <button class="view-btn" data-view="list">☰</button>
                            <button class="view-btn" data-view="compact">≡</button>
                        </div>
                    </div>
                    
                    <div class="notes-container" id="notes-container">
                        <!-- یادداشت‌ها اینجا نمایش داده می‌شوند -->
                        <div class="empty-state" id="empty-state">
                            <p>📭 هنوز یادداشتی ندارید</p>
                            <button id="create-first-note" class="primary-btn">ایجاد اولین یادداشت</button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
        
        <!-- نوار پایین -->
        <footer class="app-footer">
            <div class="footer-info">
                <span>${this.name} • نسخه ${this.version}</span>
                <span id="sync-status">🟢 همگام شده</span>
            </div>
            <div class="footer-actions">
                <button id="export-btn" class="footer-btn">📤 صادرات</button>
                <button id="settings-btn" class="footer-btn">⚙️ تنظیمات</button>
                <button id="help-btn" class="footer-btn">❓ راهنما</button>
            </div>
        </footer>
    </div>
    
    <!-- مدال‌ها -->
    <div id="modal-overlay" class="modal-overlay"></div>
    
    <div id="settings-modal" class="modal">
        <div class="modal-content">
            <h2>⚙️ تنظیمات</h2>
            <!-- تنظیمات -->
        </div>
    </div>
    
    <script src="app.js"></script>
</body>
</html>`;
    }

    generateCSS() {
        return `/* استایل‌های ${this.name} */
:root {
    --primary: #4CAF50;
    --primary-dark: #388E3C;
    --primary-light: #C8E6C9;
    --secondary: #2196F3;
    --accent: #FF9800;
    --danger: #F44336;
    --warning: #FFC107;
    --success: #4CAF50;
    --info: #00BCD4;
    
    --dark: #121212;
    --dark-card: #1E1E1E;
    --dark-text: #E0E0E0;
    --dark-border: #333;
    
    --light: #FFFFFF;
    --light-card: #F5F5F5;
    --light-text: #333333;
    --light-border: #DDD;
    
    --shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 5px 20px rgba(0, 0, 0, 0.15);
    --radius: 12px;
    --radius-sm: 6px;
}

/* حالت تیره */
@media (prefers-color-scheme: dark) {
    :root {
        --background: var(--dark);
        --card: var(--dark-card);
        --text: var(--dark-text);
        --border: var(--dark-border);
    }
}

/* حالت روشن */
@media (prefers-color-scheme: light) {
    :root {
        --background: var(--light);
        --card: var(--light-card);
        --text: var(--light-text);
        --border: var(--light-border);
    }
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Vazirmatn', sans-serif;
}

body {
    background: var(--background);
    color: var(--text);
    line-height: 1.6;
    transition: all 0.3s ease;
}

.app-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    max-width: 1400px;
    margin: 0 auto;
}

/* هدر */
.app-header {
    background: var(--primary);
    color: white;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: var(--shadow);
    position: sticky;
    top: 0;
    z-index: 100;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.menu-btn {
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: var(--radius-sm);
    transition: background 0.2s;
}

.menu-btn:hover {
    background: rgba(255, 255, 255, 0.1);
}

.app-title {
    font-size: 1.5rem;
    font-weight: 700;
}

.header-right {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.search-container {
    display: flex;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 25px;
    padding: 0.3rem 1rem;
    transition: all 0.3s;
}

.search-container:focus-within {
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
}

#search-input {
    background: none;
    border: none;
    color: white;
    width: 250px;
    padding: 0.5rem;
    outline: none;
}

#search-input::placeholder {
    color: rgba(255, 255, 255, 0.7);
}

.icon-btn {
    background: none;
    border: none;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: background 0.2s;
}

.icon-btn:hover {
    background: rgba(255, 255, 255, 0.1);
}

.primary-btn {
    background: white;
    color: var(--primary);
    border: none;
    padding: 0.7rem 1.5rem;
    border-radius: 25px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.primary-btn:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
}

/* محتوای اصلی */
.app-main {
    display: flex;
    flex: 1;
    padding: 1rem;
    gap: 1.5rem;
}

/* نوار کناری */
.sidebar {
    width: 280px;
    background: var(--card);
    border-radius: var(--radius);
    padding: 1.5rem;
    box-shadow: var(--shadow);
    position: sticky;
    top: 5rem;
    height: fit-content;
    transition: all 0.3s;
}

.sidebar-section {
    margin-bottom: 2rem;
}

.sidebar-section h3 {
    font-size: 1rem;
    margin-bottom: 1rem;
    color: var(--primary);
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.categories-list {
    list-style: none;
}

.categories-list li {
    padding: 0.7rem 1rem;
    margin-bottom: 0.5rem;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.categories-list li:hover {
    background: rgba(76, 175, 80, 0.1);
}

.categories-list li.active {
    background: var(--primary-light);
    color: var(--primary-dark);
    font-weight: 600;
}

.tags-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.tag-cloud-item {
    background: var(--primary-light);
    color: var(--primary-dark);
    padding: 0.3rem 0.7rem;
    border-radius: 15px;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.2s;
}

.tag-cloud-item:hover {
    background: var(--primary);
    color: white;
    transform: scale(1.05);
}

.stats-box {
    background: rgba(76, 175, 80, 0.05);
    padding: 1rem;
    border-radius: var(--radius-sm);
    border: 1px solid var(--primary-light);
}

.stats-box p {
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    display: flex;
    justify-content: space-between;
}

.stats-box strong {
    color: var(--primary);
}

/* بخش مرکزی */
.content-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.editor-section {
    background: var(--card);
    border-radius: var(--radius);
    padding: 1.5rem;
    box-shadow: var(--shadow);
}

.editor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    gap: 1rem;
}

.title-input {
    flex: 1;
    background: none;
    border: none;
    border-bottom: 2px solid var(--border);
    color: var(--text);
    font-size: 1.8rem;
    font-weight: 700;
    padding: 0.5rem 0;
    outline: none;
    transition: border-color 0.3s;
    min-width: 300px;
}

.title-input:focus {
    border-color: var(--primary);
}

.editor-tools {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    flex-wrap: wrap;
}

.tool-btn {
    background: var(--background);
    border: 1px solid var(--border);
    color: var(--text);
    padding: 0.6rem 1.2rem;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.tool-btn:hover {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
}

.category-select {
    background: var(--background);
    border: 1px solid var(--border);
    color: var(--text);
    padding: 0.6rem 1rem;
    border-radius: var(--radius-sm);
    cursor: pointer;
    min-width: 150px;
}

.editor-body {
    margin-top: 1rem;
}

.content-editor {
    width: 100%;
    background: var(--background);
    border: 1px solid var(--border);
    color: var(--text);
    padding: 1.5rem;
    border-radius: var(--radius-sm);
    font-size: 1rem;
    line-height: 1.8;
    resize: vertical;
    outline: none;
    transition: border-color 0.3s;
    font-family: 'Vazirmatn', monospace;
}

.content-editor:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
}

.editor-footer {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.tag-input-container {
    display: flex;
    gap: 0.5rem;
}

.tag-input {
    flex: 1;
    background: var(--background);
    border: 1px solid var(--border);
    color: var(--text);
    padding: 0.6rem 1rem;
    border-radius: var(--radius-sm);
    outline: none;
}

.small-btn {
    background: var(--primary);
    color: white;
    border: none;
    padding: 0.6rem 1.2rem;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: background 0.2s;
}

.small-btn:hover {
    background: var(--primary-dark);
}

.tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.note-tag {
    background: var(--primary-light);
    color: var(--primary-dark);
    padding: 0.3rem 0.8rem;
    border-radius: 15px;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.note-tag .remove-tag {
    background: none;
    border: none;
    color: var(--primary-dark);
    cursor: pointer;
    font-size: 0.9rem;
    padding: 0;
}

/* بخش یادداشت‌ها */
.notes-section {
    background: var(--card);
    border-radius: var(--radius);
    padding: 1.5rem;
    box-shadow: var(--shadow);
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.section-header h2 {
    font-size: 1.5rem;
    color: var(--primary);
}

.view-controls {
    display: flex;
    gap: 0.5rem;
    background: var(--background);
    padding: 0.3rem;
    border-radius: var(--radius-sm);
}

.view-btn {
    background: none;
    border: none;
    color: var(--text);
    padding: 0.5rem 0.8rem;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all 0.2s;
}

.view-btn.active {
    background: var(--primary);
    color: white;
}

.notes-container {
    min-height: 300px;
}

.empty-state {
    text-align: center;
    padding: 4rem 2rem;
    color: var(--text);
    opacity: 0.7;
}

.empty-state p {
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
}

/* کارت یادداشت‌ها */
.notes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
}

.note-card {
    background: var(--background);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 1.5rem;
    cursor: pointer;
    transition: all 0.3s;
    position: relative;
    overflow: hidden;
}

.note-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
    border-color: var(--primary);
}

.note-card.starred::before {
    content: '⭐';
    position: absolute;
    top: 10px;
    left: 10px;
    font-size: 1.2rem;
}

.note-card.archived {
    opacity: 0.8;
    background: rgba(255, 193, 7, 0.05);
}

.note-card-title {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 0.8rem;
    color: var(--text);
}

.note-card-preview {
    color: var(--text);
    opacity: 0.8;
    font-size: 0.9rem;
    line-height: 1.6;
    margin-bottom: 1rem;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.note-card-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8rem;
    color: var(--text);
    opacity: 0.6;
}

.note-card-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
    opacity: 0;
    transition: opacity 0.2s;
}

.note-card:hover .note-card-actions {
    opacity: 1;
}

.action-btn {
    background: none;
    border: 1px solid var(--border);
    color: var(--text);
    padding: 0.3rem 0.8rem;
    border-radius: var(--radius-sm);
    cursor: pointer;
    font-size: 0.8rem;
    transition: all 0.2s;
}

.action-btn:hover {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
}

/* فوتر */
.app-footer {
    background: var(--card);
    color: var(--text);
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid var(--border);
    margin-top: auto;
}

.footer-info {
    display: flex;
    align-items: center;
    gap: 1rem;
}

#sync-status {
    font-size: 0.8rem;
    padding: 0.3rem 0.8rem;
    border-radius: 15px;
    background: rgba(76, 175, 80, 0.1);
    color: var(--primary);
}

.footer-actions {
    display: flex;
    gap: 1rem;
}

.footer-btn {
    background: none;
    border: 1px solid var(--border);
    color: var(--text);
    padding: 0.5rem 1rem;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all 0.2s;
}

.footer-btn:hover {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
}

/* مدال‌ها */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: none;
}

.modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--card);
    border-radius: var(--radius);
    padding: 2rem;
    z-index: 1001;
    min-width: 400px;
    max-width: 90vw;
    max-height: 90vh;
    overflow-y: auto;
    display: none;
    box-shadow: var(--shadow-lg);
}

.modal-content h2 {
    margin-bottom: 1.5rem;
    color: var(--primary);
}

/* پاسخگو */
@media (max-width: 1024px) {
    .app-main {
        flex-direction: column;
    }
    
    .sidebar {
        width: 100%;
        position: static;
    }
    
    .notes-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }
}

@media (max-width: 768px) {
    .app-header {
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
    }
    
    .header-left, .header-right {
        width: 100%;
        justify-content: center;
    }
    
    #search-input {
        width: 100%;
    }
    
    .editor-header {
        flex-direction: column;
        align-items: stretch;
    }
    
    .title-input {
        min-width: auto;
    }
    
    .editor-tools {
        justify-content: center;
    }
    
    .app-footer {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
    }
}

@media (max-width: 480px) {
    .notes-grid {
        grid-template-columns: 1fr;
    }
    
    .modal {
        min-width: 95vw;
        padding: 1rem;
    }
}

/* انیمیشن‌ها */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

.note-card {
    animation: fadeIn 0.3s ease;
}

@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}

.primary-btn:active {
    animation: pulse 0.2s;
}

/* اسکرول بار */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    background: var(--background);
}

::-webkit-scrollbar-thumb {
    background: var(--primary);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: var(--primary-dark);
}

/* انتخاب متن */
::selection {
    background: var(--primary-light);
    color: var(--primary-dark);
}

/* حالت چاپ */
@media print {
    .app-header,
    .sidebar,
    .editor-section,
    .app-footer,
    .view-controls,
    .note-card-actions {
        display: none !important;
    }
    
    .notes-section {
        box-shadow: none !important;
        padding: 0 !important;
    }
    
    .note-card {
        break-inside: avoid;
        border: 1px solid #000 !important;
    }
}`;
    }

    generateJS() {
        return `// ${this.name} - نسخه ${this.version}
// کد کامل اپ یادداشت حرفه‌ای

class NoteAppManager {
    constructor() {
        this.notes = new Map();
        this.categories = new Set(['شخصی', 'کاری', 'ایده', 'خرید', 'پروژه']);
        this.tags = new Map();
        this.currentNote = null;
        this.currentView = 'grid';
        this.searchQuery = '';
        this.filterCategory = '';
        this.filterTags = new Set();
        this.filterStarred = false;
        this.filterArchived = false;
        this.filterDeleted = false;
        
        this.init();
    }
    
    async init() {
        console.log('🚀 راه‌اندازی اپ یادداشت...');
        
        // بارگذاری داده‌های ذخیره شده
        await this.loadFromStorage();
        
        // تنظیم رویدادها
        this.setupEventListeners();
        
        // مقداردهی اولیه UI
        this.initUI();
        
        // رندر اولیه
        this.render();
        
        // ثبت Service Worker
        this.registerServiceWorker();
        
        console.log('✅ اپ یادداشت آماده است');
        this.showNotification('اپ یادداشت بارگذاری شد', 'success');
    }
    
    async loadFromStorage() {
        try {
            const saved = localStorage.getItem('note_app_data');
            if (saved) {
                const data = JSON.parse(saved);
                
                // بارگذاری یادداشت‌ها
                if (data.notes) {
                    data.notes.forEach(note => {
                        this.notes.set(note.id, note);
                    });
                }
                
                // بارگذاری دسته‌بندی‌ها
                if (data.categories) {
                    data.categories.forEach(cat => this.categories.add(cat));
                }
                
                // بارگذاری تگ‌ها
                if (data.tags) {
                    Object.entries(data.tags).forEach(([tag, noteIds]) => {
                        this.tags.set(tag, new Set(noteIds));
                    });
                }
                
                console.log('📂 داده‌ها از حافظه بارگذاری شد');
                return true;
            }
        } catch (error) {
            console.error('خطا در بارگذاری داده‌ها:', error);
        }
        
        return false;
    }
    
    async saveToStorage() {
        try {
            const data = {
                notes: Array.from(this.notes.values()),
                categories: Array.from(this.categories),
                tags: Object.fromEntries(
                    Array.from(this.tags.entries()).map(([tag, noteSet]) => [tag, Array.from(noteSet)])
                ),
                timestamp: new Date().toISOString(),
                version: '${this.version}'
            };
            
            localStorage.setItem('note_app_data', JSON.stringify(data));
            console.log('💾 داده‌ها ذخیره شدند');
            return true;
        } catch (error) {
            console.error('خطا در ذخیره داده‌ها:', error);
            return false;
        }
    }
    
    setupEventListeners() {
        // دکمه جدید
        document.getElementById('new-note-btn').addEventListener('click', () => this.createNewNote());
        document.getElementById('create-first-note').addEventListener('click', () => this.createNewNote());
        
        // جستجو
        document.getElementById('search-btn').addEventListener('click', () => this.searchNotes());
        document.getElementById('search-input').addEventListener('input', (e) => {
            this.searchQuery = e.target.value;
            this.debouncedSearch();
        });
        document.getElementById('search-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchNotes();
        });
        
        // ذخیره یادداشت
        document.querySelector('[data-action="save"]').addEventListener('click', () => this.saveCurrentNote());
        
        // ستاره‌دار کردن
        document.querySelector('[data-action="star"]').addEventListener('click', () => this.toggleStar());
        
        // آرشیو
        document.querySelector('[data-action="archive"]').addEventListener('click', () => this.toggleArchive());
        
        // تغییر دسته‌بندی
        document.getElementById('note-category').addEventListener('change', (e) => {
            if (this.currentNote) {
                this.updateNote(this.currentNote.id, { category: e.target.value });
            }
        });
        
        // افزودن تگ
        document.getElementById('add-tag-btn').addEventListener('click', () => this.addTagToNote());
        document.getElementById('tag-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTagToNote();
        });
        
        // تغییر نمای لیست
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentView = e.target.dataset.view;
                this.renderNotes();
            });
        });
        
        // صادرات
        document.getElementById('export-btn').addEventListener('click', () => this.exportNotes());
        
        // تنظیمات
        document.getElementById('settings-btn').addEventListener('click', () => this.openSettings());
        
        // راهنما
        document.getElementById('help-btn').addEventListener('click', () => this.showHelp());
        
        // منوی کشویی
        document.getElementById('menu-btn').addEventListener('click', () => this.toggleSidebar());
        
        // ذخیره خودکار
        document.getElementById('note-title').addEventListener('input', () => this.autoSave());
        document.getElementById('note-content').addEventListener('input', () => this.autoSave());
        
        // رویدادهای کیبورد
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + S برای ذخیره
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.saveCurrentNote();
            }
            
            // Ctrl/Cmd + N برای جدید
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                this.createNewNote();
            }
            
            // Ctrl/Cmd + F برای جستجو
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                document.getElementById('search-input').focus();
            }
            
            // Escape برای پاک کردن جستجو
            if (e.key === 'Escape') {
                this.clearSearch();
            }
        });
        
        // جلوگیری از بسته شدن صفحه بدون ذخیره
        window.addEventListener('beforeunload', (e) => {
            if (this.hasUnsavedChanges()) {
                e.preventDefault();
                e.returnValue = 'تغییرات ذخیره نشده‌ای دارید. آیا مطمئن هستید؟';
            }
        });
    }
    
    initUI() {
        // پر کردن لیست دسته‌بندی‌ها
        this.updateCategoriesList();
        
        // پر کردن تگ‌های ابری
        this.updateTagsCloud();
        
        // به‌روزرسانی آمار
        this.updateStats();
    }
    
    createNewNote() {
        this.clearEditor();
        
        const noteId = this.generateId('note');
        const now = new Date().toISOString();
        
        this.currentNote = {
            id: noteId,
            title: '',
            content: '',
            category: 'شخصی',
            tags: [],
            isStarred: false,
            isArchived: false,
            isDeleted: false,
            createdAt: now,
            updatedAt: now,
            version: 1
        };
        
        // به‌روزرسانی UI
        document.getElementById('note-title').value = '';
        document.getElementById('note-content').value = '';
        document.getElementById('note-category').value = 'شخصی';
        this.updateNoteTags();
        
        // فوکوس روی عنوان
        setTimeout(() => {
            document.getElementById('note-title').focus();
        }, 100);
        
        console.log('📝 یادداشت جدید ایجاد شد');
    }
    
    saveCurrentNote() {
        if (!this.currentNote) return;
        
        const title = document.getElementById('note-title').value.trim();
        const content = document.getElementById('note-content').value.trim();
        const category = document.getElementById('note-category').value;
        
        if (!title && !content) {
            this.showNotification('عنوان یا متن یادداشت نمی‌تواند خالی باشد', 'warning');
            return;
        }
        
        const updates = {
            title: title || 'بدون عنوان',
            content,
            category: category || 'شخصی',
            updatedAt: new Date().toISOString()
        };
        
        // اگر یادداشت جدید است
        if (!this.notes.has(this.currentNote.id)) {
            this.currentNote = {
                ...this.currentNote,
                ...updates,
                createdAt: updates.updatedAt
            };
            this.notes.set(this.currentNote.id, this.currentNote);
            this.showNotification('یادداشت ذخیره شد', 'success');
        } else {
            // به‌روزرسانی یادداشت موجود
            this.updateNote(this.currentNote.id, updates);
        }
        
        // به‌روزرسانی لیست
        this.renderNotes();
        this.saveToStorage();
    }
    
    updateNote(noteId, updates) {
        const note = this.notes.get(noteId);
        if (!note) return null;
        
        // حذف تگ‌های قدیمی از ایندکس
        note.tags.forEach(tag => {
            if (this.tags.has(tag)) {
                this.tags.get(tag).delete(noteId);
                if (this.tags.get(tag).size === 0) {
                    this.tags.delete(tag);
                }
            }
        });
        
        // اعمال تغییرات
        Object.assign(note, updates, {
            version: note.version + 1
        });
        
        // اضافه کردن تگ‌های جدید به ایندکس
        note.tags.forEach(tag => {
            if (!this.tags.has(tag)) {
                this.tags.set(tag, new Set());
            }
            this.tags.get(tag).add(noteId);
        });
        
        // ذخیره
        this.notes.set(noteId, note);
        this.saveToStorage();
        
        return note;
    }
    
    loadNote(noteId) {
        const note = this.notes.get(noteId);
        if (!note) return;
        
        this.currentNote = note;
        
        // به‌روزرسانی ویرایشگر
        document.getElementById('note-title').value = note.title;
        document.getElementById('note-content').value = note.content;
        document.getElementById('note-category').value = note.category;
        
        // به‌روزرسانی دکمه‌ها
        const starBtn = document.querySelector('[data-action="star"]');
        const archiveBtn = document.querySelector('[data-action="archive"]');
        
        starBtn.textContent = note.isStarred ? '★ ستاره‌دار' : '☆ ستاره';
        archiveBtn.textContent = note.isArchived ? '📦 خارج از آرشیو' : '📦 آرشیو';
        
        // به‌روزرسانی تگ‌ها
        this.updateNoteTags();
        
        // اسکرول به بالا
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    deleteNote(noteId, permanent = false) {
        const note = this.notes.get(noteId);
        if (!note) return false;
        
        if (permanent) {
            // حذف دائمی
            this.notes.delete(noteId);
            
            // حذف از تگ‌ها
            note.tags.forEach(tag => {
                if (this.tags.has(tag)) {
                    this.tags.get(tag).delete(noteId);
                    if (this.tags.get(tag).size === 0) {
                        this.tags.delete(tag);
                    }
                }
            });
            
            this.showNotification('یادداشت حذف شد', 'info');
        } else {
            // انتقال به سطل زباله
            note.isDeleted = true;
            note.deletedAt = new Date().toISOString();
            this.showNotification('یادداشت به سطل زباله منتقل شد', 'info');
        }
        
        // اگر یادداشت فعلی حذف شد، ویرایشگر را پاک کن
        if (this.currentNote && this.currentNote.id === noteId) {
            this.clearEditor();
            this.currentNote = null;
        }
        
        this.renderNotes();
        this.saveToStorage();
        return true;
    }
    
    restoreNote(noteId) {
        const note = this.notes.get(noteId);
        if (!note || !note.isDeleted) return false;
        
        note.isDeleted = false;
        note.deletedAt = null;
        note.restoredAt = new Date().toISOString();
        
        this.showNotification('یادداشت بازیابی شد', 'success');
        this.renderNotes();
        this.saveToStorage();
        return true;
    }
    
    toggleStar() {
        if (!this.currentNote) return;
        
        const note = this.notes.get(this.currentNote.id);
        if (!note) return;
        
        note.isStarred = !note.isStarred;
        note.updatedAt = new Date().toISOString();
        
        const starBtn = document.querySelector('[data-action="star"]');
        starBtn.textContent = note.isStarred ? '★ ستاره‌دار' : '☆ ستاره';
        
        this.showNotification(note.isStarred ? 'ستاره‌دار شد' : 'ستاره برداشته شد', 'info');
        this.saveToStorage();
        this.renderNotes();
    }
    
    toggleArchive() {
        if (!this.currentNote) return;
        
        const note = this.notes.get(this.currentNote.id);
        if (!note) return;
        
        note.isArchived = !note.isArchived;
        note.updatedAt = new Date().toISOString();
        
        const archiveBtn = document.querySelector('[data-action="archive"]');
        archiveBtn.textContent = note.isArchived ? '📦 خارج از آرشیو' : '📦 آرشیو';
        
        this.showNotification(note.isArchived ? 'آرشیو شد' : 'از آرشیو خارج شد', 'info');
        this.saveToStorage();
        this.renderNotes();
    }
    
    addTagToNote() {
        if (!this.currentNote) {
            this.showNotification('ابتدا یک یادداشت ایجاد یا انتخاب کنید', 'warning');
            return;
        }
        
        const tagInput = document.getElementById('tag-input');
        const tag = tagInput.value.trim();
        
        if (!tag) {
            this.showNotification('لطفاً یک برچسب وارد کنید', 'warning');
            return;
        }
        
        const note = this.notes.get(this.currentNote.id);
        if (!note) return;
        
        // جلوگیری از تگ‌های تکراری
        if (note.tags.includes(tag)) {
            this.showNotification('این برچسب قبلاً اضافه شده', 'info');
            tagInput.value = '';
            return;
        }
        
        // اضافه کردن تگ
        note.tags.push(tag);
        note.updatedAt = new Date().toISOString();
        
        // به‌روزرسانی ایندکس تگ‌ها
        if (!this.tags.has(tag)) {
            this.tags.set(tag, new Set());
        }
        this.tags.get(tag).add(note.id);
        
        // به‌روزرسانی UI
        this.updateNoteTags();
        this.updateTagsCloud();
        tagInput.value = '';
        
        this.showNotification(\`برچسب "\${tag}" اضافه شد\`, 'success');
        this.saveToStorage();
    }
    
    removeTagFromNote(tag) {
        if (!this.currentNote) return;
        
        const note = this.notes.get(this.currentNote.id);
        if (!note) return;
        
        // حذف تگ از یادداشت
        const index = note.tags.indexOf(tag);
        if (index > -1) {
            note.tags.splice(index, 1);
            note.updatedAt = new Date().toISOString();
        }
        
        // حذف از ایندکس تگ‌ها
        if (this.tags.has(tag)) {
            this.tags.get(tag).delete(note.id);
            if (this.tags.get(tag).size === 0) {
                this.tags.delete(tag);
            }
        }
        
        // به‌روزرسانی UI
        this.updateNoteTags();
        this.updateTagsCloud();
        
        this.showNotification(\`برچسب "\${tag}" حذف شد\`, 'info');
        this.saveToStorage();
    }
    
    updateNoteTags() {
        const container = document.getElementById('note-tags');
        if (!container) return;
        
        if (!this.currentNote) {
            container.innerHTML = '';
            return;
        }
        
        const note = this.notes.get(this.currentNote.id);
        if (!note) {
            container.innerHTML = '';
            return;
        }
        
        container.innerHTML = note.tags.map(tag => \`
            <span class="note-tag">
                \${tag}
                <button class="remove-tag" onclick="noteApp.removeTagFromNote('\${tag}')">×</button>
            </span>
        \`).join('');
    }
    
    searchNotes() {
        const query = this.searchQuery.toLowerCase().trim();
        
        if (!query) {
            this.renderNotes();
            return;
        }
        
        const results = Array.from(this.notes.values()).filter(note => {
            if (note.isDeleted && !this.filterDeleted) return false;
            if (note.isArchived && !this.filterArchived) return false;
            
            return note.title.toLowerCase().includes(query) ||
                   note.content.toLowerCase().includes(query) ||
                   note.tags.some(tag => tag.toLowerCase().includes(query)) ||
                   note.category.toLowerCase().includes(query);
        });
        
        this.renderNotes(results);
        this.showNotification(\`\${results.length} نتیجه برای "\${query}" یافت شد\`, 'info');
    }
    
    clearSearch() {
        document.getElementById('search-input').value = '';
        this.searchQuery = '';
        this.renderNotes();
    }
    
    renderNotes(notesToRender = null) {
        const container = document.getElementById('notes-container');
        const emptyState = document.getElementById('empty-state');
        
        let notes = notesToRender || Array.from(this.notes.values());
        
        // اعمال فیلترها
        notes = notes.filter(note => {
            if (note.isDeleted && !this.filterDeleted) return false;
            if (note.isArchived && !this.filterArchived) return false;
            if (this.filterStarred && !note.isStarred) return false;
            if (this.filterCategory && note.category !== this.filterCategory) return false;
            if (this.filterTags.size > 0 && !Array.from(this.filterTags).every(tag => note.tags.includes(tag))) {
                return false;
            }
            return true;
        });
        
        if (notes.length === 0) {
            container.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }
        
        emptyState.style.display = 'none';
        
        // مرتب‌سازی بر اساس تاریخ به‌روزرسانی (جدیدترین اول)
        notes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        
        let html = '';
        
        if (this.currentView === 'grid') {
            html = '<div class="notes-grid">';
            notes.forEach(note => {
                html += this.createNoteCard(note);
            });
            html += '</div>';
        } else if (this.currentView === 'list') {
            html = '<div class="notes-list">';
            notes.forEach(note => {
                html += this.createNoteListItem(note);
            });
            html += '</div>';
        } else {
            html = '<div class="notes-compact">';
            notes.forEach(note => {
                html += this.createNoteCompact(note);
            });
            html += '</div>';
        }
        
        container.innerHTML = html;
        
        // اضافه کردن رویداد به کارت‌ها
        container.querySelectorAll('.note-card').forEach(card => {
            const noteId = card.dataset.id;
            card.addEventListener('click', () => this.loadNote(noteId));
        });
    }
    
    createNoteCard(note) {
        const date = new Date(note.updatedAt).toLocaleDateString('fa-IR');
        const time = new Date(note.updatedAt).toLocaleTimeString('fa-IR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        let cardClasses = 'note-card';
        if (note.isStarred) cardClasses += ' starred';
        if (note.isArchived) cardClasses += ' archived';
        if (note.isDeleted) cardClasses += ' deleted';
        
        return \`
            <div class="\${cardClasses}" data-id="\${note.id}">
                \${note.isStarred ? '<div class="star-badge">⭐</div>' : ''}
                \${note.isArchived ? '<div class="archive-badge">📦</div>' : ''}
                
                <h3 class="note-card-title">\${note.title || 'بدون عنوان'}</h3>
                
                <div class="note-card-preview">
                    \${note.content.substring(0, 150)}\${note.content.length > 150 ? '...' : ''}
                </div>
                
                <div class="note-card-meta">
                    <span class="note-category">\${note.category}</span>
                    <span class="note-date">\${date} - \${time}</span>
                </div>
                
                \${note.tags.length > 0 ? \`
                    <div class="note-card-tags">
                        \${note.tags.slice(0, 3).map(tag => \`<span class="note-tag-small">\${tag}</span>\`).join('')}
                        \${note.tags.length > 3 ? '<span class="more-tags">+' + (note.tags.length - 3) + '</span>' : ''}
                    </div>
                \` : ''}
                
                <div class="note-card-actions">
                    <button class="action-btn" onclick="event.stopPropagation(); noteApp.deleteNote('\${note.id}')">
                        🗑️ حذف
                    </button>
                    <button class="action-btn" onclick="event.stopPropagation(); noteApp.toggleNoteArchive('\${note.id}')">
                        \${note.isArchived ? '📤 خارج' : '📦 آرشیو'}
                    </button>
                    <button class="action-btn" onclick="event.stopPropagation(); noteApp.toggleNoteStar('\${note.id}')">
                        \${note.isStarred ? '☆' : '⭐'}
                    </button>
                </div>
            </div>
        \`;
    }
    
    createNoteListItem(note) {
        const date = new Date(note.updatedAt).toLocaleDateString('fa-IR');
        
        return \`
            <div class="note-list-item" data-id="\${note.id}">
                <div class="list-item-main">
                    <h4>\${note.title || 'بدون عنوان'}</h4>
                    <p>\${note.content.substring(0, 100)}...</p>
                </div>
                <div class="list-item-meta">
                    <span>\${note.category}</span>
                    <span>\${date}</span>
                </div>
            </div>
        \`;
    }
    
    createNoteCompact(note) {
        return \`
            <div class="note-compact-item" data-id="\${note.id}">
                <span>\${note.isStarred ? '⭐ ' : ''}\${note.title || 'بدون عنوان'}</span>
                <span>\${new Date(note.updatedAt).toLocaleDateString('fa-IR')}</span>
            </div>
        \`;
    }
    
    updateCategoriesList() {
        const container = document.getElementById('categories-list');
        const select = document.getElementById('note-category');
        
        if (!container && !select) return;
        
        let listHTML = '';
        let selectHTML = '<option value="">همه دسته‌بندی‌ها</option>';
        
        this.categories.forEach(category => {
            listHTML += \`
                <li class="\${this.filterCategory === category ? 'active' : ''}" 
                    onclick="noteApp.filterByCategory('\${category}')">
                    \${category}
                    <span class="category-count">\${this.getNotesByCategory(category).length}</span>
                </li>
            \`;
            
            selectHTML += \`<option value="\${category}">\${category}</option>\`;
        });
        
        if (container) container.innerHTML = listHTML;
        if (select) select.innerHTML = selectHTML;
    }
    
    updateTagsCloud() {
        const container = document.getElementById('tags-cloud');
        if (!container) return;
        
        const tags = Array.from(this.tags.entries())
            .map(([tag, noteSet]) => ({
                name: tag,
                count: noteSet.size,
                size: Math.min(20 + (noteSet.size * 2), 40) // اندازه بر اساس تعداد
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 20); // فقط ۲۰ تگ برتر
        
        container.innerHTML = tags.map(tag => \`
            <span class="tag-cloud-item" 
                  style="font-size: \${tag.size}px; opacity: \${0.5 + (tag.count / Math.max(...tags.map(t => t.count)) * 0.5)}"
                  onclick="noteApp.filterByTag('\${tag.name}')"
                  title="\${tag.count} یادداشت">
                \${tag.name}
            </span>
        \`).join(' ');
    }
    
    updateStats() {
        const container = document.getElementById('app-stats');
        if (!container) return;
        
        const notes = Array.from(this.notes.values());
        const activeNotes = notes.filter(n => !n.isDeleted && !n.isArchived);
        const wordCount = notes.reduce((sum, n) => sum + (n.content.split(/\\s+/).length || 0), 0);
        const charCount = notes.reduce((sum, n) => sum + n.content.length, 0);
        
        container.innerHTML = \`
            <p>تعداد یادداشت‌ها: <strong>\${notes.length}</strong></p>
            <p>یادداشت‌های فعال: <strong>\${activeNotes.length}</strong></p>
            <p>کلمات: <strong>\${wordCount}</strong></p>
            <p>کاراکترها: <strong>\${charCount}</strong></p>
            <p>دسته‌بندی‌ها: <strong>\${this.categories.size}</strong></p>
            <p>برچسب‌ها: <strong>\${this.tags.size}</strong></p>
        \`;
    }
    
    filterByCategory(category) {
        this.filterCategory = this.filterCategory === category ? '' : category;
        this.updateCategoriesList();
        this.renderNotes();
    }
    
    filterByTag(tag) {
        if (this.filterTags.has(tag)) {
            this.filterTags.delete(tag);
        } else {
            this.filterTags.add(tag);
        }
        this.renderNotes();
    }
    
    toggleStarFilter() {
        this.filterStarred = !this.filterStarred;
        this.renderNotes();
    }
    
    toggleArchiveFilter() {
        this.filterArchived = !this.filterArchived;
        this.renderNotes();
    }
    
    toggleDeletedFilter() {
        this.filterDeleted = !this.filterDeleted;
        this.renderNotes();
    }
    
    getNotesByCategory(category) {
        return Array.from(this.notes.values()).filter(note => note.category === category);
    }
    
    exportNotes() {
        const notes = Array.from(this.notes.values())
            .filter(n => !n.isDeleted)
            .map(n => ({
                title: n.title,
                content: n.content,
                category: n.category,
                tags: n.tags,
                created: n.createdAt,
                updated: n.updatedAt
            }));
        
        const data = {
            app: '${this.name}',
            version: '${this.version}',
            exportDate: new Date().toISOString(),
            notes: notes
        };
        
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = \`notes_export_\${new Date().getTime()}.json\`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification(\`\${notes.length} یادداشت صادر شد\`, 'success');
    }
    
    importNotes(file) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (!data.notes || !Array.isArray(data.notes)) {
                    throw new Error('فرمت فایل نامعتبر است');
                }
                
                let imported = 0;
                data.notes.forEach(noteData => {
                    const noteId = this.generateId('note');
                    const note = {
                        id: noteId,
                        title: noteData.title || '',
                        content: noteData.content || '',
                        category: noteData.category || 'وارد شده',
                        tags: noteData.tags || [],
                        isStarred: false,
                        isArchived: false,
                        isDeleted: false,
                        createdAt: noteData.created || new Date().toISOString(),
                        updatedAt: noteData.updated || new Date().toISOString(),
                        version: 1
                    };
                    
                    this.notes.set(noteId, note);
                    
                    // اضافه کردن تگ‌ها به ایندکس
                    note.tags.forEach(tag => {
                        if (!this.tags.has(tag)) {
                            this.tags.set(tag, new Set());
                        }
                        this.tags.get(tag).add(noteId);
                    });
                    
                    // اضافه کردن دسته‌بندی
                    this.categories.add(note.category);
                    
                    imported++;
                });
                
                this.saveToStorage();
                this.render();
                this.showNotification(\`\${imported} یادداشت وارد شد\`, 'success');
                
            } catch (error) {
                this.showNotification(\`خطا در وارد کردن: \${error.message}\`, 'error');
                console.error('خطای واردات:', error);
            }
        };
        
        reader.readAsText(file);
    }
    
    openSettings() {
        // پیاده‌سازی مدال تنظیمات
        this.showNotification('بخش تنظیمات به زودی اضافه می‌شود', 'info');
    }
    
    showHelp() {
        const helpContent = \`
            <h2>📖 راهنمای استفاده</h2>
            <p><strong>ایجاد یادداشت جدید:</strong> دکمه + جدید یا Ctrl+N</p>
            <p><strong>ذخیره:</strong> دکمه 💾 یا Ctrl+S</p>
            <p><strong>جستجو:</strong> جعبه جستجو یا Ctrl+F</p>
            <p><strong>ستاره‌دار کردن:</strong> دکمه ⭐ در ویرایشگر</p>
            <p><strong>آرشیو:</strong> دکمه 📦 در ویرایشگر</p>
            <p><strong>برچسب‌ها:</strong> با + در ویرایشگر اضافه کنید</p>
            <p><strong>صادرات:</strong> دکمه 📤 در فوتر</p>
        \`;
        
        this.showModal('راهنما', helpContent);
    }
    
    showModal(title, content) {
        // پیاده‌سازی مدال
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = \`
            <div class="modal-content">
                <h2>\${title}</h2>
                <div>\${content}</div>
                <button onclick="this.closest('.modal').remove()">بستن</button>
            </div>
        \`;
        
        document.body.appendChild(modal);
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = \`notification \${type}\`;
        notification.textContent = message;
        
        notification.style.cssText = \`
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 24px;
            background: \${type === 'success' ? '#4CAF50' : type === 'error' ? '#F44336' : type === 'warning' ? '#FF9800' : '#2196F3'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        \`;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('collapsed');
    }
    
    clearEditor() {
        document.getElementById('note-title').value = '';
        document.getElementById('note-content').value = '';
        document.getElementById('note-category').value = 'شخصی';
        document.getElementById('tag-input').value = '';
        document.getElementById('note-tags').innerHTML = '';
        
        const starBtn = document.querySelector('[data-action="star"]');
        const archiveBtn = document.querySelector('[data-action="archive"]');
        
        starBtn.textContent = '☆ ستاره';
        archiveBtn.textContent = '📦 آرشیو';
    }
    
    hasUnsavedChanges() {
        if (!this.currentNote) return false;
        
        const currentTitle = document.getElementById('note-title').value.trim();
        const currentContent = document.getElementById('note-content').value.trim();
        
        const note = this.notes.get(this.currentNote.id);
        if (!note) return true; // یادداشت جدید
        
        return currentTitle !== note.title || currentContent !== note.content;
    }
    
    autoSave() {
        if (!this.autoSaveTimer) {
            this.autoSaveTimer = setTimeout(() => {
                if (this.currentNote && this.hasUnsavedChanges()) {
                    this.saveCurrentNote();
                }
                this.autoSaveTimer = null;
            }, 2000); // ۲ ثانیه تاخیر
        }
    }
    
    debouncedSearch = this.debounce(() => {
        this.searchNotes();
    }, 300);
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    generateId(prefix = 'item') {
        return \`\${prefix}_\${Date.now()}_\${Math.random().toString(36).substr(2, 9)}\`;
    }
    
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                await navigator.serviceWorker.register('service-worker.js');
                console.log('✅ Service Worker ثبت شد');
            } catch (error) {
                console.error('❌ خطا در ثبت Service Worker:', error);
            }
        }
    }
    
    render() {
        this.renderNotes();
        this.updateCategoriesList();
        this.updateTagsCloud();
        this.updateStats();
    }
    
    // متدهای کمکی برای استفاده در HTML
    toggleNoteStar(noteId) {
        const note = this.notes.get(noteId);
        if (note) {
            note.isStarred = !note.isStarred;
            this.saveToStorage();
            this.renderNotes();
        }
    }
    
    toggleNoteArchive(noteId) {
        const note = this.notes.get(noteId);
        if (note) {
            note.isArchived = !note.isArchived;
            this.saveToStorage();
            this.renderNotes();
        }
    }
}

// ایجاد نمونه اصلی
const noteApp = new NoteAppManager();

// صادر کردن برای استفاده در HTML
window.noteApp = noteApp;

// اضافه کردن استایل‌های انیمیشن
const style = document.createElement('style');
style.textContent = \`
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .sidebar.collapsed {
        transform: translateX(-100%);
        opacity: 0;
        width: 0;
        padding: 0;
        overflow: hidden;
    }
\`;
document.head.appendChild(style);

console.log('🚀 ${this.name} آماده استفاده است');
`;
    }
}

// ==================== ۲. اپ ماشین حساب مهندسی ====================
class CalculatorApp extends MobileApp {
    constructor(config = {}) {
        super({
            name: 'ماشین حساب مهندسی',
            version: '2.0.0',
            icon: '🧮',
            category: 'ابزار',
            description: 'ماشین حساب پیشرفته با قابلیت‌های مهندسی و مالی',
            ...config
        });
        
        this.history = [];
        this.memory = 0;
        this.constants = {
            'π': Math.PI,
            'e': Math.E,
            'φ': 1.618033988749895, // نسبت طلایی
            'G': 6.67430e-11, // ثابت گرانش
            'c': 299792458 // سرعت نور
        };
        
        this.init();
    }
    
    init() {
        this.components = [
            this.createComponent('display', 'نمایشگر پیشرفته', [
                '۱۲ رقم',
                'نمایش نماد علمی',
                'تاریخچه نمایش',
                'حافظه نمایش'
            ], { precision: 12, scientific: true }),
            
            this.createComponent('keypad', 'صفحه کلید مهندسی', [
                'اعمال پایه',
                'توابع مثلثاتی',
                'لگاریتم و نمایی',
                'ریشه و توان',
                'ثوابت'
            ], { layout: 'engineering', haptic: true }),
            
            this.createComponent('converter', 'مبدل واحد', [
                'طول',
                'وزن',
                'دما',
                'سرعت',
                'مساحت',
                'حجم'
            ], { categories: 6, favorites: true }),
            
            this.createComponent('history', 'تاریخچه محاسبات', [
                'ذخیره ۱۰۰ عملیات',
                'بازیابی',
                'پاک کردن انتخابی',
                'صادرات'
            ], { maxEntries: 100, autoSave: true }),
            
            this.createComponent('solver', 'حل‌کننده معادلات', [
                'معادلات خطی',
                'درجه دو',
                'انتگرال',
                'مشتق'
            ], { steps: true, explanations: true })
        ];
    }
    
    calculate(expression) {
        try {
            // ثبت زمان شروع
            const startTime = Date.now();
            
            // پیش‌پردازش عبارت
            let processedExpr = this.preprocessExpression(expression);
            
            // اعتبارسنجی
            if (!this.validateExpression(processedExpr)) {
                throw new Error('عبارت نامعتبر است');
            }
            
            // محاسبه
            const result = this.evaluateExpression(processedExpr);
            
            // ثبت در تاریخچه
            const calculation = {
                id: this.generateId('calc'),
                expression: expression,
                result: result,
                timestamp: new Date().toISOString(),
                processingTime: Date.now() - startTime
            };
            
            this.history.unshift(calculation);
            if (this.history.length > 100) {
                this.history.pop();
            }
            
            this.log('محاسبه انجام شد', {
                expression,
                result,
                time: calculation.processingTime
            });
            
            return {
                success: true,
                result: result,
                calculation: calculation
            };
            
        } catch (error) {
            const errorResult = this.error('خطای محاسبه', {
                expression,
                error: error.message
            });
            
            return {
                success: false,
                error: error.message,
                details: errorResult
            };
        }
    }
    
    preprocessExpression(expr) {
        let processed = expr
            // جایگزینی نمادهای فارسی/عربی
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/،/g, '.')
            .replace(/,/g, '.')
            
            // جایگزینی ثوابت
            .replace(/π/g, 'Math.PI')
            .replace(/پی/g, 'Math.PI')
            .replace(/e/g, 'Math.E')
            .replace(/φ/g, '1.618033988749895')
            .replace(/طلایی/g, '1.618033988749895')
            
            // جایگزینی توابع
            .replace(/sin/g, 'Math.sin')
            .replace(/cos/g, 'Math.cos')
            .replace(/tan/g, 'Math.tan')
            .replace(/cot/g, '1/Math.tan')
            .replace(/sec/g, '1/Math.cos')
            .replace(/csc/g, '1/Math.sin')
            
            .replace(/asin/g, 'Math.asin')
            .replace(/acos/g, 'Math.acos')
            .replace(/atan/g, 'Math.atan')
            
            .replace(/sinh/g, 'Math.sinh')
            .replace(/cosh/g, 'Math.cosh')
            .replace(/tanh/g, 'Math.tanh')
            
            .replace(/log/g, 'Math.log10')
            .replace(/ln/g, 'Math.log')
            .replace(/exp/g, 'Math.exp')
            
            .replace(/√/g, 'Math.sqrt')
            .replace(/³√/g, 'Math.cbrt')
            .replace(/²/g, '**2')
            .replace(/³/g, '**3')
            .replace(/\^/g, '**')
            
            // درصد
            .replace(/%/g, '/100')
            
            // فاکتوریل
            .replace(/!/g, this.factorial.toString());
        
        // تبدیل درجه به رادیان برای توابع مثلثاتی
        processed = processed.replace(/(Math\.(sin|cos|tan))\(([^)]+)\)/g, (match, func, trig, angle) => {
            return \`\${func}(\${angle} * Math.PI / 180)\`;
        });
        
        return processed;
    }
    
    validateExpression(expr) {
        // جلوگیری از کدهای خطرناک
        const dangerousPatterns = [
            /eval\(/i,
            /Function\(/i,
            /setTimeout\(/i,
            /setInterval\(/i,
            /document\./i,
            /window\./i,
            /localStorage\./i,
            /alert\(/i,
            /prompt\(/i,
            /confirm\(/i
        ];
        
        for (const pattern of dangerousPatterns) {
            if (pattern.test(expr)) {
                return false;
            }
        }
        
        // بررسی پرانتزهای متوازن
        let balance = 0;
        for (const char of expr) {
            if (char === '(') balance++;
            if (char === ')') balance--;
            if (balance < 0) return false;
        }
        if (balance !== 0) return false;
        
        // بررسی کاراکترهای مجاز
        const allowedChars = /^[0-9+\-*/.()\sπeφطلاییسینکستانژلوگاکسپ√^!%sin costan cotseccscasincosatanatanhcoshsinhatanhlogln expMath\.PIE]+$/;
        
        return allowedChars.test(expr.replace(/\s+/g, ''));
    }
    
    evaluateExpression(expr) {
        try {
            // استفاده از Function برای محدود کردن دسترسی
            const result = Function('"use strict"; return (' + expr + ')')();
            
            // گرد کردن
            const rounded = Math.round(result * 1000000000000) / 1000000000000;
            
            // بررسی برای بی‌نهایت و NaN
            if (!isFinite(rounded)) {
                throw new Error('نتیجه نامتناهی است');
            }
            
            if (isNaN(rounded)) {
                throw new Error('نتیجه تعریف نشده است');
            }
            
            return rounded;
        } catch (error) {
            throw new Error(\`خطا در ارزیابی: \${error.message}\`);
        }
    }
    
    factorial(n) {
        if (n < 0) throw new Error('فاکتوریل برای اعداد منفی تعریف نشده');
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }
    
    memoryStore(value) {
        this.memory = value;
        this.log('حافظه ذخیره شد', { value });
        return this.memory;
    }
    
    memoryRecall() {
        this.log('حافظه بازیابی شد', { value: this.memory });
        return this.memory;
    }
    
    memoryClear() {
        this.memory = 0;
        this.log('حافظه پاک شد');
        return 0;
    }
    
    memoryAdd(value) {
        this.memory += value;
        this.log('به حافظه اضافه شد', { added: value, newValue: this.memory });
        return this.memory;
    }
    
    memorySubtract(value) {
        this.memory -= value;
        this.log('از حافظه کم شد', { subtracted: value, newValue: this.memory });
        return this.memory;
    }
    
    convertUnit(value, fromUnit, toUnit, category) {
        const converters = {
            'length': {
                'mm': 0.001,
                'cm': 0.01,
                'm': 1,
                'km': 1000,
                'inch': 0.0254,
                'foot': 0.3048,
                'yard': 0.9144,
                'mile': 1609.344
            },
            'weight': {
                'mg': 0.000001,
                'g': 0.001,
                'kg': 1,
                'ton': 1000,
                'ounce': 0.0283495,
                'pound': 0.453592
            },
            'temperature': {
                'celsius': 'c',
                'fahrenheit': 'f',
                'kelvin': 'k'
            },
            'area': {
                'mm²': 0.000001,
                'cm²': 0.0001,
                'm²': 1,
                'km²': 1000000,
                'hectare': 10000,
                'acre': 4046.86
            },
            'volume': {
                'ml': 0.001,
                'liter': 1,
                'm³': 1000,
                'gallon': 3.78541,
                'pint': 0.473176
            },
            'speed': {
                'm/s': 1,
                'km/h': 0.277778,
                'mph': 0.44704,
                'knot': 0.514444
            }
        };
        
        const conversionTable = converters[category];
        if (!conversionTable) {
            throw new Error(\`دسته \${category} پشتیبانی نمی‌شود\`);
        }
        
        if (!conversionTable[fromUnit] || !conversionTable[toUnit]) {
            throw new Error('واحد نامعتبر');
        }
        
        // تبدیل دما (ویژه)
        if (category === 'temperature') {
            let result;
            if (fromUnit === 'celsius' && toUnit === 'fahrenheit') {
                result = (value * 9/5) + 32;
            } else if (fromUnit === 'fahrenheit' && toUnit === 'celsius') {
                result = (value - 32) * 5/9;
            } else if (fromUnit === 'celsius' && toUnit === 'kelvin') {
                result = value + 273.15;
            } else if (fromUnit === 'kelvin' && toUnit === 'celsius') {
                result = value - 273.15;
            } else if (fromUnit === 'fahrenheit' && toUnit === 'kelvin') {
                result = (value - 32) * 5/9 + 273.15;
            } else if (fromUnit === 'kelvin' && toUnit === 'fahrenheit') {
                result = (value - 273.15) * 9/5 + 32;
            } else {
                result = value;
            }
            
            return {
                value: result,
                from: { unit: fromUnit, value },
                to: { unit: toUnit, value: result },
                category
            };
        }
        
        // تبدیل سایر واحدها
        const baseValue = value * conversionTable[fromUnit];
        const result = baseValue / conversionTable[toUnit];
        
        return {
            value: result,
            from: { unit: fromUnit, value },
            to: { unit: toUnit, value: result },
            category,
            ratio: conversionTable[fromUnit] / conversionTable[toUnit]
        };
    }
    
    solveLinear(a, b) {
        if (a === 0) {
            throw new Error('ضریب x نمی‌تواند صفر باشد');
        }
        
        const solution = -b / a;
        
        return {
            equation: \`\${a}x + \${b} = 0\`,
            solution: solution,
            steps: [
                \`\${a}x = -\${b}\`,
                \`x = -\${b} / \${a}\`,
                \`x = \${solution}\`
            ]
        };
    }
    
    solveQuadratic(a, b, c) {
        if (a === 0) {
            return this.solveLinear(b, c);
        }
        
        const discriminant = b * b - 4 * a * c;
        
        if (discriminant < 0) {
            const realPart = -b / (2 * a);
            const imaginaryPart = Math.sqrt(-discriminant) / (2 * a);
            
            return {
                equation: \`\${a}x² + \${b}x + \${c} = 0\`,
                discriminant: discriminant,
                type: 'مختلط',
                solutions: [
                    \`\${realPart} + \${imaginaryPart}i\`,
                    \`\${realPart} - \${imaginaryPart}i\`
                ],
                steps: [
                    \`Δ = b² - 4ac = \${b}² - 4×\${a}×\${c} = \${discriminant}\`,
                    'Δ < 0 → ریشه‌ها مختلط هستند',
                    \`x = [-b ± √(Δ)] / 2a = [-\${b} ± √(\${discriminant})] / (2×\${a})\`,
                    \`x₁ = \${realPart} + \${imaginaryPart}i\`,
                    \`x₂ = \${realPart} - \${imaginaryPart}i\`
                ]
            };
        } else if (discriminant === 0) {
            const solution = -b / (2 * a);
            
            return {
                equation: \`\${a}x² + \${b}x + \${c} = 0\`,
                discriminant: discriminant,
                type: 'حقیقی و مساوی',
                solutions: [solution, solution],
                steps: [
                    \`Δ = b² - 4ac = \${b}² - 4×\${a}×\${c} = \${discriminant}\`,
                    'Δ = 0 → ریشه‌ها حقیقی و مساوی هستند',
                    \`x = -b / 2a = -\${b} / (2×\${a})\`,
                    \`x = \${solution}\`
                ]
            };
        } else {
            const sqrtDiscriminant = Math.sqrt(discriminant);
            const solution1 = (-b + sqrtDiscriminant) / (2 * a);
            const solution2 = (-b - sqrtDiscriminant) / (2 * a);
            
            return {
                equation: \`\${a}x² + \${b}x + \${c} = 0\`,
                discriminant: discriminant,
                type: 'حقیقی و متمایز',
                solutions: [solution1, solution2],
                steps: [
                    \`Δ = b² - 4ac = \${b}² - 4×\${a}×\${c} = \${discriminant}\`,
                    'Δ > 0 → ریشه‌ها حقیقی و متمایز هستند',
                    \`x = [-b ± √(Δ)] / 2a = [-\${b} ± √(\${discriminant})] / (2×\${a})\`,
                    \`x₁ = [-\${b} + \${sqrtDiscriminant}] / \${2 * a} = \${solution1}\`,
                    \`x₂ = [-\${b} - \${sqrtDiscriminant}] / \${2 * a} = \${solution2}\`
                ]
            };
        }
    }
    
    getHistory() {
        return {
            count: this.history.length,
            calculations: this.history,
            stats: {
                successful: this.history.filter(h => h.success !== false).length,
                errors: this.history.filter(h => h.success === false).length,
                avgTime: this.history.length > 0 
                    ? this.history.reduce((sum, h) => sum + h.processingTime, 0) / this.history.length
                    : 0
            }
        };
    }
    
    clearHistory() {
        const count = this.history.length;
        this.history = [];
        this.log('تاریخچه پاک شد', { count });
        return count;
    }
    
    exportHistory(format = 'json') {
        const data = {
            app: this.name,
            version: this.version,
            exportDate: new Date().toISOString(),
            calculations: this.history
        };
        
        if (format === 'json') {
            return JSON.stringify(data, null, 2);
        } else if (format === 'csv') {
            let csv = 'تاریخ,عبارت,نتیجه,زمان(میلی‌ثانیه)\\n';
            this.history.forEach(calc => {
                csv += \`\${calc.timestamp},\${calc.expression},\${calc.result},\${calc.processingTime}\\n\`;
            });
            return csv;
        } else if (format === 'html') {
            let html = \`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>تاریخچه محاسبات</title>
                    <style>
                        body { font-family: Vazirmatn; direction: rtl; padding: 20px; }
                        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                        th, td { border: 1px solid #ddd; padding: 12px; text-align: right; }
                        th { background: #4CAF50; color: white; }
                        tr:nth-child(even) { background: #f2f2f2; }
                    </style>
                </head>
                <body>
                    <h1>تاریخچه محاسبات</h1>
                    <p>تعداد: \${this.history.length} محاسبه | تاریخ صادرات: \${new Date().toLocaleDateString('fa-IR')}</p>
                    <table>
                        <tr>
                            <th>ردیف</th>
                            <th>تاریخ</th>
                            <th>عبارت</th>
                            <th>نتیجه</th>
                            <th>زمان (میلی‌ثانیه)</th>
                        </tr>
            \`;
            
            this.history.forEach((calc, index) => {
                html += \`
                    <tr>
                        <td>\${index + 1}</td>
                        <td>\${new Date(calc.timestamp).toLocaleString('fa-IR')}</td>
                        <td>\${calc.expression}</td>
                        <td>\${calc.result}</td>
                        <td>\${calc.processingTime}</td>
                    </tr>
                \`;
            });
            
            html += '</table></body></html>';
            return html;
        }
        
        throw new Error(\`فرمت \${format} پشتیبانی نمی‌شود\`);
    }
    
    generateHTML() {
        // کد HTML برای ماشین حساب
        return `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.name}</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="calculator-app">
        <!-- نمایشگر -->
        <div class="display">
            <div class="expression" id="expression"></div>
            <div class="result" id="result">0</div>
            <div class="memory-indicator" id="memory-indicator"></div>
        </div>
        
        <!-- صفحه کلید -->
        <div class="keypad">
            <!-- ردیف ۱: حافظه و توابع پیشرفته -->
            <button class="btn mem-btn" data-action="mc">MC</button>
            <button class="btn mem-btn" data-action="mr">MR</button>
            <button class="btn mem-btn" data-action="m+">M+</button>
            <button class="btn mem-btn" data-action="m-">M-</button>
            <button class="btn func-btn" data-action="clear">C</button>
            <button class="btn func-btn" data-action="clear-all">AC</button>
            <button class="btn func-btn" data-action="backspace">⌫</button>
            <button class="btn op-btn" data-action="/">÷</button>
            
            <!-- ردیف ۲: توابع علمی -->
            <button class="btn sci-btn" data-action="sin">sin</button>
            <button class="btn sci-btn" data-action="cos">cos</button>
            <button class="btn sci-btn" data-action="tan">tan</button>
            <button class="btn sci-btn" data-action="log">log</button>
            <button class="btn num-btn" data-action="7">7</button>
            <button class="btn num-btn" data-action="8">8</button>
            <button class="btn num-btn" data-action="9">9</button>
            <button class="btn op-btn" data-action="*">×</button>
            
            <!-- ردیف ۳: توابع علمی بیشتر -->
            <button class="btn sci-btn" data-action="asin">sin⁻¹</button>
            <button class="btn sci-btn" data-action="acos">cos⁻¹</button>
            <button class="btn sci-btn" data-action="atan">tan⁻¹</button>
            <button class="btn sci-btn" data-action="ln">ln</button>
            <button class="btn num-btn" data-action="4">4</button>
            <button class="btn num-btn" data-action="5">5</button>
            <button class="btn num-btn" data-action="6">6</button>
            <button class="btn op-btn" data-action="-">−</button>
            
            <!-- ردیف ۴: ثوابت و توابع -->
            <button class="btn const-btn" data-action="pi">π</button>
            <button class="btn const-btn" data-action="e">e</button>
            <button class="btn sci-btn" data-action="sqrt">√</button>
            <button class="btn sci-btn" data-action="power">xʸ</button>
            <button class="btn num-btn" data-action="1">1</button>
            <button class="btn num-btn" data-action="2">2</button>
            <button class="btn num-btn" data-action="3">3</button>
            <button class="btn op-btn" data-action="+">+</button>
            
            <!-- ردیف ۵: ویژه -->
            <button class="btn sci-btn" data-action="factorial">x!</button>
            <button class="btn sci-btn" data-action="percent">%</button>
            <button class="btn num-btn" data-action="0">0</button>
            <button class="btn num-btn" data-action=".">.</button>
            <button class="btn eq-btn" data-action="=">=</button>
        </div>
        
        <!-- تب‌های اضافی -->
        <div class="tabs">
            <button class="tab-btn active" data-tab="converter">🔄 مبدل</button>
            <button class="tab-btn" data-tab="history">📜 تاریخچه</button>
            <button class="tab-btn" data-tab="solver">🧮 حل معادله</button>
            <button class="tab-btn" data-tab="settings">⚙️ تنظیمات</button>
        </div>
        
        <!-- محتوای تب‌ها -->
        <div class="tab-content">
            <div class="tab-pane active" id="converter-tab">
                <!-- محتوای مبدل واحد -->
            </div>
            <div class="tab-pane" id="history-tab">
                <!-- تاریخچه محاسبات -->
            </div>
            <div class="tab-pane" id="solver-tab">
                <!-- حل معادله -->
            </div>
            <div class="tab-pane" id="settings-tab">
                <!-- تنظیمات -->
            </div>
        </div>
    </div>
    
    <script src="app.js"></script>
</body>
</html>`;
    }
    
    generateCSS() {
        return `/* استایل‌های ${this.name} */
.calculator-app {
    max-width: 400px;
    margin: 0 auto;
    background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
    border-radius: 20px;
    padding: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    font-family: 'Vazirmatn', 'Segoe UI', sans-serif;
}

.display {
    background: #000;
    color: #0f0;
    padding: 20px;
    border-radius: 10px;
    margin-bottom: 20px;
    text-align: left;
    font-family: 'Courier New', monospace;
    min-height: 100px;
    position: relative;
    overflow: hidden;
}

.expression {
    font-size: 0.9rem;
    opacity: 0.7;
    min-height: 24px;
    word-break: break-all;
}

.result {
    font-size: 2.5rem;
    font-weight: 300;
    margin-top: 10px;
    word-break: break-all;
}

.memory-indicator {
    position: absolute;
    top: 10px;
    left: 10px;
    color: #ff9800;
    font-size: 0.8rem;
}

.keypad {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin-bottom: 20px;
}

.btn {
    border: none;
    border-radius: 10px;
    font-size: 1.2rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.1s;
    padding: 15px 5px;
    user-select: none;
    outline: none;
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn:active {
    transform: scale(0.95);
}

.num-btn {
    background: #333;
    color: white;
}

.num-btn:hover {
    background: #444;
}

.op-btn {
    background: #ff9800;
    color: white;
}

.op-btn:hover {
    background: #ffb74d;
}

.func-btn {
    background: #616161;
    color: white;
}

.func-btn:hover {
    background: #757575;
}

.sci-btn {
    background: #1976d2;
    color: white;
    font-size: 0.9rem;
}

.sci-btn:hover {
    background: #2196f3;
}

.mem-btn {
    background: #7b1fa2;
    color: white;
    font-size: 0.9rem;
}

.mem-btn:hover {
    background: #9c27b0;
}

.const-btn {
    background: #388e3c;
    color: white;
    font-size: 0.9rem;
}

.const-btn:hover {
    background: #4caf50;
}

.eq-btn {
    background: #d32f2f;
    color: white;
    grid-column: span 2;
}

.eq-btn:hover {
    background: #f44336;
}

.tabs {
    display: flex;
    background: #2a2a2a;
    border-radius: 10px;
    margin-bottom: 15px;
    overflow: hidden;
}

.tab-btn {
    flex: 1;
    background: none;
    border: none;
    color: #aaa;
    padding: 12px;
    cursor: pointer;
    transition: all 0.3s;
    font-size: 0.9rem;
}

.tab-btn:hover {
    background: #333;
    color: white;
}

.tab-btn.active {
    background: #4CAF50;
    color: white;
}

.tab-content {
    background: #2a2a2a;
    border-radius: 10px;
    padding: 15px;
    min-height: 200px;
}

.tab-pane {
    display: none;
}

.tab-pane.active {
    display: block;
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

/* پاسخگو */
@media (max-width: 480px) {
    .calculator-app {
        max-width: 100%;
        padding: 10px;
        border-radius: 0;
    }
    
    .btn {
        padding: 12px 5px;
        font-size: 1rem;
    }
    
    .result {
        font-size: 2rem;
    }
}

/* حالت تیره/روشن */
@media (prefers-color-scheme: light) {
    .calculator-app {
        background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
    }
    
    .display {
        background: #fff;
        color: #000;
        border: 2px solid #ddd;
    }
    
    .num-btn {
        background: #e0e0e0;
        color: #000;
    }
    
    .tab-content, .tabs {
        background: #f5f5f5;
    }
}`;
    }
    
    generateJS() {
        // کد JavaScript برای ماشین حساب
        return `// ${this.name} - نسخه ${this.version}
// کد کامل ماشین حساب مهندسی

class Calculator {
    constructor() {
        this.currentInput = '0';
        this.expression = '';
        this.memory = 0;
        this.history = [];
        this.isResultShown = false;
        this.isScientificMode = true;
        
        this.init();
    }
    
    init() {
        console.log('🧮 ماشین حساب راه‌اندازی شد');
        
        // بارگذاری تاریخچه از حافظه
        this.loadHistory();
        
        // تنظیم رویدادها
        this.setupEventListeners();
        
        // به‌روزرسانی نمایشگر
        this.updateDisplay();
        
        // ثبت Service Worker
        this.registerServiceWorker();
    }
    
    setupEventListeners() {
        // دکمه‌های اعداد
        document.querySelectorAll('.num-btn').forEach(btn => {
            btn.addEventListener('click', () => this.inputNumber(btn.dataset.action));
        });
        
        // دکمه‌های عملگر
        document.querySelectorAll('.op-btn').forEach(btn => {
            btn.addEventListener('click', () => this.inputOperator(btn.dataset.action));
        });
        
        // دکمه‌های توابع
        document.querySelectorAll('.func-btn').forEach(btn => {
            btn.addEventListener('click', () => this.inputFunction(btn.dataset.action));
        });
        
        // دکمه‌های علمی
        document.querySelectorAll('.sci-btn').forEach(btn => {
            btn.addEventListener('click', () => this.inputScientific(btn.dataset.action));
        });
        
        // دکمه‌های حافظه
        document.querySelectorAll('.mem-btn').forEach(btn => {
            btn.addEventListener('click', () => this.memoryOperation(btn.dataset.action));
        });
        
        // دکمه‌های ثوابت
        document.querySelectorAll('.const-btn').forEach(btn => {
            btn.addEventListener('click', () => this.inputConstant(btn.dataset.action));
        });
        
        // دکمه مساوی
        document.querySelector('.eq-btn').addEventListener('click', () => this.calculate());
        
        // رویدادهای کیبورد
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });
        
        // تب‌ها
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });
    }
    
    inputNumber(num) {
        if (this.isResultShown) {
            this.currentInput = num;
            this.expression = '';
            this.isResultShown = false;
        } else if (this.currentInput === '0' && num !== '.') {
            this.currentInput = num;
        } else if (num === '.' && this.currentInput.includes('.')) {
            return; // جلوگیری از نقطه تکراری
        } else {
            this.currentInput += num;
        }
        
        this.updateDisplay();
    }
    
    inputOperator(op) {
        if (this.isResultShown) {
            this.expression = this.currentInput + ' ' + op + ' ';
            this.currentInput = '0';
            this.isResultShown = false;
        } else {
            if (this.expression === '') {
                this.expression = this.currentInput + ' ' + op + ' ';
            } else {
                // محاسبه قسمت قبلی
                try {
                    const result = this.evaluateExpression(this.expression + this.currentInput);
                    this.expression = result + ' ' + op + ' ';
                } catch (error) {
                    this.showError(error.message);
                    return;
                }
            }
            this.currentInput = '0';
        }
        
        this.updateDisplay();
    }
    
    inputFunction(func) {
        switch (func) {
            case 'clear':
                this.currentInput = '0';
                break;
            case 'clear-all':
                this.currentInput = '0';
                this.expression = '';
                break;
            case 'backspace':
                if (this.currentInput.length > 1) {
                    this.currentInput = this.currentInput.slice(0, -1);
                } else {
                    this.currentInput = '0';
                }
                break;
        }
        
        this.updateDisplay();
    }
    
    inputScientific(func) {
        let result;
        const value = parseFloat(this.currentInput);
        
        try {
            switch (func) {
                case 'sin':
                    result = Math.sin(value * Math.PI / 180);
                    break;
                case 'cos':
                    result = Math.cos(value * Math.PI / 180);
                    break;
                case 'tan':
                    result = Math.tan(value * Math.PI / 180);
                    break;
                case 'asin':
                    result = Math.asin(value) * 180 / Math.PI;
                    break;
                case 'acos':
                    result = Math.acos(value) * 180 / Math.PI;
                    break;
                case 'atan':
                    result = Math.atan(value) * 180 / Math.PI;
                    break;
                case 'log':
                    result = Math.log10(value);
                    break;
                case 'ln':
                    result = Math.log(value);
                    break;
                case 'sqrt':
                    result = Math.sqrt(value);
                    break;
                case 'power':
                    // نیاز به ورودی دوم دارد
                    this.expression = this.currentInput + '^';
                    this.currentInput = '0';
                    this.updateDisplay();
                    return;
                case 'factorial':
                    result = this.factorial(value);
                    break;
                case 'percent':
                    result = value / 100;
                    break;
                default:
                    return;
            }
            
            if (isNaN(result) || !isFinite(result)) {
                throw new Error('نتیجه نامعتبر');
            }
            
            this.currentInput = this.formatNumber(result);
            this.addToHistory(\`\${func}(\${value}) = \${this.currentInput}\`);
            this.updateDisplay();
            
        } catch (error) {
            this.showError(error.message);
        }
    }
    
    inputConstant(constant) {
        switch (constant) {
            case 'pi':
                this.currentInput = Math.PI.toString();
                break;
            case 'e':
                this.currentInput = Math.E.toString();
                break;
        }
        
        this.updateDisplay();
    }
    
    memoryOperation(op) {
        const value = parseFloat(this.currentInput);
        
        switch (op) {
            case 'mc':
                this.memory = 0;
                this.showNotification('حافظه پاک شد');
                break;
            case 'mr':
                this.currentInput = this.memory.toString();
                this.showNotification('حافظه بازیابی شد');
                break;
            case 'm+':
                this.memory += value;
                this.showNotification(\`\${value} به حافظه اضافه شد\`);
                break;
            case 'm-':
                this.memory -= value;
                this.showNotification(\`\${value} از حافظه کم شد\`);
                break;
        }
        
        this.updateMemoryIndicator();
        this.updateDisplay();
    }
    
    calculate() {
        try {
            const fullExpression = this.expression + this.currentInput;
            const result = this.evaluateExpression(fullExpression);
            
            if (isNaN(result) || !isFinite(result)) {
                throw new Error('نتیجه نامعتبر');
            }
            
            this.currentInput = this.formatNumber(result);
            this.expression = '';
            this.isResultShown = true;
            
            // اضافه کردن به تاریخچه
            this.addToHistory(\`\${fullExpression} = \${this.currentInput}\`);
            
            // ذخیره تاریخچه
            this.saveHistory();
            
            this.updateDisplay();
            
        } catch (error) {
            this.showError(error.message);
        }
    }
    
    evaluateExpression(expr) {
        // جایگزینی نمادها
        let processed = expr
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/\^/g, '**')
            .replace(/π/g, Math.PI)
            .replace(/e/g, Math.E);
        
        // اعتبارسنجی
        if (!this.isValidExpression(processed)) {
            throw new Error('عبارت نامعتبر');
        }
        
        // محاسبه
        return Function('"use strict"; return (' + processed + ')')();
    }
    
    isValidExpression(expr) {
        // بررسی کاراکترهای مجاز
        const allowedChars = /^[0-9+\-*/.()\sπeE]+$/;
        
        // بررسی پرانتزها
        let balance = 0;
        for (const char of expr) {
            if (char === '(') balance++;
            if (char === ')') balance--;
            if (balance < 0) return false;
        }
        if (balance !== 0) return false;
        
        return allowedChars.test(expr.replace(/\s+/g, ''));
    }
    
    factorial(n) {
        if (n < 0) throw new Error('فاکتوریل برای اعداد منفی تعریف نشده');
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }
    
    formatNumber(num) {
        let formatted = parseFloat(num).toString();
        
        // اگر عدد خیلی بزرگ یا کوچک است، از نماد علمی استفاده کن
        if (Math.abs(num) > 1e12 || (Math.abs(num) < 1e-6 && num !== 0)) {
            formatted = num.toExponential(10).replace('e', 'E');
        }
        
        // حذف صفرهای اضافی انتها
        formatted = formatted.replace(/(\.\d*?[1-9])0+$/, '$1');
        formatted = formatted.replace(/\.$/, '');
        
        return formatted;
    }
    
    updateDisplay() {
        document.getElementById('expression').textContent = this.expression;
        document.getElementById('result').textContent = this.currentInput;
    }
    
    updateMemoryIndicator() {
        const indicator = document.getElementById('memory-indicator');
        if (this.memory !== 0) {
            indicator.textContent = 'M: ' + this.formatNumber(this.memory);
        } else {
            indicator.textContent = '';
        }
    }
    
    addToHistory(entry) {
        const historyEntry = {
            id: Date.now(),
            entry,
            timestamp: new Date().toISOString()
        };
        
        this.history.unshift(historyEntry);
        
        // محدود کردن به ۱۰۰ مورد
        if (this.history.length > 100) {
            this.history.pop();
        }
        
        // به‌روزرسانی نمایش تاریخچه
        this.updateHistoryDisplay();
    }
    
    updateHistoryDisplay() {
        const historyTab = document.getElementById('history-tab');
        if (!historyTab) return;
        
        if (this.history.length === 0) {
            historyTab.innerHTML = '<p>هیچ تاریخچه‌ای وجود ندارد</p>';
            return;
        }
        
        let html = '<ul class="history-list">';
        this.history.forEach(entry => {
            const time = new Date(entry.timestamp).toLocaleTimeString('fa-IR');
            html += \`
                <li>
                    <span class="history-time">\${time}</span>
                    <span class="history-entry">\${entry.entry}</span>
                </li>
            \`;
        });
        html += '</ul>';
        
        historyTab.innerHTML = html;
    }
    
    loadHistory() {
        try {
            const saved = localStorage.getItem('calculator_history');
            if (saved) {
                this.history = JSON.parse(saved);
            }
        } catch (error) {
            console.error('خطا در بارگذاری تاریخچه:', error);
        }
    }
    
    saveHistory() {
        try {
            localStorage.setItem('calculator_history', JSON.stringify(this.history));
        } catch (error) {
            console.error('خطا در ذخیره تاریخچه:', error);
        }
    }
    
    switchTab(tabName) {
        // غیرفعال کردن همه تب‌ها
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        
        // فعال کردن تب انتخاب شده
        document.querySelector(\`[data-tab="\${tabName}"]\`).classList.add('active');
        document.getElementById(\`\${tabName}-tab\`).classList.add('active');
        
        // بارگذاری محتوای تب
        this.loadTabContent(tabName);
    }
    
    loadTabContent(tabName) {
        const tab = document.getElementById(\`\${tabName}-tab\`);
        
        switch (tabName) {
            case 'converter':
                tab.innerHTML = this.generateConverterUI();
                this.setupConverterEvents();
                break;
                
            case 'history':
                this.updateHistoryDisplay();
                break;
                
            case 'solver':
                tab.innerHTML = this.generateSolverUI();
                this.setupSolverEvents();
                break;
                
            case 'settings':
                tab.innerHTML = this.generateSettingsUI();
                this.setupSettingsEvents();
                break;
        }
    }
    
    generateConverterUI() {
        return \`
            <div class="converter">
                <h3>🔄 مبدل واحد</h3>
                
                <div class="converter-controls">
                    <input type="number" id="convert-value" placeholder="مقدار" value="1">
                    
                    <select id="convert-category">
                        <option value="length">طول</option>
                        <option value="weight">وزن</option>
                        <option value="temperature">دما</option>
                        <option value="area">مساحت</option>
                        <option value="volume">حجم</option>
                        <option value="speed">سرعت</option>
                    </select>
                    
                    <select id="convert-from"></select>
                    <span>به</span>
                    <select id="convert-to"></select>
                    
                    <button id="convert-btn">تبدیل</button>
                </div>
                
                <div class="converter-result" id="converter-result"></div>
            </div>
        \`;
    }
    
    setupConverterEvents() {
        document.getElementById('convert-category').addEventListener('change', (e) => {
            this.updateUnitOptions(e.target.value);
        });
        
        document.getElementById('convert-btn').addEventListener('click', () => {
            this.performConversion();
        });
        
        // بارگذاری اولیه
        this.updateUnitOptions('length');
    }
    
    updateUnitOptions(category) {
        const units = {
            length: ['mm', 'cm', 'm', 'km', 'inch', 'foot', 'yard', 'mile'],
            weight: ['mg', 'g', 'kg', 'ton', 'ounce', 'pound'],
            temperature: ['celsius', 'fahrenheit', 'kelvin'],
            area: ['mm²', 'cm²', 'm²', 'km²', 'hectare', 'acre'],
            volume: ['ml', 'liter', 'm³', 'gallon', 'pint'],
            speed: ['m/s', 'km/h', 'mph', 'knot']
        };
        
        const fromSelect = document.getElementById('convert-from');
        const toSelect = document.getElementById('convert-to');
        
        fromSelect.innerHTML = '';
        toSelect.innerHTML = '';
        
        units[category].forEach(unit => {
            fromSelect.innerHTML += \`<option value="\${unit}">\${unit}</option>\`;
            toSelect.innerHTML += \`<option value="\${unit}">\${unit}</option>\`;
        });
        
        // تنظیم مقادیر پیش‌فرض
        if (category === 'temperature') {
            fromSelect.value = 'celsius';
            toSelect.value = 'fahrenheit';
        } else {
            fromSelect.value = units[category][2]; // واحد میانی
            toSelect.value = units[category][3];   // واحد بعدی
        }
    }
    
    performConversion() {
        const value = parseFloat(document.getElementById('convert-value').value);
        const category = document.getElementById('convert-category').value;
        const fromUnit = document.getElementById('convert-from').value;
        const toUnit = document.getElementById('convert-to').value;
        
        if (isNaN(value)) {
            this.showError('لطفاً یک عدد وارد کنید');
            return;
        }
        
        try {
            const result = this.convertUnit(value, fromUnit, toUnit, category);
            document.getElementById('converter-result').innerHTML = \`
                <p><strong>\${value} \${fromUnit} = \${result.toFixed(6)} \${toUnit}</strong></p>
            \`;
        } catch (error) {
            this.showError(error.message);
        }
    }
    
    convertUnit(value, fromUnit, toUnit, category) {
        const conversionRates = {
            length: {
                'mm': 0.001,
                'cm': 0.01,
                'm': 1,
                'km': 1000,
                'inch': 0.0254,
                'foot': 0.3048,
                'yard': 0.9144,
                'mile': 1609.344
            },
            weight: {
                'mg': 0.000001,
                'g': 0.001,
                'kg': 1,
                'ton': 1000,
                'ounce': 0.0283495,
                'pound': 0.453592
            },
            temperature: {
                'celsius': 'c',
                'fahrenheit': 'f',
                'kelvin': 'k'
            },
            area: {
                'mm²': 0.000001,
                'cm²': 0.0001,
                'm²': 1,
                'km²': 1000000,
                'hectare': 10000,
                'acre': 4046.86
            },
            volume: {
                'ml': 0.001,
                'liter': 1,
                'm³': 1000,
                'gallon': 3.78541,
                'pint': 0.473176
            },
            speed: {
                'm/s': 1,
                'km/h': 0.277778,
                'mph': 0.44704,
                'knot': 0.514444
            }
        };
        
        const rates = conversionRates[category];
        if (!rates) throw new Error('دسته‌بندی نامعتبر');
        
        if (!rates[fromUnit] || !rates[toUnit]) {
            throw new Error('واحد نامعتبر');
        }
        
        // تبدیل دما
        if (category === 'temperature') {
            if (fromUnit === 'celsius' && toUnit === 'fahrenheit') {
                return (value * 9/5) + 32;
            } else if (fromUnit === 'fahrenheit' && toUnit === 'celsius') {
                return (value - 32) * 5/9;
            } else if (fromUnit === 'celsius' && toUnit === 'kelvin') {
                return value + 273.15;
            } else if (fromUnit === 'kelvin' && toUnit === 'celsius') {
                return value - 273.15;
            } else if (fromUnit === 'fahrenheit' && toUnit === 'kelvin') {
                return (value - 32) * 5/9 + 273.15;
            } else if (fromUnit === 'kelvin' && toUnit === 'fahrenheit') {
                return (value - 273.15) * 9/5 + 32;
            } else {
                return value;
            }
        }
        
        // تبدیل سایر واحدها
        return value * rates[fromUnit] / rates[toUnit];
    }
    
    generateSolverUI() {
        return \`
            <div class="solver">
                <h3>🧮 حل معادله</h3>
                
                <div class="solver-type">
                    <select id="equation-type">
                        <option value="linear">معادله خطی</option>
                        <option value="quadratic">معادله درجه دو</option>
                    </select>
                </div>
                
                <div class="equation-input" id="equation-input">
                    <input type="number" id="linear-a" placeholder="a" value="1">
                    <span>x + </span>
                    <input type="number" id="linear-b" placeholder="b" value="0">
                    <span> = 0</span>
                </div>
                
                <button id="solve-btn">حل</button>
                
                <div class="solution" id="solution"></div>
            </div>
        \`;
    }
    
    setupSolverEvents() {
        document.getElementById('equation-type').addEventListener('change', (e) => {
            this.updateEquationInput(e.target.value);
        });
        
        document.getElementById('solve-btn').addEventListener('click', () => {
            this.solveEquation();
        });
    }
    
    updateEquationInput(type) {
        const container = document.getElementById('equation-input');
        
        if (type === 'linear') {
            container.innerHTML = \`
                <input type="number" id="linear-a" placeholder="a" value="1">
                <span>x + </span>
                <input type="number" id="linear-b" placeholder="b" value="0">
                <span> = 0</span>
            \`;
        } else if (type === 'quadratic') {
            container.innerHTML = \`
                <input type="number" id="quad-a" placeholder="a" value="1">
                <span>x² + </span>
                <input type="number" id="quad-b" placeholder="b" value="0">
                <span>x + </span>
                <input type="number" id="quad-c" placeholder="c" value="0">
                <span> = 0</span>
            \`;
        }
    }
    
    solveEquation() {
        const type = document.getElementById('equation-type').value;
        const solutionDiv = document.getElementById('solution');
        
        try {
            if (type === 'linear') {
                const a = parseFloat(document.getElementById('linear-a').value);
                const b = parseFloat(document.getElementById('linear-b').value);
                
                if (a === 0) {
                    throw new Error('ضریب x نمی‌تواند صفر باشد');
                }
                
                const x = -b / a;
                
                solutionDiv.innerHTML = \`
                    <h4>نتیجه:</h4>
                    <p>\${a}x + \${b} = 0</p>
                    <p>x = \${x}</p>
                \`;
                
            } else if (type === 'quadratic') {
                const a = parseFloat(document.getElementById('quad-a').value);
                const b = parseFloat(document.getElementById('quad-b').value);
                const c = parseFloat(document.getElementById('quad-c').value);
                
                if (a === 0) {
                    throw new Error('ضریب x² نمی‌تواند صفر باشد');
                }
                
                const discriminant = b * b - 4 * a * c;
                
                if (discriminant < 0) {
                    const real = -b / (2 * a);
                    const imaginary = Math.sqrt(-discriminant) / (2 * a);
                    
                    solutionDiv.innerHTML = \`
                        <h4>نتیجه:</h4>
                        <p>\${a}x² + \${b}x + \${c} = 0</p>
                        <p>Δ = \${discriminant} (منفی)</p>
                        <p>x₁ = \${real} + \${imaginary}i</p>
                        <p>x₂ = \${real} - \${imaginary}i</p>
                    \`;
                    
                } else if (discriminant === 0) {
                    const x = -b / (2 * a);
                    
                    solutionDiv.innerHTML = \`
                        <h4>نتیجه:</h4>
                        <p>\${a}x² + \${b}x + \${c} = 0</p>
                        <p>Δ = \${discriminant} (صفر)</p>
                        <p>x = \${x} (دو ریشه برابر)</p>
                    \`;
                    
                } else {
                    const sqrtD = Math.sqrt(discriminant);
                    const x1 = (-b + sqrtD) / (2 * a);
                    const x2 = (-b - sqrtD) / (2 * a);
                    
                    solutionDiv.innerHTML = \`
                        <h4>نتیجه:</h4>
                        <p>\${a}x² + \${b}x + \${c} = 0</p>
                        <p>Δ = \${discriminant}</p>
                        <p>x₁ = \${x1}</p>
                        <p>x₂ = \${x2}</p>
                    \`;
                }
            }
            
        } catch (error) {
            solutionDiv.innerHTML = \`<p class="error">خطا: \${error.message}</p>\`;
        }
    }
    
    generateSettingsUI() {
        return \`
            <div class="settings">
                <h3>⚙️ تنظیمات</h3>
                
                <div class="setting-item">
                    <label>
                        <input type="checkbox" id="scientific-mode" \${this.isScientificMode ? 'checked' : ''}>
                        حالت علمی
                    </label>
                </div>
                
                <div class="setting-item">
                    <label>
                        <input type="checkbox" id="haptic-feedback">
                        لرزش دکمه‌ها
                    </label>
                </div>
                
                <div class="setting-item">
                    <label>
                        دقت اعشار:
                        <select id="decimal-precision">
                            <option value="2">۲ رقم</option>
                            <option value="4">۴ رقم</option>
                            <option value="6">۶ رقم</option>
                            <option value="10" selected>۱۰ رقم</option>
                        </select>
                    </label>
                </div>
                
                <div class="setting
