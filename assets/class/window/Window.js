const { BrowserWindow } = require('electron')

// default window settings
const defaultProps = {
  height: 600,
  width: 900,
  resizable: false,
  autoHideMenuBar: true,
  show: false,
  devTools: false,
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false
  }
}

class Window extends BrowserWindow {
  constructor ({ file, ...windowSettings }) {
    // calls new BrowserWindow with these props
    super({ ...defaultProps, ...windowSettings })

    // load the html and open devtools
    this.loadFile(file)
    // this.webContents.openDevTools()

    // gracefully show when ready to prevent flickering
    this.once('ready-to-show', () => {
      this.show()
    })
  }
}

module.exports = Window
