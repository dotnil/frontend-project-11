import * as yup from 'yup'
import { fetchRss } from './api.js'
import { i18nInstance } from './i18n.js'
import { prepareFeedData } from './utils.js'

const buildSchema = existingUrls => yup.object({
  url: yup
    .string()
    .required()
    .url()
    .notOneOf(existingUrls),
})

const validateUrl = (url, state) => {
  const schema = buildSchema(state.feeds.map(feed => feed.url))
  return schema.validate({ url }).then(() => url)
}

const fetchData = url =>
  fetchRss(url).then((response) => {
    const { contents } = response.data
    if (!contents) {
      throw new Error('NetworkError')
    }
    return contents
  })

const prepareData = (contents, url, state, generateId) =>
  prepareFeedData(contents, url, state, generateId)

const applyData = (data, watchedState) => {
  const { feedWithMeta, newPosts } = data

  watchedState.feeds.push(feedWithMeta)
  watchedState.posts.push(...newPosts)
}

const finalizeSuccess = (watchedState, elements) => {
  watchedState.form.status = 'success'
  elements.input.value = ''
  elements.input.focus()
}

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

const processRss = (url, state, watchedState, elements, generateId) => {
  watchedState.form.status = 'validating'
  watchedState.form.error = null

  return validateUrl(url, state)
    .then(() => {
      watchedState.form.status = 'loading'
      return fetchData(url)
    })
    .then(contents =>
      prepareData(contents, url, state, generateId))
    .then((data) => {
      applyData(data, watchedState)
      finalizeSuccess(watchedState, elements)
    })
    .catch(error => handleError(error, watchedState))
}

export default (watchedState, elements, generateId, state) => {
  const form = document.querySelector('form')

  form.addEventListener('submit', (e) => {
    e.preventDefault()

    const url = elements.input.value.trim()
    if (!url) return

    processRss(url, state, watchedState, elements, generateId)
  })
}
