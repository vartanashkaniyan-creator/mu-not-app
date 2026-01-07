// engine.js - OUTPUT ENABLED & ADVANCED
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

    // پاک کردن خروجی
    if (cmd === "clear") {
      output = [];
    }

    // دستور alert (نمایش هشدار)
    if (cmd === "alert") {
      output.push("⚠️ ALERT: " + parts.slice(1).join(" "));
    }
  });

  return { screen, output };
}

window.runEngine = runEngine;
