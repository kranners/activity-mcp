import { app, BrowserWindow, ipcMain, Menu } from "electron";
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
  const { items } = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
        {
          click: () => win.webContents.send("update-counter", 1),
          label: "Increment"
        },
        {
          click: () => win.webContents.send("update-counter", -1),
          label: "Decrement"
        }
      ]
    }
  ]);
  const menu = Menu.getApplicationMenu();
  if (menu === null) {
    throw new Error("The existing menu was somehow null!");
  }
  items.forEach((item) => menu.append(item));
  Menu.setApplicationMenu(menu);
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
  ipcMain.on("ping", (event, count) => {
    event.preventDefault();
    console.log("pong", count);
    return count;
  });
  createWindow();
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
