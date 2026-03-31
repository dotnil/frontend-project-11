import i18next from 'i18next'

const resources = {
  ru: {
    translation: {
      title: 'RSS агрегатор',
      addButton: 'Добавить',
      errors: {
        invalidUrl: 'Ссылка должна быть валидным URL',
      },
    },
  },
  en: {
    translation: {
      title: 'RSS Aggregator',
      addButton: 'Add',
      errors: {
        invalidUrl: 'The URL must be valid',
      },
    },
  },
}

i18next.init({
  lng: 'ru',
  debug: false,
  resources,
})

export default i18next
