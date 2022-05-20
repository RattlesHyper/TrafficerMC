const { ipcRenderer } = require('electron');
const mineflayer = require('mineflayer');
const antiafk = require('../assets/botwindow/plugins/antiafk');
const Store = require('electron-store')
const fs = require('fs')
const store = new Store()
const { EventEmitter } = require('events')
const execmd = new EventEmitter()
var script = store.get('script')
var accounts = store.get('accounts')
let botcount = 0;
let joindata = ""
ipcRenderer.on('startbotmulti', (e, data) => {
    joindata = data
    if(accounts) {startaccountfile()} else {startmultibot()}
    setInterval(() => {
        document.getElementById('invitm').innerHTML = botcount
    }, 500);
});
function newBot(options) {
    const bot = mineflayer.createBot({
      username: options.username,
      password: options.password,
      auth: options.auth,
      host: options.host,
      port: options.port,
      version: options.version,
      loginMsg: options.loginMsg
    });
    // load plugins
    bot.loadPlugin(antiafk);
    //login event
    bot.once('login', () => {
      sendlog(`[${options.username}] Logged in.`, "green")
      botcount += 1
      if (options.loginMsg) {
        bot.chat(options.loginMsg);
        sendlog(`[${options.username}] Join Message sent.`, "#34abeb")
      }
    });
    //spawn event
    bot.once('spawn', () => {
      if (script) {
        startscript(script);
        sendlog(`[${options.username}] Script started.`, "#03fcd7")
      }
    })
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
        //script listeners
        execmd.on('chat', (o) => {bot.chat(o)});
        execmd.on('activate', () => {bot.activateItem()});
        execmd.on('lclickwindow', (o) => {bot.clickWindow(o, 1, 0)});
        execmd.on('rclickwindow', (o) => {bot.clickWindow(o, 0, 0)});
        execmd.on('drop', () => {bot.clickWindow(-999, 1, 0)});
        execmd.on('sethotbar', (o) => {bot.setQuickBarSlot(o)});
        execmd.on('closewindow', () => {bot.closeWindow(window)});
        execmd.on('startwalk', () => {bot.setControlState('forward', true); document.getElementById("togglewalk").checked = true});
        execmd.on('stopwalk', () => {bot.setControlState('forward', false); document.getElementById("togglewalk").checked = false});
        execmd.on('startrun', () => {bot.setControlState('forward', true); bot.setControlState('sprint', true); document.getElementById("togglewalk").checked = true});
        execmd.on('stoprun', () => {bot.setControlState('forward', false); bot.setControlState('sprint', false); document.getElementById("togglewalk").checked = false});
        execmd.on('startjump', () => {bot.setControlState('jump', true)});
        execmd.on('stopjump', () => {bot.setControlState('jump', false)});
        execmd.on('startwalkback', () => {bot.setControlState('back', true)});
        execmd.on('stopwalkback', () => {bot.setControlState('back', false)});
        execmd.on('startwalkleft', () => {bot.setControlState('left', true)});
        execmd.on('stopwalkleft', () => {bot.setControlState('left', false)});
        execmd.on('stopwalkright', () => {bot.setControlState('right', true)});
        execmd.on('stopwalkright', () => {bot.setControlState('right', false)});
        execmd.on('startsneak', () => {bot.setControlState('sneak', true)});
        execmd.on('stopsneak', () => {bot.setControlState('sneak', false)});
        execmd.on('stopmove', () => {bot.clearControlStates(); document.getElementById("togglewalk").checked = false});
        execmd.on('disconnect', () => {bot.quit()});
        execmd.on('dropall', () => {
          tossNext()
          function tossNext() {
            if (bot.inventory.items().length === 0) return
            const item = bot.inventory.items()[0]
            bot.tossStack(item, tossNext)
          }
        });
};
//disconnect
document.getElementById('btndiscon').addEventListener('click', () => {
    execmd.emit('disconnect');
    botcount = 0
  });
  //reconnect
  document.getElementById('buttonreconnect').addEventListener('click', () => {
    startmultibot(joindata)
  })
  execmd.on('reconnect', () => {
    sendlog("[Script] Reconnect not supported in MultiMode.")
  }); //script
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
  //script controler
  async function startscript() {
    const s = fs.readFileSync(script.path)
    let c = 0
    for (var i = 0; i < s.toString().split(/\r?\n/).length; i++) {
      const args = s.toString().split(/\r?\n/)[c].slice().trim().split(/ +/g);
      const command = args.shift().toLowerCase();
      if (c === script.toString().split(/\r?\n/).length) {
        execmd.emit('end')
      }
      if (command === "delay") {
        await timer(args.shift(1));
      }
      if (command === "loop") {
        startscript(script);
      }
      if (command === "chat") {
        execmd.emit(command, s.toString().split(/\r?\n/)[c].slice(5));
      } else {
        execmd.emit(command, args.shift(1), args.shift(2));
      }
      c += 1
    }
  }
  //multi bot
  async function startmultibot() {
    for (var i = 0; i < (joindata.count); i++) {
        var options = {
          username: `${joindata.username}_${i}`,
          host: joindata.host,
          port: joindata.port,
          version: joindata.version,
          loginMsg: joindata.loginMsg
        }
        newBot(options)
        await timer(joindata.delay)
      }
  }
  // account file method
  async function startaccountfile() {
    const s = fs.readFileSync(accounts.path)
    for (var i = 0; i < (joindata.count ?? s.toString().split(/\r?\n/).length); i++) {
      const args = s.toString().split(/\r?\n/)[i].slice().trim().split(/ +/g);
      var options = {
        username: args.shift(),
        password: args.shift(1),
        auth: args.shift(2),
        host: joindata.host,
        port: joindata.port,
        version: joindata.version,
        loginMsg: joindata.loginMsg
      }
      newBot(options)
      await timer(joindata.delay)
    }
  }
  //delay function
  function timer(ms) {return new Promise(res => setTimeout(res, ms ?? 1000))}