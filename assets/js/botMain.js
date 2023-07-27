const { ipcRenderer, shell } = require("electron")
const { connectBot, delay, salt, addPlayer, rmPlayer, errBot, botApi, sendLog, exeAll, checkVer, startScript, mineflayer, loadTheme, createPopup, formatText, selectedList } = require( __dirname + '/assets/js/cf.js')
const antiafk = require( __dirname +  '/assets/plugins/antiafk')
process.NODE_TLS_REJECT_UNAUTHORIZED = "0"
let currentTime = Date.now()

//ids
let idVersion = document.getElementById('topBarVersion')
let idBotUsername = document.getElementById('botUsename')
let idAuthType = document.getElementById('botAuthType')
let idIp = document.getElementById('botConnectIp')
let idBotCount = document.getElementById('botCount')
let idJoinDelay = document.getElementById('joinDelay')
let idJoinMessage = document.getElementById('joinMessage')
let idBtnStart = document.getElementById('btnStart')
let idBtnStop = document.getElementById('btnStop')
let idBotVersion = document.getElementById('botversion')
let idBotList = document.getElementById('botList')
let idBtnDc = document.getElementById('btnDisconnect')
let idBtnRc = document.getElementById('btnReconnect')
let idBtnUse = document.getElementById('btnUseHeld')
let idBtnClose = document.getElementById('btnCloseWin')
let idBtnStartScript = document.getElementById('btnStartScript')
let idBtnChat = document.getElementById('btnChatMessage')
let idChatMessage = document.getElementById('chatMessage')
let idSpamMessage = document.getElementById('spamMessageBox')
let idSpamDelay = document.getElementById('spamDelay')
let idProxyToggle = document.getElementById('useProxy')
let idDownbarBotCount = document.getElementById('downbarBotCount')
let idChatBox = document.getElementById('chatBox')
let idCheckAutoRc = document.getElementById('checkboxAutoRc')
let idReconDelay = document.getElementById('reconDelay')
let idConnectSound = document.getElementById('connectSound')
let idDiconnectSound = document.getElementById('disconnectSound')
let idErrorSound = document.getElementById('errorSound')
let idBtnSpam = document.getElementById('startSpam')
let idBtnSpamStop = document.getElementById('stopSpam')
let idUptime = document.getElementById('uptime')
let idHotbarSlot = document.getElementById('hotbarSlot')
let idBtnSetHotbar = document.getElementById('btnSetHotbar')
let idBtnWinClickSlot = document.getElementById('windowValue')
let idClickWinLoR = document.getElementById('clickWindowLorR')
let idBtnWinClick = document.getElementById('btnWindowClick')
let idControlValue = document.getElementById('controlValue')
let idControlStart = document.getElementById('startControl')
let idControlStop = document.getElementById('stopControl')
let idLookValue = document.getElementById('lookValue')
let idBtnLookAt = document.getElementById('setLook')
let idCheckSprint = document.getElementById('checkboxSprint')
let idBtnDrop = document.getElementById('btnDrop')
let idDropValue = document.getElementById('dropValue')
let idLinearValue = document.getElementById('linearValue')
let idScriptPath = document.getElementById('scriptPath')
let idScriptCheck = document.getElementById('scriptCheck')
let idAccountFileCheck = document.getElementById('accountFileCheck')
let idAccountFilePath = document.getElementById('accountFilePath')
let idBtnM = document.getElementById('btnMinimize')
let idBtnC = document.getElementById('btnClose')
let idProxyFilePath = document.getElementById('proxyFilePath')
let idProxyType = document.getElementById('proxyType')
let idProxyOrderRnd = document.getElementById('proxyOrderRnd')
let idCheckAntiSpam = document.getElementById('checkAntiSpam')
let idAntiAfkLoad = document.getElementById('loadAntiAfk')
let idStartAfk = document.getElementById('startAfk')
let idStopAfk = document.getElementById('stopAfk')
let antiSpamLength = document.getElementById('antiSpamLength')
let idBtnCustomCss = document.getElementById('btnSaveTheme')
let idCustomCssFile = document.getElementById('customCssFile')
let idPopupUl = document.getElementById('listul')
let idShowChatCheck = document.getElementById('showChatCheck')
let idWindow = document.getElementById('botOpenWindow')
let idWindowTitle = document.getElementById('botOpenWindowName')
let idKarange = document.getElementById('kaRange')
let idKadelay = document.getElementById('kaDelay')
let idTplayer = document.getElementById('kaTp')
let idTvehicle = document.getElementById('kaTv')
let idTmob = document.getElementById('kaTm')
let idTanimal = document.getElementById('kaTa')
let idKaToggle = document.getElementById('toggleka')
let idKaLook = document.getElementById('toggleKaLook')
let idAutoSelect = document.getElementById('toggleAutoSelect')
let idCheckOnRespawn = document.getElementById('scriptCheckOnRespawn')
let idCheckOnDeath = document.getElementById('scriptCheckOnDeath')
let idCheckIgnoreFriends = document.getElementById('checkKaIgnoreSelected')

