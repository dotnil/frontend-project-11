import 'bootstrap/dist/css/bootstrap.min.css'
import onChange from 'on-change'
import initView from './view.js'
import initApp from './init.js'
import { createInitialState, generateId } from './state.js'
import { startUpdater } from './updater.js'
import { initI18n } from './i18n.js'
import 'bootstrap'

const state = createInitialState()

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

initI18n().then(() => {
  const watchedState = onChange(state, (path, value) => {
    initView(path, value, watchedState, elements, handlers)
  })

  const handlers = initApp(watchedState, elements, generateId)

  startUpdater(watchedState, generateId)
})
