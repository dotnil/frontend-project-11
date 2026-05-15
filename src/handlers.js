import { buildSchema } from './validation.js'
import { fetchRss } from './api.js'
import parseRss from './parser.js'
import { i18nInstance } from './i18n.js'
import { normalizeError } from './errors.js'

export const FORM_STATUS = {
  IDLE: 'idle',
  VALIDATING: 'validating',
  LOADING: 'loading',
  SUCCESS: 'success',
  FAILED: 'failed',
}

const filterNewPosts = (posts, existingPosts) => {
  const existingLinks = new Set(existingPosts.map(post => post.link))

  return posts.filter(post => !existingLinks.has(post.link))
}

export const loadFeed = (url, existingPosts, generateId) =>
  fetchRss(url)
    .then(response => response.data.contents)
    .then(parseRss)
    .then(({ feed, posts }) => {
      const feedId = generateId()

      return {
        feed: { ...feed, id: feedId, url },
        posts: filterNewPosts(posts, existingPosts).map(post => ({
          ...post,
          id: generateId(),
          feedId,
        })),
      }
    })

const setFormStatus = (state, status) => {
  state.form.status = status
}

const handleError = (state, error) => {
  const normalized = normalizeError(error, i18nInstance.t)

  state.form.error = normalized.message
  setFormStatus(state, FORM_STATUS.FAILED)
}

export const createHandlers = (state, generateId) => {
  const handleSubmit = (url) => {
    if (!url) {
      return Promise.resolve()
    }

    state.form.error = null
    setFormStatus(state, FORM_STATUS.VALIDATING)

    const schema = buildSchema(
      state.feeds.map(feed => feed.url),
      i18nInstance.t,
    )

    return schema.validate({ url })
      .then(() => {
        setFormStatus(state, FORM_STATUS.LOADING)

        return loadFeed(url, state.posts, generateId)
      })
      .then(({ feed, posts }) => {
        state.feeds.push(feed)
        state.posts.push(...posts)

        setFormStatus(state, FORM_STATUS.SUCCESS)
      })
      .catch(error => handleError(state, error))
  }

  const handlePostClick = (postId) => {
    if (!state.ui.readPostIds.includes(postId)) {
      state.ui.readPostIds.push(postId)
    }
  }

  const handleOpenModal = (postId) => {
    handlePostClick(postId)
    state.ui.openedPostId = postId
  }

  return {
    handleSubmit,
    handlePostClick,
    handleOpenModal,
  }
}
