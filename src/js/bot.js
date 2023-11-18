const { ipcRenderer, shell } = require("electron");
const fs = require('fs');
const path = require('path');
const { connectBot, delay, salt, addPlayer, rmPlayer, errBot, botApi, sendLog, exeAll, checkVer, startScript, loadTheme, createPopup, formatText, selectedList, checkAuth, createBot, scrapeProxy } = require(path.join(__dirname, "js", "utils.js"));
const { checkProxy } = require(path.join(__dirname, "js", "plugins", "proxy.js"))
const antiafk = require(path.join(__dirname, "js", "plugins", "afk.js"))

let currentTime

// ids
const idBotUsername = document.getElementById('botUsename')
const idAuthType = document.getElementById('botAuthType')
const idIp = document.getElementById('botConnectIp')
const idBotCount = document.getElementById('botCount')
const idJoinDelay = document.getElementById('joinDelay')
const idJoinMessage = document.getElementById('joinMessage')
const idBtnStart = document.getElementById('btnStart')
const idBtnStop = document.getElementById('btnStop')
const idBotVersion = document.getElementById('botversion')
const idBotList = document.getElementById('botList')
const idBtnDc = document.getElementById('btnDisconnect')
const idBtnRc = document.getElementById('btnReconnect')
const idBtnUse = document.getElementById('btnUseHeld')
const idBtnClose = document.getElementById('btnCloseWin')
const idBtnStartScript = document.getElementById('btnStartScript')
const idBtnChat = document.getElementById('btnChatMessage')
const idChatMessage = document.getElementById('chatMessage')
const idSpamMessage = document.getElementById('spamMessageBox')
const idSpamDelay = document.getElementById('spamDelay')
const idProxyToggle = document.getElementById('useProxy')
const idDownbarBotCount = document.getElementById('downbarBotCount')
const idChatBox = document.getElementById('chatBox')
const idCheckAutoRc = document.getElementById('checkboxAutoRc')
const idReconDelay = document.getElementById('reconDelay')
const idBtnSpam = document.getElementById('startSpam')
const idBtnSpamStop = document.getElementById('stopSpam')
const idUptime = document.getElementById('uptime')
const idHotbarSlot = document.getElementById('hotbarSlot')
const idBtnSetHotbar = document.getElementById('btnSetHotbar')
const idBtnWinClickSlot = document.getElementById('windowValue')
const idClickWinLoR = document.getElementById('clickWindowLorR')
const idBtnWinClick = document.getElementById('btnWindowClick')
const idControlValue = document.getElementById('controlValue')
const idControlStart = document.getElementById('startControl')
const idControlStop = document.getElementById('stopControl')
const idLookValue = document.getElementById('lookValue')
const idBtnLookAt = document.getElementById('setLook')
const idCheckSprint = document.getElementById('checkboxSprint')
const idBtnDrop = document.getElementById('btnDrop')
const idDropValue = document.getElementById('dropValue')
const idLinearValue = document.getElementById('linearValue')
const idScriptPath = document.getElementById('scriptPath')
const idScriptCheck = document.getElementById('scriptCheck')
const idAccountFileCheck = document.getElementById('accountFileCheck')
const idAccountFilePath = document.getElementById('accountFilePath')
const idBtnM = document.getElementById('btnMinimize')
const idBtnC = document.getElementById('btnClose')
const idProxyFilePath = document.getElementById('proxyFilePath')
const idProxyType = document.getElementById('proxyType')
const idProxyOrderRnd = document.getElementById('proxyOrderRnd')
const idCheckAntiSpam = document.getElementById('checkAntiSpam')
const idAntiAfkLoad = document.getElementById('loadAntiAfk')
const idStartAfk = document.getElementById('startAfk')
const idStopAfk = document.getElementById('stopAfk')
const antiSpamLength = document.getElementById('antiSpamLength')
const idBtnCustomCss = document.getElementById('btnSaveTheme')
const idCustomCssFile = document.getElementById('customCssFile')
const idPopupUl = document.getElementById('listul')
const idShowChatCheck = document.getElementById('showChatCheck')
const idWindow = document.getElementById('botOpenWindow')
const idWindowTitle = document.getElementById('botOpenWindowName')
const idKarange = document.getElementById('kaRange')
const idKadelay = document.getElementById('kaDelay')
const idTplayer = document.getElementById('kaTp')
const idTvehicle = document.getElementById('kaTv')
const idTmob = document.getElementById('kaTm')
const idTanimal = document.getElementById('kaTa')
const idKaToggle = document.getElementById('toggleka')
const idKaLook = document.getElementById('toggleKaLook')
const idAutoSelect = document.getElementById('toggleAutoSelect')
const idCheckOnRespawn = document.getElementById('scriptCheckOnRespawn')
const idCheckOnDeath = document.getElementById('scriptCheckOnDeath')
const idCheckIgnoreFriends = document.getElementById('checkKaIgnoreSelected')
const idAltToken = document.getElementById('easymcAuthToken')
const idStartScrape = document.getElementById('proxyScrapeStart')
const idProxyLogs = document.getElementById('proxyLogs')
const idScrapeProtocol = document.getElementById('proxyScrapeProtocol')
const idProxylist = document.getElementById('proxyTextBox')
const idStartProxyCheck = document.getElementById('buttonStartCheckBoxList')
const idProxyCheckProtocol = document.getElementById('proxyCheckProtocol')
const idProxyTimeout = document.getElementById('proxyTimeout')
const idproxyCheckDelay = document.getElementById('proxyCheckDelay')
const idStopCheck = document.getElementById('buttonStopCheck')
const idProxyDownbar = document.getElementById('proxyInfoDownbar')
const idCheckCount = document.getElementById('proxyInfoDownbarCount')
const idBtnCheckFile = document.getElementById('checkProxyfile')
const idTabBot = document.getElementById('btnBotting')
const idNameMethod = document.getElementById('usernameMethod')

