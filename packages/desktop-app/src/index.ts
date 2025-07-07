import { app, BrowserWindow, ipcMain } from "electron";
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

  win.loadFile("./index.html");

  watch(__dirname, { recursive: true }, () => {
    win.reload();
  });
}

app.whenReady().then(() => {
  ipcMain.on("ping", () => {
    console.log("pong");
  });

  createWindow();
});
