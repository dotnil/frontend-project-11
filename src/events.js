const handleFormSubmit = (
  event,
  elements,
  handlers,
) => {
  event.preventDefault()

  const url = elements.input.value.trim()

  handlers.handleSubmit(url)
    .then(() => {
      elements.input.value = ''
    })
}

const handlePostsClick = (
  event,
  handlers,
) => {
  const postLink = event.target.closest('.post-link')

  if (postLink) {
    handlers.handlePostClick(Number(postLink.dataset.id))
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
}

export const initEvents = (
  elements,
  formElement,
  handlers,
) => {
  formElement.addEventListener(
    'submit',
    event => handleFormSubmit(
      event,
      elements,
      handlers,
    ),
  )

  elements.postsContainer.addEventListener(
    'click',
    event => handlePostsClick(
      event,
      handlers,
    ),
  )
}
