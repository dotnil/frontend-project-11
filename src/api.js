import axios from 'axios'

const buildProxyUrl = url =>
  `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`

export const fetchRss = (url) => {
  const proxyUrl = buildProxyUrl(url)
  return axios.get(proxyUrl)
}
