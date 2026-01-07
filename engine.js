// engine.js - PHASE 2 (COMBINED COMMANDS + VARIABLES)
const ALLOWED_SCREENS = new Set(["home", "note", "list"]);
const VARIABLES = {};

function normalize(cmd) {
  return (cmd || "")
    .toLowerCase()
    .replace(/صفحه/g, "screen")
    .replace(/یادداشت/g, "note")
    .replace(/لیست/g, "list")
    .replace(/برو/g, "go")
    .trim();
}

function runEngine(input) {
  let screen = "home";
  let output = [];

  if (!input) return { screen, output };

  // تقسیم دستورات با ; برای اجرای ترکیبی
  const commands = input.split(";").map(c => normalize(c)).filter(Boolean);

  commands.forEach(line => {
    const parts = line.split(" ");
    const cmd = parts[0];

    // ===== متغیرها =====
    if (cmd === "set" && parts[1] && parts[2] === "=") {
      const varName = parts[1];
      const varValue = parts.slice(3).join(" ");
      VARIABLES[varName] = varValue;
    }

    // جایگذاری متغیرها در دستورات
    let processedLine = line.replace(/\$(\w+)/g, (_, v) => VARIABLES[v] || "");

    // ===== دستورات صفحه =====
    if ((cmd === "screen" || cmd === "go") && ALLOWED_SCREENS.has(parts[1])) {
      screen = parts[1];
    }

    // ===== چاپ خروجی =====
    if (cmd === "print") {
      output.push(processedLine.replace(/^print\s*/, ""));
    }

    // ===== پاک کردن خروجی =====
    if (cmd === "clear") {
      output = [];
    }

    // ===== پلاگین =====
    if (cmd === "plugin" && parts[1] && window.PluginSystem) {
      const result = window.PluginSystem.execute(parts[1]);
      output.push(result);
    }
  });

  return { screen, output };
}

window.runEngine = runEngine;
window.VARIABLES = VARIABLES;
