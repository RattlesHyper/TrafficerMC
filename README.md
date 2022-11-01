# TrafficerMC
## A Minecraft botting tool with Anti-AFK, Chat spammer, Inventory/Chest manager features.

[![Discord](https://discord.com/api/guilds/935341227400904734/widget.png)](https://discord.gg/m6b8Pw4NR8)
[![](https://img.shields.io/github/release/RattlesHyper/TrafficerMC.svg)](https://github.com/RattlesHyper/TrafficerMC/releases)
[![GitHub downloads](https://img.shields.io/github/downloads/RattlesHyper/TrafficerMC/total.svg)](https://github.com/RattlesHyper/TrafficerMC/releases/latest)

### Click here to [Download](https://github.com/RattlesHyper/TrafficerMC/releases)

# 📦 Features
- Anti-AFK
- Inventory/Chest Clicker
- Chat
- Chat Spammer + Anti Spam
- Auto Reconnect
- [Scripting](#scripting)
- [Account File](#accountfile)
- [Proxy Support](#proxy) SOCKS4/SOCKS5
- [Name Salt](#namesalt)
- [Linux Support](#linux)
- [Manual Build & Run Guide](#build)
- Minecraft 1.8 - 1.19 Support
- (And so many more featutrs, I'm too lazy to write them all)

<details open style="font-size: 16px">
<summary>📷 Screenshots and Video</summary>
<br>

# 📷 Screenshots

![Screenshot 1](https://cdn.discordapp.com/attachments/937393739490537493/1036899237654446100/unknown.png)

![Screenshot 2](https://cdn.discordapp.com/attachments/937393739490537493/1036899922781417502/unknown.png)

![Screenshot 3](https://cdn.discordapp.com/attachments/937393739490537493/1036900465478217738/unknown.png)

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
LlickWindow 10
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
    You must load plugin with ` loadAntiAfk `

    ` afkOn ` Anti-AFK enabled

    ` afkOff ` Anti-AFK disabled

    ### Disconnect
    ` Disconnect ` Discommects Bot.

    ### Reconnect 
    ` Reconnect ` Reconnects Bot.

    (Currently not supported in MultiMode)

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

    You can leave the Username & Password empty while using account file.

    ## Inside account file

    📍 First argument: Username / Email

    📍 Second argument: Password (Leave empty if cracked)

    📍 Third argument: Auth Type [mojang / microsoft]. (Leave empty if mojang)

    💡 Example:

    ```
    Username Password microsoft
    Username Password
    Email Password microsoft
    Username
    ```

    # linux

    📍 Download the Linux version.

    📍 Right click on the Appimage file.

    📍 Click Properties.

    📍 Click Permissions

    📍 And enable "Allow ecexuting file as program"

    📍 Then you can run the app by double clicking on it.


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

    # namesalt

    Name Salt Randomizes the name automatically!

    You can put ` (SALT) ` in the name box to get 4 random letters.

    💡 Example

    ```
    (SALT)_NAME = UaiO_NAME
    (SALT)_NAME_(SALT) = kwaW_NAME_aWad
    (SALT)(SALT)(SALT) = UaiOaFHWHbJx
    ```

    # Build

    This is a guide for those who wanna build or run it with the source code.

    You need to download [NodeJs](https://nodejs.org/en/download/) before following the steps.

    Open Powershell or Terminal in a folder

    1 ` git clone https://github.com/RattlesHyper/TrafficerMC ` clones the repo

    2 ` npm install ` installs the dependencies

    3 ` npm start ` starts the application

    Build commands.

    ` npm run <OSxArch> ` builds and puts the build in /dist folder


    OScArch options.

    `winx64` for Windows x64

    `winx86` for Windows x86

    `linux64` for linux x64

    `linux86` for linux x86
