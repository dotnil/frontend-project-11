import axios from 'axios'

const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // мс

export default async function fetchFeed(url, retries = MAX_RETRIES) {
  const proxyUrl = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`

  try {
    const response = await axios.get(proxyUrl)
    const contents = response.data?.contents
    if (!contents || typeof contents !== 'string') {
      throw new Error('network')
    }
    return contents
  }
  catch {
    if (retries > 0) {
      // подождать RETRY_DELAY и повторить
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY))
      return fetchFeed(url, retries - 1)
    }
    throw new Error('network')
  }
}
