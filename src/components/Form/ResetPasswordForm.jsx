import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import PropTypes from 'prop-types'
import { Link } from 'react-router'

const validationSchema = Yup.object({
  password: Yup.string('Şifre giriniz').min(4, 'Şifre en az 4 karakter olmalıdır').max(100, 'Şifre en fazla 100 karakter olmalıdır').required('Şifre gerekli'),
  confirmPassword: Yup.string('Şifreyi tekrar giriniz')
    .oneOf([Yup.ref('password'), null], 'Şifreler eşleşmiyor')
    .required('Şifreyi tekrar girme gerekli'),
})

export default function ResetPasswordForm({ onSubmit, isSubmitting }) {
  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
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
        name="password"
        label="Yeni Şifre"
        type="password"
        id="password"
        autoComplete="new-password"
        autoFocus
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={formik.touched.password && formik.errors.password}
        disabled={isSubmitting}
      />

      <TextField
        margin="normal"
        required
        fullWidth
        name="confirmPassword"
        label="Şifreyi Tekrar Giriniz"
        type="password"
        id="confirmPassword"
        autoComplete="new-password"
        value={formik.values.confirmPassword}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
        helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
        disabled={isSubmitting}
      />

      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, textTransform: 'none', position: 'relative' }} disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <CircularProgress size={24} sx={{ position: 'absolute', left: '50%', ml: -1.2 }} />
            <span style={{ visibility: 'hidden' }}>Şifreyi Sıfırla</span>
          </>
        ) : (
          'Şifreyi Sıfırla'
        )}
      </Button>

      <Link to="/login" style={{ textDecoration: 'none', width: '100%' }}>
        <Button fullWidth variant="outlined" sx={{ textTransform: 'none' }}>
          Geri Dön
        </Button>
      </Link>
    </Box>
  )
}

ResetPasswordForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
}

ResetPasswordForm.defaultProps = {
  isSubmitting: false,
}
