const { ipcRenderer } = require('electron');
const mineflayer = require('mineflayer');
const antiafk = require("mineflayer-antiafk");
const acts = ['rotate', 'jump', 'swingArm'];
let bots = [];
let botcount = 0;
ipcRenderer.on('startbotmulti', (e, options) => {
    newBot(options)
    setInterval(() => {
        document.getElementById('invitm').innerHTML = botcount
    }, 500);
});

function newBot(options) {
    const bot = mineflayer.createBot({
        username: options.username,
        host: options.host,
        port: options.port,
        version: options.version
    });
    // load plugins
    bot.loadPlugin(antiafk);
    bot.afk.setOptions({
        fishing: false,
        actions: acts,
        killauraEnabled: false
    });
    //login event
    bot.once('login', () => {
        sendlog(`[${options.username}] Logged in`, "green")
        botcount += 1
    });
    //spawn event
    bot.on('spawn', () => {
        sendlog(`[${options.username}] Spawned`, "#145e00")
        var checkBox = document.getElementById("afkToggle");
        if (checkBox.checked == true) {
            bot.afk.start();
        };
    });
    //chat send
    document.getElementById('chatbox').addEventListener('keyup', (e) => {
        if (e.key !== "Enter") return;
        bot.chat(document.getElementById('chatbox').value);
        document.getElementById('h2tit').innerHTML = `Sent: ${document.getElementById('chatbox').value}`
    })
    document.getElementById('sendmsg').addEventListener('click', () => {
        bot.chat(document.getElementById('chatbox').value);
        document.getElementById('h2tit').innerHTML = `Sent: ${document.getElementById('chatbox').value}`
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
        sendlog(`[${options.username}] Opened Window`, "#312691")
    });
    bot.on('windowClose', () => {
        sendlog(`[${options.username}] Closed Window`, "#312691")
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
    //AFK button
    document.getElementById('afkToggle').addEventListener('change', () => {
        var checkBox = document.getElementById("afkToggle");
        if (checkBox.checked == true) {
            bot.afk.start();
        } else {
            bot.afk.stop();
        }
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
            sendlog(`[${options.username}] Got Kicked!`, "red")
            botcount -= 1
        } else {
            sendlog(`[${options.username}] Failed to Join!`, "red")
        }
    });
    //Auto Reconnect Toggle check
    bot.on('end', () => {
        var checkBox = document.getElementById("btnrecon");
        if (checkBox.checked == true) {
            newBot(options)
        };
    });
    //reconnect 
    document.getElementById('buttonreconnect').addEventListener('click', () => {
        newBot(options)
    })
    //disconnect
    document.getElementById('btndiscon').addEventListener('click', () => {
        bot.quit();
        botcount = 0
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

};

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