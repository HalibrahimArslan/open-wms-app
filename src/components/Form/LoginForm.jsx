import { useState } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Typography } from '@mui/material'

// Tema taban punto olarak 12px kullanir; giris ekraninda alanlarin okunakli
// kalmasi icin input ve etiket puntolari burada buyutulur.
const fieldSx = {
  '& .MuiInputBase-input': { fontSize: 15, paddingTop: '14px', paddingBottom: '14px' },
  '& .MuiInputLabel-root': { fontSize: 14 },
  '& .MuiFormHelperText-root': { fontSize: 12.5 },
}

const validationSchema = Yup.object({
  username: Yup.string('Kullanıcı adı giriniz').required('Kullanıcı adı gerekli'),
  password: Yup.string('Şifre giriniz').required('Şifre gerekli'),
})

export default function LoginForm({ onSubmit, isSubmitting }) {
  const [showPassword, setShowPassword] = useState(false)

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
        disabled={isSubmitting}
        sx={fieldSx}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PersonOutlineRoundedIcon fontSize="small" color="action" />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Şifre"
        type={showPassword ? 'text' : 'password'}
        id="password"
        autoComplete="current-password"
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={formik.touched.password && formik.errors.password}
        disabled={isSubmitting}
        sx={fieldSx}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockOutlinedIcon fontSize="small" color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'} onClick={() => setShowPassword((prev) => !prev)} edge="end" size="small">
                {showPassword ? <VisibilityOffRoundedIcon fontSize="small" /> : <VisibilityRoundedIcon fontSize="small" />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Box sx={{ alignSelf: 'flex-end', mt: 1, mb: 2 }}>
        <Link to="/forget-password" style={{ textDecoration: 'none' }}>
          <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: 'primary.main', '&:hover': { textDecoration: 'underline' } }}>Şifremi Unuttum</Typography>
        </Link>
      </Box>

      <Button
        disabled={isSubmitting}
        type="submit"
        fullWidth
        variant="contained"
        sx={{
          mt: 2,
          mb: 2,
          py: 1.35,
          fontSize: 16,
          textTransform: 'none',
          fontWeight: 700,
          letterSpacing: '0.02em',
          position: 'relative',
          boxShadow: '0 10px 24px rgba(88, 41, 49, 0.35)',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 14px 28px rgba(88, 41, 49, 0.42)',
          },
        }}
      >
        {isSubmitting ? (
          <>
            <CircularProgress size={20} sx={{ position: 'absolute', left: '50%', ml: -1.5, color: 'inherit' }} />
            <span style={{ visibility: 'hidden' }}>Giriş Yap</span>
          </>
        ) : (
          'Giriş Yap'
        )}
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
