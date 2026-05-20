import * as yup from 'yup'

export const createFeedSchema = (existingUrls, t) => yup.object({
  url: yup.string()
    .required(t('errors.required'))
    .url(t('errors.invalidUrl'))
    .notOneOf(existingUrls, t('errors.duplicate')),
})
