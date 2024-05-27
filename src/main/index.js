/* eslint-disable no-case-declarations */
import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import crypto from 'crypto'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import fs from 'fs'
import { connection } from './js/proxy/proxyhandler'
import { checkProxy } from './js/proxy/proxycheck'
import { scrapeProxy } from './js/proxy/proxyscrape'
import {
  salt,
  delay,
  genName,
  botMode,
  easyMcAuth,
  sendEvent,
  proxyEvent,
  notify
} from './js/misc/utils'
import EventEmitter from 'node:events'
const Store = require('electron-store')
const mineflayer = require('mineflayer')
import { antiafk } from './js/misc/antiafk'
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const botApi = new EventEmitter()
botApi.setMaxListeners(0)
const store = new Store()

let stopBot = false
let stopScript = false
let stopProxyTest = false
let currentProxy = 0
let proxyUsed = 0

function storeinfo() {
  return store.get('config')
}

let clientVersion = 3.0

let playerList = []

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 500,
    show: false,
    autoHideMenuBar: true,
    frame: false,
    resizable: false,
    maximizable: false,
    webPreferences: {
      devTools: false,
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  ipcMain.on('loaded', () => {
    store.set('version', {
      current: clientVersion
    })
    mainWindow.webContents.send('setConfig', store.get('config'), store.get('version'))
    if (!storeinfo()) {
      mainWindow.webContents.send('initConfig')
    }
    if (store.get('config.namefile')) {
      mainWindow.webContents.send('fileSelected', 'nameFileLabel', store.get('config.namefile'))
    }
    mainWindow.show()
  })

  ipcMain.on('playerList', (event, list) => {
    playerList = list
  })

  ipcMain.on('open', (event, id, name) => {
    dialog
      .showOpenDialog(mainWindow, {
        title: name,
        filters: [{ name: 'Text File', extensions: ['txt'] }],
        properties: ['openFile', 'multiSelections']
      })
      .then((result) => {
        if (!result.canceled) {
          store.set('config.namefile', result.filePaths[0])
          mainWindow.webContents.send('fileSelected', id, result.filePaths[0])
        }
      })
      .catch((error) => {
        console.log(error)
        return
      })
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/index.html`)
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.rattleshyper.trafficermc')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
    optimizer.registerFramelessWindowIpc(window)
  })

  createMainWindow()
})

ipcMain.on('setConfig', (event, type, id, value) => {
  store.set(`config.${type}.${id}`, value)
})

ipcMain.on('deleteConfig', () => {
  store.delete('config')
})

ipcMain.on('checkboxClick', (event, id, state) => {
  switch (id) {
    case 'test':
      console.log(state)
      break
    default:
  }
})

ipcMain.on('btnClick', (event, btn) => {
  switch (btn) {
    case 'btnStart':
      connectBot()
      break
    case 'btnStop':
      stopBot = true
      notify('Info', 'Stopped sending bots.', 'success')
      break
    case 'btnChat':
      exeAll('chat ' + storeinfo().value.chatMsg)
      break
    case 'btnDisconnect':
      exeAll('disconnect')
      break
    case 'btnSetHotbar':
      exeAll('sethotbar ' + storeinfo().value.hotbarSlot)
      break
    case 'btnUseheld':
      exeAll('useheld')
      break
    case 'btnWinClickRight':
      exeAll('winclick ' + storeinfo().value.invSlot + ' 1')
      break
    case 'btnWinClickLeft':
      exeAll('winclick ' + storeinfo().value.invSlot + ' 0')
      break
    case 'btnDropSlot':
      exeAll('drop ' + storeinfo().value.invSlot)
      break
    case 'btnDropAll':
      exeAll('dropall')
      break
    case 'btnCloseWindow':
      exeAll('closewindow')
      break
    case 'btnStartMove':
      exeAll('startmove ' + storeinfo().value.moveType)
      break
    case 'btnStopMove':
      exeAll('stopmove ' + storeinfo().value.moveType)
      break
    case 'btnResetMove':
      exeAll('resetmove')
      break
    case 'btnLook':
      exeAll('look ' + storeinfo().value.lookDirection)
      break
    case 'btnAfkOn':
      exeAll('afkon')
      break
    case 'btnAfkOff':
      exeAll('afkoff')
      break
    case 'runScript':
      playerList.forEach((username) => {
        startScript(username)
      })
      break
    case 'stopScript':
      stopScript = true
      break
    case 'proxyTestStart':
      testProxy(storeinfo().value.proxyList)
      break
    case 'proxyTestStop':
      stopProxyTest = true
      proxyEvent('', 'stop', '', '')
      break
    case 'proxyScrape':
      if (storeinfo().value.proxyType === 'none')
        return notify('Error', 'Select proxy type', 'error')
      notify('Info', 'Scraping proxies...', 'success')
      setProxy()
      break
    default:
      break
  }
})

function setProxy() {
  scrapeProxy(storeinfo().value.proxyType)
    .then((result) => {
      proxyEvent('', 'scraped', result, '')
    })
    .catch((err) => {
      console.log(err)
      notify('Error', 'Failed to scrape proxies', 'error')
    })
}

async function testProxy(list) {
  stopProxyTest = false
  const server = storeinfo().value.server
  const [serverHost, serverPort] = server.split(':')
  if (!serverHost) return notify('Error', 'Invalid server address', 'error')
  if (!list) return notify('Error', 'Please enter proxy list', 'error')
  if (storeinfo().value.proxyType === 'none') return notify('Error', 'Select proxy type', 'error')
  notify('Info', 'Testing proxies...', 'success')
  proxyEvent('', 'start', '', '')
  const lines = list.split(/\r?\n/)
  for (let i = 0; i < lines.length; i++) {
    if (stopProxyTest) break
    const count = `${i + 1}/${lines.length}`
    const [host, port, username, password] = lines[i].split(':')
    checkProxy(
      storeinfo().value.proxyType,
      host,
      port,
      username,
      password,
      serverHost,
      serverPort || 25565,
      storeinfo().value.proxyCheckTimeout || 5000
    )
      .then((result) => {
        proxyEvent(result.proxy, 'success', '', count)
      })
      .catch((error) => {
        proxyEvent(error.proxy, 'fail', error.reason, count)
      })
    if (lines.length == i + 1) {
      proxyEvent('', 'stop', '', '')
    }
    await delay(storeinfo().value.proxyCheckDelay || 100)
  }
}

async function startScript(username) {
  stopScript = false
  if (!storeinfo().value.scriptText) return
  const scriptLines = storeinfo().value.scriptText.split(/\r?\n/)
  for (let i = 0; i < scriptLines.length; i++) {
    if (stopScript) break
    const args = scriptLines[i].split(' ')
    const command = args.shift().toLowerCase()
    switch (command) {
      case 'delay':
        await delay(parseInt(args[0]))
        break
      default:
        botApi.emit('botEvent', username, command, args.slice(0))
    }
  }
}

async function exeAll(command) {
  if (!command) return
  const list = playerList
  const cmd = command.split(' ')
  if (list.length == 0) return notify('Error', 'No bots selected', 'error')
  for (let i = 0; i < list.length; i++) {
    botApi.emit('botEvent', list[i], cmd[0], cmd.slice(1))
    if (storeinfo().boolean.isLinear) {
      await delay(storeinfo().value.linearDelay || 100)
    }
  }
  sendEvent('Executed', 'chat', 'Script: ' + command)
}

async function startFile() {
  BrowserWindow.getAllWindows()[0].webContents.send('showBottab')
  const filePath = storeinfo().namefile
  const lines = fs.readFileSync(filePath, 'utf-8').split(/\r?\n/)
  const count = storeinfo().value.botMax || lines.length

  for (let i = 0; i < count; i++) {
    if (stopBot) break
    newBot(getBotInfo(lines[i]))
    await delay(storeinfo().value.joinDelay || 1000)
  }
}

async function connectBot() {
  if (storeinfo().value.authType === 'easymc') return easyMcConnect()
  stopBot = false
  currentProxy = 0
  proxyUsed = 0
  const count = storeinfo().value.botMax || 1

  if (storeinfo().value.nameType === 'file' && storeinfo().namefile) {
    BrowserWindow.getAllWindows()[0].webContents.send('showBottab')
  } else if (storeinfo().value.nameType !== 'file' && storeinfo().value.nameType !== 'default') {
    BrowserWindow.getAllWindows()[0].webContents.send('showBottab')
  }

  for (let i = 0; i < count; i++) {
    if (stopBot) break

    let botInfo

    switch (storeinfo().value.nameType) {
      case 'random':
        botInfo = getBotInfo(salt(10))
        break
      case 'legit':
        botInfo = getBotInfo(genName())
        break
      case 'file':
        if (!storeinfo().namefile) {
          notify('Error', 'Please select name file', 'error')
        } else {
          startFile()
        }
        return
      default:
        if (!storeinfo().value.username) return notify('Error', 'Please insert username', 'error')
        const username =
          count == 1 ? storeinfo().value.username : storeinfo().value.username + '_' + i
        botInfo = getBotInfo(username)
        if (i == 0) BrowserWindow.getAllWindows()[0].webContents.send('showBottab')
    }

    newBot(botInfo)
    await delay(storeinfo().value.joinDelay || 1000)
  }
}

function easyMcConnect() {
  newBot(getBotInfo(salt(10)))
  BrowserWindow.getAllWindows()[0].webContents.send('showBottab')
  console.log('EasyMC connected')
}

function getBotInfo(botName) {
  const server = storeinfo().value.server || 'localhost:25565'
  const [serverHost, serverPort] = server.split(':')
  const parsedPort = parseInt(serverPort) || 25565

  const options = {
    host: serverHost,
    port: parsedPort,
    username: botName,
    version: storeinfo().value.version,
    auth: storeinfo().value.authType,
    hideErrors: true,
    easyMcToken: storeinfo().value.easyMcToken,
    joinMessage: storeinfo().value.joinMessage,
    ...botMode(storeinfo().value.botMode),
    ...getProxy(storeinfo().value.proxyType)
  }

  return options
}

function getProxy(proxyType) {
  if (proxyType === 'none' || !storeinfo().value.proxyList) return

  const proxyList = storeinfo().value.proxyList.split(/\r?\n/)
  const randomIndex = crypto.randomInt(0, proxyList.length)

  const proxyPerBot = storeinfo().value.proxyPerBot

  if (proxyUsed >= proxyPerBot) {
    proxyUsed = 0
    currentProxy++
    if (currentProxy >= proxyList.length) {
      currentProxy = 0
    }
  }

  proxyUsed++

  const index = storeinfo().boolean.randomizeOrder ? randomIndex : currentProxy
  const [host, port, username, password] = proxyList[index].split(':')
  return {
    protocol: proxyType,
    proxyHost: host,
    proxyPort: port,
    proxyUsername: username,
    proxyPassword: password
  }
}

function newBot(options) {
  if (options.auth === 'easymc') {
    if (options.easyMcToken?.length !== 20) {
      return sendEvent(options.username, 'easymcAuth')
    }
    options.auth = easyMcAuth
    options.sessionServer ||= 'https://sessionserver.easymc.io'
  }

  const bot = mineflayer.createBot({
    ...options,
    plugins: {
      anvil: false,
      book: false,
      boss_bar: false,
      breath: false,
      chest: false,
      command_block: false,
      craft: false,
      creative: false,
      enchantment_table: false,
      experience: false,
      explosion: false,
      fishing: false,
      furnace: false,
      generic_place: false,
      painting: false,
      particle: false,
      place_block: false,
      place_entity: false,
      rain: false,
      ray_trace: false,
      scoreboard: false,
      sound: false,
      spawn_point: false,
      tablist: false,
      team: false,
      time: false,
      title: false,
      villager: false
    },
    connect: async (client) => {
      try {
        const socket = await connection(
          storeinfo().value.proxyType,
          options.proxyHost,
          options.proxyPort,
          options.proxyUsername,
          options.proxyPassword,
          options.host,
          options.port
        )
        client.setSocket(socket)
        client.emit('connect')
      } catch (error) {
        if (storeinfo().boolean.proxyLogChat) {
          sendEvent(
            client.username,
            'chat',
            options.proxyHost + ':' + options.proxyPort + ' ' + error
          )
        }
        return
      }
    },
    onMsaCode: (data) => {
      sendEvent(options.username, 'authmsg', data.user_code)
    }
  })
  let hitTimer = 0

  bot.once('login', () => {
    sendEvent(bot._client.username, 'login')
    if (storeinfo().boolean.runOnConnect) {
      startScript(bot._client.username)
    }
    if (storeinfo().value.joinMessage) {
      bot.chat(storeinfo().value.joinMessage)
    }
  })
  bot.once('spawn', () => {
    bot.loadPlugin(antiafk)
  })
  bot.on('spawn', () => {
    if (storeinfo().boolean.runOnSpawn) {
      startScript(bot._client.username)
    }
  })
  bot.on('messagestr', (msg) => {
    sendEvent(bot._client.username, 'chat', msg)
  })
  bot.once('kicked', (reason) => {
    if (typeof reason === 'string' && reason.trim().startsWith('{')) {
      try {
        const parsed = JSON.parse(reason)
        sendEvent(bot._client.username, 'kicked', parsed.text)
      } catch (e) {
        return
      }
    }
  })
  bot.once('end', (reason) => {
    sendEvent(bot._client.username, 'end', reason)
    if (storeinfo().boolean.autoReconnect) {
      setTimeout(() => {
        newBot(options)
      }, storeinfo().value.reconnectDelay || 1000)
    }
  })

  bot.on('physicTick', () => {
    if (storeinfo().boolean.killauraToggle && playerList.includes(bot._client.username)) {
      killaura()
    }
  })

  function killaura() {
    if (hitTimer <= 0) {
      hit(
        storeinfo().boolean.targetPlayer,
        storeinfo().boolean.targetVehicle,
        storeinfo().boolean.targetMob,
        storeinfo().boolean.targetAnimal,
        storeinfo().value.killauraRange,
        storeinfo().boolean.killauraRotate
      )
      hitTimer = storeinfo().value.killauraDelay || 10
    } else {
      hitTimer--
    }
  }

  function hit(player, vehicle, mob, animal, maxDistance, rotate) {
    let targetEntities = []
    const entities = Object.values(bot.entities)
    entities.forEach((entity) => {
      const distance = bot.entity.position.distanceTo(entity.position)
      if (distance >= parseFloat(maxDistance)) return
      if (entity.type === 'player' && entity.username !== bot.username && player) {
        targetEntities.push(entity)
      }
      if (entity.kind === 'Vehicles' && vehicle) {
        targetEntities.push(entity)
      }
      if (entity.kind === 'Hostile mobs' && mob) {
        targetEntities.push(entity)
      }
      if (entity.kind === 'Passive mobs' && animal) {
        targetEntities.push(entity)
      }
    })
    targetEntities.forEach((entity) => {
      if (rotate) {
        bot.lookAt(entity.position, true)
        bot.attack(entity)
      } else {
        bot.attack(entity)
      }
    })
  }

  botApi.on('botEvent', (target, event, ...options) => {
    if (target !== bot._client.username) return
    const optionsArray = options[0]
    switch (event) {
      case 'disconnect':
        bot.quit()
        break
      case 'chat':
        const bypass = storeinfo().boolean.bypassChat ? ' ' + salt(crypto.randomInt(2, 6)) : ''
        bot.chat(
          optionsArray
            .join(' ')
            .replaceAll('{random}', salt(4))
            .replaceAll('{player}', bot._client.username) + bypass
        )
        break
      case 'notify':
        notify(
          'Bot',
          bot._client.username +
            ': ' +
            optionsArray
              .join(' ')
              .replaceAll('{random}', salt(4))
              .replaceAll('{player}', bot._client.username),
          'success'
        )
        break
      case 'sethotbar':
        bot.setQuickBarSlot(parseInt(optionsArray[0] ? optionsArray[0] : 0))
        break
      case 'useheld':
        bot.activateItem()
        break
      case 'winclick':
        bot.clickWindow(parseInt(optionsArray[0]), parseInt(optionsArray[1]), 0)
        break
      case 'drop':
        bot.clickWindow(-999, 0, 0)
        bot.clickWindow(parseInt(optionsArray[0]), 0, 0)
        bot.clickWindow(-999, 0, 0)
        break
      case 'dropall':
        ;(async () => {
          const itemCount = bot.inventory.items().length
          for (var i = 0; i < itemCount; i++) {
            if (bot.inventory.items().length === 0) return
            const item = bot.inventory.items()[0]
            bot.tossStack(item)
            await delay(10)
          }
        })()
        break
      case 'closewindow':
        bot.closeWindow(bot.currentWindow || '')
        break
      case 'startmove':
        bot.setControlState(optionsArray[0], true)
        break
      case 'stopmove':
        bot.setControlState(optionsArray[0], false)
        break
      case 'resetmove':
        bot.clearControlStates()
        break
      case 'look':
        bot.look(parseFloat(optionsArray[0]), 0, true)
        break
      case 'afkon':
        bot.afk.start()
        break
      case 'afkoff':
        bot.afk.stop()
        break
      case 'hit':
        const player = optionsArray[0]
        const vehicle = optionsArray[1]
        const mob = optionsArray[2]
        const animal = optionsArray[3]
        const maxDistance = parseFloat(optionsArray[4])
        const rotate = optionsArray[5]
        hit(player, vehicle, mob, animal, maxDistance, rotate)
        break
      default:
    }
  })
}

process.on('uncaughtException', (err) => {
  console.log(err)
})
process.on('UnhandledPromiseRejectionWarning', (err) => {
  console.log(err)
})
