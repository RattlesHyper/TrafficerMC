const { ipcRenderer } = require('electron');
const mineflayer = require('mineflayer');
const antiafk = require("mineflayer-antiafk");
const acts = ['rotate', 'jump', 'swingArm'];


ipcRenderer.on('startbot', (e, data) => {
  const newBot = new NewBot(data)
});

class NewBot {
  constructor(data) {
      this.username = data.username;
      this.host = data.host;
      this.port = data.port;
      this.version = data.version;
      this.initBot();
  }
  initBot() {
      this.bot = mineflayer.createBot({
          "username": this.username,
          "host": this.host,
          "port": this.port,
          "version": this.version
      });
      // load plugins
      this.bot.loadPlugin(antiafk);
      this.bot.afk.setOptions({
          fishing: false,
          actions: acts,
          killauraEnabled: false
      });
      this.initEvents()
  }
  initEvents() {
      // health & food update
      this.bot.on('health', () => {
          document.getElementById('healthhp').innerHTML = ` ${this.bot.health.toFixed()}`
          document.getElementById('foodhp').innerHTML = ` ${this.bot.food.toFixed()}`
      })
      //reconnect
      document.getElementById('buttonreconnect').addEventListener('click', () => {
          this.initBot()
      });
      // new bot winwow
      this.bot.once('login', () => {
          ipcRenderer.send('usernameupdate', this.username)
          document.getElementById('h2tit').innerHTML = 'Logged in'
          document.getElementById('hitit').innerHTML = `Bot Control Panel (${this.username})`
      });
      //login event
      this.bot.on('spawn', () => {
          document.getElementById('h2tit').innerHTML = 'Spawned'
          sendlog("[logs] Spawned.", "#145e00")
          if (document.getElementById("afkToggle").checked == true) {
              this.bot.afk.start();
          }
      });
      //AFK button
      document.getElementById('afkToggle').addEventListener('change', () => {
          if (document.getElementById("afkToggle").checked == true) {
              this.bot.afk.start();
          } else {
              this.bot.afk.stop();
          }
      });
      // chat send
      document.getElementById('chatbox').addEventListener('keyup', (e) => {
          if (e.key !== "Enter") return;
          this.bot.chat(document.getElementById('chatbox').value);
          document.getElementById('h2tit').innerHTML = `Message sent ${document.getElementById('chatbox').value}`;
      })
      document.getElementById('sendmsg').addEventListener('click', () => {
          this.bot.chat(document.getElementById('chatbox').value);
          document.getElementById('h2tit').innerHTML = `Message sent ${document.getElementById('chatbox').value}`;
      });
      //hotbar selector
      document.getElementById('rclickhotbar').addEventListener('click', () => {
          this.bot.activateItem();
          document.getElementById('h2tit').innerHTML = "Activated slot";
      });
      document.getElementById('sethotbar').addEventListener('click', () => {
          this.bot.setQuickBarSlot(document.getElementById('hotbar').value);
          document.getElementById('h2tit').innerHTML = "Hotbar slot set";
      });
      //window state
      this.bot.on('windowOpen', () => {
          document.getElementById('invitm').innerHTML = 'Window Opened'
          sendlog("[logs] Window Opened.", "#312691")
      });
      this.bot.on('windowClose', () => {
          document.getElementById('invitm').innerHTML = 'Window Closed'
          sendlog("[logs] Window Closed.", "#312691")
      });
      //inventory slot clicker
      document.getElementById('inventoryslotr').addEventListener('click', () => {
          this.bot.clickWindow(document.getElementById('inventoryslotbox').value, 1, 0)
      });
      document.getElementById('inventoryslotl').addEventListener('click', () => {
          this.bot.clickWindow(document.getElementById('inventoryslotbox').value, 0, 0)
      });
      document.getElementById('inventoryslotd').addEventListener('click', () => {
          this.bot.clickWindow(-999, 1, 0)
      });
      document.getElementById('closewin').addEventListener('click', () => {
          this.bot.closeWindow(window)
      });
      //spam toggle
      document.getElementById('spambtn').addEventListener('change', () => {
          var checkBox = document.getElementById("spambtn");
          if (checkBox.checked == true) {
              this.bot.chat(document.getElementById('chatbox').value)
              var chatSpam = setInterval(() => {
                  this.bot.chat(document.getElementById('chatbox').value)
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
      this.bot.on('kicked', (reason, loggedIn) => {
          if (loggedIn === true) {
              sendlog("[logs] Got Kicked!", "red")
          } else {
              sendlog("[logs] Failed to Join!", "red")
          }
      });
      //auto reconnect check
      this.bot.on('end', () => {
          if (document.getElementById("btnrecon").checked == true) {
              sendlog("[logs] Attempting to Reconnect.", "pink")
              this.initBot();
          };
          document.getElementById("spambtn").checked = false;
      });
      //disconnect button
      document.getElementById('btndiscon').addEventListener('click', () => {
          this.bot.quit();
          sendlog("[logs] Disconnected.", "red")
          document.getElementById('h2tit').innerHTML = "Bot Disconnected"
      });
      //chat print
      this.bot.on('message', (m) => {
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
      this.bot.on('playerJoined', (player) => {
          sendlog(`[logs] ${player.username} Joined the server.`, "#03fc6b")
      });
      this.bot.on('playerLeft', (player) => {
          sendlog(`[logs] ${player.username} Left the server.`, "#ff6666")
      });
      //look at position
      document.getElementById('lookPos').addEventListener('click', () => {
          this.bot._client.write('look', {
              yaw: document.getElementById('lookvalue').value,
              pitch: 0,
              onGround: true
          })
      });
      //walk toggle
      document.getElementById('togglewalk').addEventListener('change', () => {
          if (document.getElementById("togglewalk").checked == true) {
              this.bot.setControlState('forward', true)
          }
          if (document.getElementById("togglewalk").checked == false) {
              this.bot.setControlState('forward', false)
          }
      });
  }
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