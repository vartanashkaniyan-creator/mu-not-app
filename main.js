// main.js - UPDATED FOR OUTPUT ENABLED ENGINE

let currentScreen = "home";
let currentOutput = [];

// ===== START APP =====
window.addEventListener("DOMContentLoaded", () => {
  renderScreen("home");
});

// ===== RUN APP =====
function runApp(command) {
  const result = window.runEngine(command || "");

  if (result.screen) {
    currentScreen = result.screen;
    renderScreen(currentScreen);
  }

  if (Array.isArray(result.output)) {
    currentOutput = result.output;
    renderOutput();
  }
}

// ===== RENDER SCREEN =====
function renderScreen(screen) {
  const app = document.getElementById("app");
  if (!app) return;

  app.innerHTML = "";

  // ===== OUTPUT BOX =====
  const outputBox = document.createElement("div");
  outputBox.id = "outputBox";
  outputBox.style.marginBottom = "20px";
  outputBox.style.padding = "10px";
  outputBox.style.background = "#1e1e1e";
  outputBox.style.borderRadius = "8px";
  app.appendChild(outputBox);

  // ===== HOME SCREEN =====
  if (screen === "home") {
    const textarea = document.createElement("textarea");
    textarea.id = "commandInput";
    textarea.placeholder = "دستور بنویس…";
    app.appendChild(textarea);

    const btn = document.createElement("button");
    btn.textContent = "اجرا";
    btn.onclick = () => runApp(textarea.value);
    app.appendChild(btn);
  }

  // ===== NOTE SCREEN =====
  if (screen === "note") {
    const textarea = document.createElement("textarea");
    textarea.id = "noteText";
    textarea.placeholder = "یادداشت…";
    textarea.value = localStorage.getItem("note") || "";
    app.appendChild(textarea);

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "ذخیره";
    saveBtn.onclick = () => {
      localStorage.setItem("note", textarea.value);
      alert("ذخیره شد ✅");
    };
    app.appendChild(saveBtn);

    const backBtn = document.createElement("button");
    backBtn.textContent = "بازگشت";
    backBtn.onclick = () => runApp("screen home");
    app.appendChild(backBtn);
  }

  // ===== LIST SCREEN =====
  if (screen === "list") {
    const input = document.createElement("textarea");
    input.id = "itemInput";
    input.placeholder = "آیتم جدید…";
    app.appendChild(input);

    const addBtn = document.createElement("button");
    addBtn.textContent = "اضافه";
    addBtn.onclick = () => {
      const val = input.value.trim();
      if (!val) return;
      const list = JSON.parse(localStorage.getItem("items") || "[]");
      list.push(val);
      localStorage.setItem("items", JSON.stringify(list));
      renderScreen("list");
      renderOutput();
    };
    app.appendChild(addBtn);

    const ul = document.createElement("ul");
    const items = JSON.parse(localStorage.getItem("items") || "[]");
    items.forEach((item, i) => {
      const li = document.createElement("li");
      li.textContent = `${i + 1}. ${item}`;
      ul.appendChild(li);
    });
    app.appendChild(ul);

    const backBtn = document.createElement("button");
    backBtn.textContent = "بازگشت";
    backBtn.onclick = () => runApp("screen home");
    app.appendChild(backBtn);
  }

  renderOutput();
}

// ===== RENDER OUTPUT =====
function renderOutput() {
  const box = document.getElementById("outputBox");
  if (!box) return;

  box.innerHTML = "";
  currentOutput.forEach(line => {
    const p = document.createElement("p");
    p.textContent = line;
    p.style.padding = "6px 0";
    p.style.borderBottom = "1px solid #333";
    box.appendChild(p);
  });
    }
