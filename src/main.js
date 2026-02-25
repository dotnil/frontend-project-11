import 'bootstrap/dist/css/bootstrap.min.css'
import './style.css'
import onChange from 'on-change'
import * as yup from 'yup'
import initView from './view.js'

const form = document.querySelector('form')
const input = document.querySelector('#url-input')
const feedback = document.querySelector('#feedback')

const state = {
  feeds: [],
  form: {
    status: 'idle',
    error: null,
  },
}

const watchedState = onChange(state, (path, value) => {
  initView(path, value, state, { input, feedback })
})

watchedState.form.status = 'valid'

const buildSchema = existingUrls => yup.object({
  url: yup
    .string()
    .required('Не должно быть пустым')
    .url('Ссылка должна быть валидным URL')
    .notOneOf(existingUrls, 'RSS уже существует'),
})

form.addEventListener('submit', (e) => {
  e.preventDefault()

  const url = input.value.trim()

  watchedState.form.status = 'validating'
  watchedState.form.error = null

  buildSchema(watchedState.feeds)
    .validate({ url })
    .then((data) => {
      watchedState.feeds.push(data.url)
      watchedState.form.status = 'valid'
      input.value = ''
      input.focus()
    })
    .catch((err) => {
      watchedState.form.error = err.message
      watchedState.form.status = 'invalid'
    })
})
