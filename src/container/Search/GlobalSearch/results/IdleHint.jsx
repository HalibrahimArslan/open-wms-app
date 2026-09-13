import { Box, Stack, Typography } from '@mui/material'
import QrCodeRoundedIcon from '@mui/icons-material/QrCodeRounded'
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded'
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded'
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded'
import ViewInArRoundedIcon from '@mui/icons-material/ViewInArRounded'
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'

const EXAMPLES = [
  { icon: <QrCodeRoundedIcon />, label: 'Barkod', example: '8690123456789' },
  { icon: <ViewInArRoundedIcon />, label: 'Palet', example: '9999991234567' },
  { icon: <Inventory2RoundedIcon />, label: 'Stok Kodu', example: '11.01.002' },
  { icon: <LocationOnRoundedIcon />, label: 'Adres', example: 'J00103' },
  { icon: <ReceiptLongRoundedIcon />, label: 'Sipariş', example: 'A-12345' },
]

export default function IdleHint() {
  return (
    <Box sx={{ py: 3 }}>
      <Stack direction="row" alignItems="center" gap={1} sx={{ color: 'text.secondary', mb: 2 }}>
        <AutoAwesomeRoundedIcon fontSize="small" />
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          Akıllı Arama — tipini otomatik tanır
        </Typography>
      </Stack>
      <Stack spacing={1}>
        {EXAMPLES.map((ex, i) => (
          <Stack
            key={i}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            gap={1.5}
            sx={{
              px: 1.5,
              py: 1,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1.5,
            }}
          >
            <Stack direction="row" alignItems="center" gap={1}>
              <Box sx={{ color: 'primary.main', display: 'flex' }}>{ex.icon}</Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {ex.label}
              </Typography>
            </Stack>
            <Typography
              variant="body2"
              sx={{
                fontFamily: 'monospace',
                color: 'text.secondary',
                bgcolor: (theme) => theme.palette.action.hover,
                px: 1,
                py: 0.4,
                borderRadius: 1,
              }}
            >
              {ex.example}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  )
}
