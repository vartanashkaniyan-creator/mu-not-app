function goTo(page) {
  location.hash = page;
}

function loadPage(page) {
  const app = document.getElementById("app");
  if (!app) return;

  if (page === "home") {
    app.innerHTML = `
      <h2>🏠 Home</h2>
      <button onclick="goTo('note')">📝 Note</button>
      <button onclick="goTo('calculator')">🧮 Calculator</button>
      <button onclick="goTo('builder')">🛠️ App Builder</button>
    `;
  } else if (page === "note") {
    app.innerHTML = generateApp("note").ui;
    injectLogic(generateApp("note").logic);
  } else if (page === "calculator") {
    app.innerHTML = generateApp("calculator").ui;
    injectLogic(generateApp("calculator").logic);
  } else if (page === "builder") {
    app.innerHTML = generateApp("builder").ui;
    injectLogic(generateApp("builder").logic);
  } else {
    app.innerHTML = "<h2>❌ Page not found</h2>";
  }
}

function injectLogic(code) {
  const script = document.createElement("script");
  script.textContent = code;
  document.body.appendChild(script);
}

// بارگذاری اولیه و هنگام تغییر مسیر
window.addEventListener("DOMContentLoaded", () => {
  loadPage(location.hash.slice(1) || "home");
});

window.addEventListener("hashchange", () => {
  loadPage(location.hash.slice(1));
});
