import { StreamEvent } from "mcp-use";
import { SlackUserInfo } from "./auth/slack";
import { contextBridge, ipcRenderer } from "electron";

const electronAPI = {
  sendUserMessage: (content: string) => {
    return ipcRenderer.send("receiveUserMessage", content);
  },
  onReceiveBotEvent: (callback: (event: StreamEvent) => void) => {
    return ipcRenderer.on("sendBotEvent", (_electronEvent, event) => {
      return callback(event);
    });
  },
  connectSlackIntegration: () => {
    return ipcRenderer.send("connectSlackIntegration");
  },
  disconnectSlackIntegration: () => {
    return ipcRenderer.send("disconnectSlackIntegration");
  },
  onReceiveSlackIntegration: (callback: (user?: SlackUserInfo) => void) => {
    return ipcRenderer.on("sendSlackIntegration", (_event, user) => {
      return callback(user);
    });
  },
  removeAllListeners: (channel: string) => {
    return ipcRenderer.removeAllListeners(channel);
  },
};

contextBridge.exposeInMainWorld("electronAPI", electronAPI);

export type ElectronAPI = typeof electronAPI;
