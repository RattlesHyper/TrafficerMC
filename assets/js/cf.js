const mineflayer = require('mineflayer');
const { EventEmitter } = require('events')
const socks = require('socks').SocksClient
const ProxyAgent = require('proxy-agent')
const botApi = new EventEmitter()
const fetch = require('node-fetch')
const fs = require('fs')
const currentVersion = "1.9.2"

//bot connect method
function connectBot() {
    if(idAccountFileCheck.checked && idAccountFilePath.value) {
        startAccountFile(idAccountFilePath.files[0].path)
    } else {
        if(idBotCount.value <= 1) {
            newBot(getBotInfo(idBotUsername.value, "0"))
        } else {
            if(idBotUsername.value) {
                startWname()
            } else {
                startWnoName()
            }
        }
    }
}

//connection methods
async function startAccountFile(accountFile) {
    sendLog(`<li> <img src="./assets/icons/app/code.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(28%) sepia(100%) saturate(359%) hue-rotate(172deg) brightness(93%) contrast(89%)"> Account File Loaded. </li>`)
	const file = fs.readFileSync(accountFile)
    const lines = file.toString().split(/\r?\n/)
    const count = idBotCount.value ? idBotCount.value: lines.length
    for (var i = 0; i < count; i++) {
        newBot(getBotInfo(lines[i], i))
        await delay(idJoinDelay.value ? idJoinDelay.value : 1000)
    }
}
async function startWname() {
    for (var i = 0; i < idBotCount.value; i++) {
        let options = getBotInfo(idBotUsername.value, i)
        if(idBotUsername.value.includes("(SALT)")) {
            newBot(options)
        } else {
            options.username = options.username+"_"+i
            newBot(options)
        }
        await delay(idJoinDelay.value ? idJoinDelay.value : 1000)
    }
}
async function startWnoName() {
    for (var i = 0; i < idBotCount.value; i++) {
        newBot(getBotInfo(idBotUsername.value, i))
        await delay(idJoinDelay.value ? idJoinDelay.value : 1000)
    }
}

//send bot info
function getBotInfo(botName, n) {
    let unm = "";
    unm = botName.replace("(SALT)", salt(4)).replace("(SALT)", salt(4)).replace("(SALT)", salt(4)).replace("(SALT)", salt(4))

    if(idProxyToggle.checked){
        const file = fs.readFileSync(idProxyFilePath.files[0].path)
        const lines = file.toString().split(/\r?\n/)
        const rnd = Math.floor(Math.random() * lines.length)
        let proxyHost = '';
        let proxyPort = '';

        if(idProxyOrderRnd.checked) {
            proxyHost = lines[rnd].split(":")[0]
            proxyPort = lines[rnd].split(":")[1]
        } else {
            if(n >= lines.length) {n = rnd}
            proxyHost = lines[n].split(":")[0]
            proxyPort = lines[n].split(":")[1]
        }
        
        options = {
            connect: client => {
                socks.createConnection({
                  proxy: {
                    host: proxyHost,
                    port: parseInt(proxyPort),
                    type: parseInt(idProxyType.value)
                  },
                  command: 'connect',
                  destination: {
                    host: idIp.value.split(':')[0],
                    port: parseInt(idIp.value.split(':')[1] ? idIp.value.split(':')[1]: 25565)
                  }
                }, (err, info) => {
                  if (err) {
                    sendLog(`[ProxyError]-> [${unm}]-> [proxy:port]-> ${err}`)
                    return;
                  }
                  client.setSocket(info.socket);
                  client.emit('connect')
                })
            },
            agent: new ProxyAgent({ protocol: `socks${idProxyType.value}`, host: proxyHost, port: proxyPort }),
            host: idIp.value.split(':')[0] ? idIp.value.split(':')[0] : "localhost",
            port: idIp.value.split(':')[1] ? idIp.value.split(':')[1] : 25565,
            username: unm ? unm: salt(10),
            version: idBotVersion.value,
            auth: idAuthType.value,
            onMsaCode: function (data) {
                sendLog(`<li> <img src="./assets/icons/app/code.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(28%) sepia(100%) saturate(359%) hue-rotate(172deg) brightness(93%) contrast(89%)">[${botName}] First time signing in. Please authenticate now: To sign in, use a web browser to open the page https://www.microsoft.com/link and enter the code: ${data.user_code} to authenticate. </li>`)
              }
        };
        return options;
    } else {
        options = {
            host: idIp.value.split(':')[0] ? idIp.value.split(':')[0] : "localhost" ,
            port: idIp.value.split(':')[1] ? idIp.value.split(':')[1] : 25565,
            username: unm ? unm: salt(10),
            version: idBotVersion.value,
            auth: idAuthType.value,
            onMsaCode: function (data) {
                sendLog(`<li> <img src="./assets/icons/app/code.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(28%) sepia(100%) saturate(359%) hue-rotate(172deg) brightness(93%) contrast(89%)">[${botName}] First time signing in. Please authenticate now: To sign in, use a web browser to open the page https://www.microsoft.com/link and enter the code: ${data.user_code} to authenticate. </li>`)
              }
        };
        
        return options;
    }
}

