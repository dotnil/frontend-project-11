import { Modal } from 'bootstrap'
import { i18nInstance } from './i18n.js'
import { FORM_STATUS } from './handlers.js'

const toggleValidationClass = (input, isValid) => {
  input.classList.toggle('is-valid', isValid)
  input.classList.toggle('is-invalid', !isValid)
}

const renderError = (error, elements) => {
  const { input, feedback } = elements

  toggleValidationClass(input, false)

  feedback.textContent = error
  feedback.classList.add('text-danger')
  feedback.classList.remove('text-success')
}

const renderSuccess = (elements) => {
  const { input, feedback } = elements

  toggleValidationClass(input, true)

  feedback.textContent = i18nInstance.t('feedback.success')
  feedback.classList.remove('text-danger')
  feedback.classList.add('text-success')
}

const clearFeedback = (elements) => {
  const { input, feedback } = elements

  input.classList.remove('is-valid', 'is-invalid')

  feedback.textContent = ''
  feedback.classList.remove('text-danger', 'text-success')
}

const renderFeeds = (feeds, container) => {
  container.innerHTML = ''

  feeds.forEach((feed) => {
    const wrapper = document.createElement('div')

    wrapper.classList.add('mb-3')

    wrapper.innerHTML = `
      <h3>${feed.title}</h3>
      <p>${feed.description}</p>
    `

    container.append(wrapper)
  })
}

const renderPosts = (posts, readPostIds, container) => {
  container.innerHTML = ''

  posts.forEach((post) => {
    const isViewed = readPostIds.includes(post.id)

    const listItem = document.createElement('li')
    const postLink = document.createElement('a')
    const previewButton = document.createElement('button')

    listItem.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
    )

    postLink.href = post.link
    postLink.textContent = post.title
    postLink.target = '_blank'
    postLink.rel = 'noopener noreferrer'
    postLink.dataset.id = post.id
    postLink.classList.add('post-link')

    postLink.classList.toggle('fw-bold', !isViewed)
    postLink.classList.toggle('fw-normal', isViewed)
    postLink.classList.toggle('link-secondary', isViewed)

    previewButton.type = 'button'
    previewButton.textContent = 'Просмотр'
    previewButton.dataset.id = post.id

    previewButton.classList.add(
      'btn',
      'btn-outline-primary',
      'btn-sm',
      'post-preview-button',
    )

    listItem.append(postLink, previewButton)
    container.append(listItem)
  })
}

const renderModal = (post, elements) => {
  elements.modalTitle.textContent = post.title
  elements.modalDescription.textContent = post.description
  elements.modalLink.href = post.link

  Modal.getOrCreateInstance(elements.modal).show()
}

export default (path, changedValue, state, elements) => {
  if (path.startsWith('feeds')) {
    renderFeeds(state.feeds, elements.feedsContainer)
  }

  if (path.startsWith('posts') || path === 'ui.readPostIds') {
    renderPosts(
      state.posts,
      state.ui.readPostIds,
      elements.postsContainer,
    )
  }

  if (path === 'ui.openedPostId') {
    const post = state.posts.find(({ id }) => id === changedValue)

    if (post) {
      renderModal(post, elements)
    }
  }

  if (path === 'form.status') {
    if (changedValue === FORM_STATUS.SUCCESS) {
      renderSuccess(elements)
    }

    if (changedValue === FORM_STATUS.FAILED) {
      renderError(state.form.error, elements)
    }

    if (
      [
        FORM_STATUS.IDLE,
        FORM_STATUS.VALIDATING,
        FORM_STATUS.LOADING,
      ].includes(changedValue)
    ) {
      clearFeedback(elements)
    }
  }

  if (path === 'form.error') {
    renderError(changedValue, elements)
  }
}
