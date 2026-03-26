import 'bootstrap/dist/css/bootstrap.min.css'
import './style.css'
import * as yup from 'yup'
import onChange from 'on-change'
import initView from './view.js'
import axios from 'axios'
import parseRss from './parser.js'
import { i18nInstance, initI18n } from './i18n.js'

const state = {
  feeds: [],
  posts: [],
  form: {
    status: 'idle', // idle | validating | loading | success | failed
    error: null,
  },
}

const form = document.querySelector('form')
const input = document.querySelector('#url-input')
const feedback = document.querySelector('#feedback')
const elements = { input, feedback }

const watchedState = onChange(state, (path, value) => {
  initView(path, value, state, elements)
})

initI18n().then(() => {
  yup.setLocale({
    string: {
      url: () => i18nInstance.t('errors.invalidUrl'),
    },
    mixed: {
      required: () => i18nInstance.t('errors.required'),
      notOneOf: () => i18nInstance.t('errors.duplicate'),
    },
  })

  const buildSchema = existingUrls => yup.object({
    url: yup
      .string()
      .required()
      .url()
      .notOneOf(existingUrls),
  })

  const buildProxyUrl = url => `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const url = input.value.trim()
    if (!url) return

    watchedState.form.status = 'validating'
    watchedState.form.error = null

    buildSchema(watchedState.feeds.map(f => f.url))
      .validate({ url })
      .then(({ url: validatedUrl }) => {
        watchedState.form.status = 'loading'
        return axios.get(buildProxyUrl(validatedUrl))
      })
      .then((response) => {
        const xml = response.data.contents
        const { feed, posts } = parseRss(xml)

        watchedState.feeds.push(feed)
        posts.forEach(post => watchedState.posts.push(post))

        watchedState.form.status = 'success'
        watchedState.form.error = null

        input.value = ''
        input.focus()
      })
      .catch((error) => {
        if (error.name === 'ValidationError') {
          watchedState.form.error = error.message
          watchedState.form.status = 'failed'
          return
        }
        if (error.name === 'ParsingError') {
          watchedState.form.error = i18nInstance.t('errors.parsing')
          watchedState.form.status = 'failed'
          return
        }
        watchedState.form.error = i18nInstance.t('errors.network')
        watchedState.form.status = 'failed'
      })
  })
})
