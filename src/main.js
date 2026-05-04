import 'bootstrap/dist/css/bootstrap.min.css'
import './style.css'
import onChange from 'on-change'
import initView from './view.js'
import { initI18n } from './i18n.js'
import 'bootstrap'
import { startUpdater } from './updater.js'
import { generateId, createInitialState } from './state.js'
import initApp from './init.js'

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

const watchedState = onChange(state, (path, value) => {
  initView(path, value, watchedState, elements)
})

startUpdater(watchedState, generateId)

initI18n().then(() => {
  initApp(watchedState, elements, generateId, state)
})
