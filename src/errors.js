export const createAppError = (type, message) => {
  const error = new Error(message)

  error.type = type

  return error
}

export const isValidationError = error =>
  error.name === 'ValidationError'

export const isParsingError = error =>
  error.type === 'rssParsing'

const normalizeParsingError = (error, translateText) =>
  createAppError(
    'rssParsing',
    translateText(error.message),
  )

export const normalizeError = (error, translateText) => {
  if (isValidationError(error)) {
    return createAppError('validation', error.message)
  }

  if (isParsingError(error)) {
    return normalizeParsingError(error, translateText)
  }

  return createAppError(
    'network',
    translateText('errors.networkError'),
  )
}
