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
  watchedState,
) => {
  renderView(
    path,
    currentValue,
    watchedState,
    elements,
  )
}

const runApplication = () => {
  initI18n().then(() => {
    const watchedState = onChange(
      state,
      (path, currentValue) => {
        handleStateChange(
          path,
          currentValue,
          watchedState,
        )
      },
    )

    const handlers = createHandlers(
      watchedState,
      elements,
      generateId,
    )

    formElement.addEventListener(
      'submit',
      handlers.handleSubmit,
    )

    elements.postsContainer.addEventListener(
      'click',
      (event) => {
        const postLink = event.target.closest('.post-link')

        if (postLink) {
          handlers.handlePostClick(
            Number(postLink.dataset.id),
          )

          return
        }

        const previewButton = event.target.closest(
          '.post-preview-button',
        )

        if (previewButton) {
          handlers.handleOpenModal(
            Number(previewButton.dataset.id),
          )
        }
      },
    )

    startUpdater(watchedState, generateId)
  })
}

runApplication()
