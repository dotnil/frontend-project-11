import { fetchRss } from './api.js'
import parseRss from './parser.js'

const updateFeed = (feed, watchedState, generateId) => {
  return fetchRss(feed.url)
    .then((response) => {
      const { contents } = response.data
      if (!contents) return

      const { posts } = parseRss(contents)

      const existingLinks = new Set(
        watchedState.posts
          .filter(post => post.feedId === feed.id)
          .map(post => post.link),
      )

      const newPosts = posts
        .filter(post => !existingLinks.has(post.link))
        .map(post => ({
          ...post,
          id: generateId(),
          feedId: feed.id,
        }))

      if (newPosts.length > 0) {
        watchedState.posts = [...watchedState.posts, ...newPosts]
        console.log(
          `[Обновление] ${new Date().toLocaleTimeString()} | Фид "${
            feed.title
          }" — добавлено ${newPosts.length} постов`,
        )
      }
    })
    .catch(() => {
    })
}

const startUpdater = (watchedState, generateId) => {
  const updateAll = () => {
    const feeds = watchedState.feeds
    if (feeds.length === 0) {
      setTimeout(updateAll, 5000)
      return
    }

    feeds.forEach(feed => updateFeed(feed, watchedState, generateId))

    setTimeout(updateAll, 5000)
  }

  updateAll()
}

export { startUpdater, updateFeed }
