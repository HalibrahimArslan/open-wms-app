import { Box, Chip, Stack, Typography, useTheme } from '@mui/material'
import PickingCard from './PickingCard'

/**
 * Kutu gorunumunde bir parcali urun grubu: ust satirda ana urun, altinda o
 * ana uruna bagli parcalarin kartlari.
 *
 * Grup basligi "Parçalı Ürün" yazan, 270 derece dondurulmus ve kutunun 50
 * piksel soluna tasirilmis bir etiketti. Solda yer olmadigi icin ya kirpiliyor
 * ya da sayfa govdesinin uzerine biniyordu; ustelik dikey konumu yuzdeyle
 * ayarlandigi icin grup buyudukce kayiyordu. Etiket artik basligin icinde,
 * duz duran bir cip.
 */
export default function PickingItem({ list, master, adresList }) {
  const theme = useTheme()

  const items = (list ?? []).filter((item) => item.pieceMaster?.stokKodu === master)
  const pieceMaster = items[0]?.pieceMaster

  if (items.length === 0) {
    return null
  }

  return (
    <Box
      sx={{
        marginBottom: 2,
        borderRadius: theme.radius.section,
        border: `1px solid ${theme.palette.border.subtle}`,
        backgroundColor: theme.palette.surface.subtle,
        overflow: 'hidden',
      }}
    >
      <Stack
        direction="row"
        spacing={1.5}
        sx={{
          alignItems: 'center',
          paddingX: 2,
          paddingY: 1.25,
          borderBottom: `1px solid ${theme.palette.border.subtle}`,
        }}
      >
        <Chip size="small" color="primary" label="Parçalı Ürün" sx={{ borderRadius: theme.radius.control, fontWeight: 700, flexShrink: 0 }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 700, flexShrink: 0 }}>
          {pieceMaster?.stokKodu}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', minWidth: 0 }} noWrap>
          {pieceMaster?.stokAdi}
        </Typography>
      </Stack>

      {/* Parcalar yan yana kayar. Onceden ortak kaydirma bileseni kullaniliyordu
          ama o bilesen sabit bir DOM id'si tasiyor; sayfada birden fazla
          parcali urun oldugunda ayni id tekrar ediyordu. */}
      <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', padding: 2 }}>
        {items.map((item) => (
          <Box key={item.id} sx={{ flex: '0 0 260px' }}>
            <PickingCard item={item} adresList={adresList} />
          </Box>
        ))}
      </Box>
    </Box>
  )
}
