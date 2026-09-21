import { Box, Button, TextField } from '@mui/material'
import { useFormik } from 'formik'
import * as yup from 'yup'

const validationSchema = yup.object({
  customerCode: yup.string().required('Cari kodu boş bırakılamaz'),
  districtCode: yup.number().nullable().typeError('Bölge kodu sayı olmalıdır').required('Bölge kodu boş bırakılamaz'),
  mail: yup.string().email('Geçerli bir email adresi giriniz').required('Email boş bırakılamaz'),
})

const VendorMailCreateForm = ({ handleCreateEmail }) => {
  const formik = useFormik({
    initialValues: {
      customerCode: '',
      districtCode: null,
      mail: '',
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
          id="customerCode"
          name="customerCode"
          label="Cari Kodu"
          placeholder="Cari kodu giriniz"
          value={formik.values.customerCode}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.customerCode && Boolean(formik.errors.customerCode)}
          helperText={formik.touched.customerCode && formik.errors.customerCode}
        />
        <TextField
          fullWidth
          id="districtCode"
          name="districtCode"
          label="Bölge Kodu"
          placeholder="Bölge kodu Giriniz"
          value={formik.values.districtCode}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.districtCode && Boolean(formik.errors.districtCode)}
          helperText={formik.touched.districtCode && formik.errors.districtCode}
        />
        <TextField
          fullWidth
          id="mail"
          name="mail"
          label="Email"
          placeholder="Email Giriniz"
          value={formik.values.mail}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.mail && Boolean(formik.errors.mail)}
          helperText={formik.touched.mail && formik.errors.mail}
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

export default VendorMailCreateForm
