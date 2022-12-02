const { app, ipcMain, BrowserWindow, ipcRenderer } = require('electron')
const window = require('./assets/js/window')
const Store = require('electron-store');
const store = new Store();

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

function createWindow() {
    const mainWindow = new window({
        file: "index.html"
    });
    ipcMain.on('minimize', () => {
        mainWindow.minimize()
    });
    mainWindow.webContents.once('dom-ready', () => {
        mainWindow.webContents.send('restore', store.get('config'))
    });
}

ipcMain.on('config', (event, config) => {
    store.set('config', config)
});