const { ipcRenderer } = require('electron');
const mineflayer = require('mineflayer');
const antiafk = require("mineflayer-antiafk");
const acts = ['rotate', 'jump', 'swingArm'];


ipcRenderer.on('startbot', (e, data) => {
    newBot(data)
});

function newBot(data) {
    const bot = mineflayer.createBot({
        username: data.username,
        password: data.password,
        auth: data.auth,
        host: data.host,
        port: data.port,
        version: data.version
    });
    // load plugins
    bot.loadPlugin(antiafk);
    bot.afk.setOptions({
        fishing: false,
        actions: acts,
        killauraEnabled: false
    });
    // health & food update
    bot.on('health', () => {
        document.getElementById('healthhp').innerHTML = ` ${bot.health.toFixed()}`
        document.getElementById('foodhp').innerHTML = ` ${bot.food.toFixed()}`
    })
    //reconnect
    document.getElementById('buttonreconnect').addEventListener('click', () => {
        newBot(data)
    });
    // new bot winwow
    bot.once('login', () => {
        document.getElementById('h2tit').innerHTML = 'Logged in'
        document.getElementById('hitit').innerHTML = `Bot Control Panel (${bot.username})`
        if(data.loginMsg) {bot.chat(data.loginMsg); sendlog(`[logs] Join Message sent.`, "#34abeb")}
    });
    //login event
    bot.on('spawn', () => {
        document.getElementById('h2tit').innerHTML = 'Spawned'
        sendlog("[logs] Spawned.", "#145e00")
        if (document.getElementById("afkToggle").checked == true) {
            bot.afk.start();
        }
    });
    //AFK button
    document.getElementById('afkToggle').addEventListener('change', () => {
        if (document.getElementById("afkToggle").checked == true) {
            bot.afk.start();
        } else {
            bot.afk.stop();
        }
    });
    // chat send
    document.getElementById('chatbox').addEventListener('keyup', (e) => {
        if (e.key !== "Enter") return;
        bot.chat(document.getElementById('chatbox').value);
        document.getElementById('h2tit').innerHTML = `Message sent ${document.getElementById('chatbox').value}`;
    })
    document.getElementById('sendmsg').addEventListener('click', () => {
        bot.chat(document.getElementById('chatbox').value);
        document.getElementById('h2tit').innerHTML = `Message sent ${document.getElementById('chatbox').value}`;
    });
    //hotbar selector
    document.getElementById('rclickhotbar').addEventListener('click', () => {
        bot.activateItem();
        document.getElementById('h2tit').innerHTML = "Activated slot";
    });
    document.getElementById('sethotbar').addEventListener('click', () => {
        bot.setQuickBarSlot(document.getElementById('hotbar').value);
        document.getElementById('h2tit').innerHTML = "Hotbar slot set";
    });
    //window state
    bot.on('windowOpen', () => {
        document.getElementById('invitm').innerHTML = 'Window Opened'
        sendlog("[logs] Window Opened.", "#312691")
    });
    bot.on('windowClose', () => {
        document.getElementById('invitm').innerHTML = 'Window Closed'
        sendlog("[logs] Window Closed.", "#312691")
    });
    //inventory slot clicker
    document.getElementById('inventoryslotr').addEventListener('click', () => {
        bot.clickWindow(document.getElementById('inventoryslotbox').value, 1, 0)
    });
    document.getElementById('inventoryslotl').addEventListener('click', () => {
        bot.clickWindow(document.getElementById('inventoryslotbox').value, 0, 0)
    });
    document.getElementById('inventoryslotd').addEventListener('click', () => {
        bot.clickWindow(-999, 1, 0)
    });
    document.getElementById('closewin').addEventListener('click', () => {
        bot.closeWindow(window)
    });
    //drop all
    document.getElementById('inventoryslotda').addEventListener('click', () => {
        function tossNext() {
          if (bot.inventory.items().length === 0) return
          const item = bot.inventory.items()[0]
          bot.tossStack(item, tossNext)
        }
        var drop = setInterval(() => {
          tossNext()
        }, 10);
        setTimeout(() => {
          clearInterval(drop)
        }, 3000);
      });
    //spam toggle
    document.getElementById('spambtn').addEventListener('change', () => {
        var checkBox = document.getElementById("spambtn");
        if (checkBox.checked == true) {
            bot.chat(document.getElementById('chatbox').value)
            var chatSpam = setInterval(() => {
                bot.chat(document.getElementById('chatbox').value)
            }, document.getElementById('spamdelay').value);
        }
        document.getElementById('spambtn').addEventListener('change', () => {
            var checkBox = document.getElementById("spambtn");
            if (checkBox.checked == false) {
                clearInterval(chatSpam)
            }
        })
    });
    //kick detect
    bot.on('kicked', (reason, loggedIn) => {
        if (loggedIn === true) {
            sendlog("[logs] Got Kicked!", "red")
        } else {
            sendlog("[logs] Failed to Join!", "red")
        }
    });
    //auto reconnect check
    bot.on('end', () => {
        if (document.getElementById("btnrecon").checked == true) {
            sendlog("[logs] Attempting to Reconnect.", "pink")
            newBot(data)
        };
        document.getElementById("spambtn").checked = false;
    });
    //disconnect button
    document.getElementById('btndiscon').addEventListener('click', () => {
        bot.quit();
        sendlog("[logs] Disconnected.", "red")
        document.getElementById('h2tit').innerHTML = "Bot Disconnected"
    });
    //chat print
    bot.on('message', (m) => {
        const t = document.createElement("li");
        var c = ''
        if (m.json.extra instanceof Array) {
            m.json.extra.forEach(e => {
                c += `<span style="color: ${e.color}; ${e.bold ? 'font-weight: bold;' : ''} ${e.italic ? 'font-style: italic;' : ''} ${e.strikethrough && e.underlined ? 'text-decoration: line-through underline' : e.strikethrough ? 'text-decoration: line-through' : e.underlined ? 'text-decoration: underline' : ''}">${e.text.replace('<', '&lt').replace('>', '&gt')}</span>`.replace(/\\n/g, '<br>')
            });
        } else if (m.json.text) {
            c += `<span>${m.json.text.replace('<', '&lt;').replace('>', '&gt;')}</span>`.replace(/\\n/g, '<br>').replace(/§.{1}/g, '')
        }
        t.innerHTML = c
        document.getElementById('chatmsgbox').appendChild(t)
        document.getElementById('chatmsgbox').scrollTop = document.getElementById('chatmsgbox').scrollHeight
    });
    //player join & leave message
    bot.on('playerJoined', (player) => {
        sendlog(`[logs] ${player.username} Joined the server.`, "#03fc6b")
    });
    bot.on('playerLeft', (player) => {
        sendlog(`[logs] ${player.username} Left the server.`, "#ff6666")
    });
    //look at position
    document.getElementById('lookPos').addEventListener('click', () => {
        bot._client.write('look', {
            yaw: document.getElementById('lookvalue').value,
            pitch: 0,
            onGround: true
        })
    });
    //walk toggle
    document.getElementById('togglewalk').addEventListener('change', () => {
        if (document.getElementById("togglewalk").checked == true) {
            bot.setControlState('forward', true)
        }
        if (document.getElementById("togglewalk").checked == false) {
            bot.setControlState('forward', false)
        }
    });
}

