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
 */
export default function EmptyState({ title, description, icon, action, dense = false, sx }) {
  const theme = useTheme()
  const iconSize = dense ? 36 : 52

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
