import { fetchRss } from './api.js'
import parseRss from './parser.js'

const filterNewPosts = (posts, existingPosts) => {
  const links = new Set(existingPosts.map(p => p.link))
  return posts.filter(p => !links.has(p.link))
}

export const rssService = (url, existingPosts, generateId) =>
  fetchRss(url)
    .then(res => res.data.contents)
    .then(parseRss)
    .then(({ feed, posts }) => {
      const feedId = generateId()

      return {
        feed: { ...feed, id: feedId, url },
        posts: filterNewPosts(posts, existingPosts).map(p => ({
          ...p,
          id: generateId(),
          feedId,
        })),
      }
    })
