// engine.js - ADVANCED OUTPUT ENABLED

const ALLOWED_SCREENS = new Set(["home", "note", "list"]);
const vars = {}; // متغیرهای موقت

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

    // چاپ خروجی
    else if (cmd === "print") {
      const msg = parts.slice(1).join(" ");
      output.push(msg);
    }

    // پاک کردن خروجی
    else if (cmd === "clear") {
      output = [];
    }

    // هشدار alert
    else if (cmd === "alert") {
      const msg = parts.slice(1).join(" ");
      output.push(`[ALERT] ${msg}`);
    }

    // تعریف متغیر
    else if (cmd === "set" && parts[1] && parts[2]) {
      const key = parts[1];
      const value = parts.slice(2).join(" ");
      vars[key] = value;
      output.push(`[SET] ${key} = ${value}`);
    }

    // دریافت مقدار متغیر
    else if (cmd === "get" && parts[1]) {
      const key = parts[1];
      const value = vars[key] || "";
      output.push(`[GET] ${key} = ${value}`);
    }

    // فراخوانی پلاگین
    else if (cmd === "plugin" && parts[1] && window.PluginSystem) {
      const pluginName = parts[1];
      const result = window.PluginSystem.execute(pluginName, ...parts.slice(2));
      output.push(`[PLUGIN:${pluginName}] ${result}`);
    }

    else {
      output.push(`[UNKNOWN CMD] ${line}`);
    }
  });

  return {
    screen,
    output
  };
}

// اجازه دسترسی به موتور از main.js
window.runEngine = runEngine;