// button listeners

window.onload = () => {
    botApi.setMaxListeners(0)
    checkVer()
}

idBtnStart.onclick = () => {
    if(idNameMethod.value == "default" && !idBotUsername.value) {
        createPopup("Invalid Username!", "red")
        return;
    }
    connectBot();
    saveData();
    idTabBot.click()
}
idBtnStop.onclick = () => {botApi.emit('stopBots')}
idBtnDc.onclick = () => {exeAll("disconnect")}
idBtnUse.onclick = () => {exeAll("useheld")}
idBtnClose.onclick = () => {exeAll("closewindow")}
idBtnSpam.onclick = () => {botApi.emit("spam", idSpamMessage.value, idSpamDelay.value)}
idBtnSpamStop.onclick = () => {botApi.emit("stopspam")}
idBtnChat.onclick = () => {exeAll("chat", idChatMessage.value)}
idBtnSetHotbar.onclick = () => {exeAll("sethotbar", idHotbarSlot.value)}
idBtnWinClick.onclick = () => {exeAll("winclick", idBtnWinClickSlot.value, idClickWinLoR.value)}
idControlStart.onclick = () => {exeAll("startcontrol", idControlValue.value)}
idControlStop.onclick = () => {exeAll("stopcontrol", idControlValue.value)}
idBtnLookAt.onclick = () => {exeAll("look", idLookValue.value)}
idCheckSprint.onclick = () => {exeAll("sprintcheck", idCheckSprint.checked)}
idBtnDrop.onclick = () => {exeAll("drop", idDropValue.value)}
idStartScrape.onclick = () => {scrapeProxy()}
idStartProxyCheck.onclick = () => {checkProxy(idProxylist.value)}
idBtnCheckFile.onclick = () => {
    const path = fs.readFileSync(idProxyFilePath.files[0].path)
    if (!path) return createPopup("No file selected.")
    const list = path.toString()
    checkProxy(list)
}

