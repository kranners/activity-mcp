import "dotenv/config";
import { app, BrowserWindow, ipcMain } from "electron";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { buildMenu } from "./menu";
import { agent } from "./agent";
import {
  startSlackOauthFlow,
  attemptToPreloadSlackAuthorization,
  getSlackIntegrationInfo,
  disconnectSlackIntegration,
} from "./auth/slack";

const __dirname = dirname(fileURLToPath(import.meta.url));

const INTEGRATION_POLL_MILLIS = 200;

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = join(__dirname, "..", "dist-electron");
export const RENDERER_DIST = join(__dirname, "..", "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? join(join(__dirname, ".."), "public")
  : RENDERER_DIST;

export function navigateHome(win: BrowserWindow) {
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(join(RENDERER_DIST, "index.html"));
  }
}

let win: BrowserWindow;

async function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 600,
    icon: join(process.env.VITE_PUBLIC!, "electron-vite.svg"),
    webPreferences: {
      preload: join(__dirname, "preload.mjs"),
    },
  });

  buildMenu(win);
  navigateHome(win);
}

let slackTimeout: NodeJS.Timeout;

app.on("activate", () => {
  // Recreate window on dock activation in MacOS
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("before-quit", () => {
  slackTimeout.close();
});

app.whenReady().then(async () => {
  ipcMain.on("receiveUserMessage", async (event, message: string) => {
    event.preventDefault();
    const stream = agent.streamEvents(message);
    const events: Record<string, number> = {};

    for await (const event of stream) {
      win.webContents.send("sendBotEvent", event);
      const eventTypeCount = events[event.event] ?? 0;
      events[event.event] = eventTypeCount + 1;
    }
  });

  ipcMain.on("connectSlackIntegration", async (event) => {
    event.preventDefault();
    await startSlackOauthFlow(win);
  });

  ipcMain.on("disconnectSlackIntegration", (event) => {
    event.preventDefault();
    disconnectSlackIntegration();
  });

  createWindow();

  slackTimeout = setInterval(
    () => getSlackIntegrationInfo(win),
    INTEGRATION_POLL_MILLIS,
  );

  await attemptToPreloadSlackAuthorization();
});
