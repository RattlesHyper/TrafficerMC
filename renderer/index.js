const { ipcRenderer, shell } = require('electron')

document.getElementById('connect').addEventListener('click', () => {
  document.getElementById('content').innerHTML = "Connecting..."
  const data = {
    host: document.getElementById('host').value,
    port: parseInt(document.getElementById('port').value),
    username: document.getElementById('username').value,
    version: document.getElementById('version').value,
  }
  ipcRenderer.send('connect', data)
})

ipcRenderer.on('got-username', (e, unm) => {
  document.getElementById('content').innerHTML = `${unm} Connected`
})

function opendiscord() {
  shell.openExternal('https://discord.gg/m6b8Pw4NR8')
}
function openyt() {
  shell.openExternal('https://www.youtube.com/channel/UCrOD2iq1muNhIcRTQX0Xh6A')
}

