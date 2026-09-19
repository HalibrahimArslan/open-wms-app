import { Box, Stack, Typography } from '@mui/material'
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded'
import QrCodeRoundedIcon from '@mui/icons-material/QrCodeRounded'
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded'
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded'
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded'

const HINTS = [
  { icon: <QrCodeRoundedIcon fontSize="small" />, label: 'Barkod', desc: '13 haneli sayı veya 999999 ile başlayan palet' },
  { icon: <Inventory2RoundedIcon fontSize="small" />, label: 'Stok Kodu', desc: 'Sayı ve nokta — örn. 11.01.002' },
  { icon: <LocationOnRoundedIcon fontSize="small" />, label: 'Adres', desc: '6 karakter — örn. J00103, Z0Z002' },
  { icon: <ReceiptLongRoundedIcon fontSize="small" />, label: 'Sipariş', desc: 'SERI-SIRA — örn. A-12345' },
]

export default function UnknownResult({ hint }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1.5,
        py: 3,
      }}
    >
      <HelpOutlineRoundedIcon sx={{ fontSize: 40, color: 'text.secondary', opacity: 0.6 }} />
      <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
        {hint || 'Girdi tipi tanımlanamadı. Aşağıdaki formatlardan birini deneyin:'}
      </Typography>
      <Stack
        spacing={1}
        sx={{
          width: '100%',
          maxWidth: 480,
          mt: 1,
        }}
      >
        {HINTS.map((h, i) => (
          <Stack
            key={i}
            direction="row"
            sx={{
              alignItems: 'center',
              gap: 1.2,
              px: 1.5,
              py: 1,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1.5,
            }}
          >
            <Box sx={{ color: 'primary.main' }}>{h.icon}</Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {h.label}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                }}
              >
                {h.desc}
              </Typography>
            </Box>
          </Stack>
        ))}
      </Stack>
    </Box>
  )
}