idBtnStartScript.onclick = () => {
    const list = selectedList()
    if(list.length === 0) return createPopup("No bot selected")
    list.forEach(name => {
        startScript(name, idScriptPath.value)
    });
}
idStartAfk.onclick = () => {exeAll('afkon')}
idStopAfk.onclick = () => {exeAll('afkoff')}
idBtnC.onclick = () => {saveData(); window.close()}
idBtnM.onclick = () => {ipcRenderer.send('minimize')}
idBtnCustomCss.onclick = () => {
    const path = idCustomCssFile.files[0].path
    if(path) {
        loadTheme(path)
        ipcRenderer.send('theme', (event, path))
    }
}
idKaToggle.onchange = () => {
    if(idKaToggle.checked) {
        botApi.emit("toggleka", idKadelay.value)
    } else {
        botApi.emit("stopka")
    }
}
idAuthType.onchange = () => {checkAuth()}


async function newBot(options) {
    const bot = createBot(options)
    let afkLoaded = false
    await bot.once('login', ()=> {
        botApi.emit("login", bot.username)
        botApi.once(bot.username+'disconnect', () => {bot.quit()})
        botApi.once(bot.username+'reconnect', () => {newBot(options)})
        botApi.on(bot.username+'useheld', () => {bot.activateItem()})
        botApi.on(bot.username+'closewindow', () => {bot.closeWindow(bot.currentWindow)})
        botApi.on(bot.username+'chat', (o) => { if(idCheckAntiSpam.checked) { bot.chat(o.toString().replaceAll("(SALT)", salt(4))+" "+salt(antiSpamLength.value ? antiSpamLength.value : 5)) } else { bot.chat(o.toString().replaceAll("(SALT)", salt(4))) } })
        botApi.on(bot.username+'sethotbar', (o) => {bot.setQuickBarSlot(o)})
        botApi.on(bot.username+'winclick', (o, i) => {if(i == 0) {bot.clickWindow(o, 0, 0)} else {bot.clickWindow(o, 1, 0)}})
        botApi.on(bot.username+'stopcontrol', (o) => {bot.setControlState(o, false)})
        botApi.on(bot.username+'look', (o) => {bot.look(o, 0)})
        botApi.on(bot.username+'sprintcheck', (o) => {bot.setControlState('sprint', o)})
        botApi.on(bot.username+'startscript', () => {startScript(bot.username, idScriptPath.value)})
        if(idScriptCheck.checked) { startScript(bot.username, idScriptPath.value)}
        
        botApi.on(bot.username+'afkon', () => {
            if(!afkLoaded) {
                afkLoaded = true
                bot.loadPlugin(antiafk)
                bot.afk.start()
            } else {
                bot.afk.start()
            }
        })
        botApi.on(bot.username+'afkoff', () => {bot.afk.stop()})
    
        botApi.on(bot.username+'drop', (o) => {
            if(o) {
                bot.clickWindow(o, 0, 0)
                bot.clickWindow(-999, 0, 0)
            } else {
                (async () => {
                    const itemCount = bot.inventory.items().length
                    for (var i = 0; i < itemCount; i++) {
                        if (bot.inventory.items().length === 0) return
                        const item = bot.inventory.items()[0]
                        bot.tossStack(item)
                        await delay(10)
                    }
                  })();
            }
        })
    
        botApi.on(bot.username+'startcontrol', (o) => {
            bot.setControlState(o, true)
            if(idCheckSprint.checked === true) {bot.setControlState('sprint', true)} else {bot.setControlState('sprint', false)}
        })
    
        idBtnRc.addEventListener('click', () => {botApi.emit(bot.username+'reconnect')})
    
        botApi.on(bot.username + 'hit', () => {
            const entities = Object.values(bot.entities);
            entities.forEach((entity) => {
                const distance = bot.entity.position.distanceTo(entity.position);
                if (distance <= idKarange.value) {
                    if (entity.kind === "Hostile mobs" && idTmob.checked) {
                        if (idKaLook.checked) {
                            bot.lookAt(entity.position, true);
                            bot.attack(entity);
                        } else {
                            bot.attack(entity);
                        }
                        sendLog(`<li> <img src="./assets/icons/code.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(28%) sepia(100%) saturate(359%) hue-rotate(172deg) brightness(93%) contrast(89%)"> [hit] ${entity.displayName ? entity.displayName : "Unknown Entity"} </li>`)
                    }
                    if (entity.kind === "Passive mobs" && idTanimal.checked) {
                        if (idKaLook.checked) {
                            bot.lookAt(entity.position, true);
                            bot.attack(entity);
                        } else {
                            bot.attack(entity);
                        }
                        sendLog(`<li> <img src="./assets/icons/code.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(28%) sepia(100%) saturate(359%) hue-rotate(172deg) brightness(93%) contrast(89%)"> [hit] ${entity.displayName ? entity.displayName : "Unknown Entity"} </li>`)
                    }
                    if (entity.kind === "Vehicles" && idTvehicle.checked) {
                        if (idKaLook.checked) {
                            bot.lookAt(entity.position, true);
                            bot.attack(entity);
                        } else {
                            bot.attack(entity);
                        }
                        sendLog(`<li> <img src="./assets/icons/code.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(28%) sepia(100%) saturate(359%) hue-rotate(172deg) brightness(93%) contrast(89%)"> [hit] ${entity.displayName ? entity.displayName : "Unknown Entity"} </li>`)
                    }
                    if (entity.type === "player" && entity.username !== bot.username && idTplayer.checked) {
                        const list = selectedList()
                        if(list.includes(entity.username) && idCheckIgnoreFriends.checked) return;
                        if (idKaLook.checked) {
                            bot.lookAt(entity.position, true);
                            bot.attack(entity);
                        } else {
                            bot.attack(entity);
                        }
                        sendLog(`<li> <img src="./assets/icons/code.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(28%) sepia(100%) saturate(359%) hue-rotate(172deg) brightness(93%) contrast(89%)"> [hit] ${entity.username} </li>`)
                    }
                }
            });
        })
    });
    bot.once('spawn', ()=> {
        botApi.emit("spawn", bot.username)
        if(idJoinMessage) {bot.chat(idJoinMessage.value)}
    });
    bot.once('kicked', (reason)=> {
        botApi.emit("kicked", bot.username, reason)
    });
    bot.once('end', (reason)=> {
        botApi.emit("end", bot.username, reason)
        if(idCheckAutoRc.checked === true) {
            recon()
            async function recon() {
                await delay(idReconDelay.value)
                newBot(options)
            }
        }
    });
    bot.once('error', (err)=> {
        botApi.emit("error", bot.username, err)
    });
    
    bot.on('messagestr', (message) => {
        if(!message) return;
        if(idShowChatCheck.checked) {
            sendLog(`[${bot.username}] ${message}`)
        }
    });

    bot.on('windowOpen', (window) => {
        sendLog(`[${bot.username}] Window opened`)
    })
    bot.on('death', function() {
        botApi.emit('death', bot.username)
        bot.once('respawn', function() {
            if(idCheckOnDeath.checked && idScriptPath.value) { startScript(bot.username, idScriptPath.value)}
        })
    })
    bot.on('respawn', function() {
        botApi.emit('respawn', bot.username)
        if(idCheckOnRespawn.checked && idScriptPath.value) { startScript(bot.username, idScriptPath.value)}
    })
}

