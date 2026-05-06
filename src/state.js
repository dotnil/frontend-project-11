export const generateId = (() => {
  let id = 1
  return () => id++
})()

export const createInitialState = () => ({
  feeds: [],
  posts: [],
  form: {
    status: 'idle',
    error: null,
  },
  ui: {
    viewedPosts: [],
    modal: {
      postId: null,
    },
  },
})
