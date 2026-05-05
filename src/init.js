import * as yup from 'yup'
import { i18nInstance } from './i18n.js'
import { rssService } from './rssService.js'

// ------------------------
// Validation
// ------------------------
const buildSchema = existingUrls => yup.object({
  url: yup
    .string()
    .required()
    .url()
    .notOneOf(existingUrls),
})

// ------------------------
// Error handling
// ------------------------
const handleError = (error, watchedState) => {
  if (error.message === 'NetworkError') {
    watchedState.form.error = i18nInstance.t('errors.network')
  }
  else if (error.name === 'ValidationError') {
    watchedState.form.error = error.message
  }
  else if (error.name === 'ParsingError') {
    watchedState.form.error = i18nInstance.t('errors.parsing')
  }
  else {
    watchedState.form.error = i18nInstance.t('errors.network')
  }

  watchedState.form.status = 'failed'
}

// ------------------------
// Main logic
// ------------------------
export default (watchedState, elements, generateId, state) => {
  const form = document.querySelector('form')

  form.addEventListener('submit', (e) => {
    e.preventDefault()

    const url = elements.input.value.trim()
    if (!url) return

    watchedState.form.status = 'validating'
    watchedState.form.error = null

    const schema = buildSchema(state.feeds.map(feed => feed.url))

    schema.validate({ url })
      .then(() => {
        watchedState.form.status = 'loading'
        return rssService(url, state.posts, generateId)
      })
      .then(({ feed, posts }) => {
        watchedState.feeds.push(feed)
        watchedState.posts.push(...posts)

        watchedState.form.status = 'success'
        elements.input.value = ''
        elements.input.focus()
      })
      .catch(error => handleError(error, watchedState))
  })
}
