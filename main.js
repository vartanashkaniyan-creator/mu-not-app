// engine.js - ADVANCED OUTPUT ENABLED

const ALLOWED_SCREENS = new Set(["home", "note", "list"]);

function sanitize(text) {
  if (typeof text !== "string") return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function normalize(cmd) {
  return (cmd || "")
    .toLowerCase()
    .replace(/صفحه/g, "screen")
    .replace(/یادداشت/g, "note")
    .replace(/لیست/g, "list")
    .replace(/برو/g, "go")
    .trim();
}

// ورودی چند خطی، دستورات ترکیبی و پلاگین
function runEngine(input) {
  let screen = "home";
  let output = [];
  let pluginCommand = null;

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
    if (cmd === "print") {
      output.push(sanitize(parts.slice(1).join(" ")));
    }

    // پاک کردن خروجی
    if (cmd === "clear") {
      output = [];
    }

    // فراخوانی پلاگین
    if (cmd === "plugin" && parts[1]) {
      pluginCommand = parts.slice(1).join(" ");
    }

    // هشدار سریع
    if (cmd === "alert") {
      output.push(`⚠️ ${sanitize(parts.slice(1).join(" "))}`);
    }
  });

  return {
    screen,
    output,
    pluginCommand
  };
}

window.runEngine = runEngine;
