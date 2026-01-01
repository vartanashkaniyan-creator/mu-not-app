function generateApp(name) {
  const apps = {
    note() {
      return {
        ui: `
          <h2>📝 Note</h2>
          <textarea id="note"></textarea>
          <button onclick="saveNote(document.getElementById('note').value)">💾 Save</button>
          <button onclick="document.getElementById('note').value = loadNote()">📥 Load</button>
        `,
        logic: `
          function saveNote(text) {
            localStorage.setItem("note", text);
          }

          function loadNote() {
            return localStorage.getItem("note") || "";
          }
        `
      };
    },

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
    },

    builder() {
      return {
        ui: `
          <h2>🛠️ App Builder</h2>
          <label>App Name:</label>
          <input id="app-name" type="text" placeholder="MyApp">

          <label>Select Feature:</label>
          <select id="feature">
            <option value="note">Note App</option>
            <option value="calculator">Calculator</option>
          </select>

          <button onclick="generateAppCode()">Generate</button>
          <pre id="output" style="margin-top:20px; background:#1e1e1e; padding:12px; border-radius:8px;"></pre>
        `,
        logic: `
          function generateAppCode() {
            const name = document.getElementById("app-name").value || "MyApp";
            const feature = document.getElementById("feature").value;
            let code = "";

            if (feature === "note") {
              code = \`// \${name} - Note App\\nfunction saveNote(text) {
  localStorage.setItem("note", text);
}\\n\\nfunction loadNote() {
  return localStorage.getItem("note") || "";
}\`;
            } else if (feature === "calculator") {
              code = \`// \${name} - Calculator App\\nfunction calc(a, b) {
  return a + b;
}\`;
            }

            document.getElementById("output").innerText = code;
          }
        `
      };
    }
  };

  return apps[name]();
}
