const { ipcRenderer } = require('electron');
const mineflayer = require('mineflayer');
const antiafk = require("mineflayer-antiafk");
const acts = ['rotate', 'jump', 'swingArm'];


ipcRenderer.on('startbot', (e, data) => {
  //reconnect
  document.getElementById('buttonreconnect').addEventListener('click', () => {
    reconfunction();
  });

  reconfunction();
  function reconfunction() {
    const bot = mineflayer.createBot(data);
    bot.loadPlugin(antiafk);
    bot.afk.setOptions({
      fishing: false,
      actions: acts,
      killauraEnabled: false
    });
    // new bot winwow
    bot.once('login', () => {
      unm = bot.username
      ipcRenderer.send('usernameupdate', unm)
      document.getElementById('h2tit').innerHTML = 'Logged in'
      document.getElementById('hitit').innerHTML = `Bot Control Panel (${unm})`
    });
    bot.on('spawn', () => {
      document.getElementById('h2tit').innerHTML = 'Spawned'
      var checkBox = document.getElementById("afkToggle");
      if (checkBox.checked == true) {
        var checkBox = document.getElementById("afkToggle");
        if (checkBox.checked == true) {
          bot.afk.start();
        };
      };
    });
    // chat send
    document.getElementById('chatbox').addEventListener('keyup', (e) => {
      if(e.key !== "Enter") return;
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
    });
    bot.on('windowClose', () => {
      document.getElementById('invitm').innerHTML = 'Window Closed'
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
        var chatSpam = setInterval(spamit, document.getElementById('spamdelay').value);

        function spamit() {
          bot.chat(document.getElementById('chatbox').value)
        }
      } else {};
      document.getElementById('spambtn').addEventListener('click', () => {
        var checkBox = document.getElementById("spambtn");
        if (checkBox.checked == false) {
          clearInterval(chatSpam);
        } else {};
      })
    });
    //kick detect
    bot.on('kicked', (reason) => {
      document.getElementById('h2tit').innerHTML = `Bot Kicked reason: ${reason}`
      document.getElementById("spambtn").checked = false;
    });
    //Auto Reconnect Toggle check
    bot.on('end', (reason) => {
      clearInterval(health)
      var checkBox = document.getElementById("btnrecon");
      if (checkBox.checked == true) {
        reconfunction();
      } else {};
      document.getElementById("spambtn").checked = false;
    });
    //disconnect
    document.getElementById('btndiscon').addEventListener('click', () => {
      bot.quit();
      document.getElementById('h2tit').innerHTML = "Bot Disconnected"
    });
    //chat print
    bot.on('message', (m) => {
      const t = document.createElement("li");
      var c = ''
      if (m.json.extra instanceof Array) {
      m.json.extra.forEach(e => {
        c += `<span style="color: ${e.color};">${e.text.replace('<', '&lt;').replace('>', '&gt;')}</span>`.replace(/\\n/g, '<br>')
      });
      } else if (msg.json.text) {
        c += `<span>${m.json.text.replace('<', '&lt;').replace('>', '&gt;')}</span>`.replace(/\\n/g, '<br>').replace(/§.{1}/g, '')
      }
      t.innerHTML = c
      document.getElementById('chatmsgbox').appendChild(t)
      document.getElementById('chatmsgbox').scrollTop = document.getElementById('chatmsgbox').scrollHeight
    })
    //player join & leave message
    bot.on('playerJoined',  (player) => {
      const plyr = document.createElement("li");
      plyr.appendChild(document.createTextNode(`> ${player.username} Joined the server.`));
      document.getElementById('chatmsgbox').appendChild(plyr).style.color = '#03fc6b';
      document.getElementById('chatmsgbox').scrollTop = document.getElementById('chatmsgbox').scrollHeight
    });
    bot.on('playerLeft',  (player) => {
      const plyrl = document.createElement("li");
      plyrl.appendChild(document.createTextNode(`> ${player.username} Left the server.`));
      document.getElementById('chatmsgbox').appendChild(plyrl).style.color = '#ff6666';
      document.getElementById('chatmsgbox').scrollTop = document.getElementById('chatmsgbox').scrollHeight
    });
    //health & food update
    let health = setInterval(() => {gethealth()}, 500);
    function gethealth() {
      document.getElementById('healthhp').innerHTML = ` ${bot.health.toFixed()}`
      document.getElementById('foodhp').innerHTML = ` ${bot.food.toFixed()}`
    }
  }
});
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
