// utils/fetchFeed.js
export default async function fetchFeed(url) {
  const proxyUrl = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`

  const res = await fetch(proxyUrl)
  if (!res.ok) throw new Error('network')

  const data = await res.json()
  if (!data?.contents) throw new Error('network')

  return data.contents
}
