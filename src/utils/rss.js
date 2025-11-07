// src/utils/rss.js
import axios from 'axios'

export const fetchFeed = async (url) => {
  const proxy = `https://api.allorigins.win/get?disableCache=true&url=${encodeURIComponent(url)}`

  const response = await axios.get(proxy)
  if (!response.data?.contents) {
    throw new Error('Network error')
  }

  return response.data.contents // raw XML строка
}

export const parseRss = (xmlString) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xmlString, 'application/xml')

  // Проверка ошибок парсинга
  const parseError = doc.querySelector('parsererror')
  if (parseError) {
    throw new Error('Parsing error')
  }

  const feedTitle = doc.querySelector('channel > title')?.textContent ?? ''
  const feedDescription = doc.querySelector('channel > description')?.textContent ?? ''

  const items = Array.from(doc.querySelectorAll('item')).map(item => ({
    title: item.querySelector('title')?.textContent ?? '',
    link: item.querySelector('link')?.textContent ?? '',
    description: item.querySelector('description')?.textContent ?? '',
    guid: item.querySelector('guid')?.textContent ?? null,
  }))

  return {
    feed: {
      title: feedTitle,
      description: feedDescription,
    },
    posts: items,
  }
}