//button listeners
window.addEventListener('DOMContentLoaded', () => {
    botApi.setMaxListeners(0)
    checkVer()
    idBtnStart.addEventListener('click', () => {connectBot(); saveData()})
    idBtnStop.addEventListener('click', () => {botApi.emit('stopBots')})
    idBtnDc.addEventListener('click', () => {exeAll("disconnect")})
    idBtnUse.addEventListener('click', () => {exeAll("useheld")})
    idBtnClose.addEventListener('click', () => {exeAll("closewindow")})
    idBtnSpam.addEventListener('click', () => {botApi.emit("spam", idSpamMessage.value, idSpamDelay.value)})
    idBtnSpamStop.addEventListener('click', () => {botApi.emit("stopspam")})
    idBtnChat.addEventListener('click', () => {exeAll("chat", idChatMessage.value)})
    idBtnSetHotbar.addEventListener('click', () => {exeAll("sethotbar", idHotbarSlot.value)})
    idBtnWinClick.addEventListener('click', () => {exeAll("winclick", idBtnWinClickSlot.value, idClickWinLoR.value)})
    idControlStart.addEventListener('click', () => {exeAll("startcontrol", idControlValue.value)})
    idControlStop.addEventListener('click', () => {exeAll("stopcontrol", idControlValue.value)})
    idBtnLookAt.addEventListener('click', () => {exeAll("look", idLookValue.value)})
    idCheckSprint.addEventListener('click', () => {exeAll("sprintcheck", idCheckSprint.checked)})
    idBtnDrop.addEventListener('click', () => {exeAll("drop", idDropValue.value)})
    idBtnStartScript.addEventListener('click', () => {
        const list = selectedList()
        if(list.length === 0) return createPopup("No bot selected")
        list.forEach(name => {
            startScript(name, idScriptPath.value)
        });
    })
    idStartAfk.addEventListener('click', () => {exeAll('afkon')})
    idStopAfk.addEventListener('click', () => {exeAll('afkoff')})
    idBtnC.addEventListener('click', () => {saveData(); window.close()})
    idBtnM.addEventListener('click', () => {ipcRenderer.send('minimize')})
    idBtnCustomCss.addEventListener('click', () => {
        const path = idCustomCssFile.files[0].path
        if(path) {
            loadTheme(path)
            ipcRenderer.send('theme', (event, path))
        }
    })
    idKaToggle.addEventListener('change', ()=> {
        if(idKaToggle.checked) {
            botApi.emit("toggleka", idKadelay.value)
        } else {
            botApi.emit("stopka")
        }
    })
})


