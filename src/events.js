const handleFormSubmit = (event, dom, handlers) => {
  event.preventDefault()

  const url = dom.input.value.trim()

  handlers.handleSubmit(url)
    .then(() => {
      dom.input.value = ''
      dom.input.focus()
    })
}

const handlePostsContainerClick = (event, handlers) => {
  const postLink = event.target.closest('.post-link')

  if (postLink) {
    handlers.markPostAsRead(Number(postLink.dataset.id))
    return
  }

  const previewButton = event.target.closest('.post-preview-button')

  if (previewButton) {
    handlers.openPostModal(Number(previewButton.dataset.id))
  }
}

export const initEvents = (dom, handlers) => {
  dom.form.addEventListener('submit', (event) => {
    handleFormSubmit(event, dom, handlers)
  })

  dom.postsContainer.addEventListener('click', (event) => {
    handlePostsContainerClick(event, handlers)
  })
}
