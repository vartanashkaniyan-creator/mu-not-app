// preview.js
document.addEventListener("DOMContentLoaded", () => {
  const app = Storage.load("currentApp");
  if (!app) return;

  document.body.innerHTML = app.ui;
  const script = document.createElement("script");
  script.innerHTML = app.logic;
  document.body.appendChild(script);
});
