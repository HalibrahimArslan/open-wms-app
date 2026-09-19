import { Box, Button, TextField } from '@mui/material'
import { useFormik } from 'formik'
import * as yup from 'yup'

const validationSchema = yup.object({
  mailAdres: yup.string().required('Email boş bırakılamaz'),
})

const PublicMailCreateForm = ({ handleCreateEmail }) => {
  const formik = useFormik({
    initialValues: {
      mailAdres: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleCreateEmail(values)
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
        <TextField
          fullWidth
          id="mailAdres"
          name="mailAdres"
          label="Email"
          placeholder="Email Giriniz"
          value={formik.values.mailAdres}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.mailAdres && Boolean(formik.errors.mailAdres)}
          helperText={formik.touched.mailAdres && formik.errors.mailAdres}
          type="email"
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

export default PublicMailCreateForm
