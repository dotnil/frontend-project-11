const createError = (code) => {
  const e = new Error(code)
  e.name = 'ParsingError'
  e.code = code
  return e
}

const parseItem = (item) => {
  const title = item.querySelector('title')?.textContent
  const link = item.querySelector('link')?.textContent
  const description = item.querySelector('description')?.textContent || ''

  if (!title || !link) return null

  return { title, link, description }
}

export default (xml) => {
  const doc = new DOMParser().parseFromString(xml, 'application/xml')

  if (doc.querySelector('parsererror')) {
    throw createError('invalidXML')
  }

  const channel = doc.querySelector('channel')
  if (!channel) throw createError('invalidRSS')

  const title = channel.querySelector('title')?.textContent
  const description = channel.querySelector('description')?.textContent

  if (!title || !description) {
    throw createError('invalidStructure')
  }

  const posts = Array.from(channel.querySelectorAll('item'))
    .map(parseItem)
    .filter(Boolean)

  return { feed: { title, description }, posts }
}
