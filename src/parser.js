const createParsingError = (message) => {
  const error = new Error(message)
  error.name = 'ParsingError'
  return error
}

const parseRss = (xmlString) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xmlString, 'application/xml')

  const parserError = doc.querySelector('parsererror')
  if (parserError) {
    throw createParsingError('Невалидный XML')
  }

  const channel = doc.querySelector('channel')
  if (!channel) {
    throw createParsingError('Это не RSS')
  }

  const title = channel.querySelector('title')?.textContent
  const description = channel.querySelector('description')?.textContent

  if (!title || !description) {
    throw createParsingError('RSS не содержит обязательных полей')
  }

  const items = doc.querySelectorAll('item')

  const posts = Array.from(items).map((item) => {
    const postTitle = item.querySelector('title')?.textContent
    const postDescription = item.querySelector('description')?.textContent
    const link = item.querySelector('link')?.textContent

    if (!postTitle || !postDescription || !link) {
      throw createParsingError('Некорректная структура поста')
    }

    return {
      title: postTitle,
      description: postDescription,
      link,
    }
  })

  return {
    feed: {
      title,
      description,
    },
    posts,
  }
}

export default parseRss
