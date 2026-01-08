function runEngine(input) {
  let screen = "home";
  let output = [];

  const text = (input || "").toLowerCase();

  if (text.includes("note") || text.includes("یادداشت")) {
    screen = "note";
  }

  if (text.includes("list") || text.includes("لیست")) {
    screen = "list";
  }

  if (text.startsWith("print ")) {
    output.push(text.replace("print ", ""));
  }

  return { screen, output };
}

window.runEngine = runEngine;
