let currentScreen = "home";
let currentOutput = [];

window.onload = () => render();

function runApp(cmd) {
  const result = runEngine(cmd);

  currentScreen = result.screen;
  currentOutput = result.output;

  render();
}

function render() {
  const app = document.getElementById("app");
  app.innerHTML = "";

  // ===== OUTPUT =====
  const out = document.createElement("div");
  out.style.border = "1px solid #444";
  out.style.padding = "10px";
  out.style.marginBottom = "10px";

  currentOutput.forEach(t => {
    const p = document.createElement("div");
    p.textContent = t;
    out.appendChild(p);
  });

  app.appendChild(out);

  // ===== HOME =====
  if (currentScreen === "home") {
    const t = document.createElement("textarea");
    t.id = "cmd";
    app.appendChild(t);

    const b = document.createElement("button");
    b.textContent = "اجرا";
    b.onclick = () => runApp(t.value);
    app.appendChild(b);
  }

  // ===== NOTE =====
  if (currentScreen === "note") {
    app.innerHTML += "<h2>صفحه یادداشت</h2>";
  }

  // ===== LIST =====
  if (currentScreen === "list") {
    app.innerHTML += "<h2>صفحه لیست</h2>";
  }
}
