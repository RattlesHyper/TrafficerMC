const mineflayer = require('mineflayer');
const { EventEmitter } = require('events')
const socks = require('socks').SocksClient
const ProxyAgent = require('proxy-agent')
const botApi = new EventEmitter()
const fetch = require('node-fetch')
const fs = require('fs')
const currentVersion = "2.1"
let stopBot = false

//bot connect method
function connectBot() {
    stopBot = false
    if (idAccountFileCheck.checked && idAccountFilePath.value) {
        startAccountFile(idAccountFilePath.files[0].path)
    } else {
        if (idBotCount.value <= 1) {
            newBot(getBotInfo(idBotUsername.value, "0"))
        } else {
            if (idBotUsername.value) {
                startWname()
            } else {
                startWnoName()
            }
        }
    }
}

//bot stop event listener
botApi.on('stopBots', () => {
    stopBot = true
})

//connection methods
async function startAccountFile(accountFile) {
    sendLog(`<li> <img src="./assets/icons/app/code.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(28%) sepia(100%) saturate(359%) hue-rotate(172deg) brightness(93%) contrast(89%)"> Account File Loaded. </li>`)
    const file = fs.readFileSync(accountFile)
    const lines = file.toString().split(/\r?\n/)
    const count = idBotCount.value ? idBotCount.value : lines.length
    for (var i = 0; i < count; i++) {
        newBot(getBotInfo(lines[i], i))
        await delay(idJoinDelay.value ? idJoinDelay.value : 1000)
    }
}
async function startWname() {
    for (var i = 0; i < idBotCount.value; i++) {
        if (stopBot) break;
        let options = getBotInfo(idBotUsername.value, i)
        if (idBotUsername.value.includes("(SALT)") || idBotUsername.value.includes("(LEGIT)")) {
            newBot(options)
        } else {
            options.username = options.username + "_" + i
            newBot(options)
        }
        await delay(idJoinDelay.value ? idJoinDelay.value : 1000)
    }
}
async function startWnoName() {
    for (var i = 0; i < idBotCount.value; i++) {
        if (stopBot) break;
        newBot(getBotInfo(idBotUsername.value, i))
        await delay(idJoinDelay.value ? idJoinDelay.value : 1000)
    }
}

//send bot info
function getBotInfo(botName, n) {
    var unm = botName.replaceAll("(SALT)", salt(4)).replaceAll("(LEGIT)", genName());
    var serverHost = idIp.value.split(':')[0] ? idIp.value.split(':')[0] : "localhost";
    var serverPort = idIp.value.split(':')[1] ? idIp.value.split(':')[1] : 25565;

    if (idProxyToggle.checked) {
        var proxyHost = getProxy(n).split(":")[0];
        var proxyPort = getProxy(n).split(":")[1];
        
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
                        host: serverHost,
                        port: parseInt(serverPort)
                    }
                }, (err, info) => {
                    if (err) {
                        sendLog(`[ProxyError] [${unm}] [${proxyHost}:${proxyPort}] ${err}`)
                        return;
                    }
                    client.setSocket(info.socket);
                    client.emit('connect')
                })
            },
            agent: new ProxyAgent({
                protocol: `socks${idProxyType.value}`,
                host: proxyHost,
                port: proxyPort
            }),
            host: serverHost,
            port: serverPort,
            username: unm ? unm : salt(10),
            version: idBotVersion.value,
            auth: idAuthType.value,
            onMsaCode: function(data) {
                sendLog(`<li> <img src="./assets/icons/app/code.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(28%) sepia(100%) saturate(359%) hue-rotate(172deg) brightness(93%) contrast(89%)">[${botName}] First time signing in. Please authenticate now: To sign in, use a web browser to open the page https://www.microsoft.com/link and enter the code: ${data.user_code} to authenticate. </li>`)
            }
        };
        return options;
    } else {
        options = {
            host: serverHost,
            port: serverPort,
            username: unm ? unm : salt(10),
            version: idBotVersion.value,
            auth: idAuthType.value,
            onMsaCode: function(data) {
                sendLog(`<li> <img src="./assets/icons/app/code.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(28%) sepia(100%) saturate(359%) hue-rotate(172deg) brightness(93%) contrast(89%)">[${botName}] First time signing in. Please authenticate now: To sign in, use a web browser to open the page https://www.microsoft.com/link and enter the code: ${data.user_code} to authenticate. </li>`)
            }
        };
        return options;
    }
}

//get proxy from file with line number
function getProxy(n) {
    const file = fs.readFileSync(idProxyFilePath.files[0].path)
    const lines = file.toString().split(/\r?\n/)
    const rnd = Math.floor(Math.random() * lines.length)
    
    if (idProxyOrderRnd.checked) {
        return lines[rnd]
    } else {
        if (n >= lines.length) {
            return lines[rnd]
        } else {
            return lines[n]
        }
    }
}

//random char
function salt(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
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
    b.id = "list" + name
    b.style = "font-weight:bold"
    b.innerHTML = name
    b.addEventListener('click', () => {
        selectBot(event)
    })
    idBotList.appendChild(b)
    idBotList.scrollTop = idBotList.scrollHeight
    updateBotCount()
}

