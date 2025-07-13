import { app, BrowserWindow, Menu, ipcMain } from "electron";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

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

  const { items } = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
        {
          click: () => {
            return win.webContents.send(
              "bot-message",
              "This is a test message!",
            );
          },
          label: "Send test message",
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
