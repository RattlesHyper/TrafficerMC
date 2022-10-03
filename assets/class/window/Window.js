const { BrowserWindow } = require('electron')

class Window extends BrowserWindow {
  constructor ({ file, h, w }) {
    super({
      height: h ?? 661,
      width: w ?? 965,
      resizable: false,
      autoHideMenuBar: true,
      show: false,
      devTools: false,
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