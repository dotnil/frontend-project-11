import { fetchRss } from './api.js'
import parseRss from './parser.js'

// ------------------------
// helpers (чистые функции)
// ------------------------

const getExistingLinks = posts =>
  new Set(posts.map(post => post.link))

const filterNewPosts = (posts, existingPosts) => {
  const existingLinks = getExistingLinks(existingPosts)
  return posts.filter(post => !existingLinks.has(post.link))
}

const enhanceFeed = (feed, url, generateId) => ({
  ...feed,
  id: generateId(),
  url,
})

const enhancePosts = (posts, feedId, generateId) =>
  posts.map(post => ({
    ...post,
    id: generateId(),
    feedId,
  }))

// ------------------------
// main service
// ------------------------

export const rssService = (url, existingPosts, generateId) => {
  return fetchRss(url)
    .then((response) => {
      const { contents } = response.data

      if (!contents) {
        throw new Error('NetworkError')
      }

      return contents
    })
    .then((contents) => {
      const { feed, posts } = parseRss(contents)

      return { feed, posts }
    })
    .then(({ feed, posts }) => {
      const feedWithMeta = enhanceFeed(feed, url, generateId)

      const newPostsRaw = filterNewPosts(posts, existingPosts)

      const newPosts = enhancePosts(
        newPostsRaw,
        feedWithMeta.id,
        generateId,
      )

      return {
        feed: feedWithMeta,
        posts: newPosts,
      }
    })
}
