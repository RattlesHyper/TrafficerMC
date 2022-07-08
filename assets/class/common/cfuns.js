const { EventEmitter } = require('events')
const execmd = new EventEmitter()
const Store = require('electron-store')
const store = new Store()
const antiafk = require('../../plugins/antiafk')

//delay function
function timer(ms) {
	return new Promise(res => setTimeout(res, ms ? ms : 1000))
  };
  //send logs to chat box
  function sendlog(textToLog, color) {
	const chatboxid = document.getElementById('chatmsgbox')
	ele = document.createElement("li");
	ele.style.color = color
	ele.appendChild(document.createTextNode(textToLog))
	chatboxid.appendChild(ele)
	chatboxid.scrollTop = document.getElementById('chatmsgbox').scrollHeight
  }
  //script controler
  async function startscript(script) {
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
		execmd.emit(command, args.shift(1));
	  }
	  c += 1
	}
  }
  //clear chat
  function clearchat() {
	document.getElementById('chatmsgbox').innerHTML = ''
  }
  //disconnect button
  function btnDc() {
	execmd.emit('disconnect');
	sendlog("[logs] Disconnected.", "red")
	document.getElementById('h2tit').innerHTML = "Bot Disconnected"
  }
  //reconnect
  function btnRc() {
	newBot(joindata)
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
  
  // show account list
  function showAaccList() {
	if (document.getElementById("divBotCount").style.display === "none") {
	  document.getElementById("divBotCount").style.display = null
	} else {
	  document.getElementById("divBotCount").style.display = "none"
	}
  }

// random char
function salt(length) {
	var result = '';
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for ( var i = 0; i < length; i++ ) {
	  result += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return result;
  }

module.exports = { timer, sendlog, startscript, antiafk, clearchat, btnDc, btnRc, startaccountfile, startmultibot, showAaccList, salt, execmd, store }