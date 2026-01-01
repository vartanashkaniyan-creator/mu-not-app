function normalize(cmd) {
  return cmd
    .toLowerCase()
    .replace(/صفحه/g, "screen")
    .replace(/یادداشت/g, "note")
    .replace(/لیست/g, "list")
    .replace(/عنوان/g, "title")
    .replace(/هشدار/g, "alert")
    .replace(/برو/g, "go")
    .trim();
}

function runEngine(input) {
  const lines = input
    .split("\n")
    .map(l => normalize(l))
    .filter(Boolean);

  let screen = "home";
  let title = "Advanced App Builder";
  let alertText = null;

  lines.forEach(line => {
    const parts = line.split(" ");

    if (parts[0] === "title") {
      title = parts.slice(1).join(" ");
    }

    if (parts[0] === "screen" || parts[0] === "go") {
      screen = parts[1];
    }

    if (parts[0] === "alert") {
      alertText = parts.slice(1).join(" ");
    }
  });

  if (screen === "note") {
    return {
      meta: { alertText },
      schema: {
        title,
        components: [
          { type: "textarea", id: "noteText", placeholder: "یادداشت بنویس..." },
          { type: "button", label: "ذخیره", action: "saveNote" },
          { type: "button", label: "بازگشت", action: "goHomeAction" }
        ]
      }
    };
  }

  if (screen === "list") {
    return {
      meta: { alertText },
      schema: {
        title,
        components: [
          { type: "textarea", id: "itemInput", placeholder: "آیتم جدید..." },
          { type: "button", label: "اضافه کن", action: "addItem" },
          { type: "list", id: "itemsList" },
          { type: "button", label: "بازگشت", action: "goHomeAction" }
        ]
      }
    };
  }

  return {
    meta: { alertText },
    schema: {
      title,
      components: [
        {
          type: "textarea",
          id: "commandInput",
          placeholder:
`مثال فارسی:
عنوان یادداشت‌های من
صفحه note

Example English:
title My Notes
screen note`
        },
        { type: "button", label: "اجرا", action: "runCommand" }
      ]
    }
  };
}
