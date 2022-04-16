const path = require('path')
const { app, ipcMain, Menu } = require('electron')
const Store = require('electron-store')
const store = new Store()
const Window = require('./assets/class/window/Window');
const WindowSmall = require('./assets/class/window/WindowSmall');

function main() {
  Menu.setApplicationMenu(null);
  const mainWindow = new WindowSmall({
    file: path.join('renderer', 'index.html')
  });
  mainWindow.webContents.once('dom-ready', () => {
    mainWindow.webContents.send('verinfo')
  });

  ipcMain.on('connect', (e, data) => {
    const windowBot = new Window({
      file: path.join('renderer', '../BotWindow/botwin.html')
    })
    windowBot.webContents.once('dom-ready', () => {
      windowBot.webContents.send('startbot', data)
    })
  });
  
  ipcMain.on('connectmulti', (e, data) => {
    const windowBot = new Window({
      file: path.join('renderer', '../BotWindow/mbotwin.html')
    })
     windowBot.webContents.once('dom-ready', () => {
       delaybot()
       async function delaybot() {
        for(var i = 0; i < (data.count); i++) {
          var options = {
            username: `${data.username}_${i}`,
            host: data.host,
            port: data.port,
            version: data.version,
            loginMsg: data.loginMsg
          }
          windowBot.webContents.send('startbotmulti', options)
          await timer(data.delay)
      }
       }
    });
  });
}
app.whenReady().then(main);
app.on('window-all-closed', function() {
  app.quit()
})

function timer(ms) { return new Promise(res => setTimeout(res, ms)); }