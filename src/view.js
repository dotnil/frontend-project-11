const renderError = (error, elements) => {
  const { input, feedback } = elements

  input.classList.add('is-invalid')
  feedback.textContent = error
  feedback.classList.remove('text-success')
  feedback.classList.add('text-danger')
}

const renderSuccess = (elements) => {
  const { input, feedback } = elements

  input.classList.remove('is-invalid')
  feedback.textContent = 'RSS успешно загружен'
  feedback.classList.remove('text-danger')
  feedback.classList.add('text-success')
}

const clearFeedback = (elements) => {
  const { input, feedback } = elements

  input.classList.remove('is-invalid')
  feedback.textContent = ''
  feedback.className = ''
}

export default (path, value, state, elements) => {
  if (path === 'form.error') {
    renderError(value, elements)
  }

  if (path === 'form.status') {
    if (value === 'valid') {
      renderSuccess(elements)
    }

    if (value === 'invalid') {
      renderError(state.form.error, elements)
    }

    if (value === 'idle' || value === 'validating') {
      clearFeedback(elements)
    }
  }
}