function newBot(options) {
    const bot = mineflayer.createBot(options)
    let afkLoaded = false

    bot.once('login', ()=> {
        botApi.emit("login", bot.username)
    });
    bot.once('spawn', ()=> {
        botApi.emit("spawn", bot.username)
        if(idJoinMessage) {bot.chat(idJoinMessage.value)}
        if(idScriptCheck.checked && idScriptPath.value) { startScript(bot.username, idScriptPath.value)}
    });
    bot.once('kicked', (reason)=> {
        botApi.emit("kicked", options.username, reason)
    });
    bot.once('end', (reason)=> {
        botApi.emit("end", options.username, reason)
        if(idCheckAutoRc.checked === true) {
            recon()
            async function recon() {
                await delay(idReconDelay.value)
                newBot(options)
            }
        }
    });
    bot.once('error', (err)=> {
        botApi.emit("error", options.username, err)
    });
    
    bot.on('messagestr', (message) => {
        if(!message) return;
        if(idShowChatCheck.checked) {
            sendLog(`[${options.username}] ${message}`)
        }
    });

    bot.on('windowOpen', (window) => {
        sendLog(`[${bot.username}] Window opened`)
    })
    bot.on('death', function() {
        botApi.emit('death', options.username)
        bot.once('respawn', function() {
            if(idCheckOnDeath.checked && idScriptPath.value) { startScript(bot.username, idScriptPath.value)}
        })
    })
    bot.on('respawn', function() {
        botApi.emit('respawn', options.username)
        if(idCheckOnRespawn.checked && idScriptPath.value) { startScript(bot.username, idScriptPath.value)}
    })

    botApi.once(options.username+'disconnect', () => {bot.quit()})
    botApi.once(options.username+'reconnect', () => {newBot(options)})
    botApi.on(options.username+'useheld', () => {bot.activateItem()})
    botApi.on(options.username+'closewindow', () => {bot.closeWindow(bot.currentWindow)})
    botApi.on(options.username+'chat', (o) => { if(idCheckAntiSpam.checked) { bot.chat(o.toString().replaceAll("(SALT)", salt(4))+" "+salt(antiSpamLength.value ? antiSpamLength.value : 5)) } else { bot.chat(o.toString().replaceAll("(SALT)", salt(4))) } })
    botApi.on(options.username+'sethotbar', (o) => {bot.setQuickBarSlot(o)})
    botApi.on(options.username+'winclick', (o, i) => {if(i == 0) {bot.clickWindow(o, 0, 0)} else {bot.clickWindow(o, 1, 0)}})
    botApi.on(options.username+'stopcontrol', (o) => {bot.setControlState(o, false)})
    botApi.on(options.username+'look', (o) => {bot.look(o, 0)})
    botApi.on(options.username+'sprintcheck', (o) => {bot.setControlState('sprint', o)})
    botApi.on(options.username+'startscript', () => {startScript(bot.username, idScriptPath.value)})
    
    botApi.on(options.username+'afkon', () => {
        if(!afkLoaded) {
            afkLoaded = true
            bot.loadPlugin(antiafk)
            bot.afk.start()
        } else {
            bot.afk.start()
        }
    })
    botApi.on(options.username+'afkoff', () => {bot.afk.stop()})

    botApi.on(options.username+'drop', (o) => {
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

    botApi.on(options.username+'startcontrol', (o) => {
        bot.setControlState(o, true)
        if(idCheckSprint.checked === true) {bot.setControlState('sprint', true)} else {bot.setControlState('sprint', false)}
    })

    idBtnRc.addEventListener('click', () => {botApi.emit(options.username+'reconnect')})

    botApi.on(options.username + 'hit', () => {
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
                    sendLog(`<li> <img src="./assets/icons/app/code.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(28%) sepia(100%) saturate(359%) hue-rotate(172deg) brightness(93%) contrast(89%)"> [hit] ${entity.displayName ? entity.displayName : "Unknown Entity"} </li>`)
                }
                if (entity.kind === "Passive mobs" && idTanimal.checked) {
                    if (idKaLook.checked) {
                        bot.lookAt(entity.position, true);
                        bot.attack(entity);
                    } else {
                        bot.attack(entity);
                    }
                    sendLog(`<li> <img src="./assets/icons/app/code.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(28%) sepia(100%) saturate(359%) hue-rotate(172deg) brightness(93%) contrast(89%)"> [hit] ${entity.displayName ? entity.displayName : "Unknown Entity"} </li>`)
                }
                if (entity.kind === "Vehicles" && idTvehicle.checked) {
                    if (idKaLook.checked) {
                        bot.lookAt(entity.position, true);
                        bot.attack(entity);
                    } else {
                        bot.attack(entity);
                    }
                    sendLog(`<li> <img src="./assets/icons/app/code.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(28%) sepia(100%) saturate(359%) hue-rotate(172deg) brightness(93%) contrast(89%)"> [hit] ${entity.displayName ? entity.displayName : "Unknown Entity"} </li>`)
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
                    sendLog(`<li> <img src="./assets/icons/app/code.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(28%) sepia(100%) saturate(359%) hue-rotate(172deg) brightness(93%) contrast(89%)"> [hit] ${entity.username} </li>`)
                }
            }
        });
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
    sendLog(`<li> <img src="./assets/icons/app/arrow-right.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(68%) sepia(74%) saturate(5439%) hue-rotate(86deg) brightness(128%) contrast(114%)"> ${name} Logged in.</li>`)
    if(idConnectSound.checked === true) {
        playAudio("connected.mp3")
    }
})
botApi.on("end", (name, reason)=> {
    rmPlayer(name)
    sendLog(`<li> <img src="./assets/icons/app/alert-triangle.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(100%) sepia(61%) saturate(4355%) hue-rotate(357deg) brightness(104%) contrast(104%)"> [${name}] ${reason}</li>`)
    if(idDiconnectSound.checked === true) {
        playAudio("")
    }
})
botApi.on("error", (name, err)=> {
    errBot(name)
    sendLog(`<li> <img src="./assets/icons/app/alert-triangle.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(89%) sepia(82%) saturate(799%) hue-rotate(1deg) brightness(103%) contrast(102%)"> [${name}] ${err}</li>`)
    if(idErrorSound.checked === true) {
        playAudio("error.wav")
    }
})
botApi.on("spawn", (name)=> {
    sendLog(`<li> <img src="./assets/icons/app/arrow-right.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(26%) sepia(94%) saturate(5963%) hue-rotate(74deg) brightness(96%) contrast(101%)"> ${name} Spawned.</li>`)
})
botApi.on("death", (name)=> {
    sendLog(`<li> <img src="./assets/icons/app/arrow-right.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(26%) sepia(94%) saturate(5963%) hue-rotate(74deg) brightness(96%) contrast(101%)"> ${name} Died.</li>`)
})
botApi.on("respawn", (name)=> {
    sendLog(`<li> <img src="./assets/icons/app/arrow-right.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(26%) sepia(94%) saturate(5963%) hue-rotate(74deg) brightness(96%) contrast(101%)"> ${name} Respawned.</li>`)
})
botApi.on("kicked", (name, reason)=> {
    rmPlayer(name)
    sendLog(`<li> <img src="./assets/icons/app/arrow-left.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(11%) sepia(92%) saturate(6480%) hue-rotate(360deg) brightness(103%) contrast(113%)"> [${name}] : ${formatText(JSON.parse(reason))}</li>`)
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

process.on('uncaughtException', (err) => {sendLog(`<li> <img src="./assets/icons/app/alert-triangle.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(11%) sepia(92%) saturate(6480%) hue-rotate(360deg) brightness(103%) contrast(113%)"> [Internal Error] ${err}</li>`)})