import React, { useEffect, useState } from 'react'
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, InputBase, Stack, TextField, Typography, useTheme } from '@mui/material'
import QrCode2Icon from '@mui/icons-material/QrCode2'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import CloseIcon from '@mui/icons-material/Close'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'

// Backend stokBirimi kodlarını (DB değerleri: ADET, M2, MT, KG, MTÜL, KOLİ) normalize eder.
function normalizeUnit(stokBirimi) {
  const u = (stokBirimi || '').toString().trim().toUpperCase()
  if (u === 'M2' || u === 'METREKARE') return 'M2'
  if (u === 'MTÜL' || u === 'MTUL' || u === 'METRETÜL' || u === 'METRETUL') return 'MTÜL'
  if (u === 'MT' || u === 'METRE') return 'MT'
  if (u === 'KG' || u === 'KILOGRAM') return 'KG'
  // Dübel tipli ürünler KOLİ birimiyle gelir; her koli tek barkod, barkod "koli içi adet" taşır.
  if (u === 'KOLİ' || u === 'KOLI') return 'KOLİ'
  return u || 'ADET'
}

// Birim -> popup alan(lar)ı eşlemesi (bkz. doküman Bölüm 4)
const UNIT_FIELD = {
  ADET: 'Miktar',
  MT: 'Metre',
  MTÜL: 'Metretül',
  KG: 'Kilogram',
  KOLİ: 'Koli İçi Adet',
  M2: ['En', 'Boy'],
}

const parseNum = (s) => Number(String(s).replace(',', '.'))

