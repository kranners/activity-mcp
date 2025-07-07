import { app, BrowserWindow } from "electron";
import { watch } from "fs";

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 600,
  });

  win.loadFile("./index.html");

  watch(__dirname, { recursive: true }, () => {
    win.reload();
  });
}

app.whenReady().then(createWindow);
