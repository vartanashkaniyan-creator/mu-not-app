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

          <label>Select Features:</label><br>
          <label><input type="checkbox" value="note" class="feature"> 📝 Note</label><br>
          <label><input type="checkbox" value="calculator" class="feature"> 🧮 Calculator</label><br>

          <button onclick="generateAppCode()">Generate</button>

          <h3>📄 Code Output:</h3>
          <pre id="output" style="background:#1e1e1e; color:#fff; padding:12px; border-radius:8px;"></pre>

          <h3>🔍 Live Preview:</h3>
          <div id="preview" style="border:1px solid #ccc; padding:10px; border-radius:8px;"></div>
        `,
        logic: `
          function generateAppCode() {
            const name = document.getElementById("app-name").value || "MyApp";
            const features = Array.from(document.querySelectorAll(".feature:checked")).map(el => el.value);
            let code = \`// \${name} - Combined App\\n\\n\`;
            let previewHTML = "";
            let previewScript = "";

            features.forEach(f => {
              if (f === "note") {
                code += \`// Note Feature\\nfunction saveNote(text) {
  localStorage.setItem("note", text);
}\\nfunction loadNote() {
  return localStorage.getItem("note") || "";
}\\n\\n\`;

                previewHTML += \`
                  <h4>📝 Note</h4>
                  <textarea id="note"></textarea>
                  <button onclick="saveNote(document.getElementById('note').value)">💾 Save</button>
                  <button onclick="document.getElementById('note').value = loadNote()">📥 Load</button>
                  <hr>
                \`;

                previewScript += \`
                  function saveNote(text) {
                    localStorage.setItem("note", text);
                  }
                  function loadNote() {
                    return localStorage.getItem("note") || "";
                  }
                \`;
              }

              if (f === "calculator") {
                code += \`// Calculator Feature\\nfunction calc(a, b) {
  return a + b;
}\\n\\n\`;

                previewHTML += \`
                  <h4>🧮 Calculator</h4>
                  <input id="a" type="number">
                  <input id="b" type="number">
                  <button onclick="calc()">+</button>
                  <p id="res"></p>
                \`;

                previewScript += \`
                  function calc() {
                    const aVal = Number(document.getElementById("a").value);
                    const bVal = Number(document.getElementById("b").value);
                    document.getElementById("res").innerText = aVal + bVal;
                  }
                \`;
              }
            });

            if (features.length === 0) {
              code += "// No features selected.";
              previewHTML = "<p>No features selected.</p>";
            }

            document.getElementById("output").innerText = code;
            document.getElementById("preview").innerHTML = previewHTML;

            const script = document.createElement("script");
            script.textContent = previewScript;
            document.body.appendChild(script);
          }
        `
      };
    }
  };

  return apps[name]();
}
