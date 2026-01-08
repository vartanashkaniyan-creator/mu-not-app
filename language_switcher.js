
/**
 * AppBuilder - Language Switcher Module
 * Handles dynamic language switching and text translations
 */

const LanguageSwitcher = (function() {
    'use strict';
    
    // Language database
    const translations = {
        fa: {
            // General
            'app.title': 'اپ‌ساز حرفه‌ای',
            'app.subtitle': 'ساخت اپ موبایل بدون کدنویسی',
            'loading': 'در حال بارگذاری...',
            'saving': 'در حال ذخیره...',
            'error': 'خطا',
            'success': 'موفقیت',
            'warning': 'هشدار',
            'info': 'اطلاعات',
            'confirm': 'تایید',
            'cancel': 'لغو',
            'save': 'ذخیره',
            'delete': 'حذف',
            'edit': 'ویرایش',
            'create': 'ایجاد',
            'search': 'جستجو',
            'settings': 'تنظیمات',
            
            // Navigation
            'nav.dashboard': 'داشبورد',
            'nav.apps': 'برنامه‌ها',
            'nav.templates': 'قالب‌ها',
            'nav.build': 'ساخت خروجی',
            'nav.settings': 'تنظیمات',
            'nav.help': 'راهنما',
            
            // Apps
            'apps.my_apps': 'برنامه‌های من',
            'apps.create_new': 'برنامه جدید',
            'apps.empty': 'هنوز برنامه‌ای نساخته‌اید',
            'apps.name': 'نام برنامه',
            'apps.icon': 'آیکون',
            'apps.color': 'رنگ',
            'apps.category': 'دسته‌بندی',
            'apps.description': 'توضیحات',
            'apps.version': 'نسخه',
            'apps.created': 'تاریخ ایجاد',
            'apps.updated': 'آخرین تغییر',
            
            // Categories
            'category.tools': 'ابزارها',
            'category.productivity': 'بهره‌وری',
            'category.education': 'آموزشی',
            'category.entertainment': 'سرگرمی',
            'category.finance': 'مالی',
            'category.health': 'سلامت',
            'category.other': 'سایر',
            
            // Templates
            'templates.builtin': 'قالب‌های آماده',
            'templates.custom': 'قالب‌های شخصی',
            'templates.use': 'استفاده از قالب',
            'templates.customize': 'سفارشی‌سازی',
            'templates.preview': 'پیش‌نمایش',
            
            // Builder
            'builder.build': 'ساخت',
            'builder.export': 'خروجی',
            'builder.apk': 'فایل APK',
            'builder.pwa': 'PWA',
            'builder.website': 'وبسایت',
            'builder.select_app': 'انتخاب برنامه',
            'builder.building': 'در حال ساخت...',
            'builder.download': 'دانلود',
            'builder.install': 'نصب',
            
            // Settings
            'settings.general': 'عمومی',
            'settings.appearance': 'ظاهر',
            'settings.language': 'زبان',
            'settings.theme': 'تم',
            'settings.storage': 'ذخیره‌سازی',
            'settings.about': 'درباره',
            'settings.reset': 'بازنشانی',
            'settings.export_data': 'خروجی داده‌ها',
            'settings.import_data': 'ورود داده‌ها',
            
            // Themes
            'theme.light': 'روشن',
            'theme.dark': 'تیره',
            'theme.blue': 'آبی',
            'theme.auto': 'خودکار',
            
            // Actions
            'action.run': 'اجرا',
            'action.stop': 'توقف',
            'action.clear': 'پاک کردن',
            'action.copy': 'کپی',
            'action.paste': 'چسباندن',
            'action.undo': 'بازگشت',
            'action.redo': 'تکرار',
            
            // Calculator app
            'calc.title': 'ماشین حساب',
            'calc.memory': 'حافظه',
            'calc.history': 'تاریخچه',
            'calc.scientific': 'علمی',
            'calc.basic': 'ساده',
            
            // Notes app
            'notes.title': 'یادداشت‌ها',
            'notes.new_note': 'یادداشت جدید',
            'notes.title_placeholder': 'عنوان یادداشت',
            'notes.content_placeholder': 'متن یادداشت...',
            'notes.search_notes': 'جستجوی یادداشت‌ها',
            'notes.auto_save': 'ذخیره خودکار',
            'notes.categories': 'دسته‌بندی‌ها',
            
            // Messages
            'msg.delete_confirm': 'آیا مطمئن هستید؟',
            'msg.unsaved_changes': 'تغییرات ذخیره نشده',
            'msg.build_success': 'با موفقیت ساخته شد',
            'msg.build_failed': 'خطا در ساخت',
            'msg.saved': 'ذخیره شد',
            'msg.deleted': 'حذف شد',
            'msg.copied': 'کپی شد',
            'msg.import_success': 'داده‌ها با موفقیت وارد شدند',
            'msg.export_success': 'داده‌ها با موفقیت خارج شدند',
            
            // Errors
            'error.network': 'خطای شبکه',
            'error.storage': 'خطای ذخیره‌سازی',
            'error.invalid_data': 'داده نامعتبر',
            'error.app_not_found': 'برنامه یافت نشد',
            'error.template_not_found': 'قالب یافت نشد'
        },
        
        en: {
            // General
            'app.title': 'Professional App Builder',
            'app.subtitle': 'Create mobile apps without coding',
            'loading': 'Loading...',
            'saving': 'Saving...',
            'error': 'Error',
            'success': 'Success',
            'warning': 'Warning',
            'info': 'Info',
            'confirm': 'Confirm',
            'cancel': 'Cancel',
            'save': 'Save',
            'delete': 'Delete',
            'edit': 'Edit',
            'create': 'Create',
            'search': 'Search',
            'settings': 'Settings',
            
            // Navigation
            'nav.dashboard': 'Dashboard',
            'nav.apps': 'Apps',
            'nav.templates': 'Templates',
            'nav.build': 'Build Output',
            'nav.settings': 'Settings',
            'nav.help': 'Help',
            
            // Apps
            'apps.my_apps': 'My Apps',
            'apps.create_new': 'New App',
            'apps.empty': 'No apps yet',
            'apps.name': 'App Name',
            'apps.icon': 'Icon',
            'apps.color': 'Color',
            'apps.category': 'Category',
            'apps.description': 'Description',
            'apps.version': 'Version',
            'apps.created': 'Created',
            'apps.updated': 'Updated',
            
            // Categories
            'category.tools': 'Tools',
            'category.productivity': 'Productivity',
            'category.education': 'Education',
            'category.entertainment': 'Entertainment',
            'category.finance': 'Finance',
            'category.health': 'Health',
            'category.other': 'Other',
            
            // Templates
            'templates.builtin': 'Built-in Templates',
            'templates.custom': 'Custom Templates',
            'templates.use': 'Use Template',
            'templates.customize': 'Customize',
            'templates.preview': 'Preview',
            
            // Builder
            'builder.build': 'Build',
            'builder.export': 'Export',
            'builder.apk': 'APK File',
            'builder.pwa': 'PWA',
            'builder.website': 'Website',
            'builder.select_app': 'Select App',
            'builder.building': 'Building...',
            'builder.download': 'Download',
            'builder.install': 'Install',
            
            // Settings
            'settings.general': 'General',
            'settings.appearance': 'Appearance',
            'settings.language': 'Language',
            'settings.theme': 'Theme',
            'settings.storage': 'Storage',
            'settings.about': 'About',
            'settings.reset': 'Reset',
            'settings.export_data': 'Export Data',
            'settings.import_data': 'Import Data',
            
            // Themes
            'theme.light': 'Light',
            'theme.dark': 'Dark',
            'theme.blue': 'Blue',
            'theme.auto': 'Auto',
            
            // Actions
            'action.run': 'Run',
            'action.stop': 'Stop',
            'action.clear': 'Clear',
            'action.copy': 'Copy',
            'action.paste': 'Paste',
            'action.undo': 'Undo',
            'action.redo': 'Redo',
            
            // Calculator app
            'calc.title': 'Calculator',
            'calc.memory': 'Memory',
            'calc.history': 'History',
            'calc.scientific': 'Scientific',
            'calc.basic': 'Basic',
            
            // Notes app
            'notes.title': 'Notes',
            'notes.new_note': 'New Note',
            'notes.title_placeholder': 'Note Title',
            'notes.content_placeholder': 'Note content...',
            'notes.search_notes': 'Search notes',
            'notes.auto_save': 'Auto save',
            'notes.categories': 'Categories',
            
            // Messages
            'msg.delete_confirm': 'Are you sure?',
            'msg.unsaved_changes': 'Unsaved changes',
            'msg.build_success': 'Built successfully',
            'msg.build_failed': 'Build failed',
            'msg.saved': 'Saved',
            'msg.deleted': 'Deleted',
            'msg.copied': 'Copied',
            'msg.import_success': 'Data imported successfully',
            'msg.export_success': 'Data exported successfully',
            
            // Errors
            'error.network': 'Network error',
            'error.storage': 'Storage error',
            'error.invalid_data': 'Invalid data',
            'error.app_not_found': 'App not found',
            'error.template_not_found': 'Template not found'
        },
        
        ar: {
            // General
            'app.title': 'منشئ التطبيقات المحترف',
            'app.subtitle': 'أنشئ تطبيقات الجوال بدون برمجة',
            'loading': 'جار التحميل...',
            'saving': 'جار الحفظ...',
            'error': 'خطأ',
            'success': 'نجاح',
            'warning': 'تحذير',
            'info': 'معلومة',
            'confirm': 'تأكيد',
            'cancel': 'إلغاء',
            'save': 'حفظ',
            'delete': 'حذف',
            'edit': 'تعديل',
            'create': 'إنشاء',
            'search': 'بحث',
            'settings': 'الإعدادات',
            
            // Navigation
            'nav.dashboard': 'لوحة التحكم',
            'nav.apps': 'التطبيقات',
            'nav.templates': 'القوالب',
            'nav.build': 'بناء المخرجات',
            'nav.settings': 'الإعدادات',
            'nav.help': 'المساعدة',
            
            // Apps
            'apps.my_apps': 'تطبيقاتي',
            'apps.create_new': 'تطبيق جديد',
            'apps.empty': 'لا توجد تطبيقات بعد',
            'apps.name': 'اسم التطبيق',
            'apps.icon': 'الأيقونة',
            'apps.color': 'اللون',
            'apps.category': 'الفئة',
            'apps.description': 'الوصف',
            'apps.version': 'الإصدار',
            'apps.created': 'تاريخ الإنشاء',
            'apps.updated': 'آخر تعديل',
            
            // Categories
            'category.tools': 'الأدوات',
            'category.productivity': 'الإنتاجية',
            'category.education': 'التعليم',
            'category.entertainment': 'الترفيه',
            'category.finance': 'المال',
            'category.health': 'الصحة',
            'category.other': 'أخرى',
            
            // Templates
            'templates.builtin': 'القوالب المضمنة',
            'templates.custom': 'القوالب المخصصة',
            'templates.use': 'استخدم القالب',
            'templates.customize': 'تخصيص',
            'templates.preview': 'معاينة',
            
            // Builder
            'builder.build': 'بناء',
            'builder.export': 'تصدير',
            'builder.apk': 'ملف APK',
            'builder.pwa': 'PWA',
            'builder.website': 'موقع ويب',
            'builder.select_app': 'اختر التطبيق',
            'builder.building': 'جاري البناء...',
            'builder.download': 'تحميل',
            'builder.install': 'تثبيت',
            
            // Settings
            'settings.general': 'عام',
            'settings.appearance': 'المظهر',
            'settings.language': 'اللغة',
            'settings.theme': 'السمة',
            'settings.storage': 'التخزين',
            'settings.about': 'حول',
            'settings.reset': 'إعادة تعيين',
            'settings.export_data': 'تصدير البيانات',
            'settings.import_data': 'استيراد البيانات',
            
            // Themes
            'theme.light': 'فاتح',
            'theme.dark': 'داكن',
            'theme.blue': 'أزرق',
            'theme.auto': 'تلقائي',
            
            // Actions
            'action.run': 'تشغيل',
            'action.stop': 'إيقاف',
            'action.clear': 'مسح',
            'action.copy': 'نسخ',
            'action.paste': 'لصق',
            'action.undo': 'تراجع',
            'action.redo': 'إعادة',
            
            // Calculator app
            'calc.title': 'آلة حاسبة',
            'calc.memory': 'الذاكرة',
            'calc.history': 'السجل',
            'calc.scientific': 'علمي',
            'calc.basic': 'أساسي',
            
            // Notes app
            'notes.title': 'الملاحظات',
            'notes.new_note': 'ملاحظة جديدة',
            'notes.title_placeholder': 'عنوان الملاحظة',
            'notes.content_placeholder': 'محتوى الملاحظة...',
            'notes.search_notes': 'بحث في الملاحظات',
            'notes.auto_save': 'حفظ تلقائي',
            'notes.categories': 'الفئات',
            
            // Messages
            'msg.delete_confirm': 'هل أنت متأكد؟',
            'msg.unsaved_changes': 'تغييرات غير محفوظة',
            'msg.build_success': 'تم البناء بنجاح',
            'msg.build_failed': 'فشل البناء',
            'msg.saved': 'تم الحفظ',
            'msg.deleted': 'تم الحذف',
            'msg.copied': 'تم النسخ',
            'msg.import_success': 'تم استيراد البيانات بنجاح',
            'msg.export_success': 'تم تصدير البيانات بنجاح',
            
            // Errors
            'error.network': 'خطأ في الشبكة',
            'error.storage': 'خطأ في التخزين',
            'error.invalid_data': 'بيانات غير صالحة',
            'error.app_not_found': 'التطبيق غير موجود',
            'error.template_not_found': 'القالب غير موجود'
        },
        
        tr: {
            // General
            'app.title': 'Profesyonel Uygulama Oluşturucu',
            'app.subtitle': 'Kod yazmadan mobil uygulama oluşturun',
            'loading': 'Yükleniyor...',
            'saving': 'Kaydediliyor...',
            'error': 'Hata',
            'success': 'Başarılı',
            'warning': 'Uyarı',
            'info': 'Bilgi',
            'confirm': 'Onayla',
            'cancel': 'İptal',
            'save': 'Kaydet',
            'delete': 'Sil',
            'edit': 'Düzenle',
            'create': 'Oluştur',
            'search': 'Ara',
            'settings': 'Ayarlar',
            
            // Navigation
            'nav.dashboard': 'Kontrol Paneli',
            'nav.apps': 'Uygulamalar',
            'nav.templates': 'Şablonlar',
            'nav.build': 'Çıktı Oluştur',
            'nav.settings': 'Ayarlar',
            'nav.help': 'Yardım',
            
            // Apps
            'apps.my_apps': 'Uygulamalarım',
            'apps.create_new': 'Yeni Uygulama',
            'apps.empty': 'Henüz uygulama yok',
            'apps.name': 'Uygulama Adı',
            'apps.icon': 'Simge',
            'apps.color': 'Renk',
            'apps.category': 'Kategori',
            'apps.description': 'Açıklama',
            'apps.version': 'Sürüm',
            'apps.created': 'Oluşturulma',
            'apps.updated': 'Güncelleme',
            
            // Categories
            'category.tools': 'Araçlar',
            'category.productivity': 'Üretkenlik',
            'category.education': 'Eğitim',
            'category.entertainment': 'Eğlence',
            'category.finance': 'Finans',
            'category.health': 'Sağlık',
            'category.other': 'Diğer',
            
            // Templates
            'templates.builtin': 'Hazır Şablonlar',
            'templates.custom': 'Özel Şablonlar',
            'templates.use': 'Şablon Kullan',
            'templates.customize': 'Özelleştir',
            'templates.preview': 'Önizleme',
            
            // Builder
            'builder.build': 'Oluştur',
            'builder.export': 'Dışa Aktar',
            'builder.apk': 'APK Dosyası',
            'builder.pwa': 'PWA',
            'builder.website': 'Web Sitesi',
            'builder.select_app': 'Uygulama Seç',
            'builder.building': 'Oluşturuluyor...',
            'builder.download': 'İndir',
            'builder.install': 'Yükle',
            
            // Settings
            'settings.general': 'Genel',
            'settings.appearance': 'Görünüm',
            'settings.language': 'Dil',
            'settings.theme': 'Tema',
            'settings.storage': 'Depolama',
            'settings.about': 'Hakkında',
            'settings.reset': 'Sıfırla',
            'settings.export_data': 'Veriyi Dışa Aktar',
            'settings.import_data': 'Veriyi İçe Aktar',
            
            // Themes
            'theme.light': 'Açık',
            'theme.dark': 'Koyu',
            'theme.blue': 'Mavi',
            'theme.auto': 'Otomatik',
            
            // Actions
            'action.run': 'Çalıştır',
            'action.stop': 'Durdur',
            'action.clear': 'Temizle',
            'action.copy': 'Kopyala',
            'action.paste': 'Yapıştır',
            'action.undo': 'Geri Al',
            'action.redo': 'Yinele',
            
            // Calculator app
            'calc.title': 'Hesap Makinesi',
            'calc.memory': 'Bellek',
            'calc.history': 'Geçmiş',
            'calc.scientific': 'Bilimsel',
            'calc.basic': 'Temel',
            
            // Notes app
            'notes.title': 'Notlar',
            'notes.new_note': 'Yeni Not',
            'notes.title_placeholder': 'Not Başlığı',
            'notes.content_placeholder': 'Not içeriği...',
            'notes.search_notes': 'Notlarda ara',
            'notes.auto_save': 'Otomatik kaydet',
            'notes.categories': 'Kategoriler',
            
            // Messages
            'msg.delete_confirm': 'Emin misiniz?',
            'msg.unsaved_changes': 'Kaydedilmemiş değişiklikler',
            'msg.build_success': 'Başarıyla oluşturuldu',
            'msg.build_failed': 'Oluşturma başarısız',
            'msg.saved': 'Kaydedildi',
            'msg.deleted': 'Silindi',
            'msg.copied': 'Kopyalandı',
            'msg.import_success': 'Veri başarıyla içe aktarıldı',
            'msg.export_success': 'Veri başarıyla dışa aktarıldı',
            
            // Errors
            'error.network': 'Ağ hatası',
            'error.storage': 'Depolama hatası',
            'error.invalid_data': 'Geçersiz veri',
            'error.app_not_found': 'Uygulama bulunamadı',
            'error.template_not_found': 'Şablon bulunamadı'
        }
    };
    
    // Current language
    let currentLang = 'fa';
    
    // DOM elements with data-i18n attribute
    const i18nElements = new Set();
    
    // Initialize
    function init() {
        // Load saved language or detect browser language
        const savedLang = localStorage.getItem('app_language');
        const browserLang = navigator.language.split('-')[0];
        
        if (savedLang && translations[savedLang]) {
            currentLang = savedLang;
        } else if (translations[browserLang]) {
            currentLang = browserLang;
        }
        
        // Scan DOM for i18n elements
        scanForI18nElements();
        
        // Apply translations
        updateAllElements();
        
        // Listen for new elements
        setupMutationObserver();
        
        console.log(`🌐 Language module initialized: ${currentLang}`);
    }
    
    // Scan DOM for elements with data-i18n attribute
    function scanForI18nElements() {
        const elements = document.querySelectorAll('[data-i18n]');
        i18nElements.clear();
        
        elements.forEach(element => {
            i18nElements.add(element);
        });
    }
    
    // Setup mutation observer to detect new i18n elements
    function setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            let shouldUpdate = false;
            
            mutations.forEach((mutation) => {
                // Check added nodes
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        if (node.hasAttribute && node.hasAttribute('data-i18n')) {
                            i18nElements.add(node);
                            shouldUpdate = true;
                        }
                        
                        // Check children
                        const i18nChildren = node.querySelectorAll ? 
                            node.querySelectorAll('[data-i18n]') : [];
                        i18nChildren.forEach(child => {
                            i18nElements.add(child);
                            shouldUpdate = true;
                        });
                    }
                });
                
                // Check attribute changes
                if (mutation.type === 'attributes' && 
                    mutation.attributeName === 'data-i18n') {
                    i18nElements.add(mutation.target);
                    shouldUpdate = true;
                }
            });
            
            if (shouldUpdate) {
                updateAllElements();
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['data-i18n']
        });
    }
    
    // Get translation
    function translate(key, lang = null) {
        const langToUse = lang || currentLang;
        
        if (!translations[langToUse]) {
            console.warn(`Language not found: ${langToUse}, falling back to fa`);
            langToUse = 'fa';
        }
        
        const translation = translations[langToUse][key];
        
        if (!translation) {
            console.warn(`Translation key not found: ${key} in ${langToUse}`);
            return `[${key}]`;
        }
        
        return translation;
    }
    
    // Update a single element
    function updateElement(element) {
        const key = element.getAttribute('data-i18n');
        
        if (!key) return;
        
        const translation = translate(key);
        
        // Handle different element types
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            const placeholder = element.getAttribute('data-i18n-placeholder');
            if (placeholder) {
                element.placeholder = translate(placeholder);
            } else {
                element.placeholder = translation;
            }
        } else if (element.hasAttribute('title')) {
            element.title = translation;
        } else if (element.hasAttribute('aria-label')) {
            element.setAttribute('aria-label', translation);
        } else {
            element.textContent = translation;
        }
        
        // Handle dynamic attributes
        const attrs = element.getAttribute('data-i18n-attrs');
        if (attrs) {
            const attrList = attrs.split(',');
            attrList.forEach(attr => {
                const trimmedAttr = attr.trim();
                if (trimmedAttr) {
                    element.setAttribute(trimmedAttr, translation);
                }
            });
        }
    }
    
    // Update all i18n elements
    function updateAllElements() {
        i18nElements.forEach(element => {
            if (document.body.contains(element)) {
                updateElement(element);
            } else {
                i18nElements.delete(element);
            }
        });
    }
    
    // Set language
    function setLanguage(lang) {
        if (!translations[lang]) {
            throw new Error(`Language not supported: ${lang}`);
        }
        
        if (currentLang === lang) return;
        
        // Update current language
        currentLang = lang;
        
        // Save preference
        localStorage.setItem('app_language', lang);
        
        // Update direction
        updatePageDirection(lang);
        
        // Update all elements
        updateAllElements();
        
        // Dispatch event
        document.dispatchEvent(new CustomEvent('language:changed', {
            detail: { language: lang }
        }));
        
        console.log(`🌐 Language changed to: ${lang}`);
    }
    
    // Update page direction based on language
    function updatePageDirection(lang) {
        const isRTL = ['fa', 'ar'].includes(lang);
        document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
    }
    
    // Get current language
    function getLanguage() {
        return currentLang;
    }
    
    // Get available languages
    function getLanguages() {
        return Object.keys(translations).map(code => ({
            code,
            name: translateLanguageName(code),
            nativeName: getNativeName(code)
        }));
    }
    
    // Translate language name
    function translateLanguageName(code) {
        const names = {
            fa: 'فارسی',
            en: 'English',
            ar: 'العربية',
            tr: 'Türkçe'
        };
        return names[code] || code;
    }
    
    // Get native name
    function getNativeName(code) {
        const nativeNames = {
            fa: 'فارسی',
            en: 'English',
            ar: 'العربية',
            tr: 'Türkçe'
        };
        return nativeNames[code] || code;
    }
    
    // Add custom translations
    function addTranslations(lang, newTranslations) {
        if (!translations[lang]) {
            translations[lang] = {};
        }
        
        Object.assign(translations[lang], newTranslations);
        
        // Update elements if this is the current language
        if (lang === currentLang) {
            updateAllElements();
        }
    }
    
    // Format with parameters
    function format(key, params = {}, lang = null) {
        let text = translate(key, lang);
        
        Object.entries(params).forEach(([key, value]) => {
            const placeholder = `{{${key}}}`;
            text = text.replace(new RegExp(placeholder, 'g'), value);
        });
        
        return text;
    }
    
    // Public API
    return {
        init,
        translate,
        setLanguage,
        getLanguage,
        getLanguages,
        addTranslations,
        format,
        
        // Utility
        updateAll: updateAllElements,
        
        // Advanced
        getTranslations: () => ({ ...translations }),
        
        // Export/Import
        exportTranslations: (lang) => {
            return JSON.stringify(translations[lang] || {}, null, 2);
        },
        
        importTranslations: (lang, json) => {
            try {
                const imported = JSON.parse(json);
                addTranslations(lang, imported);
                return true;
            } catch (error) {
                console.error('Failed to import translations:', error);
                return false;
            }
        }
    };
})();

// Auto-initialize
if (typeof window !== 'undefined') {
    window.LanguageSwitcher = LanguageSwitcher;
    
    // Shortcut function
    window.__ = LanguageSwitcher.translate;
    window.__f = LanguageSwitcher.format;
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageSwitcher;
          }
