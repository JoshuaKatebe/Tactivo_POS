const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  send: (channel, payload) => ipcRenderer.send(channel, payload),
  receive: (channel, fn) => ipcRenderer.on(channel, (e, ...args) => fn(...args)),
});