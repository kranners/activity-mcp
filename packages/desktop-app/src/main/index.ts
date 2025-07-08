import { app, BrowserWindow, ipcMain, Menu } from "electron";
import { watch } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      preload: join(__dirname, "..", "preload", "index.js"),
    },
  });

  const { items } = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
        {
          click: () => win.webContents.send("update-counter", 1),
          label: "Increment",
        },
        {
          click: () => win.webContents.send("update-counter", -1),
          label: "Decrement",
        },
      ],
    },
  ]);

  const menu = Menu.getApplicationMenu();

  if (menu === null) {
    throw new Error("The existing menu was somehow null!");
  }

  items.forEach((item) => menu.append(item));
  Menu.setApplicationMenu(menu);

  win.loadFile(join(__dirname, "..", "index.html"));

  watch(__dirname, { recursive: true }, () => {
    win.reload();
  });
}

app.whenReady().then(() => {
  ipcMain.on("ping", (event, count: number) => {
    event.preventDefault();

    console.log("pong", count);
    return count;
  });

  createWindow();
});
