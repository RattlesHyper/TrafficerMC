window.addEventListener('DOMContentLoaded', () => {
  window.electron?.ipcRenderer.send('loaded')

  window.electron?.ipcRenderer.on('setConfig', (event, config, version) => {
    setConfigValues(config)
    fetch('https://raw.githubusercontent.com/RattlesHyper/TrafficerMC/main/VERSION', {
      method: 'GET'
    })
      .then((response) => response.text())
      .then((result) => {
        const liveVersion = parseFloat(result)
        const currentVersion = version.current
        if (currentVersion != liveVersion) {
          notify('Warning', 'New version available. Please update your client', 'warning')
        }
      })
    document.getElementById('versionString').innerHTML = `v${version.current}`
  })

  window.electron?.ipcRenderer.on('fileSelected', (event, id, path) => {
    const filename = path.match(/[^\\]+$/)[0]
    document.getElementById(id).innerHTML = filename
  })

  window.electron?.ipcRenderer.on('showBottab', () => {
    document.getElementById('bottingTab').click()
  })

  const valueElements = document.querySelectorAll(
    'input[type="text"], input[type="number"], input[type="range"], select, textarea'
  )
  valueElements.forEach((select) => {
    select.addEventListener('change', valueChange)
  })

  const checkboxElements = document.querySelectorAll('input[type="checkbox"]')
  checkboxElements.forEach((check) => {
    check.addEventListener('click', checkboxClick)
  })

  const buttonElements = document.querySelectorAll('button, .button')
  buttonElements.forEach((button) => {
    button.addEventListener('click', buttonClick)
  })

  const tabElements = document.querySelectorAll('.tab, .tab-2')
  tabElements.forEach((tab) => {
    tab.addEventListener('click', navClick)
  })

  window.electron?.ipcRenderer.on('initConfig', () => {
    valueElements.forEach((select) => {
      if (!select.id) return
      window.electron?.ipcRenderer.send('setConfig', 'value', select.id, select.value)
    })
    checkboxElements.forEach((check) => {
      if (!check.id) return
      window.electron?.ipcRenderer.send('setConfig', 'boolean', check.id, check.checked)
    })
  })

  window.electron?.ipcRenderer.on('notify', (event, title, body, type, img, keep) => {
    notify(title, body, type, img, keep)
  })

  window.electron?.ipcRenderer.on('proxyEvent', (event, info) => {
    if (info.event === 'scraped') {
      logProxy('Scraped', 'success', '')
    } else {
      logProxy(info.proxy, info.event, info.message)
    }
    document.getElementById('proxyCheckStatusCount').innerHTML = info.count
    switch (info.event) {
      case 'start':
        document.getElementById('proxyCheckStatus').style.display = 'block'
        document.getElementById('proxyList').value = ''
        break
      case 'stop':
        document.getElementById('proxyCheckStatus').style.display = 'none'
        notify('Info', 'Stopped proxy test.', 'success')
        updateProxyList()
        break
      case 'success':
        document.getElementById('proxyList').value += `${info.proxy}\n`
        updateProxyList()
        break
      case 'scraped':
        document.getElementById('proxyList').value += `\n${info.message}\n`
        clearProxyEmpty()
        updateProxyList()
        break
      default:
    }
  })

  window.electron?.ipcRenderer.on('botEvent', (event, info) => {
    switch (info.event) {
      case 'login':
        addPlayer(info.id)
        logChat('Bot', info.id, 'Connected to the server.')
        break
      case 'authmsg':
        directChat(
          `<div class="space-h"><div class="flex"><p class="text-sm link">Auth</p></div><div class="space-h-f pl-2"><p class="text-sm" style="user-select: text;">${info.id}</p></div></div><p class="text-sm-2" style="user-select: text;"> First time signing in. Use a web browser to open the page <a href="https://www.microsoft.com/link" target="_blank" rel="noreferrer" class="text-sm-2">https://www.microsoft.com/link</a> and enter the code: <a class="text-sm-2" style="border-bottom: solid 1px #a1a1a1; cursor: pointer;" onclick="navigator.clipboard.writeText('${info.message}')">${info.message} [click to copy]</a></p>`
        )
        break
      case 'easymcAuth':
        directChat(
          `<div class="space-h"><div class="flex"><p class="text-sm link">EasyMC</p></div><div class="space-h-f pl-2"><p class="text-sm" style="user-select: text;">Authentication</p></div></div><p class="text-sm-2" style="user-select: text;"> EasyMC authentication requires an alt token. Check <a href="https://easymc.io/get" target="_blank" rel="noreferrer" class="text-sm-2">https://easymc.io/get</a> to get a token.</p>`
        )
        break
      case 'chat':
        logChat('Bot', info.id, info.message)
        break
      case 'kicked':
        logChat('Bot', info.id, 'Kicked: ' + info.message)
        removePlayer(info.id)
        break
      case 'end':
        logChat('Bot', info.id, 'Connection: ' + info.message)
        removePlayer(info.id)
        break
      default:
    }
  })
  // setInterval(() => {
  //   logChat('Bot', 'Username', 'TEST')
  //   notify('TEST', 'Welcome back User', 'success')
  //   logProxy('proxy:port', 'fail', 'Test')
  // }, 1000)
})

