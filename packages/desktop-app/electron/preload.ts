import { SlackUserInfo } from "./auth/slack";
import { contextBridge, ipcRenderer } from "electron";

const electronAPI = {
  sendUserMessage: (content: string) => {
    return ipcRenderer.send("receiveUserMessage", content);
  },
  onReceiveBotMessage: (callback: (content: string) => void) => {
    return ipcRenderer.on("sendBotMessage", (_event, content) => {
      return callback(content);
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
};

contextBridge.exposeInMainWorld("electronAPI", electronAPI);

export type ElectronAPI = typeof electronAPI;