botApi.on('toggleka', (dl)=> {
    botApi.once('stopka', ()=> {clearInterval(katoggle)})
    var katoggle = setInterval(() => {
        exeAll('hit')
    }, dl ? dl: 500);
})

botApi.on('spam', (msg, dl) => {
    botApi.once('stopspam', ()=> {clearInterval(chatSpam)})
    var chatSpam = setInterval(() => {
        exeAll("chat", msg)
    }, dl ? dl: 1000);
})

botApi.on("login", (name)=> {
    addPlayer(name)
    sendLog(`<li> <img src="./assets/icons/arrow-right.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(68%) sepia(74%) saturate(5439%) hue-rotate(86deg) brightness(128%) contrast(114%)"> ${name} Logged in.</li>`)
})
botApi.on("end", (name, reason)=> {
    rmPlayer(name)
    sendLog(`<li> <img src="./assets/icons/alert-triangle.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(100%) sepia(61%) saturate(4355%) hue-rotate(357deg) brightness(104%) contrast(104%)"> [${name}] ${reason}</li>`)
})
botApi.on("error", (name, err)=> {
    errBot(name)
    sendLog(`<li> <img src="./assets/icons/alert-triangle.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(89%) sepia(82%) saturate(799%) hue-rotate(1deg) brightness(103%) contrast(102%)"> [${name}] ${err}</li>`)
})
botApi.on("spawn", (name)=> {
    sendLog(`<li> <img src="./assets/icons/arrow-right.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(26%) sepia(94%) saturate(5963%) hue-rotate(74deg) brightness(96%) contrast(101%)"> ${name} Spawned.</li>`)
})
botApi.on("death", (name)=> {
    sendLog(`<li> <img src="./assets/icons/arrow-right.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(26%) sepia(94%) saturate(5963%) hue-rotate(74deg) brightness(96%) contrast(101%)"> ${name} Died.</li>`)
})
botApi.on("respawn", (name)=> {
    sendLog(`<li> <img src="./assets/icons/arrow-right.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(26%) sepia(94%) saturate(5963%) hue-rotate(74deg) brightness(96%) contrast(101%)"> ${name} Respawned.</li>`)
})
botApi.on("kicked", (name, reason)=> {
    rmPlayer(name)
    sendLog(`<li> <img src="./assets/icons/arrow-left.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(11%) sepia(92%) saturate(6480%) hue-rotate(360deg) brightness(103%) contrast(113%)"> [${name}] : ${formatText(JSON.parse(reason))}</li>`)
})

