import * as yup from 'yup'

const state = {
  feeds: [],
}

const buildSchema = urls => yup.object({
  url: yup.string()
    .url('Введите корректный URL')
    .required('Поле не может быть пустым')
    .notOneOf(urls, 'RSS уже существует'),
})

const form = document.querySelector('form')
const input = document.getElementById('url-input')
const feedback = document.getElementById('feedback')

const handleSubmit = async (event) => {
  event.preventDefault()
  const url = input.value.trim()

  try {
    const validated = await buildSchema(state.feeds).validate({ url })
    state.feeds.push(validated.url)

    input.value = ''
    input.focus()
    input.classList.remove('input-error')
    input.setAttribute('aria-invalid', 'false')

    feedback.textContent = 'RSS успешно добавлен'
    feedback.className = 'feedback success'

    console.log('Добавлен RSS:', validated.url)
  }
  catch (err) {
    const message = err?.errors?.[0] ?? err?.message ?? 'Ошибка валидации'

    input.classList.add('input-error')
    input.setAttribute('aria-invalid', 'true')

    feedback.textContent = message
    feedback.className = 'feedback error'
  }
}

form.addEventListener('submit', handleSubmit)
