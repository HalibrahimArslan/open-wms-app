import { Box, Stack, Typography } from '@mui/material'
import BRAND from '../../config/brand'
import BrandMark from './BrandMark'

/**
 * Urun logosu. Kurulumda REACT_APP_BRAND_LOGO_URL tanimliysa musterinin kendi
 * gorseli basilir, aksi halde vektorel marka isareti ve marka adi cizilir.
 *
 * variant: 'full' isaret + yazi, 'mark' yalnizca isaret.
 */
const BrandLogo = ({ variant = 'full', size = 40, showTagline = true, sx }) => {
  if (BRAND.logoUrl) {
    return <Box component="img" src={BRAND.logoUrl} alt={BRAND.name} sx={{ height: size, width: 'auto', maxWidth: '100%', ...sx }} />
  }

  if (variant === 'mark') {
    return (
      <Box sx={{ display: 'flex', ...sx }}>
        <BrandMark size={size} />
      </Box>
    )
  }

  return (
    <Stack direction={'row'} alignItems={'center'} spacing={1.5} sx={sx}>
      <BrandMark size={size} />
      <Box>
        <Typography
          component="span"
          sx={{
            display: 'block',
            fontSize: size * 0.62,
            lineHeight: 1.1,
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: 'primary.main',
          }}
        >
          {BRAND.name}
        </Typography>
        {showTagline && BRAND.tagline && (
          <Typography
            component="span"
            sx={{
              display: 'block',
              fontSize: Math.max(size * 0.22, 10),
              lineHeight: 1.3,
              fontWeight: 500,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'text.secondary',
              whiteSpace: 'nowrap',
            }}
          >
            {BRAND.tagline}
          </Typography>
        )}
      </Box>
    </Stack>
  )
}

export default BrandLogo
