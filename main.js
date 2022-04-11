const path = require('path')
const { app, ipcMain, dialog, ipcRenderer, BrowserWindow, Menu } = require('electron')
const Window = require('./Window');
const { spawn } = require('child_process');
const WindowSmall = require('./WindowSmall');
const fetch = require('node-fetch');

require('electron-reload')(__dirname)

function main() {
  Menu.setApplicationMenu(null);
  const mainWindow = new WindowSmall({
    file: path.join('renderer', 'index.html')
  })
  ipcMain.on('connect', (e, data) => {
    const windowBot = new Window({
      file: path.join('renderer', '../BotWindow/botwin.html')
    })
    windowBot.webContents.once('dom-ready', () => {
      windowBot.webContents.send('startbot', data)
    });
  })
  ipcMain.on('usernameupdate', (event, unm) => {
    mainWindow.webContents.send('got-username', unm);
  })
  mainWindow.webContents.once('dom-ready', () => {
    mainWindow.webContents.send('verinfo', "OK")
  });
  ipcMain.on('connectmulti', (e, data) => {
    console.log("OK")
    const windowBot = new Window({
      file: path.join('renderer', '../BotWindow/mbotwin.html')
    })
    windowBot.webContents.once('dom-ready', () => {
      for(var i = 0; i < data.count; i++) {
        var options = {
          username: `${data.username}_${i}`,
          host: data.host,
          port: data.port,
          version: data.version
        }
        windowBot.webContents.send('startbotmulti', options)
    }
    });
  })
}
app.whenReady().then(main);
app.on('window-all-closed', function() {
  app.quit()
})