function valueChange(event) {
  const selectedValue = event.target.value
  const selectId = event.target.id
  window.electron?.ipcRenderer.send('setConfig', 'value', selectId, selectedValue)

  switch (selectId) {
    case 'authType':
      checkAuth()
      break
    case 'nameType':
      checkUsername()
      break
    default:
  }
}

function buttonClick(event) {
  const buttonId = event.target.id
  switch (buttonId) {
    case 'minimize':
      window.electron?.ipcRenderer.send('win:invoke', 'min')
      break
    case 'close':
      window.electron?.ipcRenderer.send('win:invoke', 'close')
      break
    case 'resetConfig':
      window.electron?.ipcRenderer.send('deleteConfig')
      notify('Info', 'Config has been reset. Please restart the app', 'success')
      break
    case 'nameFileLabel':
      window.electron?.ipcRenderer.send('open', 'nameFileLabel', 'Name File')
      break
    case 'selectAll':
      selectAll()
      break
    case 'proxyClearDupe':
      clearDupe()
      notify('Info', 'Cleared duplicate proxies', 'success')
      break
    default:
      window.electron?.ipcRenderer.send('btnClick', buttonId)
      break
  }
}

function checkboxClick(event) {
  const checkId = event.target.id
  const state = event.target.checked
  window.electron?.ipcRenderer.send('setConfig', 'boolean', checkId, state)
  window.electron?.ipcRenderer.send('checkboxClick', checkId, state)
}

function navClick(event) {
  const classes = event.target.classList
  const navName = event.target.innerText.toLowerCase()
  const tabContent = document.getElementsByClassName(classes[1])

  Array.from(tabContent).forEach((content) => {
    if (!content.classList.contains(classes[0])) {
      content.style.display = 'none'
    }
  })

  const selectedContent = document.getElementById(navName)
  selectedContent.style.display = 'block'

  const tabs = document.getElementsByClassName(classes[0])
  Array.from(tabs).forEach((tab) => {
    tab.classList.remove('selected')
  })

  event.currentTarget.classList.add('selected')
}

function checkAuth() {
  const mode = document.getElementById('authType').value
  const easymcDiv = document.getElementById('easymcDiv')
  const usernameDiv = document.getElementById('usernameDiv')

  const isEasyMc = mode === 'easymc'
  easymcDiv.style.display = isEasyMc ? 'block' : 'none'
  usernameDiv.style.display = isEasyMc ? 'none' : 'block'
}
function checkUsername() {
  const nameType = document.getElementById('nameType')
  const fileDiv = document.getElementById('nameFileDiv')

  const isFileBased = nameType.value === 'file'
  fileDiv.style.display = isFileBased ? 'block' : 'none'
}

function setConfigValues(obj) {
  for (const keyType in obj) {
    const keys = Object.keys(obj[keyType])
    for (const key of keys) {
      const element = document.getElementById(key)
      if (element) {
        if (keyType === 'value') {
          element.value = obj.value[key]
        } else if (keyType === 'boolean') {
          element.checked = obj.boolean[key]
        }
      }
    }
  }
  checkUsername()
  checkAuth()
}

function notify(title, body, type, img, keep) {
  const notification = document.createElement('li')
  notification.className = type

  const top = document.createElement('div')
  top.className = 'space-h'

  const topbar = document.createElement('div')
  topbar.className = 'flex'

  const titleText = document.createElement('p')
  titleText.className = 'text-sm'
  titleText.innerHTML = title
  topbar.appendChild(titleText)

  const closeDiv = document.createElement('div')
  const closeBtn = document.createElement('p')
  closeBtn.className = 'text-sm'
  closeBtn.innerHTML = 'X'
  closeBtn.onclick = () => rmNotification()
  closeDiv.appendChild(closeBtn)

  top.appendChild(topbar)
  top.appendChild(closeDiv)

  const bodyDiv = document.createElement('div')
  bodyDiv.className = 'n-message'
  const bodyText = document.createElement('p')
  bodyText.className = 'tip-sm'
  bodyText.innerText = body
  bodyDiv.appendChild(bodyText)
  if (img) {
    const imgTag = document.createElement('img')
    imgTag.src = img
    bodyDiv.appendChild(imgTag)
  }

  notification.appendChild(top)
  notification.appendChild(bodyDiv)

  document.getElementById('notifications').appendChild(notification)

  if (!keep) {
    const progress = document.createElement('div')
    progress.className = 'n-progress'
    notification.appendChild(progress)
    setTimeout(() => {
      rmNotification()
    }, 3000)
  }
  function rmNotification() {
    notification.classList.add('fade')
    setTimeout(() => {
      notification.remove()
    }, 300)
  }
}

