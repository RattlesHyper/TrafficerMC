export async function scrapeProxy(proxyType) {
  const proxyLink = `https://raw.githubusercontent.com/RattlesHyper/proxy/main/${proxyType}`
  const proxySources = await fetchList(proxyLink)
  const promises = proxySources.map(fetchList)
  const proxyLists = await Promise.all(promises)
  let list = ''
  for (const proxies of proxyLists) {
    list += proxies.join('\n')
  }
  return list
}

async function fetchList(link) {
  const res = await fetch(link, { cache: 'force-cache' })
  const text = await res.text()
  const result = []
  let start = 0
  let i = 0
  while (i !== -1) {
    i = text.indexOf('\n', start)
    if (i === -1) {
      if (start < text.length) result.push(text.slice(start))
    } else {
      result.push(text.slice(start, i))
      start = i + 1
    }
  }
  return result
}
