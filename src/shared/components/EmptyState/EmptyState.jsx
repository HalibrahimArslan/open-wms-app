import { Box, Typography, useTheme } from '@mui/material'
import InboxRoundedIcon from '@mui/icons-material/InboxRounded'

/**
 * Uygulamanin tek bos-durum bileseni.
 *
 * "Kayit bulunamadi" anlatimi eskiden ekran ekran farkliydi: kimi yerde gri bir
 * seritte duz yazi, kimi yerde ciplak Typography, kimi yerde Alert vardi.
 * Butun bu anlatimlar buraya baglandi ki her ekranda ayni dili konussun.
 *
 * dense: menu, panel, cekmece gibi dar alanlar icin daha az bosluk birakir.
 * image: ikon balonunun yerine gecen illustrasyon. Bazi bos ekranlar bir cizim
 * gosteriyordu; anlatimi ortaklastirirken cizimi atmamak icin ayri bir prop
 * olarak durur, ikonla birlikte degil onun yerine kullanilir.
 */
export default function EmptyState({ title, description, icon, image, imageAlt = '', action, dense = false, sx }) {
  const theme = useTheme()
  const iconSize = dense ? 36 : 52
  const imageSize = dense ? 120 : 168

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: dense ? 1 : 1.5,
        paddingX: 3,
        paddingY: dense ? 3 : 6,
        borderRadius: theme.radius.card,
        ...sx,
      }}
    >
      {image ? (
        <Box
          component="img"
          src={image}
          alt={imageAlt}
          sx={{
            width: imageSize,
            height: imageSize,
            maxWidth: '100%',
            borderRadius: '50%',
            objectFit: 'cover',
          }}
        />
      ) : (
        <Box
          sx={{
            width: iconSize,
            height: iconSize,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.palette.secondary.main,
            color: 'text.disabled',
            '& > *': { fontSize: iconSize * 0.52 },
          }}
        >
          {icon || <InboxRoundedIcon />}
        </Box>
      )}

      <Box>
        <Typography variant={dense ? 'body2' : 'subtitle1'} sx={{ fontWeight: 600, color: 'text.secondary' }}>
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" sx={{ color: 'text.disabled', marginTop: 0.5, maxWidth: 420 }}>
            {description}
          </Typography>
        )}
      </Box>

      {action}
    </Box>
  )
}
