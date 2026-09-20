import { useMemo, useState } from 'react'
import { Box, Card, Chip, Collapse, IconButton, LinearProgress, Stack, Tooltip, Typography, useTheme } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'

/**
 * Kutu gorunumundeki tek urun karti.
 *
 * Kart ustte urunu (stok kodu, barkod, ad), ortada toplama ilerlemesini,
 * altta urunun bulundugu adresleri gosterir. Uc blok her kartta ayni sirada
 * ve ayni yerde durur; kartlar esit yukseklikte oldugu icin izgarada satirlar
 * hizali kalir.
 *
 * Ilerleme cubugu sabit mavi (#1a90ff) ile ciziliyordu, yani markanin disinda
 * bir renkti ve karanlik temada da degismiyordu. Artik durumdan geliyor:
 * tamamlandiysa yesil, devam ediyorsa marka rengi.
 */
export default function PickingCard({ item, adresList }) {
  const theme = useTheme()
  const [expanded, setExpanded] = useState(false)

  const ordered = Number(item.siparisMiktar) || 0
  const picked = Number(item.teslimMiktar) || 0
  // Siparis miktari 0 gelebiliyor; bolme dogrudan yapilirsa deger NaN oluyor
  // ve LinearProgress sessizce bos cubuk ciziyor.
  const percent = ordered > 0 ? Math.min(100, Math.max(0, (picked / ordered) * 100)) : 0
  const isComplete = ordered > 0 && picked >= ordered

  const addresses = useMemo(() => (adresList ?? []).filter((address) => address.stockCode === item.stokKodu), [adresList, item.stokKodu])

  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: theme.radius.card,
        borderColor: isComplete ? theme.palette.success.main : theme.palette.border.subtle,
        backgroundColor: 'background.paper',
        textAlign: 'left',
      }}
    >
      <Box sx={{ padding: 1.75, display: 'flex', flexDirection: 'column', gap: 1.5, flexGrow: 1 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start' }}>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }} noWrap>
              {item.stokKodu}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap component="div">
              {item.barkod}
            </Typography>
          </Box>
          {isComplete && (
            <Tooltip title="Toplama tamamlandı">
              <CheckCircleRoundedIcon fontSize="small" sx={{ color: 'success.main', flexShrink: 0 }} />
            </Tooltip>
          )}
        </Stack>

        {/* Urun adi iki satirda kirpilir. Onceden 40 karakterde kesilip sonuna
            her zaman ".." ekleniyordu; kisa adlar da kesilmis gorunuyordu. */}
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: 34,
          }}
        >
          {item.stokAdi}
        </Typography>

        <Box sx={{ marginTop: 'auto' }}>
          <Stack direction="row" sx={{ alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 0.5 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Toplanan
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              {picked} / {ordered}
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={percent}
            sx={{
              height: 8,
              borderRadius: theme.radius.control,
              backgroundColor: theme.palette.surface.subtle,
              '& .MuiLinearProgress-bar': {
                borderRadius: theme.radius.control,
                backgroundColor: isComplete ? theme.palette.success.main : theme.palette.primary.main,
              },
            }}
          />
        </Box>
      </Box>

      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: 'center',
          paddingX: 1.75,
          paddingY: 0.75,
          borderTop: `1px solid ${theme.palette.border.subtle}`,
        }}
      >
        <PlaceOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
        <Typography variant="caption" sx={{ color: 'text.secondary', flexGrow: 1 }}>
          {addresses.length > 0 ? `${addresses.length} adres` : 'Adres yok'}
        </Typography>
        {addresses.length > 0 && (
          <IconButton
            size="small"
            onClick={() => setExpanded((prev) => !prev)}
            aria-expanded={expanded}
            aria-label={expanded ? 'Adresleri gizle' : 'Adresleri göster'}
            sx={{
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: theme.transitions.create('transform', { duration: theme.transitions.duration.shortest }),
            }}
          >
            <ExpandMoreIcon fontSize="small" />
          </IconButton>
        )}
      </Stack>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box
          sx={{
            maxHeight: 120,
            overflowY: 'auto',
            padding: 1.25,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 0.75,
            backgroundColor: theme.palette.surface.subtle,
          }}
        >
          {addresses.map((address) => (
            <Chip key={address.id ?? address.address} size="small" label={address.address} sx={{ borderRadius: theme.radius.control }} />
          ))}
        </Box>
      </Collapse>
    </Card>
  )
}
