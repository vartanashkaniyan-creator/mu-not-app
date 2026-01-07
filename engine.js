// engine.js - ADVANCED OUTPUT ENABLED

const ALLOWED_SCREENS = new Set(["home", "note", "list"]);

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
  let alerts = [];
  let pluginCommands = [];

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

    // چاپ در خروجی
    if (cmd === "print") {
      output.push(parts.slice(1).join(" "));
    }

    // پاک کردن خروجی
    if (cmd === "clear") {
      output = [];
    }

    // هشدار
    if (cmd === "alert") {
      alerts.push(parts.slice(1).join(" "));
    }

    // پلاگین
    if (cmd === "plugin" && parts[1]) {
      pluginCommands.push(parts.slice(1).join(" "));
    }
  });

  return { screen, output, alerts, pluginCommands };
}

window.runEngine = runEngine;
