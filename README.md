<p align="center">
  <img src="https://github.com/RattlesHyper/TrafficerMC/assets/83329088/28ffc234-65f7-4847-a0ad-1df8a52a368d"/>
</p>
<p align="center"><b style="font-size: 20px">The best, free and open source Minecraft botting tool.</b></p>
<p align="center">
<a href="https://github.com/RattlesHyper/TrafficerMC/releases/latest">
  <img src="https://img.shields.io/github/v/release/RattlesHyper/Trafficermc?color=red&style=for-the-badge"/>
</a>
  <a href="https://github.com/RattlesHyper/TrafficerMC/releases">
  <img src="https://img.shields.io/github/downloads/RattlesHyper/TrafficerMC/total?color=red&style=for-the-badge"/>
    <a href="https://discord.gg/uFpaAZdVgS"><img src="https://img.shields.io/discord/935341227400904734?label=DISCORD&color=red&style=for-the-badge"></a>
  </a>
</p>


## Features
TrafficerMC has a variety of features. Some of them are:
 - Anti AFK
 - Spam with Bypass
 - Name Generator
 - Full Inventory Control
 - Movement Control
 - EasyMC Support
 - Auto Reconnect
 - Killaura
 - [Scripting](#scripting)
 - [Proxies](#proxies)
 - and way more!

#### Minecraft Version 1.8.x - 1.20

##### Check out [Build Guide](#build-guide) to build TrafficerMC for your machine.

## Media

![TrafficerMC v3.0](https://github.com/RattlesHyper/TrafficerMC/assets/83329088/f0d90bb4-ca3b-4a7c-acdc-b851e386d632)
**TrafficerMC v3.0**

![Settings](https://github.com/RattlesHyper/TrafficerMC/assets/83329088/b1b103f1-1720-46fc-91ae-22e4ac186227)
**Settings**

![Botting](https://github.com/RattlesHyper/TrafficerMC/assets/83329088/b1951a59-7c90-40a9-b273-1b0feab52d92)
**Botting**

![Scripting](https://github.com/RattlesHyper/TrafficerMC/assets/83329088/2a25acd9-0c63-4042-8f11-68179aec0baa)
**Scripting**

![Proxy](https://github.com/RattlesHyper/TrafficerMC/assets/83329088/36f7cf6d-80e3-4d63-bb4f-ed23e8df8df1)
**Proxy**

## Tutorials
[![](https://img.youtube.com/vi/lD3poymjVAk/maxresdefault.jpg)](https://www.youtube.com/watch?v=lD3poymjVAk)
TrafficerMC v2.1 Tutorial Video

[![](https://img.youtube.com/vi/eAe9m-d-el0/maxresdefault.jpg)](https://www.youtube.com/watch?v=eAe9m-d-el0)
TrafficerMC v0.4 Preview Video (Outdated)

# Scripting
Scripting can allow the bot to do things automatically without any user input. It can also help if you are making multiple bots do the same things. All script executions will be shown on manual inputs, it can be used in scripting.

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

Variables: Player Name: `{player}`, Random String: `{random}`

Example:
```
chat Hello there! {player}
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
Clicks on a window item. To left click, use `0`. Otherwise, to right click, use `1`.
Usage: `winClick <number> <type>`

Example:
```
winClick 36 0
winClick 24 1
```
**If you are struggling on what slots you should click, here are some images to represent!**

**Every chest starts from `0`**

#### Chest interface:

![Chest](https://github.com/RattlesHyper/TrafficerMC/assets/83329088/058fd1d2-69c2-41f6-bfd3-3b9665c037e5)

#### Inventory interface:

![Inventory](https://github.com/RattlesHyper/TrafficerMC/assets/83329088/83f952e2-18f1-4c79-8a6d-e7a6880a6879)

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
Usage: `startMove/stopMove <forward/backwards/left/right/jump/sneak/sprint>`

Reset controls: `resetMove`

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
Usage: `delay <milliseconds>` default 1000

Example:
```
chat Hi
delay 1200
chat Hello
```
# Account File
Account file must be a `.txt` file. Put the usernames of the accounts you want to use line by line. Microsoft accounts can be used the same way.

**Please note that you can set Max Accounts in General Tab or it will use all the names**
## What an account file would look like
```
vampers
nVoid
Danilo764
```
# Proxies
TrafficerMC currently support all protocols and Auth proxies, HTTP is premium only.
## What a proxy file would look like
```
ProxyIP:ProxyPORT:Username:Password
98.7.65.4:32101
```

# Build Guide

**Requirements:** [NodeJS](https://nodejs.org/en/download)

Clone TrafficerMC repo with Git Clone: `git clone https://github.com/RattlesHyper/TrafficerMC` or Download the Source Code, then navigate to the folder. and open Terminal/Command Prompt/PowerShell

**Build Commands:**

**Windows:** `build:win`

**Mac:** `build:mac`

**Linux:** `build:linux`

If you want to run from source code use `npm run dev`