function addPlayer(name) {
  const list = document.getElementById('botList')
  const auto = document.getElementById('autoSelect').checked
  const b = document.createElement('li')
  b.className = 'botListItem'
  b.innerHTML = name
  b.onclick = () => {
    b.classList.toggle('selected')
    updateSelected()
  }
  list.appendChild(b)
  list.scrollTop = list.scrollHeight
  updateBotCount()
  if (auto) {
    selectAll('auto')
  }
}

function removePlayer(name) {
  const list = document.querySelectorAll('.botListItem')
  list.forEach((bot) => {
    if (bot.innerHTML === name) {
      bot.remove()
      updateSelected()
    }
  })
  updateBotCount()
}

function updateBotCount() {
  const count = document.getElementById('botCount')
  const list = document.getElementById('botList')
  count.innerHTML = list.children.length
}

function selectAll(auto) {
  const list = document.getElementById('botList')
  const allSelected = Array.from(list.children).every((li) => li.classList.contains('selected'))
  Array.from(list.children).forEach((bot) => {
    if (auto) {
      bot.classList.toggle('selected', true)
    } else {
      bot.classList.toggle('selected', !allSelected)
    }
  })
  updateSelected()
}

function updateSelected() {
  const list = document.getElementById('botList')
  const selectedBots = Array.from(list.children).filter((bot) => bot.classList.contains('selected'))
  window.electron?.ipcRenderer.send(
    'playerList',
    selectedBots.map((bot) => bot.innerHTML)
  )
}

function logProxy(proxy, type, message) {
  const scroll = document.getElementById('autoScrollProxy').checked
  const logBox = document.getElementById('proxyLogbox')
  const li = document.createElement('li')
  li.className = type
  const updiv = document.createElement('div')
  updiv.className = 'space-h'

  const ddiv = document.createElement('div')
  const msg = document.createElement('p')
  msg.className = 'text-sm-2 mu-1'
  msg.style = 'user-select: text;'
  msg.innerHTML = message
  ddiv.appendChild(msg)

  const pl = document.createElement('p')
  pl.style = 'user-select: text;'
  pl.className = 'text-sm'
  pl.innerHTML = proxy
  updiv.appendChild(pl)

  const pr = document.createElement('p')
  pr.className = 'text-sm'
  pr.innerHTML = type

  updiv.appendChild(pr)

  li.appendChild(updiv)
  li.appendChild(ddiv)

  logBox.appendChild(li)
  if (scroll) {
    logBox.scrollTop = logBox.scrollHeight
  }
}

function clearProxyEmpty() {
  const textarea = document.getElementById('proxyList')
  const lines = textarea.value.split('\n')
  const nonEmptyLines = lines.filter(function (line) {
    return line.trim() !== ''
  })
  textarea.value = nonEmptyLines.join('\n')
}

function clearDupe() {
  const textarea = document.getElementById('proxyList')
  const lines = textarea.value.split('\n')
  const uniqueLines = {}
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    uniqueLines[line] = true
  }
  const uniqueLinesArray = Object.keys(uniqueLines)
  const result = uniqueLinesArray.join('\n')
  textarea.value = result
}

function updateProxyList() {
  window.electron?.ipcRenderer.send(
    'setConfig',
    'value',
    'proxyList',
    document.getElementById('proxyList').value
  )
}

function logChat(prefix, name, text) {
  const enable = document.getElementById('enableChat').checked
  if (!enable) return
  const chatBox = document.getElementById('chatBox')
  const scroll = document.getElementById('autoScrollChat').checked

  const li = document.createElement('li')

  const spaceHDiv = document.createElement('div')
  spaceHDiv.className = 'space-h'

  const flexDiv = document.createElement('div')
  flexDiv.className = 'flex'

  const prefixP = document.createElement('p')
  prefixP.className = 'text-sm link'
  prefixP.textContent = prefix

  flexDiv.appendChild(prefixP)

  const spaceHFDiv = document.createElement('div')
  spaceHFDiv.className = 'space-h-f pl-2'

  const nameP = document.createElement('p')
  nameP.className = 'text-sm'
  nameP.style = 'user-select: text;'
  nameP.textContent = name

  spaceHFDiv.appendChild(nameP)

  spaceHDiv.appendChild(flexDiv)
  spaceHDiv.appendChild(spaceHFDiv)

  const textP = document.createElement('p')
  textP.className = 'text-sm-2'
  textP.style = 'user-select: text;'
  textP.textContent = text

  li.appendChild(spaceHDiv)
  li.appendChild(textP)

  chatBox.appendChild(li)

  if (scroll) {
    chatBox.scrollTop = chatBox.scrollHeight
  }
}

function directChat(string) {
  const chatBox = document.getElementById('chatBox')
  const li = document.createElement('li')
  li.innerHTML = string
  chatBox.appendChild(li)
}
