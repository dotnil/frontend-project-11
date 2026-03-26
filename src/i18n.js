import i18next from 'i18next'
import ru from './locales/ru.js'

export const i18nInstance = i18next.createInstance()

export const initI18n = () => i18nInstance.init({
  lng: 'ru',
  resources: { ru },
})
