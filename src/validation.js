import * as yup from 'yup'

export const buildSchema = (urls, t) => yup.object({
  url: yup.string()
    .required(t('errors.required'))
    .url(t('errors.invalidUrl'))
    .notOneOf(urls, t('errors.duplicate')),
})
