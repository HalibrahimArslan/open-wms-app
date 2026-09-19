import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { useFormik } from 'formik'
import * as yup from 'yup'

const lookupNames = ['Z_REPORT_MAIL', 'MAIL_NOT_FOUND']

const validationSchema = yup.object({
  lookupName: yup.string().required('Boş bırakılamaz'),
  lookupCode: yup.string().email('Geçerli bir email adresi giriniz').required('Email boş bırakılamaz'),
})

const LookupForm = ({ initialLookup, handleLookup }) => {
  const formik = useFormik({
    initialValues: {
      id: initialLookup ? initialLookup.id : null,
      lookupName: initialLookup ? initialLookup.lookupName : '',
      lookupCode: initialLookup ? initialLookup.lookupCode : '',
      lookupDescription: initialLookup ? initialLookup.lookupDescription : null,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleLookup(values)
    },
  })
  return (
    <form onSubmit={formik.handleSubmit}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Key</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={formik.values.lookupName}
            label="Key"
            onChange={(event) => {
              formik.setFieldValue('lookupName', event.target.value)
            }}
            disabled={initialLookup ? true : false}
          >
            {lookupNames.map((lookupName) => (
              <MenuItem value={lookupName}>{lookupName}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          id="lookupCode"
          name="lookupCode"
          label="Email"
          placeholder="Email Giriniz"
          value={formik.values.lookupCode}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.lookupCode && Boolean(formik.errors.lookupCode)}
          helperText={formik.touched.lookupCode && formik.errors.lookupCode}
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
          {initialLookup ? 'Güncelle' : 'Oluştur'}
        </Button>
      </Box>
    </form>
  )
}

export default LookupForm
