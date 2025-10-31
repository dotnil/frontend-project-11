import i18next from 'i18next'
import ru from './locales/ru.js'

const i18nInstance = i18next.createInstance()

const initI18n = i18nInstance.init({
  lng: 'ru',
  resources: { ru },
})

export { i18nInstance, initI18n }
