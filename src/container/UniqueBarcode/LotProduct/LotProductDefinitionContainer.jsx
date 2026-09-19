import React, { useEffect, useState } from 'react'
import { Box, Button, CircularProgress, Divider, InputAdornment, TablePagination, TextField, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import { notify } from '../../../layout/Layout'
import useAuthHeader from '../../../hooks/useAuthHeader'
import useDebounce from '../../../hooks/useDebounce'
import { getStockInfo, updateProductLotTracking } from '../../../services/StockInfoService'
import { generatePatchPayload } from '../../../utils/Utils'
import { normalizeStockItem } from './lotProductMock'
import LotProductCard from './LotProductCard'
import LotProductAddDialog from './LotProductAddDialog'
import ConfirmDialog from '../../../components/Dialog/ConfirmDialog'
import { useContainer } from 'unstated-next'
import { DataStore } from '../../../store/DataStore'

export default function LotProductDefinitionContainer() {
  const headers = useAuthHeader()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const [lotProducts, setLotProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [count, setCount] = useState(0)

  const { account } = useContainer(DataStore)

  const reload = () => setReloadKey((k) => k + 1)

  useEffect(() => {
    setPage(0)
  }, [debouncedSearch])

  useEffect(() => {
    let active = true

    async function fetchStockInfo() {
      setLoading(true)
      try {
        let query = `page=${page}&size=${rowsPerPage}&companyCode.equals=${account.companyCode}&lotBasedTracking.equals=true`
        const term = debouncedSearch.trim()
        if (term) query += `&multiSearch.contains=${encodeURIComponent(term)}`

        const { data, totalCount } = await getStockInfo(headers, query)
        if (!active) return
        setLotProducts(Array.isArray(data) ? data.map(normalizeStockItem) : [])
        setCount(totalCount)
      } catch (error) {
        if (active) notify(error.message)
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchStockInfo()
    return () => {
      active = false
    }
  }, [headers, page, rowsPerPage, debouncedSearch, account.companyCode, reloadKey])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleConfirmAdd = async (product) => {
    const exists = lotProducts.some((p) => p.rowKey === product.rowKey)
    if (exists) {
      notify('Bu ürün zaten lot’lu olarak tanımlı')
      setDialogOpen(false)
      return
    }

    try {
      await updateProductLotTracking(
        generatePatchPayload({
          companyCode: product.companyCode,
          lotBasedTracking: true,
          barcode: product.anaBarkod,
        })
      )
      notify(`${product.stokKodu} lot’lu ürün olarak eklendi`)
      setDialogOpen(false)
      reload()
    } catch (error) {
      notify(error.message)
    }
  }

  const handleConfirmDelete = async () => {
    const product = deleteTarget
    if (!product) return

    try {
      await updateProductLotTracking(
        generatePatchPayload({
          companyCode: product.companyCode,
          lotBasedTracking: false,
          barcode: product.anaBarkod,
        })
      )
      notify(`${product.stokKodu} lot takibinden çıkarıldı`)
      setDeleteTarget(null)
      reload()
    } catch (error) {
      notify(error.message)
      setDeleteTarget(null)
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100dvh - 140px)' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 500,
          }}
        >
          Lot’lu Ürün Tanımlama
        </Typography>
        <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
          Ürün Ekle
        </Button>
      </Box>
      <Divider />

      <Box sx={{ mt: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Stok Kodu, Ürün Adı veya Barkod ile ara"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress size={28} />
        </Box>
      ) : lotProducts.length === 0 ? (
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            mt: 3,
            textAlign: 'center',
          }}
        >
          Henüz lot’lu ürün tanımlanmadı.
        </Typography>
      ) : (
        <Box
          sx={{
            mt: 2,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 2,
          }}
        >
          {lotProducts.map((p) => (
            <LotProductCard key={p.rowKey} product={p} onDelete={setDeleteTarget} />
          ))}
        </Box>
      )}

      <TablePagination
        sx={{ mt: 'auto' }}
        component="div"
        count={count}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10, 20, 50, 100]}
        labelRowsPerPage="Sayfa başına"
      />

      <LotProductAddDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onConfirm={handleConfirmAdd} companyCode={account.companyCode} />

      <ConfirmDialog
        dialogStatus={Boolean(deleteTarget)}
        dialogTitle="Lot Takibinden Çıkar"
        dialogContentText={deleteTarget ? `${deleteTarget.stokKodu} - ${deleteTarget.stokAdi} ürününü lot’lu takipten çıkarmak istediğinize emin misiniz?` : ''}
        handleClose={() => setDeleteTarget(null)}
        handleOperate={handleConfirmDelete}
      />
    </Box>
  )
}
