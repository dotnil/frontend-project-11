import axios from 'axios'

const buildProxyUrl = url =>
  `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`

export const fetchRss = url =>
  axios.get(buildProxyUrl(url))
