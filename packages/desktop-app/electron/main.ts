import { app, BrowserWindow, ipcMain } from "electron";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { buildMenu } from "@/electron/menu";

const __dirname = dirname(fileURLToPath(import.meta.url));

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = join(__dirname, "..", "dist-electron");
export const RENDERER_DIST = join(__dirname, "..", "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? join(join(__dirname, ".."), "public")
  : RENDERER_DIST;

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 600,
    icon: join(process.env.VITE_PUBLIC!, "electron-vite.svg"),
    webPreferences: {
      preload: join(__dirname, "preload.mjs"),
    },
  });

  buildMenu(win);

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(join(RENDERER_DIST, "index.html"));
  }
}

app.on("activate", () => {
  // Recreate window on dock activation in MacOS
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(() => {
  ipcMain.on("receiveUserMessage", (event, message: string) => {
    event.preventDefault();

    console.log("receiveUserMessage", message);
    return message;
  });

  createWindow();
});