export default function BarcodePrintDialog({ open, onClose, row, onConfirm, loading = false }) {
  const theme = useTheme()
  const unit = normalizeUnit(row?.stokBirimi)
  // Lot'lu ürünlerde stok birimi (M2/MTÜL/KG...) alanları sorulmaz; sadece miktar alınır.
  // Bu yüzden lot kontrolü birim kontrolünden önce gelir ve akış ADET gibi işler.
  const isLot = !!row?.lotBasedTracking
  const isAdet = isLot || unit === 'ADET'
  const isArea = !isLot && unit === 'M2'
  // KOLİ (dübel): metre gibi çok satırlı giriş; her satır bir koli = 1 barkod, değer = koli içi adet (tam sayı).
  const isKoli = !isLot && unit === 'KOLİ'
  const fieldLabel = UNIT_FIELD[unit] || 'Miktar'

  // ADET: tek sayaç (backend N adet barkod üretir).
  const [miktar, setMiktar] = useState('1')
  // ADET dışı: çoklu giriş. Anlık alanlar + eklenmiş kayıtlar listesi.
  const [val, setVal] = useState('') // MT / MTÜL / KG anlık değer
  const [en, setEn] = useState('')
  const [boy, setBoy] = useState('')
  const [entries, setEntries] = useState([]) // [{ quantity, en?, boy? }]

  useEffect(() => {
    if (open) {
      setMiktar(isAdet ? '1' : '')
      setVal('')
      setEn('')
      setBoy('')
      setEntries([])
    }
  }, [open, isAdet])

  if (!row) return null

  // ---- ADET geçerlilik ----
  const adetNum = Number(miktar)
  const adetInvalid = miktar === '' || Number.isNaN(adetNum) || adetNum <= 0

  // ---- ADET dışı: anlık girişin geçerliliği ----
  const valNum = parseNum(val)
  const enNum = parseNum(en)
  const boyNum = parseNum(boy)
  const currentValid = isArea ? en !== '' && boy !== '' && enNum > 0 && boyNum > 0 : val !== '' && valNum > 0

  // Onayda, eklenmemiş ama geçerli anlık giriş de listeye dahil edilir (kullanıcı Ekle'ye basmasa bile)
  const pendingEntry = currentValid ? (isArea ? { en: String(enNum), boy: String(boyNum), quantity: enNum * boyNum } : { quantity: valNum }) : null
  const allEntries = pendingEntry ? [...entries, pendingEntry] : entries

  const isInvalid = isAdet ? adetInvalid : allEntries.length === 0

  const addEntry = () => {
    if (!currentValid) return
    setEntries((p) => [...p, pendingEntry])
    if (isArea) {
      setEn('')
      setBoy('')
    } else {
      setVal('')
    }
  }

  const removeEntry = (i) => setEntries((p) => p.filter((_, idx) => idx !== i))

  const handleConfirm = () => {
    if (isInvalid) return
    if (isAdet) {
      onConfirm([{ adet: adetNum, quantity: 1 }])
      return
    }
    // Her giriş tek barkod (adet=1); M2'de en/boy de taşınır
    onConfirm(
      allEntries.map((e) => ({
        adet: 1,
        quantity: e.quantity,
        ...(e.en != null ? { en: e.en, boy: e.boy } : {}),
      }))
    )
  }

  const adjust = (delta) => {
    const current = Number.isNaN(Number(miktar)) || miktar === '' ? 0 : Number(miktar)
    setMiktar(String(Math.max(1, current + delta)))
  }

  // ADET: pozitif tam sayı, diğerleri: pozitif ondalık (virgül de kabul)
  const handleNumericChange = (setter, integerOnly) => (e) => {
    const v = e.target.value.replace(',', '.')
    const pattern = integerOnly ? /^[0-9]*$/ : /^[0-9]*\.?[0-9]*$/
    if (v === '' || pattern.test(v)) setter(v)
  }

  const decimalField = (label, value, setter, autoFocus, onEnter, integerOnly = false) => (
    <TextField
      label={label}
      value={value}
      onChange={handleNumericChange(setter, integerOnly)}
      fullWidth
      size="small"
      autoFocus={autoFocus}
      inputProps={{ inputMode: integerOnly ? 'numeric' : 'decimal' }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          onEnter()
        }
      }}
    />
  )

  const entryLabel = (e) => (e.en != null ? `${e.en} × ${e.boy} = ${e.quantity} M2` : `${e.quantity} ${isKoli ? 'adet/koli' : unit}`)

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 2 } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, pr: 6 }}>
        <QrCode2Icon color="primary" />
        Barkod Oluştur / Yazdır
        <IconButton onClick={onClose} size="small" sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3} alignItems="stretch">
          {/* Ürün bilgi kartı */}
          <Box
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderLeft: '4px solid',
              borderLeftColor: theme.palette.primary.main,
              borderRadius: 1,
              p: 1.5,
              bgcolor: 'action.hover',
            }}
          >
            <Typography variant="subtitle1" fontWeight={600} sx={{ wordBreak: 'break-word' }}>
              {row.stokAdi}
            </Typography>
            <Stack direction="row" spacing={2} mt={0.5} flexWrap="wrap">
              <Typography variant="body2" color="text.secondary">
                Stok Kodu: <b>{row.stokKodu}</b>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Birim: <b>{unit}</b>
              </Typography>
              {isLot && <Chip size="small" color="secondary" variant="outlined" label="Lot'lu" />}
            </Stack>
          </Box>

          {/* ADET: adet stepper'ı */}
          {isAdet && (
            <Stack alignItems="center" spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Yazdırılacak Barkod Miktarı
              </Typography>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  overflow: 'hidden',
                }}
              >
                <IconButton size="small" onClick={() => adjust(-1)} disabled={Number(miktar) <= 1} sx={{ borderRadius: 0 }}>
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <Divider orientation="vertical" flexItem />
                <InputBase
                  value={miktar}
                  onChange={handleNumericChange(setMiktar, true)}
                  inputProps={{
                    inputMode: 'numeric',
                    style: { textAlign: 'center', fontSize: 18, fontWeight: 600, width: 64, padding: '6px 0' },
                  }}
                />
                <Divider orientation="vertical" flexItem />
                <IconButton size="small" onClick={() => adjust(1)} sx={{ borderRadius: 0 }}>
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>
              <Typography variant="caption" color={isInvalid ? 'error' : 'text.secondary'} sx={{ minHeight: 18 }}>
                {isInvalid ? 'En az 1 adet giriniz' : `${adetNum} adet barkod üretilecek${isLot ? '' : ' (her biri 1 ADET)'}`}
              </Typography>
            </Stack>
          )}

          {/* ADET dışı: çoklu giriş (Ekle ile barkod listesi) */}
          {!isAdet && (
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1} alignItems="flex-start">
                {isArea ? (
                  <>
                    {decimalField('En', en, setEn, true, addEntry)}
                    {decimalField('Boy', boy, setBoy, false, addEntry)}
                  </>
                ) : (
                  decimalField(fieldLabel, val, setVal, true, addEntry, isKoli)
                )}
                <Button onClick={addEntry} variant="outlined" startIcon={<AddIcon />} disabled={!currentValid} sx={{ whiteSpace: 'nowrap', mt: 0.25 }}>
                  Ekle
                </Button>
              </Stack>

              {isArea && currentValid && (
                <Typography variant="caption" color="text.secondary">
                  {`${en} × ${boy} = ${enNum * boyNum} M2`}
                </Typography>
              )}

              {/* Eklenen barkodlar */}
              {entries.length > 0 && (
                <Stack spacing={0.5}>
                  {entries.map((e, i) => (
                    <Stack
                      key={i}
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, px: 1, py: 0.25 }}
                    >
                      <Typography variant="body2">
                        #{i + 1} — {entryLabel(e)}
                      </Typography>
                      <IconButton size="small" onClick={() => removeEntry(i)}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  ))}
                </Stack>
              )}

              <Box>
                <Chip size="small" color={isInvalid ? 'default' : 'primary'} variant="outlined" label={`${allEntries.length} barkod üretilecek`} />
                {isInvalid && (
                  <Typography variant="caption" color="error" sx={{ ml: 1 }}>
                    En az bir kayıt ekleyin
                  </Typography>
                )}
              </Box>
            </Stack>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          İptal
        </Button>
        <Button onClick={handleConfirm} variant="contained" startIcon={<QrCode2Icon />} disabled={isInvalid || loading}>
          Onayla ve Yazdır
        </Button>
      </DialogActions>
    </Dialog>
  )
}
