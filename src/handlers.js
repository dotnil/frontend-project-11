import { buildSchema } from './validation.js'
import { fetchRss } from './api.js'
import parseRss from './parser.js'
import { i18nInstance } from './i18n.js'

const filterNewPosts = (posts, existingPosts) => {
  const existingLinks = new Set(
    existingPosts.map(post => post.link),
  )

  return posts.filter(
    post => !existingLinks.has(post.link),
  )
}

export const loadFeed = (
  url,
  existingPosts,
  generateId,
) =>
  fetchRss(url)
    .then(response => response.data.contents)
    .then(parseRss)
    .then(({ feed, posts }) => {
      const feedId = generateId()

      const newPosts = filterNewPosts(
        posts,
        existingPosts,
      ).map(post => ({
        ...post,
        id: generateId(),
        feedId,
      }))

      return {
        feed: {
          ...feed,
          id: feedId,
          url,
        },
        posts: newPosts,
      }
    })

export const createHandlers = (
  state,
  elements,
  generateId,
) => {
  const handleError = (error) => {
    if (error.name === 'ValidationError') {
      state.form.error = error.message
    }
    else if (error.name === 'ParsingError') {
      state.form.error = i18nInstance.t(
        'errors.invalidRss',
      )
    }
    else {
      state.form.error = i18nInstance.t(
        'errors.networkError',
      )
    }

    state.form.status = 'failed'
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const url = elements.input.value.trim()

    if (!url) {
      return
    }

    state.form.status = 'validating'
    state.form.error = null

    const schema = buildSchema(
      state.feeds.map(feed => feed.url),
      i18nInstance.t,
    )

    schema.validate({ url })
      .then(() => {
        state.form.status = 'loading'

        return loadFeed(
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
      .catch(handleError)
  }

  const handlePostClick = (postId) => {
    if (!state.ui.viewedPosts.includes(postId)) {
      state.ui.viewedPosts.push(postId)
    }
  }

  const handleOpenModal = (postId) => {
    handlePostClick(postId)
    state.ui.modal.postId = postId
  }

  return {
    handleSubmit,
    handlePostClick,
    handleOpenModal,
  }
}
