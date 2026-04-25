'use strict'
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: data => ipcRenderer.invoke('save-settings', data),
  notifyPickup: winners => ipcRenderer.send('notify-pickup', winners),
  onOpenPickupModal: cb => ipcRenderer.on('open-pickup-modal', cb),
  offOpenPickupModal: cb => ipcRenderer.removeListener('open-pickup-modal', cb),
  openCart: () => ipcRenderer.send('open-cart'),
  openSettings: () => ipcRenderer.send('open-settings'),
  resizeWindow: (w, h) => ipcRenderer.send('resize-window', w, h),
})
