"use strict";
const electron = require("electron");
const electronAPI = {
  ping: (count) => {
    return electron.ipcRenderer.send("ping", count);
  },
  onUpdateCounter: (callback) => {
    return electron.ipcRenderer.on("update-counter", (_event, value) => callback(value));
  }
};
electron.contextBridge.exposeInMainWorld("electronAPI", electronAPI);
