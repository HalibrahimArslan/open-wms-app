import { Box, Paper } from '@mui/material'
import Seo from '../../shared/components/Seo'
import './login.css'
import BrandLogo from '../../components/Brand/BrandLogo'

const AuthView = (props) => {
  return (
    <Box className="login">
      <Seo title={'Giriş Yap'} />
      <Paper
        sx={{
          padding: '3rem',
          borderRadius: (theme) => theme.shape.borderRadius,
        }}
      >
        <BrandLogo size={56} sx={{ justifyContent: 'center', marginBottom: '2rem' }} />
        {props.children}
      </Paper>
    </Box>
  )
}

export default AuthView
