export const createIdGenerator = () => {
  let id = 1

  return () => id++
}

export const createInitialState = () => ({
  feeds: [],
  posts: [],
  form: {
    status: 'idle',
    error: null,
  },
  ui: {
    readPostIds: [],
    openedPostId: null,
  },
})
