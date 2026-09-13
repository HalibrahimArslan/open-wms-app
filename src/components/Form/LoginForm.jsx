import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Typography } from '@mui/material'

const validationSchema = Yup.object({
  username: Yup.string('Kullanıcı adı giriniz').required('Kullanıcı adı gerekli'),
  password: Yup.string('Şifre giriniz').required('Şifre gerekli'),
})

export default function LoginForm({ onSubmit, isSubmitting }) {
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      await onSubmit(values)
    },
  })

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <TextField
        margin="normal"
        required
        fullWidth
        id="username"
        label="Kullanıcı Adı"
        name="username"
        autoComplete="username"
        autoFocus
        value={formik.values.username}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.username && Boolean(formik.errors.username)}
        helperText={formik.touched.username && formik.errors.username}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Şifre"
        type="password"
        id="password"
        autoComplete="current-password"
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={formik.touched.password && formik.errors.password}
      />

      <Box sx={{ alignSelf: 'flex-end', mt: 1, mb: 2 }}>
        <Link to="/forget-password" style={{ textDecoration: 'none' }}>
          <Typography variant="body2" sx={{ color: 'primary.main', '&:hover': { textDecoration: 'underline' } }}>
            Şifremi Unuttum
          </Typography>
        </Link>
      </Box>

      <Button disabled={isSubmitting} type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 2, textTransform: 'none' }}>
        {isSubmitting ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
      </Button>
    </Box>
  )
}

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
}

LoginForm.defaultProps = {
  isSubmitting: false,
}
