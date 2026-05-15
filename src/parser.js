import { createAppError } from './errors.js'

const createInvalidRssError = () =>
  createAppError('rssParsing', 'errors.invalidRss')

const parseItem = (item) => {
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

const isParserError = doc =>
  Boolean(doc.querySelector('parsererror'))

const getChannel = doc =>
  doc.querySelector('channel')

const getFeedData = (channel) => {
  const title = channel.querySelector('title')?.textContent
  const description = channel.querySelector('description')?.textContent

  return { title, description }
}

const getPosts = channel =>
  Array.from(channel.querySelectorAll('item'))
    .map(parseItem)
    .filter(Boolean)

export default (xml) => {
  const doc = parseXml(xml)

  if (isParserError(doc)) {
    throw createInvalidRssError()
  }

  const channel = getChannel(doc)

  if (!channel) {
    throw createInvalidRssError()
  }

  const feed = getFeedData(channel)

  if (!feed.title || !feed.description) {
    throw createInvalidRssError()
  }

  const posts = getPosts(channel)

  return { feed, posts }
}
