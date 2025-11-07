import * as yup from 'yup'
import { i18nInstance, initI18n } from './i18n.js'
import initView from './view.js'
import fetchFeed from './utils/fetchFeed.js'
import parseRss from './utils/parseRss.js'

initI18n.then(() => {
  // настройка yup
  yup.setLocale({
    string: {
      url: () => i18nInstance.t('errors.invalidUrl'),
    },
    mixed: {
      required: () => i18nInstance.t('errors.required'),
      notOneOf: () => i18nInstance.t('errors.duplicate'),
    },
  })

  const elements = {
    form: document.querySelector('form'),
    input: document.getElementById('url-input'),
    feedback: document.getElementById('feedback'),
    feedsContainer: document.getElementById('feeds'),
    postsContainer: document.getElementById('posts'),
  }

  const state = {
    feeds: {},
    posts: {},
    ui: {
      form: { status: 'idle', error: null },
    },
  }

  const watchedState = initView(elements, state)

  const buildSchema = urls => yup.object({
    url: yup.string().url().required().notOneOf(urls),
  })

  // добавление нового фида и его постов
  const addFeed = async (url) => {
    const rawXml = await fetchFeed(url)
    const { feed, posts } = parseRss(rawXml)
    const feedId = crypto.randomUUID()
    watchedState.feeds[feedId] = { id: feedId, url, ...feed }

    posts.forEach((post) => {
      const postId = crypto.randomUUID()
      watchedState.posts = {
        ...watchedState.posts,
        [postId]: { id: postId, feedId, ...post },
      }
    })
  }

  // обновление одного фида (только новые посты)
  const updateFeed = async (feed) => {
    try {
      const xml = await fetchFeed(feed.url)
      const { posts } = parseRss(xml)

      posts.forEach((post) => {
        const exists = Object.values(watchedState.posts).some(
          p => p.link === post.link,
        )
        if (!exists) {
          const postId = crypto.randomUUID()
          watchedState.posts = {
            ...watchedState.posts,
            [postId]: { id: postId, feedId: feed.id, ...post },
          }
        }
      })
    }
    catch (err) {
      console.error(`Ошибка обновления фида ${feed.url}:`, err.message)
    }
  }

  // пуллинг всех фидов каждые 5 секунд
  const startPolling = () => {
    setInterval(() => {
      Object.values(watchedState.feeds).forEach((feed) => {
        updateFeed(feed)
      })
    }, 5000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const url = elements.input.value.trim()
    if (!url) return

    watchedState.ui.form.status = 'validating'
    watchedState.ui.form.error = null

    const urls = Object.values(watchedState.feeds).map(f => f.url)

    try {
      await buildSchema(urls).validate({ url })

      watchedState.ui.form.status = 'loading'
      await addFeed(url)

      watchedState.ui.form.status = 'success'
      elements.input.value = ''
      elements.input.focus()
      setTimeout(() => {
        watchedState.ui.form.status = 'idle'
      }, 1000)
    }
    catch (err) {
      console.error(err)
      const type = err.message === 'parse' ? 'errors.parse' : 'errors.network'
      watchedState.ui.form.error = i18nInstance.t(type)
      watchedState.ui.form.status = 'error'
    }
  }

  elements.form.addEventListener('submit', handleSubmit)

  // запускаем пуллинг после инициализации
  startPolling()
})
