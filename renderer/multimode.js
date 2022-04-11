const { ipcRenderer, shell } = require('electron')

document.getElementById('connect').addEventListener('click', () => {
  const data = {
    host: document.getElementById('host').value,
    port: parseInt(document.getElementById('port').value),
    username: document.getElementById('username').value,
    version: document.getElementById('version').value,
    count: document.getElementById('countbot').value
  }
  ipcRenderer.send('connectmulti', data)
})


function opendiscord() {
  shell.openExternal('https://discord.gg/m6b8Pw4NR8')
}
function openyt() {
  shell.openExternal('https://www.youtube.com/channel/UCrOD2iq1muNhIcRTQX0Xh6A')
}
function opengithub() {
  shell.openExternal('https://github.com/RattlesHyper/TrafficerMC')
}

