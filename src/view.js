import { i18nInstance } from './i18n.js'
import { Modal } from 'bootstrap'

const renderError = (error, elements) => {
  const { input, feedback } = elements
  if (error) {
    input.classList.add('is-invalid')
    elements.feedback.textContent = error
    feedback.classList.add('text-danger')
    feedback.classList.remove('text-success')
  }
}

const renderSuccess = (elements) => {
  const { input, feedback } = elements
  input.classList.remove('is-invalid')
  elements.feedback.textContent = i18nInstance.t('feedback.success')
  feedback.classList.remove('text-danger')
  feedback.classList.add('text-success')
}

const clearFeedback = (elements) => {
  const { input, feedback } = elements
  input.classList.remove('is-invalid')
  elements.feedback.textContent = ''
  feedback.className = ''
}

const renderFeeds = (feeds, container) => {
  container.innerHTML = ''
  feeds.forEach((feed) => {
    const div = document.createElement('div')
    div.classList.add('mb-3')
    div.innerHTML = `
      <h5>${feed.title}</h5>
      <p>${feed.description}</p>
    `
    container.append(div)
  })
}

const renderPosts = (posts, watchedState, container) => {
  container.innerHTML = ''

  posts.forEach((post) => {
    const li = document.createElement('li')
    li.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
    )

    const a = document.createElement('a')
    a.href = post.link
    a.textContent = post.title
    a.target = '_blank'
    a.rel = 'noopener noreferrer'

    const isViewed = watchedState.ui.viewedPosts.includes(post.id)
    a.classList.add(isViewed ? 'fw-normal' : 'fw-bold')

    a.addEventListener('click', () => {
      if (!watchedState.ui.viewedPosts.includes(post.id)) {
        watchedState.ui.viewedPosts.push(post.id)
      }
    })

    const button = document.createElement('button')
    button.type = 'button'
    button.textContent = 'Просмотр'
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm')

    button.addEventListener('click', () => {
      if (!watchedState.ui.viewedPosts.includes(post.id)) {
        watchedState.ui.viewedPosts.push(post.id)
      }

      watchedState.ui.modal.postId = post.id
    })

    li.append(a, button)
    container.append(li)
  })
}

export default (path, value, watchedState, elements) => {
  const { feedsContainer, postsContainer } = elements

  if (path === 'form.error') {
    renderError(value, elements)
  }

  if (path === 'form.status') {
    if (value === 'success') {
      renderSuccess(elements)
    }
    if (value === 'failed') {
      renderError(watchedState.form.error, elements)
    }
    if (value === 'idle' || value === 'validating' || value === 'loading') {
      clearFeedback(elements)
    }
  }

  if (path === 'feeds' || path.startsWith('feeds')) {
    renderFeeds(watchedState.feeds, feedsContainer)
  }

  if (path === 'posts' || path.startsWith('posts')) {
    renderPosts(watchedState.posts, watchedState, postsContainer)
  }

  if (path === 'ui.modal.postId') {
    renderModal(value, watchedState, elements)
  }
}

const renderModal = (postId, state, elements) => {
  const post = state.posts.find(post => post.id === postId)
  if (!post) return

  elements.modalTitle.textContent = post.title
  elements.modalDescription.textContent = post.description
  elements.modalLink.href = post.link

  const modalInstance = Modal.getOrCreateInstance(elements.modal)
  modalInstance.show()
  console.log('OPEN MODAL', postId)
}
