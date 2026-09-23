import { Box, Checkbox, FormControl, FormControlLabel, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material'
import { useMemo } from 'react'
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

const items = [
  { key: 'departments', label: 'Bölüm', field: 'departmentIds', requiredMessage: 'En az bir bölüm seçilmelidir.' },
  { key: 'halls', label: 'Koridor', field: 'hallIds', requiredMessage: 'En az bir koridor seçilmelidir.' },
  { key: 'units', label: 'Ünite', field: 'unitIds', requiredMessage: 'En az bir ünite seçilmelidir.' },
  { key: 'flats', label: 'Kat', field: 'flatIds', requiredMessage: 'En az bir kat seçilmelidir.' },
  { key: 'rooms', label: 'Oda', field: 'roomIds', requiredMessage: 'En az bir oda seçilmelidir.' },
]

const SELECT_ALL = '__all__'

const byCode = (a, b) => String(a.code).localeCompare(String(b.code), 'tr', { numeric: true })

const AddressCreateForm = ({ data, addressModel, handleSubmit }) => {
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

  const visibleItems = items.filter((item) => getVisibility(item.label))

  const options = useMemo(() => Object.fromEntries(items.map((item) => [item.key, [...(data[item.key] || [])].sort(byCode)])), [data])

  const validationSchema = yup.object({
    addressType: selectedId('Adres tipi seçilmelidir.'),
    ...Object.fromEntries(visibleItems.map((item) => [item.field, yup.array().min(1, item.requiredMessage).required(item.requiredMessage)])),
  })

  const formik = useFormik({
    initialValues: {
      departmentIds: [],
      hallIds: [],
      unitIds: [],
      flatIds: [],
      roomIds: [],
      addressType: '',
      geciciAdres: false,
      toplamaGozu: true,
      kontrolAdres: false,
      countable: true,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const selectedFields = addressModel.filter((model) => model.visible).map((model) => model.field)
      const selectedIds = Object.fromEntries(
        items.map((item) => [
          item.field,
          visibleItems.includes(item) ? options[item.key].filter((option) => values[item.field].includes(option.id)).map((option) => option.id) : [],
        ])
      )
      handleSubmit({ ...values, ...selectedIds, selectedFields })
    },
  })

  const hasError = (field) => Boolean(formik.errors[field] && formik.touched[field])

  const handleMultiChange = (item, value) => {
    if (value.includes(SELECT_ALL)) {
      const allIds = options[item.key].map((option) => option.id)
      formik.setFieldValue(item.field, formik.values[item.field].length === allIds.length ? [] : allIds)
      return
    }
    formik.setFieldValue(item.field, value)
  }

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

      {visibleItems.map((item) => {
        const itemOptions = options[item.key]
        const selected = formik.values[item.field]
        const allSelected = itemOptions.length > 0 && selected.length === itemOptions.length
        return (
          <FormControl key={item.key} fullWidth size="small" error={hasError(item.field)}>
            <InputLabel id={`${item.key}-label`}>{item.label}</InputLabel>
            <Select
              labelId={`${item.key}-label`}
              id={item.field}
              name={item.field}
              multiple
              value={selected}
              label={item.label}
              onChange={(event) => handleMultiChange(item, event.target.value)}
              onBlur={formik.handleBlur}
              renderValue={(ids) =>
                itemOptions
                  .filter((option) => ids.includes(option.id))
                  .map((option) => option.code)
                  .join(', ')
              }
            >
              {itemOptions.length > 0 && <MenuItem value={SELECT_ALL}>{allSelected ? 'Seçimi temizle' : 'Tümünü seç'}</MenuItem>}
              {renderOptions(itemOptions)}
            </Select>
            {hasError(item.field) && <FormHelperText>{formik.errors[item.field]}</FormHelperText>}
          </FormControl>
        )
      })}

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <FormControlLabel label="Geçici Adres" control={<Checkbox checked={formik.values.geciciAdres} onChange={formik.handleChange} name="geciciAdres" id="geciciAdres" />} />
        <FormControlLabel label="Toplama Gözü" control={<Checkbox checked={formik.values.toplamaGozu} onChange={formik.handleChange} name="toplamaGozu" id="toplamaGozu" />} />
      </Box>
    </Box>
  )
}

export default AddressCreateForm
