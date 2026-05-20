export const createAppError = (type, messageKey) => {
  const error = new Error(messageKey)

  error.type = type

  return error
}

export const isValidationError = error =>
  error.name === 'ValidationError'

export const isRssParsingError = error =>
  error.type === 'rssParsing'

const translateParsingError = (error, t) =>
  createAppError('rssParsing', t(error.message))

export const normalizeError = (error, t) => {
  if (isValidationError(error)) {
    return createAppError('validation', error.message)
  }

  if (isRssParsingError(error)) {
    return translateParsingError(error, t)
  }

  return createAppError(
    'network',
    t('errors.networkError'),
  )
}
