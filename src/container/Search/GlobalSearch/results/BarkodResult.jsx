import { Box, Stack, Typography } from '@mui/material'
import QrCodeRoundedIcon from '@mui/icons-material/QrCodeRounded'
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded'
import NumbersRoundedIcon from '@mui/icons-material/NumbersRounded'
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded'
import GlobalSearchResultCard, { ResultChip } from '../GlobalSearchResultCard'
import EmptyResult from './EmptyResult'

function parseDepoMiktar(description) {
  if (!description) return []
  return description
    .split(',')
    .map((item) => {
      const colonIdx = item.lastIndexOf(':')
      if (colonIdx === -1) return null
      return { name: item.substring(0, colonIdx).trim(), qty: Number(item.substring(colonIdx + 1).trim()) || 0 }
    })
    .filter(Boolean)
}

function MikroMiktarSection({ totalQty, description }) {
  const items = parseDepoMiktar(description)
  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1} sx={{ flexWrap: 'wrap', rowGap: 0.5 }}>
        <Stack direction="row" alignItems="center" gap={0.8} sx={{ color: 'text.secondary', minWidth: 0 }}>
          <NumbersRoundedIcon fontSize="small" />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Mikro Miktar
          </Typography>
        </Stack>
        <ResultChip color={qtyChipColor(totalQty)} label={totalQty ?? 0} />
      </Stack>
      {items.length > 0 && (
        <Stack direction="row" flexWrap="wrap" gap={0.7} justifyContent="flex-start" alignItems="stretch" sx={{ mt: 1.2 }}>
          {items.map((item, i) => {
            const active = item.qty > 0
            return (
              <Box
                key={i}
                sx={{
                  px: 1,
                  py: 0.7,
                  borderRadius: 1.2,
                  border: '1px solid',
                  borderColor: active ? 'success.main' : 'divider',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  width: 110,
                  minHeight: 56,
                }}
              >
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.6rem', display: 'block', lineHeight: 1.3, textAlign: 'center', fontWeight: 600 }}>
                  {item.name}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 800, color: active ? 'success.dark' : 'text.disabled', textAlign: 'center' }}>
                  {item.qty}
                </Typography>
              </Box>
            )
          })}
        </Stack>
      )}
    </Box>
  )
}

function qtyChipColor(qty) {
  if (!qty || qty <= 0) return 'default'
  if (qty < 5) return 'warning'
  return 'success'
}

export default function BarkodResult({ data }) {
  const products = data?.products || []
  const addresses = data?.addresses || []

  if (products.length === 0) {
    return <EmptyResult msg="Bu barkoda ait ürün bulunamadı." />
  }

  return (
    <Stack spacing={1.5}>
      {products.map((product, idx) => {
        const totalQty = addresses.reduce((acc, a) => acc + (a.miktar || 0), 0)
        return (
          <GlobalSearchResultCard
            key={`${product.barkod}-${idx}`}
            icon={<QrCodeRoundedIcon />}
            typeLabel="Barkod Eşleşmesi"
            title={product.stokAdi || '-'}
            subtitle={product.stokKodu}
            headerChip={<ResultChip color="primary" variant="outlined" label={product.barkod} />}
            rows={[
              {
                icon: <Inventory2RoundedIcon fontSize="small" />,
                label: 'Stok Kodu',
                value: <ResultChip color="primary" variant="outlined" label={product.stokKodu || '-'} />,
              },
              {
                icon: <LocationOnRoundedIcon fontSize="small" />,
                label: 'Adresteki Toplam',
                value: <ResultChip color={qtyChipColor(totalQty)} label={totalQty} />,
              },
            ]}
            extra={<MikroMiktarSection totalQty={product.depodakiMiktar} description={product.description} />}
          />
        )
      })}

      {addresses.length > 0 && (
        <Box>
          <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 700 }}>
            Bulunduğu Adresler ({addresses.length})
          </Typography>
          <Stack spacing={0.8} mt={0.5}>
            {addresses.map((a, i) => (
              <Stack
                key={i}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                gap={1}
                sx={{
                  px: 1.5,
                  py: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1.5,
                  flexWrap: 'wrap',
                }}
              >
                <Stack direction="row" alignItems="center" gap={0.8} sx={{ minWidth: 0 }}>
                  <LocationOnRoundedIcon fontSize="small" color="action" />
                  <Typography variant="body2" sx={{ fontWeight: 600, wordBreak: 'break-word' }}>
                    {a?.urunAdres?.adres || '-'}
                  </Typography>
                </Stack>
                <ResultChip color={qtyChipColor(a.miktar)} label={a.miktar ?? 0} sx={{ flexShrink: 0 }} />
              </Stack>
            ))}
          </Stack>
        </Box>
      )}
    </Stack>
  )
}
