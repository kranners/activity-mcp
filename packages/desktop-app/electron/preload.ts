import { contextBridge, ipcRenderer } from "electron";

const electronAPI = {
  sendUserMessage: (content: string) => {
    return ipcRenderer.send("receiveUserMessage", content);
  },
  onReceiveBotMessage: (callback: (content: string) => void) => {
    return ipcRenderer.on("bot-message", (_event, content) => {
      return callback(content);
    });
  },
};

contextBridge.exposeInMainWorld("electronAPI", electronAPI);

export type ElectronAPI = typeof electronAPI;
