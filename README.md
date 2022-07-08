# TrafficerMC
## A Minecraft botting tool with Anti-AFK, Chat spammer, Inventory/Chest manager features.

[![Discord](https://discord.com/api/guilds/935341227400904734/widget.png)](https://discord.gg/m6b8Pw4NR8)
[![](https://img.shields.io/github/release/RattlesHyper/TrafficerMC.svg)](https://github.com/RattlesHyper/TrafficerMC/releases)
[![GitHub downloads](https://img.shields.io/github/downloads/RattlesHyper/TrafficerMC/total.svg)](https://github.com/RattlesHyper/TrafficerMC/releases/latest)

### Click here to [Download](https://github.com/RattlesHyper/TrafficerMC/releases)

# 📦 Features
- Anti-AFK
- Inventory/Chest clicker
- Chat
- Chat Spammer
- Anti-Anti-Spam (adds random text to bypass anti-spam)
- Hotbar item activator
- Auto Reconnect
- Health and Food
- Window state (open or closed)
- MultiMode (with account file or bot set count for cracked)
- [Scripting](#scripting)
- [Account File](#accountfile)
- [Linux Support](#linux)
- Minecraft 1.8 - 1.18.2 support
- (ETC)

<details open style="font-size: 16px">
<summary>📷 Screenshots and Video</summary>
<br>

# 📷 Screenshots

![Screenshot 1](https://cdn.discordapp.com/attachments/537020502779232266/993761155879292978/unknown.png)

![Screenshot 2](https://cdn.discordapp.com/attachments/537020502779232266/993588752503013426/unknown.png)

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
reconnect
loop
``` 
🔎 Script features

- [Features](#scriptfeatures)
    - [Chat](#chat)
    - [Activate](#activate)
    - [setHotbar](#sethotbar)
    - [LclickWindow / RclickWindow](#lclickwindow)
    - [closeWindow](#closewindow)
    - [drop](#drop)
    - [dropAll](#dropall)
    - [startWalk / stopWalk](#startwalk)
    - [startRun / stopRun](#startrun)
    - [stattWalkBack / stopWalkBack](#startwalkback)
    - [startWalkRight / stopWalkRight](#startwalkright)
    - [startWalkLeft / stopWalkLeft](#startwalkleft)
    - [startJump / stopJump](#startjump)
    - [startSneak / stopSneak](#startsneak)
    - [stopMove](#stopmove)
    - [Disconnect](#disconnect)
    - [Reconnect](#reconnect)
    - [Loop](#loop)
    - [Delay](#delay)

    ### chat
    ` chat <Message> ` Sends message in chat.

    💡 Example:
    ```
    chat Hi
    chat Hello
    ```

    ### Activate
    ` Activate ` Activates/RightClick item in hand.

    💡 Example:
    ```
    Activate
    Activate
    ```

    ### setHotbar
    ` setHotbar <Hotbar Slot Number> ` Sets Hotbar to selected slot.

    Minecraft hotbar starts at 0

    ![Horbar](https://cdn.discordapp.com/attachments/963491992506073108/967220718376996934/hotbar.jpg)

    💡 Example: 
    ```
    setHotbar 0
    sethotbar 3
    ```

    ### LclickWindow
    Left and Right click on window item.

    ` LclickWindow <Slot> ` Right click.
    
    ` RclickWindow <Slot> ` Left click.

    💡 Example:

    ```
    LclickWindow 10
    RclickWindow 12
    ```

    Window Slots Example:

    Minecraft Window slots / While window open:

    ![](https://cdn.discordapp.com/attachments/963491992506073108/967223630436118648/unknown.png)

    Minecraft Inventory slots / While window closed:

    ![](https://cdn.discordapp.com/attachments/963491992506073108/967224021823397888/unknown.png)

    ### closeWindow
    ` closeWindow ` Closes open window.

    ### Drop
    ` Drop ` Clicks outside of window to drop item.

    You need to click the item first to drop it.

    💡 Example:
    ```
    clickWindow 10 1
    Drop
    ```
    ### DropAll
    ` DropAll` Drops Everything from inventory.

    ### startWalk
    ` startWalk ` Starts walking forword.

    ` stopWalk ` Stops walking forword.

    ### startRun
    ` startRun ` Starts running forword.

    ` stopRun ` Stops running forword.

    ### startWalkBack
    ` startWalkBack ` Starts walking back.

    ` stopWalkBack ` Stops walking back.

    ### startWalkRight
    ` startWalkRight ` Starts walking right.
    
    ` stopWalkRight ` Stops walking right.

    ### startWalkLeft
    ` startWalkLeft ` Starts walking Left.

    ` stopWalkLeft ` Stops walking Left.

    ### startJump
    ` starJump ` Starts Jumping.

    ` stopJump ` Stops Jumping.

    ### startSneak
    ` starSneak ` Starts Sneaking.

    ` stopSneak ` Stops Sneaking.

    ### stopMove
    ` stopMove ` Stops all movement.

    ### Disconnect
    ` Disconnect ` Discommects Bot.

    ### Reconnect 
    ` Reconnect ` Reconnects Bot.

    (Currently not supported in MultiMode)

    ### Loop
    ` Loop ` Script Starts over from line 1

    ### Delay 
    ` Delay ` Adds delay to next task.

    Delay is count by ms ` 1sec = 1000 `

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

    ![](https://cdn.discordapp.com/attachments/628195877189844996/994665015829344388/unknown.png)

    📍 Click Permissions

    ![](https://cdn.discordapp.com/attachments/628195877189844996/994665646795280494/unknown.png)

    📍 And enable "Allow ecexuting file as program"

    ![](https://cdn.discordapp.com/attachments/628195877189844996/994666628627308574/unknown.png)

    📍 Then you can run the app by double clicking on it.