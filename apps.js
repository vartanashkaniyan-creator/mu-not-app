function generateApp(name) {
  const apps = {
    // اپ‌های قبلی: note و calculator...

    builder() {
      return {
        ui: `
          <h2>🛠️ App Builder</h2>
          <label>App Name:</label>
          <input id="app-name" type="text" placeholder="MyApp">

          <h3>📦 Features:</h3>
          <label><input type="checkbox" value="note" class="feature"> 📝 Note</label><br>
          <label><input type="checkbox" value="calculator" class="feature"> 🧮 Calculator</label><br>

          <h3>🧠 Logic Blocks:</h3>
          <label><input type="checkbox" value="input" class="logic"> 🔢 Input</label><br>
          <label><input type="checkbox" value="output" class="logic"> 🧾 Output</label><br>
          <label><input type="checkbox" value="if" class="logic"> ❓ If</label><br>
          <label><input type="checkbox" value="loop" class="logic"> 🔁 Loop</label><br>

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
            const logicBlocks = Array.from(document.querySelectorAll(".logic:checked")).map(el => el.value);
            let code = \`// \${name} - Custom App\\n\\n\`;
            let previewHTML = "";
            let previewScript = "";

            // Features
            features.forEach(f => {
              if (f === "note") {
                code += \`// Note\\nfunction saveNote(text) {
  localStorage.setItem("note", text);
}\\nfunction loadNote() {
  return localStorage.getItem("note") || "";
}\\n\\n\`;
                previewHTML += \`
                  <h4>📝 Note</h4>
                  <textarea id="note"></textarea>
                  <button onclick="saveNote(document.getElementById('note').value)">💾 Save</button>
                  <button onclick="document.getElementById('note').value = loadNote()">📥 Load</button><hr>
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
                code += \`// Calculator\\nfunction calc(a, b) {
  return a + b;
}\\n\\n\`;
                previewHTML += \`
                  <h4>🧮 Calculator</h4>
                  <input id="a" type="number">
                  <input id="b" type="number">
                  <button onclick="calc()">+</button>
                  <p id="res"></p><hr>
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

            // Logic Blocks
            logicBlocks.forEach(b => {
              if (b === "input") {
                code += \`// Input\\nlet userInput = prompt("Enter a value:");\\n\\n\`;
                previewHTML += \`
                  <h4>🔢 Input</h4>
                  <input id="userInput" placeholder="Enter something">
                  <hr>
                \`;
              }

              if (b === "output") {
                code += \`// Output\\nconsole.log("Result:", result);\\n\\n\`;
                previewHTML += \`
                  <h4>🧾 Output</h4>
                  <p id="outputArea">Result will appear here</p>
                  <button onclick="document.getElementById('outputArea').innerText = '✅ Done!'">Show Output</button><hr>
                \`;
              }

              if (b === "if") {
                code += \`// If\\nif (userInput === "hello") {
  alert("Hi there!");
}\\n\\n\`;
              }

              if (b === "loop") {
                code += \`// Loop\\nfor (let i = 0; i < 3; i++) {
  console.log("Loop", i);
}\\n\\n\`;
              }
            });

            if (features.length === 0 && logicBlocks.length === 0) {
              code += "// No features or logic blocks selected.";
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
