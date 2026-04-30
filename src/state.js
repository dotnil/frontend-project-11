const generateId = (() => {
  let id = 1
  return () => id++
})()

const initialState = {
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
}

export { generateId, initialState }
