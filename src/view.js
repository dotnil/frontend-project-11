import { Modal } from 'bootstrap'
import { i18nInstance } from './i18n.js'

const renderError = (error, elements) => {
  const { input, feedback } = elements

  input.classList.add('is-invalid')
  input.classList.remove('is-valid')

  feedback.textContent = error
  feedback.classList.add('text-danger')
  feedback.classList.remove('text-success')
}

const renderSuccess = (elements) => {
  const { input, feedback } = elements

  input.classList.remove('is-invalid')
  input.classList.add('is-valid')

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
    const div = document.createElement('div')
    div.classList.add('mb-3')

    div.innerHTML = `
      <h3>${feed.title}</h3>
      <p>${feed.description}</p>
    `

    container.append(div)
  })
}

const renderPosts = (posts, viewed, container, handlers) => {
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

    const isViewed = viewed.includes(post.id)

    a.classList.toggle('fw-bold', !isViewed)
    a.classList.toggle('fw-normal', isViewed)
    a.classList.toggle('link-secondary', isViewed)

    a.addEventListener('click', () => {
      handlers.handlePostClick(post.id)
    })

    const button = document.createElement('button')
    button.type = 'button'
    button.textContent = 'Просмотр'
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm')

    button.addEventListener('click', () => {
      handlers.handleOpenModal(post.id)
    })

    li.append(a, button)
    container.append(li)
  })
}

const renderModal = (post, elements) => {
  elements.modalTitle.textContent = post.title
  elements.modalDescription.textContent = post.description
  elements.modalLink.href = post.link

  Modal.getOrCreateInstance(elements.modal).show()
}

export default (path, value, state, elements, handlers) => {
  if (path.startsWith('feeds')) {
    renderFeeds(state.feeds, elements.feedsContainer)
  }

  if (path.startsWith('posts') || path === 'ui.viewedPosts') {
    renderPosts(
      state.posts,
      state.ui.viewedPosts,
      elements.postsContainer,
      handlers,
    )
  }

  if (path === 'ui.modal.postId') {
    const post = state.posts.find(p => p.id === value)
    if (!post) return

    renderModal(post, elements)
  }

  if (path === 'form.status') {
    if (value === 'success') {
      renderSuccess(elements)
    }

    if (value === 'failed') {
      renderError(state.form.error, elements)
    }

    if (['idle', 'validating', 'loading'].includes(value)) {
      clearFeedback(elements)
    }
  }

  if (path === 'form.error') {
    renderError(value, elements)
  }
}
