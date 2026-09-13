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
