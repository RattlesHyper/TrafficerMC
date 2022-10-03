const { ipcRenderer } = require('electron');
const mineflayer = require('mineflayer');
const socks = require('socks').SocksClient
const ProxyAgent = require('proxy-agent')
const fs = require('fs');
const { timer, sendlog, startscript, antiafk, clearchat, startaccountfile, startmultibot, showAaccList, salt, execmd, store } = require('../assets/class/common/cfuns');
var script = store.get('script');
var accounts = store.get('accounts');
var proxies = store.get('proxies');
const proxyFile = fs.readFileSync(proxies.path).toString().split(/\r?\n/)
let joindata = "";
let botlist = [];
let proxyType = 0;
execmd.setMaxListeners(0)

ipcRenderer.on('startbotmulti', (e, data) => {
    joindata = data
    proxyType = data.proxyType
    if(accounts) {startaccountfile()} else {startmultibot()}
    setInterval(() => {
        document.getElementById('botCount').innerHTML = document.getElementById('joinedAccList').getElementsByTagName("li").length
    }, 500);
});

function newBot(options) {
  const rnd = Math.floor(Math.random() * proxyFile.length)
  const proxyHost = proxyFile[rnd].split(':')[0]
  const proxyPort = proxyFile[rnd].split(':')[1]

    const bot = mineflayer.createBot({
      connect: client => {
        socks.createConnection({
          proxy: {
            host: proxyHost,
            port: parseInt(proxyPort),
            type: parseInt(proxyType)
          },
          command: 'connect',
          destination: {
            host: options.host,
            port: parseInt(options.port ? options.port : 25565)
          }
        }, (err, info) => {
          if (err) {
            sendlog(`[ProxyError]-> [${options.username}]-> [${proxyHost}:${proxyPort}]-> ${err}`, "red")
            return;
          }
          client.setSocket(info.socket);
          client.emit('connect')
        })
      },
      agent: new ProxyAgent({ protocol: `socks${proxyType}`, host: proxyHost, port: proxyPort }),
      username: options.username,
      password: options.password,
      auth: options.auth,
      host: options.host,
      port: options.port,
      version: options.version,
      loginMsg: options.loginMsg
    });
    // error log
    bot.on('error', (err) => {
    sendlog(`[error] [${options.username}] ${err}`, "red")
    })
    // load plugins
    bot.loadPlugin(antiafk);
    // health & food update
    bot.on('health', () => {
      document.getElementById('lid'+options.username).innerHTML = `HP: ${bot.health.toFixed()} ` + "|" + ` F: ${bot.food.toFixed()} ` + ` [${options.username}] `
    })
    //login event
    bot.once('login', () => {
      sendlog(`[${options.username}] Logged in.`, "green")
      sendToList(options.username)
      startDcL()
    });
    //spawn event
    bot.once('spawn', () => {
      if (script) {
        startscript(script);
        sendlog(`[${options.username}] Script started.`, "#03fcd7")
      }
      if (options.loginMsg) {
        bot.chat(options.loginMsg);
        sendlog(`[${options.username}] Join Message sent.`, "#34abeb")
      }
      botlist.push(bot.username)
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
      if(document.getElementById('antiantispam').checked) {
        bot.chat(document.getElementById('chatbox').value + " " + salt(3))
        var chatSpam = setInterval(() => {
          bot.chat(document.getElementById('chatbox').value + " " + salt(3))
        }, document.getElementById('spamdelay').value);
      } else {
        bot.chat(document.getElementById('chatbox').value)
        var chatSpam = setInterval(() => {
          bot.chat(document.getElementById('chatbox').value)
        }, document.getElementById('spamdelay').value);
      }
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
        document.getElementById("lid"+options.username).remove();
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
    bot.look(document.getElementById('lookvalue').value, 0)
  });
    //walk toggle
    document.getElementById('togglewalk').addEventListener('change', () => {
      if (document.getElementById("togglewalk").checked == true) {
        bot.setControlState('forward', true)
        bot.setControlState('sprint', true)
      }
      if (document.getElementById("togglewalk").checked == false) {
        bot.setControlState('forward', false)
        bot.setControlState('sprint', false)
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
    //accoutn list disconnect button
    function startDcL() {
      document.getElementById('lid'+options.username).addEventListener('click', () => {
        bot.quit()
        document.getElementById("lid"+options.username).remove();
        sendlog(`[${options.username}] Disconnected`, "red")
      })
    }
      //look
      document.getElementById('lookLock').addEventListener('change', () => {
        var lookBtn = document.getElementById("lookLock");
        var look = setInterval(() => {
            if (lookBtn.checked == false) clearInterval(look);
            const entity = bot.nearestEntity(e => e.type === 'player')
            bot.lookAt(entity.position.offset(0, entity.height, 0), true)
          }, 0)
    })
    //killaura toggle
    document.getElementById('kaPlayer').addEventListener('change', () => {
      var kaBtn = document.getElementById("kaPlayer");
      if (kaBtn.checked == false) return;
      var kaPlayer = setInterval(() => {
          if (kaBtn.checked == false) clearInterval(kaPlayer);
          const entity = bot.nearestEntity(e => e.type === 'player')
          if (entity && entity.position.distanceTo(bot.entity.position) < document.getElementById('atkrng').value) {
              if (document.getElementById('kaLook').checked) bot.lookAt(entity.position.offset(0, entity.height, 0), true)
              bot.attack(entity)
          }
      }, document.getElementById('atkdel').value);
  })
  document.getElementById('kaMobs').addEventListener('change', () => {
    var kaBtn = document.getElementById("kaMobs");
    var kaMobs = setInterval(() => {
        if (kaBtn.checked == false) clearInterval(kaMobs);
        const entity = bot.nearestEntity(e => e.type === 'mob')
        if (entity && entity.position.distanceTo(bot.entity.position) < document.getElementById('atkrng').value) {
            if (document.getElementById('kaLook').checked) bot.lookAt(entity.position.offset(0, entity.height, 0), true)
            bot.attack(entity)
        }
    }, document.getElementById('atkdel').value);
})
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
function btnDc() {
	execmd.emit('disconnect');
	sendlog("[System] Disconnected all bots.", "red")
  document.getElementById('joinedAccList').innerHTML = ""
}
//reconnect
function btnRc() {
	if (accounts) {
		startaccountfile()
	} else {
		startmultibot(joindata)
	}
	sendlog("[System] Attempting to Reconnect.", "pink")
}
//script reconnect thing
execmd.on('reconnect', () => {
	if (accounts) {
		startaccountfile()
	} else {
		startmultibot(joindata)
	}
	sendlog("[Script] Attempting to Reconnect.", "pink")
});
//sends name to count dropdown
function sendToList(name) {
  var li = document.createElement('li');
  li.id = "lid"+name;
  li.innerHTML = `HP: 0 | F: 0 [${name}]`;
  document.getElementById('joinedAccList').appendChild(li);
}