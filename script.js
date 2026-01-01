let translations = {
    en: {
        title: "Advanced Software Builder",
        languageLabel: "Select Language",
        codeLabel: "Select Code Language",
        appTypeLabel: "Select App Type",
        generateCodeButton: "Generate Code",
        mobileType1: "APK",
        mobileType2: "IPA",
        message: "Hello, World!"
    },
    fa: {
        title: "سازنده نرم‌افزار پیشرفته",
        languageLabel: "انتخاب زبان",
        codeLabel: "انتخاب زبان کد",
        appTypeLabel: "انتخاب نوع اپلیکیشن",
        generateCodeButton: "تولید کد",
        mobileType1: "APK",
        mobileType2: "IPA",
        message: "سلام، دنیا!"
    }
};

// تغییر زبان به فارسی یا انگلیسی
function changeLanguage() {
    const language = document.getElementById("language").value;
    const strings = translations[language];

    document.getElementById("title").innerText = strings.title;
    document.querySelector("label[for='language']").innerText = strings.languageLabel;
    document.querySelector("label[for='code-language']").innerText = strings.codeLabel;
    document.querySelector("label[for='app-type']").innerText = strings.appTypeLabel;
    document.getElementById("generate-code").innerText = strings.generateCodeButton;
    
    // تغییر گزینه‌ها
    document.querySelector('option[value="APK"]').innerText = strings.mobileType1;
    document.querySelector('option[value="IPA"]').innerText = strings.mobileType2;
}

// تولید کد برای انتخاب زبان
document.getElementById('generate-code').addEventListener('click', function() {
    const language = document.getElementById('code-language').value;
    const appType = document.getElementById('app-type').value;

    let generatedCode = '';

    if (language === 'Java') {
        generatedCode = `// Java Code for ${appType === 'APK' ? 'Mobile App (APK)' : 'Mobile App (IPA)'}
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`;
    } else if (language === 'Kotlin') {
        generatedCode = `// Kotlin Code for ${appType === 'APK' ? 'Mobile App (APK)' : 'Mobile App (IPA)'}
fun main() {
    println("Hello, World!")
}`;
    }

    document.getElementById('code-output').innerText = generatedCode;
});
