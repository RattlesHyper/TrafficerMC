const { app, ipcMain, BrowserWindow, ipcRenderer } = require('electron')
const Store = require('electron-store');
const store = new Store();

app.on('ready', () => {
    const mainWindow = new BrowserWindow({
        width: 970,
        height: 530,
        show: false,
        //resizable: false,
        autoHideMenuBar: true,
        titleBarStyle: 'hidden',
        webPreferences: {
          // devTools: false,
          nodeIntegration: true,
          contextIsolation: false
        }
      });
      mainWindow.loadFile("src/index.html")
      mainWindow.on('ready-to-show', () => {
        mainWindow.show()
        mainWindow.webContents.setBackgroundThrottling(false)
        app.focus()
      });
      
      ipcMain.on('minimize', () => {
        mainWindow.minimize()
    });
    
    mainWindow.webContents.once('dom-ready', () => {
        mainWindow.webContents.send('restore', store.get('config'))
        mainWindow.webContents.send('restoreTheme', store.get('theme'))
    });
});

ipcMain.on('config', (event, config) => {
    store.set('config', config)
});

ipcMain.on('theme', (event, path) => {
    store.set('theme', path)
});