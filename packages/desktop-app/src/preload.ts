import { contextBridge, ipcRenderer } from "electron/renderer";

const electronAPI = {
  ping: () => ipcRenderer.send("ping"),
};

contextBridge.exposeInMainWorld("electronAPI", electronAPI);
