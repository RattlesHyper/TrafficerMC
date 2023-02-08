# TrafficerMC
## A Minecraft botting tool with Anti-AFK, Chat spammer, Inventory/Chest manager features.

[![Discord](https://discord.com/api/guilds/935341227400904734/widget.png)](https://discord.gg/m6b8Pw4NR8)
[![](https://img.shields.io/github/release/RattlesHyper/TrafficerMC.svg)](https://github.com/RattlesHyper/TrafficerMC/releases)
[![GitHub downloads](https://img.shields.io/github/downloads/RattlesHyper/TrafficerMC/total.svg)](https://github.com/RattlesHyper/TrafficerMC/releases/latest)

### Click here to [Download](https://github.com/RattlesHyper/TrafficerMC/releases)

# 📦 Features
- Anti-AFK
- Inventory Manager
- Chat
- Chat Spammer
- Auto Reconnect
- Killaura
- [Scripting](#scripting)
- [Account File](#accountfile)
- [Proxy Support](#proxy)
- [Name Generator](#namegen)
- [Custom Theme](#theme)
- [Manual Build & Run Guide](#build)
- Minecraft 1.8 - 1.19 Support
- (And so many more featutrs, I'm too lazy to write them all)

<details open style="font-size: 16px">
<summary>📷 Screenshots and Video</summary>
<br>

# 📷 Screenshots

![Screenshot 1](https://cdn.discordapp.com/attachments/937393739490537493/1070253266237140992/image.png)

![Screenshot 2](https://cdn.discordapp.com/attachments/937393739490537493/1070254695718862889/image.png)

![Screenshot 3](https://cdn.discordapp.com/attachments/937393739490537493/1070255636874534953/image.png)

# 🎞️ Video

[![](https://cdn.discordapp.com/attachments/962345126536036415/962355332263317554/hqdefault.jpg)](https://www.youtube.com/watch?v=eAe9m-d-el0&t=2s)

</details> <br>

# Scripting

## Script format

Script will start after bot spawn.

You need to use ` .txt ` file. Capitalization doesnt matter.

### 💡 Example
```
chat Hi
delay 1000
winclick 36 0
delay 5000
disconnect
``` 
🔎 Script features

- [Features](#scriptfeatures)
    - [Chat](#chat)
    - [Use Held Item](#useheld)
    - [setHotbar](#sethotbar)
    - [Click Inventory Item](#winclick)
    - [closeWindow](#closewindow)
    - [drop](#drop)
    - [Control Movement](#control)
    - [Anti-Afk](#anti-afk)
    - [Disconnect](#disconnect)
    - [Reconnect](#reconnect)
    - [Loop](#startscript)
    - [Anti-Afk](#anti-afk)
    - [Delay](#delay)

    ### chat
    ` chat <Message> ` Sends message in chat.

    💡 Example:
    ```
    chat Hi
    chat Hello
    ```

    ### Useheld
    ` useheld ` Uses Held item in hand.

    ### setHotbar
    ` sethotbar <Hotbar Slot Number> ` Sets Hotbar to selected slot.

    Minecraft hotbar starts at 0

    ![Horbar](https://cdn.discordapp.com/attachments/963491992506073108/967220718376996934/hotbar.jpg)

    💡 Example: 
    ```
    setHotbar 0
    sethotbar 3
    ```

    ### WinClick 
    ` winclick ` lets you Left and Right click on window item.

    Right click ` <Item Slot> 0`

    Left click ` <Item Slot> 1`

    💡 Example:

    ```
    winclick 36 0
    winclick 36 1
    ```

    Window Slots Example:

    Minecraft Window slots / While window open:

    ![](https://cdn.discordapp.com/attachments/963491992506073108/967223630436118648/unknown.png)

    Minecraft Inventory slots / While window closed:

    ![](https://cdn.discordapp.com/attachments/963491992506073108/967224021823397888/unknown.png)

    ### closeWindow
    ` closeWindow ` Closes open window.

    ### Drop
    ` Drop <Invntory Slot>` Drops the slot item if none specified drops all.

    💡 Example:
    ```
    Drop
    Drop 36
    ```
    ### Control
    ` startControl ` and  ` stopControl ` lets you control bots movement.
    
    control options: ` forward, backwards, left, right, jump, sneak, sprint `

    💡 Example:

    ```
    startControl forward
    startControl jump
    stopControl forward
    ```

    ### Anti-AFK

    ` afkOn ` Anti-AFK enabled

    ` afkOff ` Anti-AFK disabled

    ### Disconnect
    ` Disconnect ` Discommects Bot.

    ### Reconnect 
    ` Reconnect ` Reconnects Bot. Delay can be set from settings. (Currently not supported in MultiMode)

    ### StartScript
    ` startScript ` Script Starts again with script command. works as loop.

    ### Delay 
    ` Delay ` Adds delay to next task.

    Delay is count by ms ` 1 sec = 1000 `

    Default delay 1000

    💡 Example:

    ```
    chat Hi
    delay 1200
    chat Hello
    ```

    # AccountFile

    ## Account File format

    Account file must be a ` .txt ` file.
    
    ⚠️ And you must set bot count. That many accounts will join.

    💡 Example:

    ```
    Username
    Username
    Username
    ```

    # proxy

    Proxy file must be a ` .txt ` file. And it's used in Random order

    💡 Proxy Supports SOCKS4 & SOCKS5

    ⚠️ You must chose SOCKS protocol from Dashboard
    
    💡 Proxy File format Example

    ```
    Proxy:Port
    Proxy:Port
    Proxy:Port
    ```
    # Theme
    Custom CSS can be loaded from settings
    
    file format must be ` .css `

    background-image url can be set to any online image link.

    here is the default theme

    💡 Example

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
    # Namegen

    Name Generator Randomizes the name automatically!

    Name Generator currently has 2 options (SALT) and (LEGIT)

    ` (SALT) ` in the Username input to get 4 random letters.

    💡 Example

    ```
    (SALT)_NAME = UaiO_NAME
    (SALT)_NAME_(SALT) = kwaW_NAME_aWad
    (SALT)(SALT)(SALT) = UaiOaFHWHbJx
    ```

    ` (LEGIT) ` in the Username input will Generate fairly realistic names.

    # Build

    This is a guide for those who wanna build or run it with the source code.

    You need to download [NodeJs](https://nodejs.org/en/download/) before following the steps.

    Open Powershell or Terminal in a folder

    1 ` git clone https://github.com/RattlesHyper/TrafficerMC `

    2 ` npm install `

    3 ` npm start `

    Build commands.

    ` npm run <option> ` builds and puts the build in /dist folder

    `winx64` for Windows x64

    `winx86` for Windows x86

    `linux64` for linux x64

    `linux86` for linux x86