//show window example
function showExample() {
    var p1 = document.getElementById("invimg1");
    if (p1.style.display === "block") {
        p1.style.display = "none";
    } else {
        p1.style.display = "block";
    }
    var p2 = document.getElementById("invimg2");
    if (p2.style.display === "block") {
        p2.style.display = "none";
    } else {
        p2.style.display = "block";
    }
    var b1 = document.getElementById('ingshowbtn');
    if (b1.innerHTML === "Hide") {
        b1.innerHTML = "Show"
    } else {
        b1.innerHTML = "Hide"
    }
}
// theme change button

function themeChange() {
    var b1 = document.getElementById('themebtn');
    if (b1.innerHTML === "Dark") {
        b1.innerHTML = "Lite"
        document.getElementById('stylecss').setAttribute("href", "../assets/botwindow/CSS/stylelite.css")
        document.getElementById('themeimgbtn').setAttribute("src", "../assets/botwindow/icons/sunimg.png")
    } else {
        b1.innerHTML = "Dark"
        document.getElementById('stylecss').setAttribute("href", "../assets/botwindow/CSS/style.css")
        document.getElementById('themeimgbtn').setAttribute("src", "../assets/botwindow/icons/moonimg.png")
    }
}

//send logs to chat box
function sendlog(textToLog, color) {
    const chatboxid = document.getElementById('chatmsgbox')
    var ele = document.createElement("li");
    ele.style.color = color
    ele.appendChild(document.createTextNode(textToLog));
    chatboxid.appendChild(ele)
    chatboxid.scrollTop = document.getElementById('chatmsgbox').scrollHeight
}

//clear chat
function clearchat() {
    document.getElementById('chatmsgbox').innerHTML = ''
}