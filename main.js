const { app, ipcMain, dialog, BrowserWindow, Notification, ipcRenderer } = require('electron')
const window = require('./assets/js/window')
const path = require('path')
app.disableHardwareAcceleration()


app.whenReady().then(() => {
  createWindow()
  app.focus()

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

})
function createWindow () {
  const mainWindow = new window({
    file: "index.html"
  })
  ipcMain.on('minimize', () => {
    mainWindow.minimize()
  })
}

ipcMain.on('stop', () => {
  createWindow()
})

ipcMain.on('notify', (t, b)=> {
  new Notification({ title: t, body: b }).show()
})