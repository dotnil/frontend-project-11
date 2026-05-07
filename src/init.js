import { createHandlers } from './handlers.js'

export default (state, elements, generateId) => {
  const handlers = createHandlers(state, elements, generateId)

  document
    .querySelector('form')
    .addEventListener('submit', handlers.handleSubmit)

  return handlers
}
