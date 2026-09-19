import { Box, Stack, Typography, useTheme } from '@mui/material'
import BRAND from '../../config/brand'
import BrandMark from './BrandMark'

/**
 * Urun logosu. Kurulumda REACT_APP_BRAND_LOGO_URL tanimliysa musterinin kendi
 * gorseli basilir, aksi halde vektorel marka isareti ve marka adi cizilir.
 *
 * variant: 'full'    isaret + ayrac + yazi (yatay kilit)
 *          'stacked' isaret ustte, marka adi altta (dar kolonlar icin)
 *          'mark'    yalnizca isaret
 */
const BrandLogo = ({ variant = 'full', size = 40, showTagline = true, sx }) => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const nameColor = isDark ? theme.palette.secondary.contrastText : theme.palette.primary.main

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

  // Dikey kilit: sol menu gibi dar kolonlarda yatay kilit sigmadigi icin
  // marka adi isaretin altina alinir, alt baslik ise tamamen birakilir.
  if (variant === 'stacked') {
    return (
      <Stack
        spacing={0.6}
        sx={[
          {
            alignItems: 'center',
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      >
        <BrandMark size={size} />
        <Typography
          component="span"
          sx={{
            fontSize: Math.max(size * 0.3, 11),
            lineHeight: 1,
            fontWeight: 700,
            letterSpacing: '0.12em',
            color: nameColor,
          }}
        >
          {BRAND.name}
        </Typography>
      </Stack>
    )
  }

  const withTagline = showTagline && Boolean(BRAND.tagline)

  return (
    <Stack
      direction={'row'}
      spacing={1.25}
      sx={[
        {
          alignItems: 'center',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <BrandMark size={size} />

      {/* Isaret ile yaziyi ayiran ince kural: kilidi kurumsal bir butun yapar. */}
      {withTagline && (
        <Box
          sx={{
            width: '1px',
            height: size * 0.72,
            backgroundColor: isDark ? theme.palette.secondary.light : theme.palette.divider,
            flexShrink: 0,
          }}
        />
      )}

      <Box>
        <Typography
          component="span"
          sx={{
            display: 'block',
            fontSize: size * 0.58,
            lineHeight: 1,
            fontWeight: 700,
            letterSpacing: '0.1em',
            color: nameColor,
          }}
        >
          {BRAND.name}
        </Typography>
        {withTagline && (
          <Typography
            component="span"
            sx={{
              display: 'block',
              fontSize: Math.max(size * 0.2, 9.5),
              lineHeight: 1.3,
              fontWeight: 500,
              letterSpacing: '0.19em',
              textTransform: 'uppercase',
              color: 'text.secondary',
              whiteSpace: 'nowrap',
              marginTop: '4px',
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
