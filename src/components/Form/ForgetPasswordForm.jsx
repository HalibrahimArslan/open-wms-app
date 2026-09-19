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
  email: Yup.string('Email giriniz').email('Geçerli bir email giriniz').required('Email gerekli'),
})

export default function ForgetPasswordForm({ onSubmit, isSubmitting = false }) {
  const formik = useFormik({
    initialValues: {
      email: '',
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
        id="email"
        label="Email Adresi"
        name="email"
        autoComplete="email"
        autoFocus
        placeholder="ornek@email.com"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
        disabled={isSubmitting}
      />

      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, textTransform: 'none', position: 'relative' }} disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <CircularProgress size={24} sx={{ position: 'absolute', left: '50%', ml: -1.2 }} />
            <span style={{ visibility: 'hidden' }}>Gönder</span>
          </>
        ) : (
          'Gönder'
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

ForgetPasswordForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
}
