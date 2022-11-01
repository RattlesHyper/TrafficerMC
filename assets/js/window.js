const { BrowserWindow } = require('electron')

class Window extends BrowserWindow {
  constructor ({ file }) {
    super({
      width: 930,
      height: 530,
      autoHideMenuBar: true,
      show: false,
      resizable: false,
      devTools: false,
      titleBarStyle: 'hidden',
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    })
    this.loadFile(file)
    //this.webContents.openDevTools()
    this.once('ready-to-show', () => {
      this.show()
    })
  }
}

module.exports = Window