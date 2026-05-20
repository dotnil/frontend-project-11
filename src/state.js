export const createIdGenerator = () => {
  let nextId = 1

  return () => nextId++
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
