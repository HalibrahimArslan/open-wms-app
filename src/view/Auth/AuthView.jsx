import { useEffect, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import FormatQuoteRoundedIcon from '@mui/icons-material/FormatQuoteRounded'
import './login.css'
import BrandLogo from '../../components/Brand/BrandLogo'
import BrandMark from '../../components/Brand/BrandMark'
import BRAND from '../../config/brand'

/**
 * Giris ekraninin sol panelinde donen memnuniyet yorumlari.
 *
 * Buradaki metinler ORNEK icerik: gercek bir musteriye ait degildir. Kurulum
 * canliya alinirken kendi musteri yorumlarinizla degistirin, aksi halde
 * dogrulanmamis referanslar yayinlamis olursunuz.
 */
const TESTIMONIALS = [
  {
    quote: 'Mal kabulden sevkiyata kadar her adımı tek ekrandan takip ediyoruz; gün sonu kapanışı dakikalar sürüyor.',
    author: 'Depo Müdürü',
  },
  {
    quote: 'Barkod okutma akışı o kadar akıcı ki sahadaki ekip yarım günde alıştı.',
    author: 'Depo Sorumlusu',
  },
  {
    quote: 'Stok doğruluğumuz görünür şekilde arttı, sayım farklarını artık konuşmuyoruz.',
    author: 'Operasyon Direktörü',
  },
]

const ROTATION_MS = 7000

const AuthView = ({ title = 'Hoş geldiniz', subtitle = 'Devam etmek için hesabınıza giriş yapın.', children }) => {
  const [activeQuote, setActiveQuote] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setActiveQuote((current) => (current + 1) % TESTIMONIALS.length), ROTATION_MS)
    return () => clearInterval(timer)
  }, [])

  const testimonial = TESTIMONIALS[activeQuote]

  return (
    <Box className="login">
      <Box className="login-visual">
        <span className="login-orb login-orb--warm" />
        <span className="login-orb login-orb--coral" />
        <span className="login-orb login-orb--rose" />
        <Box className="login-shine" />

        <Stack className="login-brand" spacing={2.5} alignItems={'center'}>
          <Box className="login-mark">
            <BrandMark size={120} color="#FFFFFF" />
          </Box>
          <Typography className="login-title" sx={{ color: '#FFFFFF', fontSize: 58, fontWeight: 800, letterSpacing: '0.14em', lineHeight: 1 }}>
            {BRAND.name}
          </Typography>
          <Typography
            className="login-title"
            sx={{ color: 'rgba(255, 255, 255, 0.92)', fontSize: 17, fontWeight: 600, letterSpacing: '0.24em', textTransform: 'uppercase' }}
          >
            {BRAND.tagline}
          </Typography>
        </Stack>

        <Box className="login-quotes">
          <FormatQuoteRoundedIcon sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 44 }} />

          <Box key={activeQuote} className="login-quote login-title">
            <Typography sx={{ color: '#FFFFFF', fontSize: 21, lineHeight: 1.6, fontWeight: 600 }}>{testimonial.quote}</Typography>
            <Typography
              sx={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: 13, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: '0.9rem' }}
            >
              {testimonial.author}
            </Typography>
          </Box>

          <Stack direction={'row'} spacing={1} justifyContent={'center'} sx={{ marginTop: '1.25rem' }}>
            {TESTIMONIALS.map((item, index) => (
              <Box
                key={item.author}
                component="button"
                type="button"
                aria-label={`${index + 1}. yorumu göster`}
                onClick={() => setActiveQuote(index)}
                className={index === activeQuote ? 'login-dot login-dot--active' : 'login-dot'}
              />
            ))}
          </Stack>
        </Box>
      </Box>

      <Box className="login-panel" sx={{ backgroundColor: 'background.paper' }}>
        <Box className="login-form-wrap" sx={{ padding: '2.5rem 0' }}>
          <BrandLogo
            variant="stacked"
            size={48}
            sx={{ marginBottom: '1.5rem', alignItems: 'flex-start', display: { xs: 'flex', md: 'none' } }}
          />

          {/* Dar ekranda ust taraftaki dikey marka kilidi zaten adi gosteriyor. */}
          <Typography
            sx={{
              display: { xs: 'none', md: 'block' },
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: 'primary.light',
            }}
          >
            {BRAND.name}
          </Typography>
          <Typography sx={{ fontSize: 36, fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.01em', color: 'text.primary', marginTop: '0.4rem' }}>
            {title}
          </Typography>
          <Typography sx={{ fontSize: 15, lineHeight: 1.6, color: 'text.secondary', marginBottom: '1.75rem', marginTop: '0.5rem' }}>
            {subtitle}
          </Typography>

          {children}
        </Box>
      </Box>
    </Box>
  )
}

export default AuthView
