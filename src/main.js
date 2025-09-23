import * as yup from 'yup'
import initView from './view.js'

const form = document.querySelector('form')
const input = document.getElementById('url-input')
const feedback = document.getElementById('feedback')
const feedList = document.getElementById('feeds')

const state = {
  feeds: [],
  form: { status: 'idle', error: null },
}

const watchedState = initView({ input, feedback, feedList }, state)

const buildSchema = urls => yup.object({
  url: yup.string()
    .url('Введите корректный URL')
    .required('Поле не может быть пустым')
    .notOneOf(urls, 'RSS уже существует'),
})

const handleSubmit = async (event) => {
  event.preventDefault()
  const url = input.value.trim()
  if (!url) return

  watchedState.form.status = 'validating'
  watchedState.form.error = null

  try {
    const validated = await buildSchema(watchedState.feeds).validate({ url })
    watchedState.feeds = [...watchedState.feeds, validated.url]
    watchedState.form.status = 'success'

    input.value = ''
    input.focus()

    setTimeout(() => {
      watchedState.form.status = 'idle'
    }, 1200)
  }
  catch (err) {
    const message = err?.errors?.[0] ?? err?.message ?? 'Ошибка валидации'
    watchedState.form.error = message
    watchedState.form.status = 'error'
  }
}

form.addEventListener('submit', handleSubmit)
