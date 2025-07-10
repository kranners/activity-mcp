import { contextBridge, ipcRenderer } from "electron/renderer";

const electronAPI = {
  ping: (count: number) => {
    return ipcRenderer.send("ping", count);
  },
  onUpdateCounter: (callback: (value: number) => void) => {
    return ipcRenderer.on("update-counter", (_event, value) => callback(value));
  },
};

contextBridge.exposeInMainWorld("electronAPI", electronAPI);

export type ElectronAPI = typeof electronAPI;
