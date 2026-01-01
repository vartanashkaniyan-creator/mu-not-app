document.addEventListener("DOMContentLoaded", () => {
  const raw = localStorage.getItem("currentApp");
  if (!raw) return;

  const app = JSON.parse(raw);
  const container = document.getElementById("app");
  if (!container) return;

  container.innerHTML = app.ui;

  const script = document.createElement("script");
  script.textContent = app.logic;
  document.body.appendChild(script);
});
