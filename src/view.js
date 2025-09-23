import onChange from 'on-change'

const renderFeeds = (feeds, feedListEl) => {
  feedListEl.innerHTML = ''
  feeds.forEach((url) => {
    const li = document.createElement('li')
    li.textContent = url
    feedListEl.append(li)
  })
}

const bindFormError = (error, inputEl, feedbackEl) => {
  if (error) {
    inputEl.classList.add('input-error')
    feedbackEl.textContent = error
    feedbackEl.className = 'feedback error'
  }
  else {
    inputEl.classList.remove('input-error')
    feedbackEl.textContent = ''
    feedbackEl.className = 'feedback'
  }
}

const bindFormSuccess = (isSuccess, inputEl, feedbackEl) => {
  if (isSuccess) {
    feedbackEl.textContent = 'RSS успешно добавлен'
    feedbackEl.className = 'feedback success'
  }
}

export default (elements, state) => {
  const { input, feedback, feedList } = elements

  const watchedState = onChange(state, (path, value) => {
    if (path === 'form.error') {
      bindFormError(value, input, feedback)
    }
    if (path === 'form.status') {
      if (value === 'success') bindFormSuccess(true, input, feedback)
      if (value === 'idle') bindFormError(null, input, feedback)
    }
    if (path === 'feeds') {
      renderFeeds(value, feedList)
    }
  })

  return watchedState
}
