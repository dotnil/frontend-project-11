export const initEvents = (
  elements,
  formElement,
  handlers,
) => {
  formElement.addEventListener(
    'submit',
    (event) => {
      event.preventDefault()

      const url = elements.input.value.trim()

      handlers.handleSubmit(url)
        .then(() => {
          elements.input.value = ''
        })
    },
  )

  elements.postsContainer.addEventListener(
    'click',
    (event) => {
      const postLink = event.target.closest(
        '.post-link',
      )

      if (postLink) {
        handlers.handlePostClick(
          Number(postLink.dataset.id),
        )

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
    },
  )
}
