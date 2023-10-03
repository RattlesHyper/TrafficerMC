const mc = require('minecraft-protocol')
const socks = require('socks').SocksClient
const ProxyAgent = require('proxy-agent')
const path = require('path')
const { salt, delay , proxyLog, createPopup } = require(path.join(__dirname, "..", "utils.js"))
process.NODE_TLS_REJECT_UNAUTHORIZED = "0"

let proxyList = "";
let stopCheck = false;

async function checkProxy(proxies) {
  start(proxies)
  idStopCheck.addEventListener('click', () => {
    stop()
  })
  const lines = proxyList.toString().split(/\r?\n/)
  for (var i = 0; i < lines.length; i++) {
    if(stopCheck) break;
    checkMain(lines[i].split(':')[0], lines[i].split(':')[1])
    idCheckCount.innerHTML =  i + 1 + "/" + lines.length
    await delay(idproxyCheckDelay.value ? idproxyCheckDelay.value : 100)
  }
}

function checkMain(proxyHost, proxyPort) {
  var serverHost = idIp.value.split(':')[0] ? idIp.value.split(':')[0] : "localhost";
  var serverPort = idIp.value.split(':')[1] ? idIp.value.split(':')[1] : 25565;
  var options = {
      connect: client => {
          socks.createConnection({
            proxy: {
              host: proxyHost,
              port: parseInt(proxyPort),
              type: parseInt(idProxyCheckProtocol.value)
            },
            command: 'connect',
            destination: {
              host: serverHost,
              port: parseInt(serverPort)
            }
          }, (err, info) => {
            if (err) {return;}
            client.setSocket(info.socket);
            client.emit('connect')
          })
        },
      agent: new ProxyAgent({ protocol: `socks${parseInt(idProxyCheckProtocol.value)}`, host: proxyHost, port: proxyPort }),
      host: serverHost,
      port: serverPort,
      username: salt(15),
      version: idBotVersion.value
  }
  var bot = mc.createClient(options);
  bot.once('connect', ()=> {
    addProxy(`${proxyHost}:${proxyPort}`)
    bot.end()
  });
  bot.on('error', (err) => {
    proxyLog('Proxy Error: '+ err.message)
  });
  setTimeout(() => {
    bot.end()
    proxyLog("Proxy Timeout: " + proxyHost + ":" + proxyPort)
  }, idProxyTimeout.value ? idProxyTimeout.value : 1000);
}

function stop() {
  stopCheck = true
  const lines = proxyList.toString().split(/\r?\n/)
  idCheckCount.innerHTML =  "0/" + lines.length
  idProxyDownbar.style.display = "none"
  createPopup("Stopped checking")
}

function start(proxies) {
  stopCheck = false
  proxyList = proxies;
  idProxylist.value = "";
  idProxyDownbar.style.removeProperty("display");
  createPopup("Started Checking")
}

function addProxy(proxy) {
  idProxylist.value += proxy + "\n"
  proxyLog("Added: " + proxy);
}

module.exports = {
    checkProxy
}