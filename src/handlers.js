import { createFeedSchema } from './validation.js'
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

const updateFormError = (state, error) => {
  const normalized = normalizeError(error, i18nInstance.t)

  state.form.error = normalized.message
  state.form.status = FORM_STATUS.FAILED
}

export const createHandlers = (state, generateId) => {
  const handleSubmit = (url) => {
    if (!url) {
      return Promise.resolve()
    }

    state.form.error = null
    state.form.status = FORM_STATUS.VALIDATING

    const schema = createFeedSchema(state.feeds.map(feed => feed.url), i18nInstance.t)

    return schema.validate({ url })
      .then(() => {
        state.form.status = FORM_STATUS.LOADING

        return loadFeed(url, state.posts, generateId)
      })
      .then(({ feed, posts }) => {
        state.feeds.push(feed)
        state.posts.push(...posts)

        state.form.status = FORM_STATUS.SUCCESS
      })
      .catch(error => updateFormError(state, error))
  }

  const markPostAsRead = (postId) => {
    if (!state.ui.readPostIds.includes(postId)) {
      state.ui.readPostIds.push(postId)
    }
  }

  const openPostModal = (postId) => {
    markPostAsRead(postId)
    state.ui.openedPostId = postId
  }

  return {
    handleSubmit,
    markPostAsRead,
    openPostModal,
  }
}
