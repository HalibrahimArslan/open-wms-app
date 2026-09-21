import { Box, Checkbox, FormControl, FormControlLabel, FormHelperText, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { AddressFieldType } from '../../utils/Utils'

/**
 * Gonder dugmesi formun icinde degil, diyalogun alt seridinde durur; ikisini
 * bu kimlik baglar (<button form="...">). Onceden form kendi "Olustur"
 * dugmesini tasiyordu ve hemen altinda diyalogun "Geri / Ilerle" seridi
 * geldigi icin diyalogda iki ayri aksiyon satiri olusuyordu.
 */
export const ADDRESS_CREATE_FORM_ID = 'address-create-form'

const selectedId = (message) =>
  yup
    .number()
    .transform((value, original) => (original === '' || original === null ? undefined : value))
    .typeError(message)
    .required(message)

const validationSchema = yup.object({
  addressType: selectedId('Adres tipi seçilmelidir.'),
  firstDepartmentId: selectedId('Bölüm başlangıcı boş bırakılamaz.'),
  lastDepartmentId: selectedId('Bölüm bitişi boş bırakılamaz.'),
  firstHallId: selectedId('Koridor başlangıcı boş bırakılamaz.'),
  lastHallId: selectedId('Koridor bitişi boş bırakılamaz.'),
})

const items = [
  { key: 'departments', label: 'Bölüm', values: { first: 'firstDepartmentId', last: 'lastDepartmentId' } },
  { key: 'halls', label: 'Koridor', values: { first: 'firstHallId', last: 'lastHallId' } },
  { key: 'units', label: 'Ünite', values: { first: 'firstUnitId', last: 'lastUnitId' } },
  { key: 'flats', label: 'Kat', values: { first: 'firstFlatId', last: 'lastFlatId' } },
  { key: 'rooms', label: 'Oda', values: { first: 'firstRoomId', last: 'lastRoomId' } },
]

const AddressCreateForm = ({ data, addressModel, handleSubmit }) => {
  const formik = useFormik({
    initialValues: {
      firstDepartmentId: '',
      lastDepartmentId: '',
      firstHallId: '',
      lastHallId: '',
      firstUnitId: '',
      lastUnitId: '',
      firstFlatId: '',
      lastFlatId: '',
      firstRoomId: '',
      lastRoomId: '',
      addressType: '',
      geciciAdres: false,
      toplamaGozu: true,
      kontrolAdres: false,
      countable: true,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const selectedFields = addressModel.filter((model) => model.visible).map((model) => model.field)
      handleSubmit({ ...values, selectedFields })
    },
  })

  const getVisibility = (label) => {
    if (label === AddressFieldType.DEPARTMENT || label === AddressFieldType.HALL) {
      return true
    }
    const desiredField = addressModel.find((model) => model.headerName === label)
    if (desiredField) {
      return desiredField.visible
    }
    return true
  }

  const hasError = (field) => Boolean(formik.errors[field] && formik.touched[field])

  const renderOptions = (list) => {
    if (!list || list.length === 0) {
      return (
        <MenuItem value="" disabled>
          Tanımlı kayıt yok
        </MenuItem>
      )
    }
    return list.map((option) => (
      <MenuItem key={option.id} value={option.id}>
        {option.code}
      </MenuItem>
    ))
  }

  const visibleItems = items.filter((item) => getVisibility(item.label))

  return (
    <Box component="form" id={ADDRESS_CREATE_FORM_ID} onSubmit={formik.handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, minWidth: { sm: 420 } }}>
      {/* Adres tipinin ustunde ayrica bir baslik yaziliyordu; alanin kendi
          etiketi zaten "Adres Tipi" oldugu icin ayni yazi iki kere cikiyor,
          ustelik dar bir izgara hucresine dustugu icin iki satira boluniyordu. */}
      <FormControl fullWidth size="small" error={hasError('addressType')}>
        <InputLabel id="address-type-label">Adres Tipi</InputLabel>
        <Select
          labelId="address-type-label"
          id="addressType"
          name="addressType"
          value={formik.values.addressType}
          label="Adres Tipi"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          {renderOptions(data.addressTypes)}
        </Select>
        {hasError('addressType') && <FormHelperText>{formik.errors.addressType}</FormHelperText>}
      </FormControl>

      {visibleItems.map((item) => (
        <Box key={item.key} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {item.label}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <FormControl fullWidth size="small" error={hasError(item.values.first)}>
              <InputLabel id={`first-${item.key}-label`}>Başlangıç</InputLabel>
              <Select
                labelId={`first-${item.key}-label`}
                id={item.values.first}
                name={item.values.first}
                value={formik.values[item.values.first]}
                label="Başlangıç"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                {renderOptions(data[item.key])}
              </Select>
              {hasError(item.values.first) && <FormHelperText>{formik.errors[item.values.first]}</FormHelperText>}
            </FormControl>
            <FormControl fullWidth size="small" error={hasError(item.values.last)}>
              <InputLabel id={`last-${item.key}-label`}>Bitiş</InputLabel>
              <Select
                labelId={`last-${item.key}-label`}
                id={item.values.last}
                name={item.values.last}
                value={formik.values[item.values.last]}
                label="Bitiş"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                {renderOptions(data[item.key])}
              </Select>
              {hasError(item.values.last) && <FormHelperText>{formik.errors[item.values.last]}</FormHelperText>}
            </FormControl>
          </Box>
        </Box>
      ))}

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <FormControlLabel label="Geçici Adres" control={<Checkbox checked={formik.values.geciciAdres} onChange={formik.handleChange} name="geciciAdres" id="geciciAdres" />} />
        <FormControlLabel label="Toplama Gözü" control={<Checkbox checked={formik.values.toplamaGozu} onChange={formik.handleChange} name="toplamaGozu" id="toplamaGozu" />} />
      </Box>
    </Box>
  )
}

export default AddressCreateForm
