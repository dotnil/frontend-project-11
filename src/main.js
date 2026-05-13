import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

import onChange from 'on-change'

import renderView from './view.js'
import { createHandlers } from './handlers.js'
import { createInitialState, generateId } from './state.js'
import { startUpdater } from './updater.js'
import { initI18n } from './i18n.js'

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

const formElement = document.querySelector('form')

const handleStateChange = (
  path,
  currentValue,
  reactiveState,
  handlers,
) => {
  renderView(
    path,
    currentValue,
    reactiveState,
    elements,
    handlers,
  )
}

const runApplication = () => {
  initI18n().then(() => {
    let formHandlers

    const reactiveState = onChange(state, (path, currentValue) => {
      handleStateChange(
        path,
        currentValue,
        reactiveState,
        formHandlers,
      )
    })

    formHandlers = createHandlers(
      reactiveState,
      elements,
      generateId,
    )

    formElement.addEventListener(
      'submit',
      formHandlers.handleSubmit,
    )

    startUpdater(reactiveState, generateId)
  })
}

runApplication()
