const { app, ipcMain, dialog, Menu} = require('electron')
const { store } = require('./assets/class/common/cfuns')
const path = require('path')
const fs = require('fs')
const Window = require('./assets/class/window/Window');
const userProxies = store.get('proxies')
// app ready and quit
app.whenReady().then(main);
app.on('window-all-closed', function() {
  app.quit()
})

//connect mode selector
ipcMain.on('connect', (e, data) => {
  if (!data.count || data.count <= 1) {
    openWinSingle(data)
  } else {
    if(userProxies) {
      openWindowMultiPrx(data)
    } else {
      openWindowMulti(data)
    }
  }
});
//main on ready function
function main() {
  Menu.setApplicationMenu(null);
  const mainWindow = new Window({
    h: 725,
    w: 500,
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
  //open account file
  ipcMain.on('openaccfile', () => {
    const accpath = dialog.showOpenDialogSync({
      properties: ['openFile'],
      filters: [{
        name: 'Text',
        extensions: ['txt']
      }]
    })[0]
    const accounts = fs.readFileSync(accpath).toString()
    mainWindow.webContents.send('account', (accounts, accpath))
  });
  //open proxy file
  ipcMain.on('openprxfile', () => {
    const prxpath = dialog.showOpenDialogSync({
      properties: ['openFile'],
      filters: [{
        name: 'Text',
        extensions: ['txt']
      }]
    })[0]
    const proxies = fs.readFileSync(prxpath).toString()
    mainWindow.webContents.send('proxies', (proxies, prxpath))
  });
};
//single mode window
function openWinSingle(data) {
  const windowBot = new Window({
    file: path.join('renderer', '../BotWindow/botwin.html')
  })
  windowBot.webContents.once('dom-ready', () => {
    windowBot.webContents.send('startbot', data)
  })
}
//multi mode window
function openWindowMulti(data) {
  const windowBot = new Window({
    file: path.join('renderer', '../BotWindow/mbotwin.html')
  })
  windowBot.webContents.once('dom-ready', () => {
    windowBot.webContents.send('startbotmulti', data)
  })
}
//multi mode window
function openWindowMultiPrx(data) {
  const windowBot = new Window({
    file: path.join('renderer', '../BotWindow/proxymbotwin.html')
  })
  windowBot.webContents.once('dom-ready', () => {
    windowBot.webContents.send('startbotmulti', data)
  })
}