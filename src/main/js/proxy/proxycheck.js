const mc = require('minecraft-protocol')
import { connection } from './proxyhandler'
import { salt } from '../misc/utils'

export function checkProxy(
  proxyType,
  proxyHost,
  proxyPort,
  proxyUsername,
  proxyPassword,
  dHost,
  dPort,
  timeout
) {
  return new Promise((resolve, reject) => {
    const bot = mc.createClient({
      host: dHost,
      port: parseInt(dPort),
      username: salt(10),
      auth: 'offline',
      connect: async (client) => {
        try {
          const socket = await connection(
            proxyType,
            proxyHost,
            proxyPort,
            proxyUsername,
            proxyPassword,
            dHost,
            dPort
          )
          client.setSocket(socket)
          client.emit('connect')
        } catch (error) {
          const info = {
            reason: 'bad',
            error: error,
            proxy: proxyHost + ':' + proxyPort
          }
          return reject(info)
        }
      }
    })

    setTimeout(() => {
      bot.end()
      const info = {
        reason: 'timeout',
        proxy: proxyHost + ':' + proxyPort
      }
      return reject(info)
    }, timeout)

    bot.on('connect', () => {
      bot.end()
      const info = {
        reason: 'success',
        proxy: `${proxyHost}:${proxyPort}${proxyUsername ? `:${proxyUsername}` : ''}${proxyPassword ? `:${proxyPassword}` : ''}`
      }
      return resolve(info)
    })

    bot.on('error', (error) => {
      const info = {
        reason: 'bad',
        error: error.message,
        proxy: proxyHost + ':' + proxyPort
      }
      return reject(info)
    })
  })
}
