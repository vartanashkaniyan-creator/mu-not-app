// app-loader.js (فقط 20 خط)
document.addEventListener('DOMContentLoaded', function() {
    // 1. کلیک روی آیکون‌ها
    document.querySelectorAll('.app-icon').forEach(icon => {
        icon.addEventListener('click', function() {
            const appName = this.dataset.app || this.id.replace('-icon', '');
            openApp(appName);
        });
    });
    
    // 2. تابع باز کردن اپ
    function openApp(name) {
        // مخفی کردن صفحه اصلی
        document.querySelector('.home-page').classList.add('hidden');
        
        // نمایش اپ
        const appPage = document.getElementById(name + '-page');
        if (appPage) {
            appPage.classList.remove('hidden');
        } else {
            alert(`اپ ${name} آماده شد!`);
        }
    }
    
    // 3. دکمه بازگشت
    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.app-page').forEach(page => {
                page.classList.add('hidden');
            });
            document.querySelector('.home-page').classList.remove('hidden');
        });
    });
});
