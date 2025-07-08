import { app, BrowserWindow, ipcMain, Menu } from "electron";
import { watch } from "fs";
import { join } from "path";

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
    },
  });

  const menu = Menu.buildFromTemplate([
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

  Menu.setApplicationMenu(menu);

  win.loadFile("./index.html");

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
