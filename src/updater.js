import { rssService } from './rssService.js'

const updateFeed = (feed, watchedState, generateId) => {
  return rssService(feed.url, watchedState.posts, generateId)
    .then(({ posts }) => {
      if (posts.length === 0) return

      watchedState.posts.push(...posts)

      console.log(
        `[Обновление] ${new Date().toLocaleTimeString()} | Фид "${
          feed.title
        }" — добавлено ${posts.length} постов`,
      )
    })
    .catch(() => {
      // можно позже добавить обработку
    })
}

const startUpdater = (watchedState, generateId) => {
  const updateAll = () => {
    const feeds = watchedState.feeds

    feeds.forEach((feed) => {
      updateFeed(feed, watchedState, generateId)
    })

    setTimeout(updateAll, 5000)
  }

  updateAll()
}

export { startUpdater }
