import { sendEvent } from './utils'

export async function easyMcAuth(client, options) {
  if (options.username?.length !== 20) return sendEvent(options.username, 'easymcAuth')
  const fetchOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: `{"token":"${options.username}"}`
  }
  try {
    const res = await fetch('https://api.easymc.io/v1/token/redeem', fetchOptions)
    const resJson = await res.json()
    if (resJson.error) return sendEvent('EasyMC', 'chat', `${resJson.error}`)
    if (!resJson) return sendEvent('EasyMC', 'chat', 'Empty response from EasyMC.')
    if (resJson.session?.length !== 43 || resJson.mcName?.length < 3 || resJson.uuid?.length !== 36)
      return sendEvent('EasyMC', 'chat', 'Invalid response from EasyMC.')
    const session = {
      accessToken: resJson.session,
      selectedProfile: {
        name: resJson.mcName,
        id: resJson.uuid
      }
    }
    options.haveCredentials = true
    client.session = session
    client.username = session.selectedProfile.name
    options.accessToken = session.accessToken
    client.emit('session', session)
  } catch (error) {
    return client.emit('error', error.message)
  }
  options.connect(client)
}
