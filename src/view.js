import { Modal } from 'bootstrap'
import { i18nInstance } from './i18n.js'
import { FORM_STATUS } from './handlers.js'

const statusesWithoutFeedback = [
  FORM_STATUS.IDLE,
  FORM_STATUS.VALIDATING,
  FORM_STATUS.LOADING,
]

const toggleValidationClass = (input, isValid) => {
  input.classList.toggle('is-valid', isValid)
  input.classList.toggle('is-invalid', !isValid)
}

const renderError = (error, dom) => {
  const { input, feedback } = dom

  toggleValidationClass(input, false)
  feedback.textContent = error

  feedback.classList.add('text-danger')
  feedback.classList.remove('text-success')
}

const renderSuccess = (dom) => {
  const { input, feedback } = dom

  toggleValidationClass(input, true)
  feedback.textContent = i18nInstance.t('feedback.success')

  feedback.classList.remove('text-danger')
  feedback.classList.add('text-success')
}

const clearFeedback = (dom) => {
  const { input, feedback } = dom

  input.classList.remove('is-valid', 'is-invalid')
  feedback.textContent = ''

  feedback.classList.remove('text-danger', 'text-success')
}

const renderFeeds = (feeds, container) => {
  if (feeds.length === 0) {
    container.innerHTML = ''
    return
  }

  container.innerHTML = `
    <h2 class='h4 mb-3'>Фиды</h2>

    ${feeds.map(feed => `
      <div class='mb-3'>
        <h3 class='h6'>${feed.title}</h3>
        <p class='text-muted small mb-0'>${feed.description}</p>
      </div>
    `).join('')}
  `
}

const renderPosts = (posts, readPostIds, container) => {
  if (posts.length === 0) {
    container.innerHTML = ''
    return
  }

  container.innerHTML = `
    <h2 class='h4 mb-3'>Посты</h2>
    <ul class='list-group'></ul>
  `

  const list = container.querySelector('ul')

  posts.forEach((post) => {
    const isRead = readPostIds.includes(post.id)

    const linkClass = isRead
      ? 'fw-normal link-secondary'
      : 'fw-bold'

    const postElement = document.createElement('li')

    postElement.classList.add(
      'list-group-item',
      'border-0',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'px-0',
    )

    postElement.innerHTML = `
      <a href='${post.link}'
         target='_blank'
         rel='noopener noreferrer'
         data-id='${post.id}'
         class='${linkClass}'>
        ${post.title}
      </a>

      <button type='button'
              data-id='${post.id}'
              class='btn btn-outline-primary btn-sm post-preview-button'>
        ${i18nInstance.t('buttons.view')}
      </button>
    `

    list.append(postElement)
  })
}

const showPostModal = (post, dom) => {
  dom.modalTitle.textContent = post.title
  dom.modalDescription.textContent = post.description
  dom.modalLink.href = post.link

  Modal.getOrCreateInstance(dom.modal).show()
}

let previousOpenedPostId = null

const renderView = (state, dom) => {
  renderFeeds(state.feeds, dom.feedsContainer)

  renderPosts(
    state.posts,
    state.ui.readPostIds,
    dom.postsContainer,
  )

  if (
    state.ui.openedPostId !== null
    && state.ui.openedPostId !== previousOpenedPostId
  ) {
    const post = state.posts.find(
      ({ id }) => id === state.ui.openedPostId,
    )

    if (post) {
      showPostModal(post, dom)
      previousOpenedPostId = state.ui.openedPostId
    }
  }

  if (state.form.status === FORM_STATUS.SUCCESS) {
    renderSuccess(dom)
  }

  if (state.form.status === FORM_STATUS.FAILED) {
    renderError(state.form.error, dom)
  }

  if (statusesWithoutFeedback.includes(state.form.status)) {
    clearFeedback(dom)
  }
}

export default renderView
