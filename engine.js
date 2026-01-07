// engine.js - ADVANCED OUTPUT ENABLED

// ===== متغیرهای ذخیره داخلی =====
const ALLOWED_SCREENS = new Set(["home", "note", "list"]);
const VARIABLES = new Map(); // ذخیره متغیرها

// ===== نرمال‌سازی دستورات =====
function normalize(cmd) {
  return (cmd || "")
    .toLowerCase()
    .replace(/صفحه/g, "screen")
    .replace(/یادداشت/g, "note")
    .replace(/لیست/g, "list")
    .replace(/برو/g, "go")
    .replace(/نمایش/g, "print")
    .trim();
}

// ===== موتور اصلی =====
function runEngine(input) {
  let screen = "home";
  let output = [];

  const lines = (input || "")
    .split("\n")
    .map(l => normalize(l))
    .filter(Boolean);

  lines.forEach(line => {
    const parts = line.split(" ");
    const cmd = parts[0];

    // تغییر صفحه
    if ((cmd === "screen" || cmd === "go") && ALLOWED_SCREENS.has(parts[1])) {
      screen = parts[1];
    }

    // چاپ متن
    if (cmd === "print") {
      output.push(parts.slice(1).join(" "));
    }

    // پاکسازی خروجی
    if (cmd === "clear") {
      output = [];
    }

    // ذخیره متغیر
    if (cmd === "set" && parts[1]) {
      const key = parts[1];
      const value = parts.slice(2).join(" ") || "";
      VARIABLES.set(key, value);
      output.push(`✅ متغیر ${key} ذخیره شد`);
    }

    // بازیابی متغیر
    if (cmd === "get" && parts[1]) {
      const key = parts[1];
      const val = VARIABLES.has(key) ? VARIABLES.get(key) : "<ناموجود>";
      output.push(`${key} = ${val}`);
    }

    // اجرای پلاگین
    if (cmd === "plugin" && parts[1] && window.PluginSystem) {
      const pluginName = parts[1];
      const result = window.PluginSystem.execute(pluginName, ...parts.slice(2));
      output.push(`🔌 [${pluginName}]: ${result}`);
    }
  });

  return { screen, output };
}

// ===== اکسپورت به ویندوز =====
window.runEngine = runEngine;
