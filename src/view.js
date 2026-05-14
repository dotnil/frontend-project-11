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
    const wrapper = document.createElement('div')

    wrapper.classList.add('mb-3')

    wrapper.innerHTML = `
      <h3>${feed.title}</h3>
      <p>${feed.description}</p>
    `

    container.append(wrapper)
  })
}

const renderPosts = (posts, viewedPosts, container) => {
  container.innerHTML = ''

  posts.forEach((post) => {
    const listItem = document.createElement('li')

    listItem.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
    )

    const postLink = document.createElement('a')

    postLink.href = post.link
    postLink.textContent = post.title
    postLink.target = '_blank'
    postLink.rel = 'noopener noreferrer'

    postLink.dataset.id = post.id
    postLink.classList.add('post-link')

    const isViewed = viewedPosts.includes(post.id)

    postLink.classList.toggle('fw-bold', !isViewed)
    postLink.classList.toggle('fw-normal', isViewed)
    postLink.classList.toggle('link-secondary', isViewed)

    const previewButton = document.createElement('button')

    previewButton.type = 'button'
    previewButton.textContent = 'Просмотр'

    previewButton.classList.add(
      'btn',
      'btn-outline-primary',
      'btn-sm',
      'post-preview-button',
    )

    previewButton.dataset.id = post.id

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

  if (path.startsWith('posts') || path === 'ui.viewedPosts') {
    renderPosts(
      state.posts,
      state.ui.viewedPosts,
      elements.postsContainer,
    )
  }

  if (path === 'ui.modal.postId') {
    const post = state.posts.find(
      postItem => postItem.id === changedValue,
    )

    if (!post) {
      return
    }

    renderModal(post, elements)
  }

  if (path === 'form.status') {
    if (changedValue === 'success') {
      renderSuccess(elements)
    }

    if (changedValue === 'failed') {
      renderError(state.form.error, elements)
    }

    if (
      ['idle', 'validating', 'loading'].includes(changedValue)
    ) {
      clearFeedback(elements)
    }
  }

  if (path === 'form.error') {
    renderError(changedValue, elements)
  }
}
