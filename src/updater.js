import { loadFeed } from './handlers.js'

const refreshFeeds = (state, generateId) => {
  const tasks = state.feeds.map(feed =>
    loadFeed(feed.url, state.posts, generateId)
      .then(({ posts }) => {
        if (posts.length > 0) {
          state.posts.push(...posts)
        }
      })
      .catch(() => {}),
  )

  return Promise.all(tasks)
}

const runUpdateLoop = (state, generateId) => {
  refreshFeeds(state, generateId)
    .finally(() => {
      setTimeout(
        () => runUpdateLoop(state, generateId),
        5000,
      )
    })
}

export const startUpdater = (state, generateId) => {
  runUpdateLoop(state, generateId)
}
