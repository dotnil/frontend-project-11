import { i18nInstance } from './i18n.js'

const renderError = (error, elements) => {
  const { input, feedback } = elements
  if (error) {
    input.classList.add('is-invalid')
    feedback.textContent = error
    feedback.classList.add('text-danger')
    feedback.classList.remove('text-success')
  }
}

const renderSuccess = (elements) => {
  const { input, feedback } = elements
  input.classList.remove('is-invalid')
  feedback.textContent = i18nInstance.t('feedback.success')
  feedback.classList.remove('text-danger')
  feedback.classList.add('text-success')
}

const clearFeedback = (elements) => {
  const { input, feedback } = elements
  input.classList.remove('is-invalid')
  feedback.textContent = ''
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

const renderPosts = (posts, container) => {
  container.innerHTML = ''
  posts.forEach((post) => {
    const li = document.createElement('li')
    li.classList.add('list-group-item')
    li.innerHTML = `<a href="${post.link}" target="_blank">${post.title}</a>`
    container.append(li)
  })
}

export default (path, value, state, elements) => {
  const feedsContainer = document.querySelector('#feeds')
  const postsContainer = document.querySelector('#posts')

  if (path === 'form.error') {
    renderError(value, elements)
  }

  if (path === 'form.status') {
    if (value === 'success') {
      renderSuccess(elements)
    }
    if (value === 'failed') {
      renderError(state.form.error, elements)
    }
    if (value === 'idle' || value === 'validating' || value === 'loading') {
      clearFeedback(elements)
    }
  }

  if (path === 'feeds' || path.startsWith('feeds')) {
    renderFeeds(state.feeds, feedsContainer)
  }

  if (path === 'posts' || path.startsWith('posts')) {
    renderPosts(state.posts, postsContainer)
  }
}
