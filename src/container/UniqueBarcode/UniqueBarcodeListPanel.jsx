import React, { useEffect, useState } from 'react'
import { Box, Checkbox, Divider, Drawer, FormControlLabel, IconButton, Stack, SwipeableDrawer, Typography, useMediaQuery, useTheme } from '@mui/material'
import QrCode2Icon from '@mui/icons-material/QrCode2'
import CloseIcon from '@mui/icons-material/Close'
import PrintIcon from '@mui/icons-material/Print'
import Barcode from 'react-barcode'
import LoadingButton from '../../components/Button/LoadingButton'

// description backend'de M2 için { en, boy } objesi, diğerlerinde string olabilir.
function formatDescription(description) {
  if (!description) return ''
  if (typeof description === 'object') {
    const { en, boy } = description
    if (en != null && boy != null) return `${en} × ${boy}`
    return ''
  }
  return String(description)
}

function BarcodeCard({ code, quantity, description, showQuantity, selected, onToggle }) {
  const descText = formatDescription(description)
  return (
    <Box
      onClick={onToggle}
      sx={{
        position: 'relative',
        border: '2px solid',
        borderColor: selected ? 'primary.main' : 'divider',
        borderRadius: 1,
        p: 1,
        cursor: 'pointer',
        bgcolor: selected ? 'action.selected' : 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0.5,
        overflow: 'hidden',
        transition: 'border-color 120ms, background-color 120ms',
      }}
    >
      <Checkbox size="small" checked={selected} onClick={(e) => e.stopPropagation()} onChange={onToggle} sx={{ position: 'absolute', top: 2, right: 2, p: 0.5 }} />
      <Barcode value={code} width={1.2} height={40} fontSize={10} margin={0} displayValue={true} />
      {(showQuantity && quantity != null) || descText ? (
        <Stack
          direction="row"
          spacing={1}
          sx={{
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {showQuantity && quantity != null && (
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
              }}
            >
              Miktar: <b>{quantity}</b>
            </Typography>
          )}
          {descText && (
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
              }}
            >
              {descText}
            </Typography>
          )}
        </Stack>
      ) : null}
    </Box>
  )
}

function PanelHeader({ product, onClose }) {
  return (
    <Stack
      direction="row"
      sx={{
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 1,
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: 'flex-start',
        }}
      >
        <QrCode2Icon color="primary" sx={{ mt: 0.3 }} />
        <Box>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
            }}
          >
            {product ? `${product.stokAdi} (${product.stokKodu})` : 'Okutulan Barkodlar'}
          </Typography>
          {product && (
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
              }}
            >
              Ürün Barkod: <b>{product.barkod}</b>
            </Typography>
          )}
        </Box>
      </Stack>
      {onClose && (
        <IconButton size="small" onClick={onClose} aria-label="Kapat">
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
    </Stack>
  )
}

function PanelContent({ product, scannedBarcodes, selected, onToggle }) {
  // Lot'lu üründe miktar barkod bazında tutulmaz; sadece description gösterilir.
  const showQuantity = !product?.lotBasedTracking
  if (!product) {
    return (
      <Box sx={{ height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
          }}
        >
          Barkodları görmek için yukarıdan bir ürün seçiniz.
        </Typography>
      </Box>
    )
  }
  if (scannedBarcodes.length === 0) {
    return (
      <Box sx={{ height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
          }}
        >
          Bu ürün için henüz okutulan barkod yok.
        </Typography>
      </Box>
    )
  }
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 1,
      }}
    >
      {scannedBarcodes.map((b) => (
        <BarcodeCard
          key={b.code}
          code={b.code}
          quantity={b.raw?.quantity}
          description={b.raw?.description}
          showQuantity={showQuantity}
          selected={selected.has(b.code)}
          onToggle={() => onToggle(b.code)}
        />
      ))}
    </Box>
  )
}

function PanelFooter({ scannedBarcodes, selected, allSelected, someSelected, onToggleAll, onPrint, printing }) {
  if (scannedBarcodes.length === 0) return null
  return (
    <Box
      sx={{
        borderTop: '1px solid',
        borderColor: 'divider',
        px: 2,
        py: 1.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1,
        bgcolor: 'background.paper',
      }}
    >
      <FormControlLabel
        control={<Checkbox size="small" checked={allSelected} indeterminate={someSelected} onChange={onToggleAll} />}
        label={<Typography variant="body2">{allSelected ? 'Seçimi Temizle' : 'Tümünü Seç'}</Typography>}
      />
      <LoadingButton loading={printing} disabled={selected.size === 0} onClick={onPrint} text={`Yazdır (${selected.size})`} endIcon={<PrintIcon />} />
    </Box>
  )
}

export default function UniqueBarcodeListPanel({ open = false, onClose, product, barcodes = [], onPrint, printing = false }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const scannedBarcodes = barcodes.filter((b) => b.used)

  const [selected, setSelected] = useState(() => new Set())

  // Ürün değişince veya drawer açılışında seçim sıfırlanır.
  useEffect(() => {
    setSelected(new Set())
  }, [product?.stokKodu, open])

  const toggle = (code) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(code) ? next.delete(code) : next.add(code)
      return next
    })
  }

  const allSelected = scannedBarcodes.length > 0 && selected.size === scannedBarcodes.length
  const someSelected = selected.size > 0 && !allSelected

  const toggleAll = () => {
    setSelected(allSelected ? new Set() : new Set(scannedBarcodes.map((b) => b.code)))
  }

  const handlePrint = () => {
    onPrint?.(scannedBarcodes.filter((b) => selected.has(b.code)))
  }

  const content = <PanelContent product={product} scannedBarcodes={scannedBarcodes} selected={selected} onToggle={toggle} />
  const footer = (
    <PanelFooter
      scannedBarcodes={scannedBarcodes}
      selected={selected}
      allSelected={allSelected}
      someSelected={someSelected}
      onToggleAll={toggleAll}
      onPrint={handlePrint}
      printing={printing}
    />
  )

  if (isMobile) {
    return (
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={onClose}
        onOpen={() => {}}
        disableSwipeToOpen
        slotProps={{
          paper: {
            sx: {
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              maxHeight: '85dvh',
              display: 'flex',
              flexDirection: 'column',
            },
          },
        }}
      >
        {/* Puller tutamaç */}
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
          <Box sx={{ width: 40, height: 5, borderRadius: 3, bgcolor: 'divider' }} />
        </Box>

        {/* Sticky başlık */}
        <Box sx={{ position: 'sticky', top: 0, zIndex: 1, bgcolor: 'background.paper', px: 2, pt: 1.5, pb: 1 }}>
          <PanelHeader product={product} onClose={onClose} />
          <Divider sx={{ mt: 1.5 }} />
        </Box>

        {/* İçerik - aşağı doğru overflow */}
        <Box sx={{ flex: 1, overflowY: 'auto', px: 2, pb: 2 }}>{content}</Box>

        {footer}
      </SwipeableDrawer>
    )
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: 420,
            maxWidth: '100vw',
            display: 'flex',
            flexDirection: 'column',
          },
        },
      }}
    >
      {/* Sabit başlık */}
      <Box sx={{ px: 2, pt: 2, pb: 1 }}>
        <PanelHeader product={product} onClose={onClose} />
        <Divider sx={{ mt: 1.5 }} />
      </Box>

      {/* İçerik - aşağı doğru overflow */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 2, pb: 2 }}>{content}</Box>

      {footer}
    </Drawer>
  )
}
