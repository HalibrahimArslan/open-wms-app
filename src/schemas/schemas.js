import * as yup from 'yup'

export const userEditSchema = yup.object({
  login: yup.string().required('Kullanıcı adı zorunludur.'),
  firstName: yup.string().required('Ad zorunludur.'),
  lastName: yup.string().required('Soyad zorunludur.'),
  email: yup.string().email('Geçerli bir e-posta adresi girin.').required('E-posta adresi zorunludur.'),
})

export const userCreateSchema = yup.object({
  login: yup.string().required('Kullanıcı adı zorunludur.'),
  firstName: yup.string().required('Ad zorunludur.'),
  lastName: yup.string().required('Soyad zorunludur.'),
  email: yup.string().email('Geçerli bir e-posta adresi girin.').required('E-posta adresi zorunludur.'),
})

export const ADDRESS_COMPONENT_CODE_MAX_LENGTH = 2
export const ADDRESS_TYPE_CODE_MAX_LENGTH = 6

export const addressComponentSchema = (label, maxLength = ADDRESS_COMPONENT_CODE_MAX_LENGTH) =>
  yup.object({
    code: yup
      .string()
      .max(maxLength, `${label} en fazla ${maxLength} karakter olabilir.`)
      .required(`${label} boş bırakılamaz.`),
    description: yup.string().required('Açıklama boş bırakılamaz.'),
  })
