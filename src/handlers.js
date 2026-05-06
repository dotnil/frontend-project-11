import { buildSchema } from './validation.js'
import { rssService } from './rssService.js'
import { i18nInstance } from './i18n.js'

export const createHandlers = (state, elements, generateId) => {
  const handleError = (error) => {
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

  const handleSubmit = (e) => {
    e.preventDefault()

    const url = elements.input.value.trim()
    if (!url) return

    state.form.status = 'validating'
    state.form.error = null

    const schema = buildSchema(
      state.feeds.map(f => f.url),
      i18nInstance.t,
    )

    schema.validate({ url })
      .then(() => {
        state.form.status = 'loading'
        return rssService(url, state.posts, generateId)
      })
      .then(({ feed, posts }) => {
        state.feeds.push(feed)
        state.posts.push(...posts)

        state.form.status = 'success'
        elements.input.value = ''
      })
      .catch(handleError)
  }

  const handlePostClick = (id) => {
    if (!state.ui.viewedPosts.includes(id)) {
      state.ui.viewedPosts.push(id)
    }
  }

  const handleOpenModal = (id) => {
    handlePostClick(id)
    state.ui.modal.postId = id
  }

  return {
    handleSubmit,
    handlePostClick,
    handleOpenModal,
  }
}
