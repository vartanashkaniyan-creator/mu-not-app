calculator() {
  return {
    ui: `
      <h2>🧮 Calculator</h2>
      <input id="a" type="number">
      <input id="b" type="number">
      <button onclick="calc()">+</button>
      <p id="res"></p>
    `,
    logic: `
      function calc() {
        const aVal = Number(document.getElementById("a").value);
        const bVal = Number(document.getElementById("b").value);
        document.getElementById("res").innerText = aVal + bVal;
      }
    `
  };
}
