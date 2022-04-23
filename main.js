const path = require('path')
const { app, ipcMain, dialog, Menu} = require('electron')
const fs = require('fs')
const Store = require('electron-store')
const store = new Store()
const Window = require('./assets/class/window/Window');
// app ready and quit
app.whenReady().then(main);
app.on('window-all-closed', function() {
  app.quit()
})
//multi connect mode
ipcMain.on('connectmulti', (e, data) => {
  const windowBot = new Window({
    file: path.join('renderer', '../BotWindow/mbotwin.html')
  })
  windowBot.webContents.once('dom-ready', () => {
    windowBot.webContents.send('startbotmulti', data)
  })
});
//single mode
ipcMain.on('connect', (e, data) => {
  const windowBot = new Window({
    file: path.join('renderer', '../BotWindow/botwin.html')
  })
  windowBot.webContents.once('dom-ready', () => {
    windowBot.webContents.send('startbot', data)
  })
});
//main on ready function
function main() {
  Menu.setApplicationMenu(null);
  const mainWindow = new Window({
    h: 600,
    w: 350,
    file: path.join('renderer', 'index.html')
  });
  mainWindow.webContents.once('dom-ready', () => {
    mainWindow.webContents.send('verinfo')
  });
  //open sript file
  ipcMain.on('openfile', () => {
    const scriptpath = dialog.showOpenDialogSync({
      properties: ['openFile'],
      filters: [{
        name: 'Text',
        extensions: ['txt']
      }]
    })[0]
    const script = fs.readFileSync(scriptpath).toString()
    mainWindow.webContents.send('script', (script, scriptpath))
  });
};