//remove player from list
function rmPlayer(name) {
    if (document.getElementById("list" + name)) document.getElementById("list" + name).remove()
    updateBotCount()
}

//log error
function errBot(name) {
    rmPlayer(name)
    updateBotCount()
}

//console logs
function sendLog(log) {
    if(!log) return;
    const b = document.createElement("li")
    b.innerHTML = log
    idChatBox.appendChild(b)
    idChatBox.scrollTop = idChatBox.scrollHeight
}

//execute command all bots
async function exeAll(command, ...args) {
    var sels = document.getElementsByClassName("botSelected");
    if (sels.length === 0) return sendLog(`<li> <img src="./assets/icons/app/alert-triangle.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(89%) sepia(82%) saturate(799%) hue-rotate(1deg) brightness(103%) contrast(102%)">No bots selected!</li>`);
    let list = ["BLANK"]

    var liElements = Array.from(sels).filter(function(element) {
        return element.tagName === "LI";
    });

    liElements.forEach(e => {
        list.push(e.innerHTML + command)
    })

    for (var i = 0; i < list.length; i++) {
        botApi.emit(list[i], ...args)
        await delay(idLinearValue.value)
    }

    sendLog(`<li> <img src="./assets/icons/app/code.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(28%) sepia(100%) saturate(359%) hue-rotate(172deg) brightness(93%) contrast(89%)"> [${command}] ${args} </li>`)
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
        const cmd2 = args.shift(1)
        if (command === "loop") {
            startScript(botId, script)
            sendLog(`<li> <img src="./assets/icons/app/code.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(28%) sepia(100%) saturate(359%) hue-rotate(172deg) brightness(93%) contrast(89%)"> [${botId}] Script Loop </li>`)
        }
        if (command === "delay") {
            sendLog(`<li> <img src="./assets/icons/app/code.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(28%) sepia(100%) saturate(359%) hue-rotate(172deg) brightness(93%) contrast(89%)"> [${botId}] Delay ${cmd2}ms </li>`)
            await delay(cmd2)
        } else if (command === "chat") {
            botApi.emit(botId + command, lines[i].slice(5))
            sendLog(`<li> <img src="./assets/icons/app/code.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(28%) sepia(100%) saturate(359%) hue-rotate(172deg) brightness(93%) contrast(89%)"> [${botId}] Chat ${lines[i].slice(5)} </li>`)
        } else {
            botApi.emit(botId + command, ...args)
            sendLog(`<li> <img src="./assets/icons/app/code.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(28%) sepia(100%) saturate(359%) hue-rotate(172deg) brightness(93%) contrast(89%)"> [${botId}] ${args} </li>`)
        }
    }
}

//check version
function checkVer() {
    const outdatedVersionAlert = document.getElementById('outdatedVersion')
    const ids = ['aboutPageVersion', 'topBarVersion']
    ids.forEach(e => {
        document.getElementById(e).innerHTML = `v${currentVersion}`
    })
    fetch("https://raw.githubusercontent.com/RattlesHyper/TrafficerMC/main/VERSION", {
            method: 'GET'
        })
        .then(response => response.text())
        .then(result => {
            if (result.replaceAll("\n", "").replaceAll(" ", "") !== currentVersion) {
                outdatedVersionAlert.style.display = outdatedVersionAlert.style.display.replace("none", "")
                createPopup("New version found, Please update", "red")
            }
        })
}

