import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

import onChange from 'on-change'

import renderView from './view.js'
import { createHandlers } from './handlers.js'
import { createInitialState, createIdGenerator } from './state.js'
import { startUpdater } from './updater.js'
import { initI18n } from './i18n.js'
import { initEvents } from './events.js'

const generateId = createIdGenerator()
const state = createInitialState()

const dom = {
  form: document.querySelector('form'),
  input: document.querySelector('#url-input'),
  feedback: document.querySelector('#feedback'),
  feedsContainer: document.querySelector('#feeds'),
  postsContainer: document.querySelector('#posts'),
  modal: document.querySelector('#modal'),
  modalTitle: document.querySelector('.modal-title'),
  modalDescription: document.querySelector('.modal-description'),
  modalLink: document.querySelector('.modal-link'),
}

const initApp = () => {
  initI18n().then(() => {
    const watchedState = onChange(state, (path, currentValue) => {
      renderView(path, currentValue, watchedState, dom)
    })

    const handlers = createHandlers(watchedState, generateId)

    initEvents(dom, handlers)

    startUpdater(watchedState, generateId)
  })
}

initApp()