//random char
function salt(length) {
	var result = '';
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for ( var i = 0; i < length; i++ ) {
	  result += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return result;
}

//delay function
function delay(ms) {
	return new Promise(res => setTimeout(res, ms))
};

//add players to player list
function addPlayer(name) {
    const b = document.createElement("li")
    b.id = "list"+name
    b.innerHTML = name
    idBotList.appendChild(b)
    idBotList.scrollTop = idBotList.scrollHeight
    updateBotCount()
}

//remove player from list
function rmPlayer(name) {
    if(document.getElementById("list"+name)) document.getElementById("list"+name).remove()
    updateBotCount()
}

//log error
function errBot(name) {
    rmPlayer(name)
    updateBotCount()
}

//console logs
function sendLog(log) {
    const b = document.createElement("li")
    b.innerHTML = log
    idChatBox.appendChild(b)
    idChatBox.scrollTop = idChatBox.scrollHeight
}

//execute command all bots
function exeAll(command, a1, a2) {
    if(idBotList.getElementsByTagName("li").length === 0) return;
    let list = ["BLANK"]
    start()
    sendLog(`<li> <img src="./assets/icons/app/code.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(28%) sepia(100%) saturate(359%) hue-rotate(172deg) brightness(93%) contrast(89%)"> [${command}] ${a1? a1: ""} ${a2 ? a2: ""} </li>`)
    function start() {
        let l = idBotList.getElementsByTagName("li").length
        for (var i = 0; i < l; i++) {
            if(i+1 === l) { startcmd(a1, a2) }
            list.push(idBotList.getElementsByTagName("li")[i].innerHTML+command)
        }
    }
    async function startcmd(a1, a2) {
        for (var i = 0; i < list.length; i++) {
            botApi.emit(list[i], a1, a2)
            await delay(idLinearValue.value)
        }
    }

}

function updateBotCount() {
    idDownbarBotCount.innerHTML = idBotList.getElementsByTagName("li").length
}

  //script controler
  async function startScript(botId, script) {
    sendLog(`<li> <img src="./assets/icons/app/code.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(28%) sepia(100%) saturate(359%) hue-rotate(172deg) brightness(93%) contrast(89%)"> [${botId}] Script started. </li>`)
	const file = fs.readFileSync(script)
    const lines = file.toString().split(/\r?\n/)

	for (var i = 0; i < lines.length; i++) {
	  const args = lines[i].split(" ")
	  const command = args.shift().toLowerCase();
      if(command === "delay") { await delay(args.shift()) }
      else if(command === "chat") { botApi.emit(botId+command, lines[i].slice(5)) } else { botApi.emit(botId+command, args.shift(), args.shift(1)) }
	}
  }

//check version
function checkVer() {
    const outdatedVersionAlert = document.getElementById('outdatedVersion')
    const ids = ['aboutPageVersion', 'topBarVersion']
    ids.forEach(e => {
        document.getElementById(e).innerHTML = `v${currentVersion}`
    })
    fetch("https://raw.githubusercontent.com/RattlesHyper/TrafficerMC/main/VERSION", {method: 'GET'})
    .then(response => response.text())
    .then(result => {
        if(result.replaceAll("\n", "").replaceAll(" ", "") !== currentVersion) {
            outdatedVersionAlert.style.display = outdatedVersionAlert.style.display.replace("none", "")
        }
    })
}

module.exports = { getBotInfo, connectBot, salt, delay, addPlayer, rmPlayer, errBot, sendLog, exeAll, startScript, checkVer, mineflayer, botApi }
