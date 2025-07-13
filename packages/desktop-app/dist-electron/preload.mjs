"use strict";
const electron = require("electron");
const electronAPI = {
  sendUserMessage: (content) => {
    return electron.ipcRenderer.send("receiveUserMessage", content);
  },
  onReceiveBotMessage: (callback) => {
    return electron.ipcRenderer.on("bot-message", (_event, content) => {
      return callback(content);
    });
  }
};
electron.contextBridge.exposeInMainWorld("electronAPI", electronAPI);
