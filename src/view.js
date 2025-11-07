import onChange from 'on-change'

const renderFeeds = (feeds, container) => {
  container.innerHTML = ''
  Object.values(feeds).forEach((feed) => {
    const li = document.createElement('li')
    li.innerHTML = `<h3>${feed.title}</h3><p>${feed.description}</p>`
    container.append(li)
  })
}

const renderPosts = (posts, container, modal) => {
  container.innerHTML = ''
  Object.values(posts).forEach((post) => {
    const li = document.createElement('li')
    const a = document.createElement('a')
    a.href = post.link
    a.textContent = post.title
    a.style.cursor = 'pointer'

    a.addEventListener('click', (e) => {
      e.preventDefault()
      // очищаем и создаём содержимое модалки динамически
      modal.innerHTML = `
        <div>
          <span id="modal-close" style="cursor:pointer">&times;</span>
          <h2>${post.title}</h2>
          <p>${post.description}</p>
          <a href="${post.link}" target="_blank">Читать полностью</a>
        </div>
      `
      modal.classList.remove('hidden')

      // навешиваем закрытие
      modal.querySelector('#modal-close').addEventListener('click', () => {
        modal.classList.add('hidden')
      })
    })

    li.append(a)
    container.append(li)
  })
}

const bindFormError = (error, inputEl, feedbackEl) => {
  if (error) {
    inputEl.classList.add('input-error')
    feedbackEl.textContent = error
    feedbackEl.className = 'feedback error'
  } else {
    inputEl.classList.remove('input-error')
    feedbackEl.textContent = ''
    feedbackEl.className = 'feedback'
  }
}

const bindFormSuccess = (isSuccess, inputEl, feedbackEl) => {
  if (isSuccess) {
    inputEl.classList.remove('input-error')
    feedbackEl.textContent = 'RSS успешно добавлен'
    feedbackEl.className = 'feedback success'
  }
}

export default (elements, state) => {
  const { input, feedback, feedsContainer, postsContainer } = elements
  const modal = document.getElementById('modal') // один div для модалки

  const watchedState = onChange(state, (path, value) => {
    if (path === 'form.error') bindFormError(value, input, feedback)
    if (path === 'form.status') {
      if (value === 'success') bindFormSuccess(true, input, feedback)
      if (value === 'idle') bindFormError(null, input, feedback)
    }
    if (path === 'feeds') renderFeeds(value, feedsContainer)
    if (path === 'posts') renderPosts(value, postsContainer, modal)
  })

  return watchedState
}
