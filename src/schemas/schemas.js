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

export const ERP_TYPES = [
  { value: 'LOCAL', label: 'Yerel' },
  { value: 'MIKRO_V16', label: 'Mikro v16' },
  { value: 'MIKRO_V15', label: 'Mikro v15' },
  { value: 'UYUMSOFT', label: 'Uyumsoft' },
]

export const companySchema = yup.object({
  companyCode: yup
    .number()
    .typeError('Şirket kodu sayı olmalı.')
    .integer('Şirket kodu tam sayı olmalı.')
    .min(0, 'Şirket kodu negatif olamaz.')
    .required('Şirket kodu boş bırakılamaz.'),
  companyName: yup.string().trim().required('Şirket adı boş bırakılamaz.'),
  erpType: yup
    .string()
    .oneOf(
      ERP_TYPES.map((type) => type.value),
      'Geçerli bir ERP tipi seçiniz.',
    )
    .required('ERP tipi seçiniz.'),
  apiEndPoint: yup
    .string()
    .trim()
    .when('erpApiActive', {
      is: true,
      then: (schema) => schema.required('ERP bağlantısı aktifken API adresi boş bırakılamaz.'),
    }),
  erpApiActive: yup.boolean(),
  username: yup.string().trim(),
  password: yup.string(),
})

export const warehouseSchema = yup.object({
  code: yup.string().trim().required('Depo kodu boş bırakılamaz.'),
  name: yup.string().trim().required('Depo adı boş bırakılamaz.'),
  receivingCode: yup.string().trim().required('Mal kabul depo kodu boş bırakılamaz.'),
  transferCode: yup.string().trim().required('Transfer depo kodu boş bırakılamaz.'),
})
