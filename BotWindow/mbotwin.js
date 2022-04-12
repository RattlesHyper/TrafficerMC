const { ipcRenderer } = require('electron');
const mineflayer = require('mineflayer');
const antiafk = require("mineflayer-antiafk");
const acts = ['rotate', 'jump', 'swingArm'];
let bots = [];
let botcount = 0;
ipcRenderer.on('startbotmulti', (e, options) => {
  bots.push(new NewBot(options))
  setInterval(() => {
      document.getElementById('invitm').innerHTML = botcount
  }, 500);
});
class NewBot {
  constructor(options) {
      this.username = options.username;
      this.host = options.host;
      this.port = options.port;
      this.version = options.version;
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
      //login event
      this.bot.once('login', () => {
          sendlog(`[${this.username}] Logged in`, "green")
          botcount += 1
      });
      //spawn event
      this.bot.on('spawn', () => {
          sendlog(`[${this.username}] Spawned`, "#145e00")
          var checkBox = document.getElementById("afkToggle");
          if (checkBox.checked == true) {
              bot.afk.start();
          };
      });
      //chat send
      document.getElementById('chatbox').addEventListener('keyup', (e) => {
          if (e.key !== "Enter") return;
          this.bot.chat(document.getElementById('chatbox').value);
          document.getElementById('h2tit').innerHTML = `Sent: ${document.getElementById('chatbox').value}`
      })
      document.getElementById('sendmsg').addEventListener('click', () => {
          this.bot.chat(document.getElementById('chatbox').value);
          document.getElementById('h2tit').innerHTML = `Sent: ${document.getElementById('chatbox').value}`
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
          sendlog(`[${this.username}] Opened Window`, "#312691")
      });
      this.bot.on('windowClose', () => {
          sendlog(`[${this.username}] Closed Window`, "#312691")
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
      //drop all
      document.getElementById('inventoryslotda').addEventListener('click', () => {
          function tossNext() {
              if (this.bot.inventory.items().length === 0) return
              const item = this.bot.inventory.items()[0]
              this.bot.tossStack(item, tossNext)
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
              this.bot.afk.start();
          } else {
              this.bot.afk.stop();
          }
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
              sendlog(`[${this.username}] Got Kicked!`, "red")
              botcount -= 1
          } else {
              sendlog(`[${this.username}] Failed to Join!`, "red")
          }
      });
      //Auto Reconnect Toggle check
      this.bot.on('end', () => {
          var checkBox = document.getElementById("btnrecon");
          if (checkBox.checked == true) {
              this.initBot();
          };
          botcount = 0
      });
      //reconnect 
      document.getElementById('buttonreconnect').addEventListener('click', () => {
          this.initBot();
      })
      //disconnect
      document.getElementById('btndiscon').addEventListener('click', () => {
          this.bot.quit();
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