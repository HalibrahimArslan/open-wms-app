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

export const DRIVER_PLATE_MAX_LENGTH = 15

export const driverSchema = yup.object({
  driverName: yup.string().trim().min(3, 'Ad soyad en az 3 karakter olmalı.').required('Ad soyad boş bırakılamaz.'),
  identityNumber: yup.string().length(11, 'T.C. No 11 haneli olmalı.').required('T.C. No boş bırakılamaz.'),
  phoneNumber: yup.string().length(11, 'Telefon 11 haneli olmalı.').required('Telefon boş bırakılamaz.'),
  licensePlate: yup
    .string()
    .trim()
    .min(6, 'Plaka en az 6 karakter olmalı.')
    .max(DRIVER_PLATE_MAX_LENGTH, `Plaka en fazla ${DRIVER_PLATE_MAX_LENGTH} karakter olabilir.`)
    .required('Plaka boş bırakılamaz.'),
  trailerPlate: yup.string().trim().max(DRIVER_PLATE_MAX_LENGTH, `Dorse plaka en fazla ${DRIVER_PLATE_MAX_LENGTH} karakter olabilir.`),
})
