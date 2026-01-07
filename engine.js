// engine.js - مرحله ۳ (شرط، حلقه، متغیر، خروجی)
const ALLOWED_SCREENS = new Set(["home", "note", "list"]);
const variables = {};

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
    // ===== متغیر =====
    if (line.startsWith("set ")) {
      const match = line.match(/^set\s+\$(\w+)\s*=\s*(.+)$/);
      if (match) variables[match[1]] = evalExpression(match[2]);
      return;
    }

    // ===== print =====
    if (line.startsWith("print ")) {
      const text = line.slice(6).replace(/\$(\w+)/g,(m,p)=>variables[p]||"");
      output.push(text);
      return;
    }

    // ===== screen =====
    if (line.startsWith("screen ") || line.startsWith("go ")) {
      const parts = line.split(" ");
      if (parts[1] && ALLOWED_SCREENS.has(parts[1])) screen = parts[1];
      return;
    }

    // ===== if / else =====
    if (line.startsWith("if ")) {
      const condMatch = line.match(/^if\s+(.+?);(.*)$/);
      if (condMatch) {
        const cond = condMatch[1];
        const cmd = condMatch[2];
        if (evalCondition(cond)) runEngine(cmd).output.forEach(o=>output.push(o));
      }
      return;
    }

    // ===== for =====
    if (line.startsWith("for ")) {
      const match = line.match(/^for\s+\$(\w+)\s*=\s*(\d+)\s+to\s+(\d+);(.*)$/);
      if (match) {
        const varName = match[1];
        const from = parseInt(match[2]);
        const to = parseInt(match[3]);
        const cmd = match[4];
        for(let i=from;i<=to;i++){
          variables[varName]=i;
          runEngine(cmd).output.forEach(o=>output.push(o));
        }
      }
      return;
    }

  });

  return { screen, output };
}

// ===== HELPER FUNCTIONS =====
function evalExpression(expr){
  try{
    return eval(expr.replace(/\$(\w+)/g,(m,p)=>variables[p]||0));
  }catch{return 0;}
}

function evalCondition(cond){
  try{
    return eval(cond.replace(/\$(\w+)/g,(m,p)=>variables[p]||0));
  }catch{return false;}
}

window.runEngine = runEngine;
window.variables = variables;
