import { SocksClient } from 'socks'
import { Socket } from 'net'

export function connection(
  proxyType,
  proxyHost,
  proxyPort,
  proxyUsername,
  proxyPassword,
  dHost,
  dPort
) {
  return new Promise((resolve, reject) => {
    if (proxyType === 'socks5' || proxyType === 'socks4') {
      SocksClient.createConnection(
        {
          proxy: {
            host: proxyHost,
            port: parseInt(proxyPort),
            userId: proxyUsername,
            password: proxyPassword,
            type: proxyType === 'socks5' ? 5 : 4
          },
          command: 'connect',
          destination: {
            host: dHost,
            port: parseInt(dPort)
          }
        },
        (err, info) => {
          if (err) {
            return reject(err.message)
          }
          resolve(info.socket)
        }
      )
    } else {
      const socket = new Socket().connect({
        host: dHost,
        port: parseInt(dPort)
      })
      socket.on('connect', () => {
        resolve(socket)
      })
      socket.on('error', (err) => {
        return reject(err.message)
      })
    }
  })
}
