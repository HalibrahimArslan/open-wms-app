import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import useAuthHeader from '../../../hooks/useAuthHeader'
import useDebounce from '../../../hooks/useDebounce'
import { searchStockInfo } from '../../../services/StockInfoService'
import { notify } from '../../../layout/Layout'
import { buildLotBarcode, normalizeStockItem } from './lotProductMock'

export default function LotProductAddDialog({ open, onClose, onConfirm, companyCode }) {
  const headers = useAuthHeader()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const debouncedSearch = useDebounce(search, 500)

  useEffect(() => {
    if (open) {
      setSearch('')
      setSelected(null)
      setResults([])
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    let active = true

    async function fetchResults() {
      setLoading(true)
      try {
        const { data } = await searchStockInfo(headers, debouncedSearch, companyCode)
        if (!active) return
        setResults(Array.isArray(data) ? data.map(normalizeStockItem) : [])
      } catch (error) {
        if (active) notify(error.message)
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchResults()
    return () => {
      active = false
    }
  }, [open, debouncedSearch, headers, companyCode])

  const previewBarcode = selected ? buildLotBarcode(selected.anaBarkod) : ''

  const handleConfirm = () => {
    if (!selected) return
    onConfirm?.({ ...selected, isLotlu: true, uniqueBarcode: previewBarcode })
  }

  const labelRow = (label, value) => (
    <Stack direction="row" spacing={1}>
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          minWidth: 70,
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
        }}
      >
        :
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontWeight: 600,
        }}
      >
        {value}
      </Typography>
    </Stack>
  )

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      slotProps={{
        paper: { sx: { borderRadius: 2 } },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', pr: 6 }}>
        Ürün Ekle
        <IconButton onClick={onClose} size="small" sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2}>
          <TextField
            fullWidth
            size="small"
            placeholder="Stok Kodu veya Ürün Adı"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              },
            }}
          />

          <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, maxHeight: 180, overflowY: 'auto' }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 1.5 }}>
                <CircularProgress size={20} />
              </Box>
            ) : results.length === 0 ? (
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  p: 1.5,
                  textAlign: 'center',
                }}
              >
                Sonuç bulunamadı
              </Typography>
            ) : (
              <List dense disablePadding>
                {results.map((p) => (
                  <ListItemButton key={p.rowKey} selected={selected?.rowKey === p.rowKey} onClick={() => setSelected(p)}>
                    <Stack>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                        }}
                      >
                        {p.stokAdi}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                        }}
                      >
                        {p.stokKodu}
                        {p.isLotlu ? ' • Lot’lu' : ''}
                      </Typography>
                    </Stack>
                  </ListItemButton>
                ))}
              </List>
            )}
          </Box>

          {selected && (
            <>
              <Divider />
              <Stack spacing={0.5}>
                {labelRow('Stok Kodu', selected.stokKodu)}
                {labelRow('Ürün Adı', selected.stokAdi)}
              </Stack>
              <Stack spacing={0.75}>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                  }}
                >
                  Oluşturulan Barkod
                </Typography>
                <Box
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    px: 1.5,
                    py: 1,
                    textAlign: 'center',
                    fontFamily: 'monospace',
                    letterSpacing: 1,
                    bgcolor: 'action.hover',
                  }}
                >
                  {previewBarcode}
                </Box>
              </Stack>
            </>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, justifyContent: 'center' }}>
        <Button onClick={handleConfirm} variant="contained" disabled={!selected} sx={{ minWidth: 160 }}>
          Onayla
        </Button>
      </DialogActions>
    </Dialog>
  )
}
