import { BrowserWindow } from 'electron'

export function salt(length) {
  var result = ''
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

export function delay(ms) {
  return new Promise((res) => setTimeout(res, ms))
}

export function botMode(mode) {
  switch (mode) {
    case 'minimal':
      return {
        physicsEnabled: false,
        viewDistance: 'tiny',
        plugins: {
          anvil: false,
          block_actions: false,
          blocks: false,
          book: false,
          boss_bar: false,
          breath: false,
          chest: false,
          command_block: false,
          conversions: false,
          craft: false,
          creative: false,
          digging: false,
          enchantment_table: false,
          entities: false,
          experience: false,
          explosion: false,
          fishing: false,
          furnace: false,
          generic_place: false,
          health: false,
          inventory: false,
          loader: false,
          painting: false,
          particle: false,
          place_block: false,
          place_entity: false,
          physics: false,
          rain: false,
          ray_trace: false,
          resource_pack: false,
          scoreboard: false,
          simple_inventory: false,
          sound: false,
          spawn_point: false,
          tablist: false,
          team: false,
          time: false,
          title: false,
          villager: false
        }
      }
    default:
      return
  }
}

export function genName() {
  const adjectives = [
    'Red',
    'Hot',
    'Big',
    'Old',
    'New',
    'Dry',
    'Wet',
    'Tall',
    'Soft',
    'Loud',
    'Cold',
    'Warm',
    'Dark',
    'Fair',
    'Blue',
    'Gray',
    'Rich',
    'Poor',
    'Fast',
    'Slow',
    'Thin',
    'Tiny',
    'Wide',
    'High',
    'Deep',
    'Dear',
    'Neat',
    'Cool',
    'Fine',
    'Lame',
    'Sharp',
    'Dull',
    'Cute',
    'Long',
    'Short',
    'Hard',
    'Mean',
    'Kind',
    'Sick',
    'Weak',
    'Pure',
    'Evil',
    'Bold',
    'Mild',
    'Wild',
    'Mad',
    'Calm',
    'Wise',
    'Dumb',
    'Slim',
    'Thick',
    'Pale',
    'Stale',
    'Ugly'
  ]
  const nouns = [
    '_',
    'Dog',
    'Cat',
    'Pen',
    'Car',
    'Cup',
    'Hat',
    'Sun',
    'Bed',
    'Box',
    'Key',
    'Arm',
    'Ball',
    'Book',
    'Cake',
    'Duck',
    'Fish',
    'Fork',
    'Hand',
    'Bird',
    'Moon',
    'Star',
    'Tree',
    'Ring',
    'Shoe',
    'Bear',
    'Coat',
    'Flag',
    'Lamp',
    'Leaf',
    'Desk',
    'Nail',
    'Sock',
    'Rose',
    'Boat',
    'Frog',
    'Pipe',
    'Rock',
    'Seal',
    'Boot',
    'Worm',
    'Bat',
    'Bell',
    'Belt',
    'Door',
    'Drum',
    'Gate',
    'Hair',
    'Head',
    'Heart',
    'Kiss',
    'Lady',
    'Lark',
    'Lion',
    'Bowl',
    'Deer',
    'Goat',
    'Nose',
    'Bone',
    'Bull',
    'Food',
    'Gown',
    'Gulf',
    'Horn',
    'Joke',
    'Jute',
    'Milk',
    'Mole',
    'Navy',
    'Pony',
    'Queen',
    'Rope',
    'Ruff',
    'Shin',
    'Tong',
    'Light',
    'Trot',
    'Vase',
    'Wren',
    'Yoke',
    'Zulu'
  ]
  const adjectivesLength = adjectives.length
  const nounsLength = nouns.length
  let name = ''

  while (name.length < 6 || name.length + 1 > 16) {
    const adjectiveIndex = Math.floor(Math.random() * adjectivesLength)
    const nounIndex = Math.floor(Math.random() * nounsLength)
    const newName = `${adjectives[adjectiveIndex]}${nouns[nounIndex]}`

    if (newName.length + name.length > 16) {
      break
    }

    name += newName

    if (Math.random() < 0.15) {
      const num = Math.floor(Math.random() * 999 + 1)
      if (name.length + num.toString().length > 16) {
        break
      }
      name += num
    }
  }

  const lowerCaseName = name.toLowerCase()
  const hasLowerCase = name !== lowerCaseName
  name += hasLowerCase ? lowerCaseName.slice(0, 16 - name.length) : ''

  return name
}

export function sendEvent(username, event, message) {
  const info = {
    id: username,
    event: event,
    message: message
  }
  BrowserWindow.getAllWindows()[0].webContents.send('botEvent', info)
}

export function proxyEvent(proxy, event, message, count) {
  const info = {
    proxy: proxy,
    event: event,
    message: message,
    count: count
  }
  BrowserWindow.getAllWindows()[0].webContents.send('proxyEvent', info)
}

export function notify(title, body, type, img, keep) {
  BrowserWindow.getAllWindows()[0].webContents.send('notify', title, body, type, img, keep)
}

export function cleanText(string) {
  let texts = []

  function recurse(obj) {
    if (obj.text) {
      texts.push(obj.text.replace(/\n/g, ' '))
    }
    if (obj.extra) {
      for (let item of obj.extra) {
        recurse(item)
      }
    }
  }

  recurse(string)
  return texts.join('').replaceAll('  ', ' ')
}
