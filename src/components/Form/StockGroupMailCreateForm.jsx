import { Box, Button, TextField } from '@mui/material'
import { useFormik } from 'formik'
import * as yup from 'yup'

const validationSchema = yup.object({
  mailAdres: yup.string().required('Mail boş bırakılamaz'),
  grupKodu: yup.number().nullable().typeError('Stok Grup Kodu sayı olmalıdır').required('Stok Grup Kodu boş bırakılamaz'),
})

const StockGroupMailCreateForm = ({ handleCreateEmail }) => {
  const formik = useFormik({
    initialValues: {
      mailAdres: '',
      grupKodu: null,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => handleCreateEmail(values),
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
          id="grupKodu"
          name="grupKodu"
          label="GropKodu"
          placeholder="Stok Grup Kodu Giriniz"
          value={formik.values.grupKodu}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.grupKodu && Boolean(formik.errors.grupKodu)}
          helperText={formik.touched.grupKodu && formik.errors.grupKodu}
          type="number"
        />
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
        <Button type="submit" variant="contained" disabled={formik.isSubmitting}>
          Oluştur
        </Button>
      </Box>
    </form>
  )
}

export default StockGroupMailCreateForm
