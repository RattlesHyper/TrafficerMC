<p align="center">
  <img src="https://cdn.discordapp.com/attachments/1101173583956422736/1101178737875234816/fqwefqef.png"/>
</p>
<p align="center">The best, free and open source Minecraft botting tool.</p>
<p align="center">
<a href="https://github.com/RattlesHyper/TrafficerMC/releases/latest">
  <img src="https://img.shields.io/github/v/release/RattlesHyper/Trafficermc?color=red&style=for-the-badge"/>
</a>
  <a href="https://github.com/RattlesHyper/TrafficerMC/releases">
  <img src="https://img.shields.io/github/downloads/RattlesHyper/TrafficerMC/total?color=red&style=for-the-badge"/>
    <a href="https://discord.gg/uFpaAZdVgS"><img src="https://img.shields.io/discord/935341227400904734?label=DISCORD&color=red&style=for-the-badge"></a>
  </a>
</p>

<hr />

## Features
TrafficerMC has a variety of features. Some of them are:
 - Anti-AFK
 - Killaura
 - Spam w/ Anti-Spam prevention
 - [Scripting](#scripting)
 - [Accounts](#account-file)
 - [Proxies](#proxies)
 - [Theme](#theme)
 - Linear Delay
 - Auto Reconnect
 - and way more!

#### Minecraft Version 1.8.x - 1.20

## Media

![](https://media.discordapp.net/attachments/1101173583956422736/1105880170751078400/image.png)

![](https://media.discordapp.net/attachments/1101173583956422736/1105881853849772062/TrafficerMC_BCQhRUpAWj.png)

![](https://media.discordapp.net/attachments/1101173583956422736/1105881852948009090/TrafficerMC_Agn7kon7Np.png)
## Tutorials
[![](https://img.youtube.com/vi/lD3poymjVAk/maxresdefault.jpg)](https://www.youtube.com/watch?v=lD3poymjVAk)
TrafficerMC v2.1

[![](https://img.youtube.com/vi/eAe9m-d-el0/maxresdefault.jpg)](https://www.youtube.com/watch?v=eAe9m-d-el0)
TrafficerMC v0.4

# Scripting
Scripting can allow the bot to do things automatically without any user input. It can also help if you are making multiple bots do the same things.

## What a script would look like
```
chat Hello from TrafficerMC!
delay 1000
useheld
delay 2000
winclick 36 0
delay 1000
disconnect
```
## Features
 - [Chat](#chat)
 - [Use Held Item](#useheld)
 - [Set Hotbar Slot](#sethotbar)
 - [Click Inventory Item](#winclick)
 - [Close Window](#closewindow)
 - [Drop](#drop)
 - [Movement](#movement)
 - [Anti-AFK](#anti-afk)
 - [Disconnect](#disconnect)
 - [Reconnect](#reconnect)
 - [Loop](#startscript)
 - [Delay](#delay)

### Chat
Sends a message to the servers chat.
Usage: `chat <message>`
Example:
```
chat Hello there!
chat /help
```
### useHeld
Uses the current held item.
Usage: `useHeld`
### setHotbar
Sets hotbar to the selected slot.
Usage: `setHotbar <number>`
Example: 
```
setHotbar 0
setHotbar 3
```
### winClick 
Clicks on a window item. To right click, use `0`. Otherwise, to left click, use `1`.
Usage: `winClick <number> <type>`
Example:
```
winClick 36 0
winClick 24 1
```
**If you are struggling on what slots you should click, here are some images to represent!**
Chest interface:
![](https://cdn.discordapp.com/attachments/963491992506073108/967223630436118648/unknown.png) 
Inventory interface:
![](https://cdn.discordapp.com/attachments/963491992506073108/967224021823397888/unknown.png)
### closeWindow
Closes the current window.
Usage: `closeWindow` 
### Drop
Drops the slot item if none specified drops all.
Usage: `drop <number>`
Example:
```
drop
drop 36
```
### Movement
Controls the bot movement.
Usage: `startControl/stopControl forward/backwards/left/right/jump/sneak/sprint`
Example:
```
startControl forward
startControl jump
stopControl forward
```
### Anti-AFK
Enables/Disables Anti-AFK on the bot.
Usage: `afkOn/afkOff`
### Disconnect
Disconnects the Bot.
Usage: `disconnect` 
### Reconnect 
Reconnects the bot.
Usage: `reconnect`
### startScript
Starts the script.
Usage: `startScript`
### Delay 
Delays the next task.
Usage: `delay <milliseconds - 1000 by default>`
Example:
```
chat Hi
delay 1200
chat Hello
```
# Account File
Account filing connects the bots with certain names that aren't set in General tab. It can be useful if you want to bot a server with NameMC names, for example. To make a account file, you would need to go into a text file editor, and apon entering all the usernames, you save it as a `.txt` file. You can name it anything. **Please note that you can set Max Accounts in General Tab or it will use all the names**
## What an account file would look like
```
vampers
nVoid
Danilo764
```
# Proxies
Proxy file must be a ` .txt ` file. And it's used in Random order
Proxies connects the bots with different ip addresses. This can be very useful to bypass the max connections to a server, or bypass the max registerations if it's a cracked server. To make a proxy file, you would need to go into a text file editor, and apon entering all the proxies with ports, you save it as a `.txt` file. You can name it anything. **Please note that you will need to set the SOCKS protocol in Settings Tab for the bots to join!**
## What a proxy file would look like
```
12.34.56.78:9876
54.3.210.123:45678
98.7.65.4:32101
```
# Theme
Custom CSS allows you to customize TrafficerMC the way you wanted. To make a custom css file, you would need to go into a text file editor, and apon finishing the css file, you save it as a `.css` file. You can name it anything. After all that, the file must be loaded in Settings tab. 
## What the css file should look like
```
:root {
    --background-image: url('../icons/app/Background.svg');
    --bg-color: #0c0d11;
    --text-color: #f6f5f5;
    --button-color: #5b8191;
    --button-text-color: #f6f5f5;
    --button-opacity: 1;
    --button-border-color: #454864;;
    --ul-bg-color: #171a25;
    --ul-opacity: 0.7;
    --downbar-color: #3D75C9;
    --selected-item-color: #00e1ff88;
    --selected-item-opacity: 1;
    --downbar-opacity: 1;
    --sidebar-color: 0 0 0;
    --sidebar-opacity: 0.2;
    --topbar-color: 0 0 0;
    --topbar-opacity: 0.6;
}
```
# Name generator
Name generation randomizes the bot's name without any user input. There are 2 current options, which are `(SALT)` and `(LEGIT)`. These must be input in the Username bit in General tab.
## What name generation would look like
```
TrafficerMC_(SALT) = TrafficerMC_hlpC / TrafficerMC_ggKt
(LEGIT) = JogBeeRibTap / GitFunWitSinWar
```
# Building TrafficerMC
If you want to run TrafficerMC in an IDE environment, you can do so. You would need [node.js](https://nodejs.org/en/download) installed before continuing. After node.js is installed, you need to make a folder to put all TrafficerMC code in, and open up a terminal or powershell in that folder. Once you have a terminal opened and on the folder, you need to execute these 3 commands:

 1. `git clone https://github.com/RattlesHyper/TrafficerMC`
 2. `npm install`
 3. `npm start`

If you want to build TrafficerMC, then run `npm run <option>`. The build will be put into /dist folder.
If you want to run TrafficerMC on different OSes, you can do so by doing `npm start <os>`. The current OSes supported are Windows 64-Bit (`winx64`), Windows 32-Bit (`winx86`), Linux 64-Bit (`linux64`) & Linux 32-Bit (`linux86`)
