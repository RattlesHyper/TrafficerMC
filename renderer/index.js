const { ipcRenderer, shell  } = require('electron')
const fetch = require('node-fetch')
const currentv = "1.1"

document.getElementById('connect').addEventListener('click', () => {
  const data = {
    host: document.getElementById('host').value,
    port: parseInt(document.getElementById('port').value),
    username: document.getElementById('username').value,
    version: document.getElementById('version').value,
    password: document.getElementById('passwd').value,
    auth: document.getElementById('authtype').value,
    count: document.getElementById('countbot').value,
    delay: document.getElementById('joindelay').value
  }
  if(!data.count) {ipcRenderer.send('connect', data)}
   else {
    ipcRenderer.send('connectmulti', data)
  }
})

ipcRenderer.on('verinfo', () => {
setTimeout(() => {clearinfo()}, 15*1000);
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

function clearinfo() {
  document.getElementById('updateinfo').style.display = "none"
}
function opendiscord() {
  shell.openExternal('https://discord.gg/m6b8Pw4NR8')
}
function openyt() {
  shell.openExternal('https://www.youtube.com/channel/UCrOD2iq1muNhIcRTQX0Xh6A')
}
function opengithub() {
  shell.openExternal('https://github.com/RattlesHyper/TrafficerMC')
}