// name generator
function genName() {
    let name = ''
    const words = ["Ace", "Aid", "Aim", "Air", "Ale", "Arm", "Art", "Awl", "Eel", "Ear", "Era", "Ice", "Ire", "Ilk", "Oar", "Oak", "Oat", "Oil", "Ore", "Owl", "Urn", "Web", "Cab", "Dab", "Jab", "Lab", "Tab", "Dad", "Fad", "Lad", "Mad", "Bag", "Gag", "Hag", "Lag", "Mag", "Rag", "Tag", "Pal", "Cam", "Dam", "Fam", "Ham", "Jam", "Ram", "Ban", "Can", "Fan", "Man", "Pan", "Tan", "Bap", "Cap", "Lap", "Pap", "Rap", "Sap", "Tap", "Yap", "Bar", "Car", "Jar", "Tar", "War", "Bat", "Cat", "Hat", "Mat", "Pat", "Tat", "Rat", "Vat", "Caw", "Jaw", "Law", "Maw", "Paw", "Bay", "Cay", "Day", "Hay", "Ray", "Pay", "Way", "Max", "Sax", "Tax", "Pea", "Sea", "Tea", "Bed", "Med", "Leg", "Peg", "Bee", "Lee", "Tee", "Gem", "Bet", "Jet", "Net", "Pet", "Set", "Den", "Hen", "Men", "Pen", "Ten", "Yen", "Dew", "Mew", "Pew", "Bib", "Fib", "Jib", "Rib", "Sib", "Bid", "Kid", "Lid", "Vid", "Tie", "Lie", "Pie", "Fig", "Jig", "Pig", "Rig", "Wig", "Dim", "Bin", "Din", "Fin", "Gin", "Pin", "Sin", "Tin", "Win", "Yin", "Dip", "Lip", "Pip", "Sip", "Tip", "Git", "Hit", "Kit", "Pit", "Wit", "Bod", "Cod", "God", "Mod", "Pod", "Rod", "Doe", "Foe", "Hoe", "Roe", "Toe", "Bog", "Cog", "Dog", "Fog", "Hog", "Jog", "Log", "Poi", "Con", "Son", "Ton", "Zoo", "Cop", "Hop", "Mop", "Pop", "Top", "Bot", "Cot", "Dot", "Lot", "Pot", "Tot", "Bow", "Cow", "Sow", "Row", "Box", "Lox", "Pox", "Boy", "Soy", "Toy", "Cub", "Nub", "Pub", "Sub", "Tub", "Bug", "Hug", "Jug", "Mug", "Rug", "Tug", "Bum", "Gum", "Hum", "Rum", "Tum", "Bun", "Gun", "Pun", "Run", "Sun", "Cup", "Pup", "Cut", "Gut", "Hut", "Nut", "Rut", "Egg", "Ego", "Elf", "Elm", "Emu", "End", "Era", "Eve", "Eye", "Ink", "Inn", "Ion", "Ivy", "Lye", "Dye", "Rye", "Pus", "Gym", "Her", "His", "Him", "Our", "You", "She", "Add", "Ail", "Are", "Eat", "Err", "Oil", "Use", "Nab", "Jab", "Bag", "Lag", "Nag", "Rag", "Sag", "Tag", "Wag", "Jam", "Ram", "Ran", "Tan", "Cap", "Lap", "Nap", "Rap", "Sap", "Tap", "Yap", "Mar", "Has", "Was", "Pat", "Sat", "Lay", "Pay", "Say", "Max", "Tax", "Fed", "See", "Get", "Let", "Net", "Met", "Pet", "Set", "Wet", "Mew", "Sew", "Lie", "Tie", "Bog", "Jog", "Boo", "Coo", "Moo", "Bop", "Hop", "Lop", "Mop", "Pop", "Top", "Sop", "Bow", "Mow", "Row", "Tow", "Dub", "Rub", "Dug", "Lug", "Tug", "Hum", "Sup", "Buy", "Got", "Jot", "Rot", "Nod", "Hem", "Led", "Wed", "Fib", "Jib", "Rib", "Did", "Dig", "Jig", "Rig", "Dip", "Nip", "Sip", "Rip", "Zip", "Gin", "Win", "Bit", "Hit", "Sit", "Won", "Pry", "Try", "Cry", "All", "Fab", "Bad", "Had", "Mad", "Rad", "Tad", "Far", "Fat", "Raw", "Lax", "Max", "Gay", "Big", "Dim", "Fit", "Red", "Wet", "Old", "New", "Hot", "Coy", "Fun", "Ill", "Odd", "Shy", "Dry", "Wry", "And", "But", "Yet", "For", "Nor", "The", "Not", "How", "Too", "Yet", "Now", "Off", "Any", "Out", "Bam", "Nah", "Yea", "Yep", "Naw", "Hey", "Yay", "Nay", "Pow", "Wow", "Moo", "Boo", "Bye", "Yum", "Ugh", "Bah", "Umm", "Why", "Aha", "Aye", "Hmm", "Hah", "Huh", "Ssh", "Brr", "Heh", "Oop", "Oof", "Zzz", "Gee", "Grr", "Yup", "Gah", "Mmm", "Dag", "Arr", "Eww", "Ehh"]
    for (var i = 0; i < Math.floor(Math.random() * 4) + 2; i++) {
        name += words[Math.floor(Math.random() * words.length)]
    }
    return name
}

// load theme
function loadTheme(file) {
    fs.exists(file, (exists) => {
        if(exists) {
            var link = document.createElement("link");
            link.href = file
            link.type = "text/css";
            link.rel = "stylesheet";
        
            document.getElementsByTagName("head")[0].appendChild(link);
            createPopup("Loaded custom CSS", "green")
        }
    });
}

// Create the pop-up element
function createPopup(text, color) {
    const popup = document.createElement('li');
    popup.classList.add('popup-content');
    popup.textContent = text;
    if(color) popup.style.color = color;

    idPopupUl.appendChild(popup);

    setTimeout(() => {
        popup.style.right = 0;
    }, 100);
    setTimeout(() => {
        popup.style.opacity = 0;
        setTimeout(() => {
            popup.remove()
        }, 300);
    }, 3000);
}

// json to html format
function formatText(json) {
    c = json
    return `<span style='${c.color ? `color: ${c.color};`: ""}${c.bold ? "font-weight:bold;" : ""}${c.italic ? "font-style:italic;" : ""} '>${c.text}</span>`;
}

module.exports = {
    getBotInfo,
    connectBot,
    salt,
    delay,
    addPlayer,
    rmPlayer,
    errBot,
    sendLog,
    exeAll,
    startScript,
    checkVer,
    genName,
    loadTheme,
    createPopup,
    formatText,
    mineflayer,
    botApi
}