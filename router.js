function loadPage(page) {
  const app = document.getElementById("app");

  if (page === "home") {
    app.innerHTML = `
      <h2>Home</h2>
      <button onclick="location.hash='note'">Note</button>
      <button onclick="location.hash='calculator'">Calculator</button>
    `;
  }

  else if (page === "note") {
    app.innerHTML = generateApp("note");
  }

  else if (page === "calculator") {
    app.innerHTML = generateApp("calculator");
  }

  else {
    app.innerHTML = "<h2>Page not found</h2>";
  }
}
