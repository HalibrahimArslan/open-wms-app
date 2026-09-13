import { useState } from 'react'
import { Alert, Box, Button, CircularProgress, Stack, Typography } from '@mui/material'
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded'
import QrCodeRoundedIcon from '@mui/icons-material/QrCodeRounded'
import NumbersRoundedIcon from '@mui/icons-material/NumbersRounded'
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded'
import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded'
import SearchOffRoundedIcon from '@mui/icons-material/SearchOffRounded'
import GlobalSearchResultCard, { ResultChip } from '../GlobalSearchResultCard'
import { produceBarkod } from '../../../../services/MikroService'
import useAuthHeader from '../../../../hooks/useAuthHeader'
import { notify, notifyError } from '../../../../layout/Layout'

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

function useProduceBarkod() {
  const headers = useAuthHeader()
  const [generating, setGenerating] = useState(false)
  const [generatedBarcode, setGeneratedBarcode] = useState(null)

  const generate = async (stokKodu) => {
    if (!stokKodu) {
      notifyError('Stok kodu bulunamadı.')
      return
    }
    try {
      setGenerating(true)
      const res = await produceBarkod(headers, stokKodu)
      if (res) {
        const cleaned = String(res).trim()
        setGeneratedBarcode(cleaned)
        notify(`Barkod oluşturuldu: ${cleaned}`)
      }
    } catch (e) {
      notifyError(e.message)
    } finally {
      setGenerating(false)
    }
  }

  return { generating, generatedBarcode, generate }
}

function ProduceBarcodeButton({ stokKodu, generating, onClick, fullWidth }) {
  return (
    <Button
      variant="contained"
      color="primary"
      size="small"
      fullWidth={fullWidth}
      disabled={generating || !stokKodu}
      onClick={() => onClick(stokKodu)}
      startIcon={generating ? <CircularProgress size={14} color="inherit" /> : <AutoFixHighRoundedIcon />}
    >
      {generating ? 'Oluşturuluyor...' : 'Barkod Oluştur'}
    </Button>
  )
}

function StokCard({ product, totalQty, generating, generatedBarcode, onGenerate }) {
  const effectiveBarcode = generatedBarcode ?? product.barkod
  const hasBarcode = effectiveBarcode && String(effectiveBarcode).trim() !== ''

  return (
    <GlobalSearchResultCard
      icon={<Inventory2RoundedIcon />}
      typeLabel="Stok Kodu Eşleşmesi"
      title={product.stokAdi || '-'}
      subtitle={product.stokKodu}
      headerChip={
        hasBarcode ? <ResultChip color="primary" variant="outlined" label={effectiveBarcode} icon={<QrCodeRoundedIcon />} /> : <ResultChip color="warning" label="Barkodsuz" />
      }
      rows={[
        {
          icon: <LocationOnRoundedIcon fontSize="small" />,
          label: 'Adresteki Toplam',
          value: <ResultChip color={qtyChipColor(totalQty)} label={totalQty} />,
        },
      ]}
      extra={<MikroMiktarSection totalQty={product.depodakiMiktar} description={product.description} />}
      footer={<ProduceBarcodeButton stokKodu={product.stokKodu} generating={generating} onClick={onGenerate} />}
    />
  )
}

function NotFoundWithProduce({ stokKodu, generating, generatedBarcode, onGenerate }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1.5,
        py: 4,
        px: 2,
        border: '1px dashed',
        borderColor: 'divider',
        borderRadius: 2,
      }}
    >
      <SearchOffRoundedIcon sx={{ fontSize: 40, color: 'text.secondary', opacity: 0.6 }} />
      <Stack alignItems="center" spacing={0.5}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          Stok Detay Bilgisi Bulunamadı
        </Typography>
        <Typography variant="caption" color="text.secondary" textAlign="center">
          {stokKodu ? `${stokKodu} koduna ait Mikro stok detayı yok.` : 'Aradığın stok koduna ait detay yok.'}
          <br />
          Yine de bu kod için yeni bir barkod oluşturabilirsin.
        </Typography>
      </Stack>
      {generatedBarcode ? (
        <ResultChip color="success" label={generatedBarcode} icon={<QrCodeRoundedIcon />} />
      ) : (
        <ProduceBarcodeButton stokKodu={stokKodu} generating={generating} onClick={onGenerate} />
      )}
    </Box>
  )
}

export default function StokResult({ data, query }) {
  const products = data?.products || []
  const addresses = data?.addresses || []
  const mikroError = data?.mikroError || null
  const { generating, generatedBarcode, generate } = useProduceBarkod()

  if (products.length === 0) {
    return (
      <Stack spacing={1.5}>
        {mikroError && <Alert severity="warning">{mikroError}</Alert>}
        <NotFoundWithProduce stokKodu={query} generating={generating} generatedBarcode={generatedBarcode} onGenerate={generate} />
      </Stack>
    )
  }

  const totalQty = addresses.reduce((acc, a) => acc + (a.miktar || 0), 0)

  return (
    <Stack spacing={1.5}>
      {mikroError && <Alert severity="warning">{mikroError}</Alert>}
      {products.map((product, idx) => (
        <StokCard
          key={`${product.stokKodu}-${idx}`}
          product={product}
          totalQty={totalQty}
          generating={generating}
          generatedBarcode={idx === 0 ? generatedBarcode : null}
          onGenerate={generate}
        />
      ))}

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
