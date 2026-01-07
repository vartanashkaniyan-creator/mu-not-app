// engine.js - VARIABLES & OUTPUT ENABLED
const ALLOWED_SCREENS = new Set(["home", "note", "list"]);
const VARIABLES = {}; // ذخیره متغیرها

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

    // ===== SCREENS =====
    if ((cmd === "screen" || cmd === "go") && ALLOWED_SCREENS.has(parts[1])) {
      screen = parts[1];
    }

    // ===== VARIABLES =====
    if (cmd === "set" && parts[1] && parts[2] !== undefined) {
      VARIABLES[parts[1]] = parts.slice(2).join(" ");
    }

    if (cmd === "print") {
      const varName = parts[1];
      if (varName && VARIABLES[varName] !== undefined) {
        output.push(VARIABLES[varName]);
      } else {
        output.push(parts.slice(1).join(" "));
      }
    }

    // ===== ALERT =====
    if (cmd === "alert") {
      output.push("⚠️ " + parts.slice(1).join(" "));
    }

    // ===== CLEAR OUTPUT =====
    if (cmd === "clear") {
      output = [];
    }
  });

  return {
    screen,
    output,
    variables: { ...VARIABLES } // کپی برای بررسی در main.js
  };
}

window.runEngine = runEngine;
