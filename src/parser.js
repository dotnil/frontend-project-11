import { createAppError } from './errors.js'

const createInvalidRssError = () =>
  createAppError('rssParsing', 'errors.invalidRss')

const parsePost = (item) => {
  const title = item.querySelector('title')?.textContent
  const link = item.querySelector('link')?.textContent
  const description = item.querySelector('description')?.textContent || ''

  if (!title || !link) {
    return null
  }

  return { title, link, description }
}

const parseXml = xml =>
  new DOMParser().parseFromString(xml, 'application/xml')

const isRssParsingError = doc =>
  Boolean(doc.querySelector('parsererror'))

const getChannel = doc =>
  doc.querySelector('channel')

const parseFeed = (channel) => {
  const title = channel.querySelector('title')?.textContent
  const description = channel.querySelector('description')?.textContent

  return { title, description }
}

const parsePosts = channel =>
  Array.from(channel.querySelectorAll('item'))
    .map(parsePost)
    .filter(Boolean)

const parseRss = (xml) => {
  const doc = parseXml(xml)

  if (isRssParsingError(doc)) {
    throw createInvalidRssError()
  }

  const channel = getChannel(doc)

  if (!channel) {
    throw createInvalidRssError()
  }

  const feed = parseFeed(channel)

  if (!feed.title || !feed.description) {
    throw createInvalidRssError()
  }

  const posts = parsePosts(channel)

  return { feed, posts }
}

export default parseRss
