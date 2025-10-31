import * as yup from 'yup'
import { i18nInstance, initI18n } from './i18n.js'
import initView from './view.js'

initI18n.then(() => {
  yup.setLocale({
    string: {
      url: () => i18nInstance.t('errors.invalidUrl'),
    },
    mixed: {
      required: () => i18nInstance.t('errors.required'),
      notOneOf: () => i18nInstance.t('errors.duplicate'),
    },
  })

  const form = document.querySelector('form')
  const input = document.getElementById('url-input')
  const feedback = document.getElementById('feedback')
  const feedList = document.getElementById('feeds')

  // Генерация ID без nanoid
  const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 5)}`

  // Создание фида
  const createFeed = (title, description, url) => ({
    id: generateId(),
    title,
    description,
    url,
  })

  // Создание поста
  const createPost = (feedId, title, link, description, pubDate) => ({
    id: generateId(),
    feedId,
    title,
    link,
    description,
    pubDate,
  })

  // Начальное состояние приложения
  const state = {
    feeds: {}, // объект id → feed
    posts: {}, // объект id → post
    ui: {
      form: { status: 'idle', error: null },
      loadingFeedIds: [],
    },
  }

  const watchedState = initView({ input, feedback, feedList }, state)

  const buildSchema = urls => yup.object({
    url: yup.string()
      .url()
      .required()
      .notOneOf(urls),
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    const url = input.value.trim()
    if (!url) return

    watchedState.form.status = 'validating'
    watchedState.form.error = null

    buildSchema(watchedState.feeds)
      .validate({ url })
      .then((validated) => {
        watchedState.feeds = [...watchedState.feeds, validated.url]
        watchedState.form.status = 'success'

        input.value = ''
        input.focus()

        setTimeout(() => {
          watchedState.form.status = 'idle'
        }, 1200)
      })
      .catch((err) => {
        const message = err?.errors?.[0] ?? i18nInstance.t('errors.validation')
        watchedState.form.error = message
        watchedState.form.status = 'error'
      })
  }

  form.addEventListener('submit', handleSubmit)
})
