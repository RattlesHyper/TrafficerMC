const { ipcRenderer, shell } = require('electron')
const fetch = require('node-fetch')
const Store = require('electron-store')
const store = new Store()
const userData = store.get('data')
const userScript = store.get('script')
const userAccount = store.get('accounts')
const userProxies = store.get('proxies')
// main connect button
document.getElementById('connect').addEventListener('click', () => {
  const data = {
    host: document.getElementById('host').value,
    port: document.getElementById('port').value,
    username: document.getElementById('username').value,
    version: document.getElementById('version').value,
    auth: document.getElementById('authtype').value,
    count: document.getElementById('countbot').value,
    delay: document.getElementById('joindelay').value,
    loginMsg: document.getElementById('loginMsg').value,
    proxyType: document.getElementById('proxytype').value
  }
  ipcRenderer.send('connect', data)
  store.set('data', data)
});
//script select button
document.getElementById('fileselectbtn').addEventListener('click', () => {
  if (document.getElementById('fileselectbtn').innerHTML === "Clear") {
    clearScript()
  } else {
    ipcRenderer.send('openfile')
  }
});
//account select button
document.getElementById('accfileselectbtn').addEventListener('click', () => {
  if (document.getElementById('accfileselectbtn').innerHTML === "Clear") {
    clearAccount()
  } else {
    ipcRenderer.send('openaccfile')
  }
});
//proxy select button
document.getElementById('prxfileselectbtn').addEventListener('click', () => {
  if (document.getElementById('prxfileselectbtn').innerHTML === "Clear") {
    clearProxy()
  } else {
    ipcRenderer.send('openprxfile')
  }
});
//version info & more
ipcRenderer.on('verinfo', () => {
  setData()
  if(userScript) {setScript()}
  if(userAccount) {setAccount()}
  if(userProxies) {setProxy()}
  setTimeout(() => {
    clearinfo()
  }, 15 * 1000);
  fetch("https://raw.githubusercontent.com/RattlesHyper/TrafficerMC/main/VERSION", {method: 'GET'})
    .then(response => response.text())
    .then(result => {
        document.getElementById('updateinfo').innerHTML = `Active Version: v${result}`
    })
});
// main to renderer path
ipcRenderer.on('script', (script, scriptpath) => {
  const scr = {
    script: script,
    path: scriptpath
  }
  store.set('script', scr)
  setScript(scriptpath)
});

// account file store
ipcRenderer.on('account', (accounts, accpath) => {
  const acc = {
    accounts: accounts,
    path: accpath
  }
  store.set('accounts', acc)
  setAccount(accpath)
});

// proxy file store
ipcRenderer.on('proxies', (proxies, prxpath) => {
  const prx = {
    proxies: proxies,
    path: prxpath
  }
  store.set('proxies', prx)
  setProxy(prxpath)
});

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
  document.getElementById('authtype').value = userData.auth
  document.getElementById('countbot').value = userData.count
  document.getElementById('joindelay').value = userData.delay
  document.getElementById('loginMsg').value = userData.loginMsg
  document.getElementById('proxytype').value = userData.proxyType
}
//restore user script
function setScript(path) {
  document.getElementById('fileselectbtn').innerHTML = "Clear"
  document.getElementById('filestate').innerHTML = `Script: ${path ?? userScript.path}`
  document.getElementById("fileselectbtn").className = "btn btn-sm btn-outline"
  document.getElementById('filestate').className = "m-1 text"
}
//restore user accounts
function setAccount(path) {
  document.getElementById('accfileselectbtn').innerHTML = "Clear"
  document.getElementById('accfilestate').innerHTML = `Accounts: ${path ?? userAccount.path}`
  document.getElementById("accfileselectbtn").className = "btn btn-sm btn-outline"
  document.getElementById('accfilestate').className = "m-1 text"
}
//restore user accounts
function setProxy(path) {
  document.getElementById('prxfileselectbtn').innerHTML = "Clear"
  document.getElementById('prxfilestate').innerHTML = `Proxies: ${path ?? userProxies.path}`
  document.getElementById("prxfileselectbtn").className = "btn btn-sm btn-outline"
  document.getElementById('prxfilestate').className = "m-1 text"
}
//clear user script
function clearScript() {
  store.delete('script')
  document.getElementById('filestate').innerHTML = "Script: No script file selected"
  document.getElementById('fileselectbtn').innerHTML = "Select"
  document.getElementById("fileselectbtn").className = "btn btn-sm btn-error btn-outline"
  document.getElementById('filestate').className = "m-1 text-error"
}
//clear selected account file
function clearAccount() {
  store.delete('accounts')
  document.getElementById('accfilestate').innerHTML = "Accounts: No file selected"
  document.getElementById('accfileselectbtn').innerHTML = "Select"
  document.getElementById("accfileselectbtn").className = "btn btn-sm btn-error btn-outline"
  document.getElementById('accfilestate').className = "m-1 text-error"
}
//clear selected proxy file
function clearProxy() {
  store.delete('proxies')
  document.getElementById('prxfilestate').innerHTML = "Proxies: No file selected (proxy:port)"
  document.getElementById('prxfileselectbtn').innerHTML = "Select"
  document.getElementById("prxfileselectbtn").className = "btn btn-sm btn-error btn-outline"
  document.getElementById('prxfilestate').className = "m-1 text-error"
}