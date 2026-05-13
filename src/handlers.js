import { buildSchema } from './validation.js'
import { fetchRss } from './api.js'
import parseRss from './parser.js'
import { i18nInstance } from './i18n.js'

const setFormError = (state, error) => {
  if (error.name === 'ValidationError') {
    state.form.error = error.message
  }
  else if (error.name === 'ParsingError') {
    state.form.error = i18nInstance.t('errors.invalidRss')
  }
  else {
    state.form.error = i18nInstance.t('errors.networkError')
  }

  state.form.status = 'failed'
}

const filterNewPosts = (posts, existingPosts) => {
  const existingLinks = new Set(
    existingPosts.map(post => post.link),
  )

  return posts.filter(
    post => !existingLinks.has(post.link),
  )
}

const createFeed = (feedData, url, generateId) => ({
  ...feedData,
  id: generateId(),
  url,
})

const createPosts = (
  posts,
  existingPosts,
  feedId,
  generateId,
) => {
  const newPosts = filterNewPosts(posts, existingPosts)

  return newPosts.map(post => ({
    ...post,
    id: generateId(),
    feedId,
  }))
}

const loadRssFeed = (
  url,
  existingPosts,
  generateId,
) => {
  const feedId = generateId()

  return fetchRss(url)
    .then(response => response.data.contents)
    .then(parseRss)
    .then(({ feed, posts }) => ({
      feed: createFeed(feed, url, () => feedId),
      posts: createPosts(
        posts,
        existingPosts,
        feedId,
        generateId,
      ),
    }))
}

const validateUrl = (url, feeds) => {
  const existingUrls = feeds.map(feed => feed.url)

  const schema = buildSchema(
    existingUrls,
    i18nInstance.t,
  )

  return schema.validate({ url })
}

const handleSubmit = (
  event,
  state,
  elements,
  generateId,
) => {
  event.preventDefault()

  const url = elements.input.value.trim()

  if (!url) {
    return
  }

  state.form.status = 'validating'
  state.form.error = null

  validateUrl(url, state.feeds)
    .then(() => {
      state.form.status = 'loading'

      return loadRssFeed(
        url,
        state.posts,
        generateId,
      )
    })
    .then(({ feed, posts }) => {
      state.feeds.push(feed)
      state.posts.push(...posts)

      state.form.status = 'success'

      elements.input.value = ''
    })
    .catch((error) => {
      setFormError(state, error)
    })
}

const handlePostClick = (postId, state) => {
  const isViewed = state.ui.viewedPosts.includes(postId)

  if (!isViewed) {
    state.ui.viewedPosts.push(postId)
  }
}

const handleOpenModal = (postId, state) => {
  handlePostClick(postId, state)

  state.ui.modal.postId = postId
}

export const createHandlers = (
  state,
  elements,
  generateId,
) => ({
  handleSubmit: event =>
    handleSubmit(
      event,
      state,
      elements,
      generateId,
    ),

  handlePostClick: postId =>
    handlePostClick(postId, state),

  handleOpenModal: postId =>
    handleOpenModal(postId, state),
})
