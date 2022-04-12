const { ipcRenderer, shell  } = require('electron')
const fetch = require('node-fetch')
const currentv = "1.0"

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

document.getElementById('btnMultiMode').addEventListener('click', () => {
  ipcRenderer.send('multimode')
})

ipcRenderer.on('got-username', (e, unm) => {
  document.getElementById('content').innerHTML = `${unm} Connected`
})

ipcRenderer.on('verinfo', () => {
fetch("https://pastebin.com/raw/YnTvkAcX", {method: 'GET'})
.then(response => response.text())
.then(result => {
  if(result === currentv) {
    document.getElementById('updateinfo').innerHTML = "Up to date!"
  } else {
    document.getElementById('updateinfo').innerHTML = `Update available Version: ${result}`
  }
});
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