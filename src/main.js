import 'bootstrap/dist/css/bootstrap.min.css'
import './style.css'
import * as yup from 'yup'
import onChange from 'on-change'
import initView from './view.js'
import axios from 'axios'
import parseRss from './parser.js'
import { i18nInstance, initI18n } from './i18n.js'
import 'bootstrap'

const generateId = (() => {
  let id = 1
  return () => id++
})()

const state = {
  feeds: [],
  posts: [],
  form: {
    status: 'idle',
    error: null,
  },
  ui: {
    viewedPosts: [],
    modal: {
      postId: null,
    },
  },
}

const form = document.querySelector('form')

const elements = {
  input: document.querySelector('#url-input'),
  feedback: document.querySelector('#feedback'),
  feedsContainer: document.querySelector('#feeds'),
  postsContainer: document.querySelector('#posts'),

  modal: document.querySelector('#modal'),
  modalTitle: document.querySelector('.modal-title'),
  modalDescription: document.querySelector('.modal-description'),
  modalLink: document.querySelector('.modal-link'),
}

const watchedState = onChange(state, (path, value) => {
  initView(path, value, watchedState, elements)
})

const buildProxyUrl = url =>
  `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`

const updateFeed = (feed) => {
  return axios.get(buildProxyUrl(feed.url))
    .then((response) => {
      const { posts } = parseRss(response.data.contents)

      const existingLinks = new Set(state.posts.map(post => post.link))

      const newPosts = posts
        .filter(post => !existingLinks.has(post.link))
        .map(post => ({
          ...post,
          id: generateId(),
          feedId: feed.id,
        }))

      if (newPosts.length > 0) {
        watchedState.posts.push(...newPosts)
      }
    })
    .catch(() => {})
}

const updateAllFeeds = (feeds) => {
  const promises = feeds.map(feed => updateFeed(feed))

  Promise.all(promises).finally(() => {
    setTimeout(() => updateAllFeeds(feeds), 5000)
  })
}

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

  form.addEventListener('submit', (e) => {
    e.preventDefault()

    const url = elements.input.value.trim()
    if (!url) return

    watchedState.form.status = 'validating'
    watchedState.form.error = null

    buildSchema(state.feeds.map(feed => feed.url))
      .validate({ url })
      .then(() => {
        watchedState.form.status = 'loading'
        return axios.get(buildProxyUrl(url))
      })
      .then((response) => {
        const { feed, posts } = parseRss(response.data.contents)

        const feedWithMeta = {
          ...feed,
          id: generateId(),
          url,
        }

        watchedState.feeds.push(feedWithMeta)

        const existingLinks = new Set(state.posts.map(post => post.link))

        const newPosts = posts
          .filter(post => !existingLinks.has(post.link))
          .map(post => ({
            ...post,
            id: generateId(),
            feedId: feedWithMeta.id,
          }))

        watchedState.posts.push(...newPosts)

        watchedState.form.status = 'success'
        elements.input.value = ''
        elements.input.focus()
      })
      .catch((error) => {
        console.log(error)
        console.log(error.name)
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

  updateAllFeeds(state.feeds)
})
