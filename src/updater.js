import { loadFeed } from './handlers.js'

const refreshFeeds = (state, generateId) => {
  const updateTasks = state.feeds.map(feed =>
    loadFeed(
      feed.url,
      state.posts,
      generateId,
    )
      .then(({ posts: newPosts }) => {
        if (newPosts.length > 0) {
          state.posts.push(...newPosts)
        }
      })
      .catch(() => {
        // background sync failure is non-critical
        // (ошибка фонового обновления не критична)
      }),
  )

  return Promise.all(updateTasks)
}

export const startUpdater = (
  state,
  generateId,
) => {
  const runUpdateLoop = () => {
    refreshFeeds(state, generateId)
      .then(() => {
        setTimeout(runUpdateLoop, 5000)
      })
  }

  runUpdateLoop()
}
