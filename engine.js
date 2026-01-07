// engine.js — STEP 2 (Variables + Output + Commands)

const ALLOWED_SCREENS = new Set(["home", "note", "list"]);

const memory = {}; // حافظه متغیرها

function normalize(cmd) {
  return (cmd || "")
    .toLowerCase()
    .replace(/صفحه/g, "screen")
    .replace(/یادداشت/g, "note")
    .replace(/لیست/g, "list")
    .replace(/برو/g, "go")
    .trim();
}

function resolveValue(value) {
  // اگر مقدار اسم متغیر بود
  if (memory[value] !== undefined) {
    return memory[value];
  }
  return value;
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

    // ===== SET VARIABLE =====
    if (cmd === "set" && parts[2] === "=") {
      const key = parts[1];
      const value = parts.slice(3).join(" ");
      memory[key] = value;
      output.push(`✓ ${key} ذخیره شد`);
      return;
    }

    // ===== SCREEN / GO =====
    if ((cmd === "screen" || cmd === "go")) {
      const target = resolveValue(parts[1]);
      if (ALLOWED_SCREENS.has(target)) {
        screen = target;
        output.push(`→ رفتی به صفحه ${target}`);
      }
      return;
    }

    // ===== PRINT =====
    if (cmd === "print") {
      const text = parts.slice(1).map(resolveValue).join(" ");
      output.push(text);
      return;
    }

    // ===== CLEAR =====
    if (cmd === "clear") {
      output = [];
      return;
    }
  });

  return {
    screen,
    output,
    memory
  };
}

window.runEngine = runEngine;
