function goTo(page) {
  location.hash = page;
}

function loadPage(page) {
  const app = document.getElementById("app");

  if (!app) return;

  if (page === "home") {
    app.innerHTML = `
      <h2>Home</h2>
      <button onclick="goTo('note')">Note</button>
      <button onclick="goTo('calculator')">Calculator</button>
    `;
  } else if (page === "note") {
    app.innerHTML = generateApp("note");
  } else if (page === "calculator") {
    app.innerHTML = generateApp("calculator");
  } else {
    app.innerHTML = "<h2>Page not found</h2>";
  }
}

// بارگذاری صفحه هنگام تغییر آدرس
window.addEventListener("hashchange", () => {
  loadPage(location.hash.slice(1));
});

// بارگذاری اولیه هنگام ورود به سایت
window.addEventListener("DOMContentLoaded", () => {
  loadPage(location.hash.slice(1) || "home");
});