// uptime counter
idBtnStart.addEventListener('click', () => {
    currentTime = Date.now()
    idBtnStart.addEventListener('click', () => {
        clearInterval(botUptime)
        idUptime.innerHTML = getTime(currentTime)
    })
    
let botUptime = setInterval(() => {
    idUptime.innerHTML = getTime(currentTime)
}, 1000);
})
function getTime(from) {
    const calc = Date.now() - from
    return convertTime((calc / 1000).toFixed())
}
function convertTime(number) {
    return `${formatTime(Math.floor(number / 60))}:${formatTime(number % 60)}`;
}
function formatTime(time) {
    if (10 > time) return "0" + time;
    return time;
}
function playAudio(filename) {
    new Audio( __dirname + `./assets/audios/${filename}`).play();
}
// save and restore config
ipcRenderer.on('restore', (event, data) => {
    Object.keys(data).forEach(v => {
        document.getElementById(v).value = data[v]
      });
      checkAuth()
})
ipcRenderer.on('restoreTheme', (event, path) => {
    loadTheme(path)
})
function saveData() {
    ipcRenderer.send('config', (event, {
        "botUsename": document.getElementById('botUsename').value,
        "botAuthType": document.getElementById('botAuthType').value,
        "botConnectIp": document.getElementById('botConnectIp').value,
        "botversion": document.getElementById('botversion').value,
        "botCount": document.getElementById('botCount').value,
        "joinDelay": document.getElementById('joinDelay').value,
        "joinMessage": document.getElementById('joinMessage').value,
        'scriptPath': document.getElementById('scriptPath').value
    }))
}

// process.on('uncaughtException', (err) => {sendLog(`<li> <img src="./assets/icons/alert-triangle.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(11%) sepia(92%) saturate(6480%) hue-rotate(360deg) brightness(103%) contrast(113%)"> [Internal Error] ${err}</li>`)})