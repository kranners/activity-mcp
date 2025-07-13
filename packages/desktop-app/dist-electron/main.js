import { app, BrowserWindow, ipcMain } from "electron";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const __dirname = dirname(fileURLToPath(import.meta.url));
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = join(__dirname, "..", "dist-electron");
const RENDERER_DIST = join(__dirname, "..", "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? join(join(__dirname, ".."), "public") : RENDERER_DIST;
function createWindow() {
  const win = new BrowserWindow({
    width: 1e3,
    height: 600,
    icon: join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: join(__dirname, "preload.mjs")
    }
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(join(RENDERER_DIST, "index.html"));
  }
}
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(() => {
  ipcMain.on("receiveUserMessage", (event, message) => {
    event.preventDefault();
    console.log("receiveUserMessage", message);
    return message;
  });
  createWindow();
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
