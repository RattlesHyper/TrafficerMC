const { ipcRenderer, shell  } = require('electron')
const fetch = require('node-fetch')
const Store = require('electron-store')
const store = new Store()
const currentv = "1.2"
let userData = store.get('data')

document.getElementById('connect').addEventListener('click', () => {
  const data = {
    host: document.getElementById('host').value,
    port: document.getElementById('port').value,
    username: document.getElementById('username').value,
    version: document.getElementById('version').value,
    password: document.getElementById('passwd').value,
    auth: document.getElementById('authtype').value,
    count: document.getElementById('countbot').value,
    delay: document.getElementById('joindelay').value,
    loginMsg: document.getElementById('loginMsg').value
  }
  if(!data.count) {ipcRenderer.send('connect', data)}
   else {
    ipcRenderer.send('connectmulti', data)
  }
  store.set('data', data)
})

ipcRenderer.on('verinfo', () => {
setData()
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

// cleat version info
function clearinfo() {
  document.getElementById('updateinfo').style.display = "none"
}
//open links
function opendiscord() {
  shell.openExternal('https://discord.gg/m6b8Pw4NR8')
}
function openyt() {
  shell.openExternal('https://www.youtube.com/channel/UCrOD2iq1muNhIcRTQX0Xh6A')
}
function opengithub() {
  shell.openExternal('https://github.com/RattlesHyper/TrafficerMC')
}
//restore user data
function setData() {
  document.getElementById('host').value = userData.host
  document.getElementById('port').value = userData.port
  document.getElementById('username').value = userData.username
  document.getElementById('version').value = userData.version
  document.getElementById('passwd').value = userData.password
  document.getElementById('authtype').value = userData.auth
  document.getElementById('countbot').value = userData.count
  document.getElementById('joindelay').value = userData.delay
  document.getElementById('loginMsg').value = userData.loginMsg
}