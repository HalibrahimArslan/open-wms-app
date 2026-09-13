import { Box, Button, Container, Typography } from '@mui/material'
import { keyframes } from '@mui/system'
import { useNavigate } from 'react-router-dom'
import Seo from '../Seo'
import FitItem from '../../../components/Layout/FitItem'

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`

export default function PageNotFound() {
  const navigate = useNavigate()

  return (
    <FitItem>
      <Seo title="Sayfa Bulunamadı" />
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" sx={{ height: 'auto', overflow: 'hidden', px: 2 }}>
        <Container maxWidth="sm" disableGutters>
          <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" gap={2}>
            <Box
              component="img"
              src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
              alt="404"
              sx={{
                width: '100%',
                maxWidth: 560,
                height: 'auto',
                borderRadius: 3,
              }}
            />
            <Box sx={{ animation: `${fadeUp} 0.6s ease-out 0.2s both` }}>
              <Typography variant="h5" fontWeight={600} color="text.primary">
                Sayfa Bulunamadı
              </Typography>
            </Box>
            <Box sx={{ animation: `${fadeUp} 0.6s ease-out 0.4s both` }}>
              <Typography variant="body1" color="text.secondary">
                Aradığınız sayfa taşınmış, silinmiş ya da hiç var olmamış olabilir.
              </Typography>
            </Box>
            <Box sx={{ animation: `${fadeUp} 0.6s ease-out 0.6s both` }}>
              <Button variant="contained" size="large" onClick={() => navigate('/')} sx={{ px: 4, borderRadius: 2 }}>
                Ana Sayfaya Dön
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </FitItem>
  )
}
