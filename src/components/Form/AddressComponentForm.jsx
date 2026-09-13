import { Box, Button, Checkbox, Divider, FormControlLabel, TextField, useTheme } from '@mui/material'
import { useFormik } from 'formik'

const AddressComponentForm = ({ initialValues, validationSchema, handleSubmit }) => {
  const theme = useTheme()
  const formik = useFormik({
    initialValues: Object.keys(initialValues).length > 0 ? initialValues : { ...initialValues, status: true },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleSubmit(values)
    },
  })

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box display={'flex'} flexDirection={'column'} gap={2}>
        <TextField
          fullWidth
          id="code"
          name="code"
          label="Kod Girniz"
          placeholder="Kod Giriniz"
          value={formik.values.code}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.code && Boolean(formik.errors.code)}
          helperText={formik.touched.code && formik.errors.code}
        />
        <TextField
          fullWidth
          id="description"
          name="description"
          label="Açıklama"
          placeholder="Açıklama Giriniz"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.description && Boolean(formik.errors.description)}
          helperText={formik.touched.description && formik.errors.description}
        />

        <Divider flexItem />

        <FormControlLabel
          label="Status"
          control={
            <Checkbox
              checked={formik.values.status}
              onChange={(event) => {
                formik.setFieldValue('status', event.target.checked)
              }}
              name="status"
              id="status"
            />
          }
        />
      </Box>
      <Box display={'flex'} justifyContent={'flex-end'} alignItems={'center'} mt={2}>
        <Button type="submit" variant="contained">
          {Object.keys(initialValues).length > 0 ? 'Güncelle' : 'Kaydet'}
        </Button>
      </Box>
    </form>
  )
}

export default AddressComponentForm
