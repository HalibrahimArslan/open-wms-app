import { Box, Button, Checkbox, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, Typography, FormHelperText, useTheme } from '@mui/material'
import { useFormik } from 'formik'
import * as yup from 'yup'
import React from 'react'
import { AddressFieldType } from '../../utils/Utils'

const validationSchema = yup.object({
  firstDepartmentId: yup.number().required('Bölüm boş bırakılamaz'),
  lastDepartmentId: yup.number().required('Bölüm boş bırakılamaz'),
  firstHallId: yup.number().required('Kat boş bırakılamaz'),
  lastHallId: yup.number().required('Kat boş bırakılamaz'),
  addressType: yup.number().required('Kat boş bırakılamaz'),
})

const items = [
  {
    key: 'departments',
    label: 'Bölüm',
    values: {
      first: 'firstDepartmentId',
      last: 'lastDepartmentId',
    },
  },
  {
    key: 'halls',
    label: 'Koridor',
    values: {
      first: 'firstHallId',
      last: 'lastHallId',
    },
  },
  {
    key: 'units',
    label: 'Ünite',
    values: {
      first: 'firstUnitId',
      last: 'lastUnitId',
    },
  },
  {
    key: 'flats',
    label: 'Kat',
    values: {
      first: 'firstFlatId',
      last: 'lastFlatId',
    },
  },
  {
    key: 'rooms',
    label: 'Oda',
    values: {
      first: 'firstRoomId',
      last: 'lastRoomId',
    },
  },
]

const AddressCreateForm = ({ data, addressModel, handleSubmit }) => {
  const theme = useTheme()
  const formik = useFormik({
    initialValues: {
      firstDepartmentId: null,
      lastDepartmentId: null,
      firstHallId: null,
      lastHallId: null,
      firstUnitId: null,
      lastUnitId: null,
      firstFlatId: null,
      lastFlatId: null,
      firstRoomId: null,
      lastRoomId: null,
      addressType: null,
      geciciAdres: false,
      toplamaGozu: true,
      kontrolAdres: false,
      countable: true,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let selectedFields = addressModel.map((model) => {
        if (model.visible) {
          return model.field
        }
      })
      handleSubmit({ ...values, selectedFields: selectedFields })
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

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={1} sx={{ flexDirection: 'column' }}>
        <Grid size={2}>
          <Typography>Adres Tipi</Typography>
        </Grid>
        <Grid size={10}>
          <FormControl fullWidth error={Boolean(formik.values.addressType && formik.touched.addressType)}>
            <InputLabel id="address-type-simple-select-label">Adres Tipi</InputLabel>
            <Select
              labelId="address-type-simple-select-label"
              id={'addressType'}
              value={formik.values.addressType}
              label="Başlangıç"
              onChange={(event) => {
                formik.setFieldValue('addressType', event.target.value)
              }}
              onBlur={formik.handleBlur}
            >
              {data.addressTypes.map((addressType) => (
                <MenuItem key={addressType.code} value={addressType.id}>
                  {addressType.code}
                </MenuItem>
              ))}
            </Select>
            {formik.errors.addressType && formik.touched.addressType && <FormHelperText>{formik.errors.addressType}</FormHelperText>}
          </FormControl>
        </Grid>
        {items.map((item) => (
          <>
            {getVisibility(item.label) ? (
              <React.Fragment key={item.key}>
                <Grid>
                  <Typography>{item.label}</Typography>
                </Grid>
                <Grid>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 1,
                    }}
                  >
                    <FormControl fullWidth error={Boolean(formik.errors[item.values.first] && formik.touched[item.values.first])}>
                      <InputLabel id={`first-${item.key}-simple-select-label`}>Başlangıç</InputLabel>
                      <Select
                        labelId={`first-${item.key}-simple-select-label`}
                        id={item.values.first}
                        value={formik.values[item.values.first]}
                        label="Başlangıç"
                        sx={{ minWidth: 150 }}
                        onChange={(event) => {
                          formik.setFieldValue(item.values.first, event.target.value)
                        }}
                        onBlur={formik.handleBlur}
                      >
                        {data[item.key].map((department) => (
                          <MenuItem key={department.id} value={department.id}>
                            {department.code}
                          </MenuItem>
                        ))}
                      </Select>
                      {formik.errors[item.values.first] && formik.touched[item.values.first] && <FormHelperText>{formik.errors[item.values.first]}</FormHelperText>}
                    </FormControl>
                    <FormControl fullWidth error={Boolean(formik.errors[item.values.last] && formik.touched[item.values.last])}>
                      <InputLabel id={`last-${item.key}-simple-select-label`}>Bitiş</InputLabel>
                      <Select
                        labelId={`last-${item.key}-simple-select-label`}
                        id={item.values.last}
                        value={formik.values[item.values.last]}
                        label="Bitiş"
                        sx={{ minWidth: 150 }}
                        onChange={(event) => {
                          formik.setFieldValue(item.values.last, event.target.value)
                        }}
                        onBlur={formik.handleBlur}
                      >
                        {data[item.key].map((department) => (
                          <MenuItem key={department.id} value={department.id}>
                            {department.code}
                          </MenuItem>
                        ))}
                      </Select>
                      {formik.errors[item.values.last] && formik.touched[item.values.last] && <FormHelperText>{formik.errors[item.values.last]}</FormHelperText>}
                    </FormControl>
                  </Box>
                </Grid>
              </React.Fragment>
            ) : (
              <></>
            )}
          </>
        ))}
      </Grid>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <FormControlLabel
          label="Geçici Adres"
          control={<Checkbox checked={formik.values.geciciAdres} onChange={formik.handleChange} name="geciciAdres" id="geciciAdres" />}
          labelPlacement="end"
        />
        <FormControlLabel
          label="Toplama Gözü"
          control={<Checkbox checked={formik.values.toplamaGozu} onChange={formik.handleChange} name="toplamaGozu" id="toplamaGozu" />}
          labelPlacement="end"
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          mt: 2,
        }}
      >
        <Button type="submit" variant="contained">
          Oluştur
        </Button>
      </Box>
    </form>
  )
}

export default AddressCreateForm
