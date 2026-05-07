import { rssService } from './rssService.js'

const updateAll = async (state, generateId) => {
  for (const feed of state.feeds) {
    try {
      const { posts } = await rssService(
        feed.url,
        state.posts,
        generateId,
      )

      if (posts.length) {
        state.posts.push(...posts)
      }
    }
    catch {
      // ignore
    }
  }
}

export const startUpdater = (state, generateId) => {
  const run = async () => {
    await updateAll(state, generateId)
    setTimeout(run, 5000)
  }

  run()
}
