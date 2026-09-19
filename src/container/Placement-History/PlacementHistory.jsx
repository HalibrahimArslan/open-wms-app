import { Grid, Button, Box, Paper, Card, Typography, Skeleton, MenuItem, TextField, IconButton, Collapse, InputAdornment, useTheme } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import dayjs from 'dayjs'
import useAuthHeader from '../../hooks/useAuthHeader'
import { getPlacemetHistory, getPlacemetHistoryCount } from '../../services/PlacementHistoryService'
import Iconify from '../../components/Iconify/Iconify'
import TablePagination from '@mui/material/TablePagination'
import { notifyError } from '../../layout/Layout'
import { DataGrid, trTR } from '@mui/x-data-grid'
import ActionHeader from '../../shared/components/ActionHeader'
import QueryFilterPanel from '../../components/Filter/QueryFilterPanel'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import CloseIcon from '@mui/icons-material/Close'
import FilterListIcon from '@mui/icons-material/FilterList'
import SearchIcon from '@mui/icons-material/Search'
import { blue } from '@mui/material/colors'
import XLSX from 'xlsx-js-style'
import excelimg from '../../assets/images/cards/excel.png'

const MOVEMENT_TYPE_OPTIONS = [
  { value: 'DEFINITION', label: 'Adres Tanımlama' },
  { value: 'REPLACEMENT', label: 'Adres Yer Değiştirme' },
  { value: 'PLACEMENT_FROM_TMP', label: 'Geçici Adresten Yerleştirme' },
]

const MOVEMENT_TYPE_LABELS = MOVEMENT_TYPE_OPTIONS.reduce((acc, o) => {
  acc[o.value] = o.label
  return acc
}, {})

const SUMMARY_CARDS = [
  { type: 'DEFINITION', title: 'Adres Tanımlama', icon: 'lucide:warehouse' },
  { type: 'PLACEMENT_FROM_TMP', title: 'Geçici Adresten Yerleştirme', icon: 'lucide:package-plus' },
  { type: 'REPLACEMENT', title: 'Adres Yer Değiştirme', icon: 'lucide:replace' },
]

/* ---- DataGrid içindeki server taraflı arama kutusu ---- */
function SearchToolbar({ value, onApply }) {
  const [local, setLocal] = useState(value ?? '')

  useEffect(() => {
    setLocal(value ?? '')
  }, [value])

  useEffect(() => {
    const handle = setTimeout(() => {
      if ((local ?? '') !== (value ?? '')) onApply(local ?? '')
    }, 600)
    return () => clearTimeout(handle)
  }, [local])

  return (
    <Box sx={{ p: 1, display: 'flex', justifyContent: 'flex-end' }}>
      <TextField
        size="small"
        variant="outlined"
        placeholder="Ara (Barkod, Stok Kodu...)"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
        sx={{ minWidth: 260 }}
      />
    </Box>
  )
}

function getCreatedDate(params) {
  const value = params?.row?.createdDate
  if (!value) return ''
  const [datePart, timePart] = value.split('T')
  return `${datePart} ${timePart ? timePart.split('.')[0] : ''}`.trim()
}

export default function PlacementHistory() {
  const theme = useTheme()
  const headers = useAuthHeader()
  const navigate = useNavigate()
  const location = useLocation()
  const { filters: filtersParam } = useParams()

  const [tmpList, setTmpList] = useState([])
  const [loading, setLoading] = useState(false)
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [filtersOpen, setFiltersOpen] = useState(true)
  const [exporting, setExporting] = useState(false)

  const columns = useMemo(
    () => [
      { field: 'barcode', headerName: 'Barkod', flex: 1, minWidth: 140 },
      { field: 'stokKodu', headerName: 'Stok Kodu', flex: 1, minWidth: 140 },
      { field: 'lastModifiedBy', headerName: 'Güncelleyen', flex: 1, minWidth: 140 },
      {
        field: 'lastModifiedDate',
        headerName: 'Güncelleme Tarihi',
        flex: 1,
        minWidth: 160,
        valueGetter: getCreatedDate,
      },
      {
        field: 'originAdres',
        headerName: 'Çıkış Adresi',
        flex: 1,
        minWidth: 140,
        valueGetter: (p) => p.row?.originAddress?.adres ?? '',
      },
      {
        field: 'placementAdres',
        headerName: 'Yerleşim Adresi',
        flex: 1,
        minWidth: 140,
        valueGetter: (p) => p.row?.placementAddress?.adres ?? '',
      },
      { field: 'processAmount', headerName: 'İşlem Miktarı', flex: 1, minWidth: 120 },
      {
        field: 'movementType',
        headerName: 'Hareket Tipi',
        flex: 1,
        minWidth: 180,
        valueGetter: (p) => MOVEMENT_TYPE_LABELS[p.row?.movementType] ?? 'Bilinmeyen',
      },
    ],
    []
  )

  /* ---------------- URL / filtre yapılandırması ---------------- */
  const basePath = useMemo(() => {
    const [prefix] = location.pathname.split('/placementhistory')
    return `${prefix}/placementhistory`
  }, [location.pathname])

  const filtersString = useMemo(() => (filtersParam ? decodeURIComponent(filtersParam) : ''), [filtersParam])

  const filterKeys = useMemo(() => ['createdDate.greaterThanOrEqual', 'createdDate.lessThanOrEqual', 'addressMovementType.in', 'multiSearch.contains'], [])

  const initialFilters = useMemo(
    () => ({
      'createdDate.greaterThanOrEqual': dayjs().subtract(7, 'day').startOf('day'),
      'createdDate.lessThanOrEqual': dayjs().add(1, 'day').startOf('day'),
      'addressMovementType.in': [],
      'multiSearch.contains': '',
    }),
    []
  )

  const serializeFilter = useMemo(
    () => (key, value) => {
      if (key.startsWith('createdDate') && value) {
        const d = key.includes('lessThan') ? dayjs(value).endOf('day') : dayjs(value).startOf('day')
        return d.toISOString()
      }
      if (key === 'addressMovementType.in') {
        return Array.isArray(value) ? value.join(',') : String(value ?? '')
      }
      return String(value ?? '')
    },
    []
  )

  const deserializeFilter = useMemo(
    () => (key, raw) => {
      if (key.startsWith('createdDate')) return dayjs(raw)
      if (key === 'addressMovementType.in') return raw ? raw.split(',') : []
      return raw
    },
    []
  )

  /* İlk girişte default tarih aralığı (bugünden 1 hafta geri) ile URL'i kur */
  useEffect(() => {
    if (filtersParam) return
    const nextParams = new URLSearchParams({
      'createdDate.greaterThanOrEqual': dayjs().subtract(7, 'day').startOf('day').toISOString(),
      'createdDate.lessThanOrEqual': dayjs().add(1, 'day').endOf('day').toISOString(),
    })
    navigate(`${basePath}/${encodeURIComponent(nextParams.toString())}`, { replace: true })
  }, [basePath, filtersParam, navigate])

  /* ---------------- Veri çekme ---------------- */
  const fetchPlacementHistoryData = async () => {
    try {
      setLoading(true)
      let query = `page=${page}&size=${rowsPerPage}`
      if (filtersString) query += `&${filtersString}`
      const res = await getPlacemetHistory(headers, query)
      const total = await getPlacemetHistoryCount(headers, query)
      res && setTmpList(res)
      res && setCount(Number(total) || 0)
    } catch (error) {
      notifyError('Hata: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setPage(0)
  }, [filtersString])

  useEffect(() => {
    if (!filtersParam) return
    fetchPlacementHistoryData()
  }, [filtersString, page, rowsPerPage])

  const handleChangePage = (event, newPage) => setPage(newPage)

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const handleExportExcel = async () => {
    try {
      setExporting(true)
      let query = `page=0&size=${count > 0 ? count : 10000}`
      if (filtersString) query += `&${filtersString}`
      const rows = await getPlacemetHistory(headers, query)

      if (!rows || rows.length === 0) {
        notifyError('Dışa aktarılacak veri bulunamadı')
        return
      }

      const HEADERS = ['Barkod', 'Stok Kodu', 'Güncelleyen', 'Güncelleme Tarihi', 'Çıkış Adresi', 'Yerleşim Adresi', 'İşlem Miktarı', 'Hareket Tipi']

      const dataRows = rows.map((r) => [
        r.barcode ?? '',
        r.stokKodu ?? '',
        r.lastModifiedBy ?? '',
        getCreatedDate({ row: r }),
        r.originAddress?.adres ?? '',
        r.placementAddress?.adres ?? '',
        r.processAmount ?? '',
        MOVEMENT_TYPE_LABELS[r.movementType] ?? 'Bilinmeyen',
      ])

      const aoa = [HEADERS, ...dataRows]
      const ws = XLSX.utils.aoa_to_sheet(aoa)
      ws['!cols'] = [{ wch: 18 }, { wch: 16 }, { wch: 16 }, { wch: 20 }, { wch: 16 }, { wch: 16 }, { wch: 14 }, { wch: 26 }]

      const border = {
        top: { style: 'thin', color: { rgb: '000000' } },
        bottom: { style: 'thin', color: { rgb: '000000' } },
        left: { style: 'thin', color: { rgb: '000000' } },
        right: { style: 'thin', color: { rgb: '000000' } },
      }

      const totalRows = aoa.length
      const totalCols = HEADERS.length

      for (let R = 0; R < totalRows; R++) {
        for (let C = 0; C < totalCols; C++) {
          const ref = XLSX.utils.encode_cell({ r: R, c: C })
          if (!ws[ref]) ws[ref] = { v: '', t: 's' }
          const isHeader = R === 0
          ws[ref].s = {
            font: { bold: isHeader, sz: 11 },
            alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
            fill: isHeader ? { patternType: 'solid', fgColor: { rgb: 'F2F2F2' } } : undefined,
            border,
          }
        }
      }

      ws['!rows'] = Array.from({ length: totalRows }, () => ({ hpt: 22 }))
      ws['!rows'][0] = { hpt: 28 }

      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Yerleştirme Geçmişi')
      XLSX.writeFile(wb, `yerlestirme_gecmisi_${dayjs().format('YYYYMMDD_HHmmss')}.xlsx`)
    } catch (error) {
      notifyError(error.message)
    } finally {
      setExporting(false)
    }
  }

  return (
    <>
      <ActionHeader title={'Yerleştirme Geçmişi'} hide={true} />

      {/* ---------------- Özet kartları ---------------- */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {SUMMARY_CARDS.map((card) => {
          const total = tmpList.filter((x) => x.movementType === card.type).length
          return (
            <Grid item xs={12} sm={6} md={4} key={card.type}>
              <Card
                elevation={0}
                sx={{
                  p: 2.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  borderRadius: 2,
                  bgcolor: blue[50],
                  border: `1px solid ${blue[100]}`,
                  height: '100%',
                }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    flexShrink: 0,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: blue[100],
                    color: blue[800],
                  }}
                >
                  <Iconify icon={card.icon} width={26} height={26} />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="h4" fontWeight={700} color={blue[900]} lineHeight={1.1}>
                    {total}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap title={card.title}>
                    {card.title}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      <QueryFilterPanel
        initialFilters={initialFilters}
        filterKeys={filterKeys}
        preserveInitialOnEmpty={true}
        urlMode="path"
        basePath={basePath}
        paramsString={filtersString}
        serialize={serializeFilter}
        deserialize={deserializeFilter}
        onFiltersChange={() => {}}
      >
        {({ filters, setFilter, applyFilters, clearFilters }) => (
          <>
            {/* ---------------- Excel + Filtre aç/kapa ---------------- */}
            <Grid sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1, mb: 1 }}>
              <Button variant="outlined" size="medium" disabled={exporting} startIcon={<img src={excelimg} alt="Excel" width={20} height={20} />} onClick={handleExportExcel}>
                {exporting ? 'Hazırlanıyor...' : 'Excel'}
              </Button>
              <IconButton size="small" onClick={() => setFiltersOpen((prev) => !prev)}>
                {filtersOpen ? <CloseIcon /> : <FilterListIcon />}
              </IconButton>
            </Grid>

            <Collapse in={filtersOpen} timeout="auto" unmountOnExit>
              <Paper sx={{ p: 3, mb: 2, backgroundColor: '#F2F5FF' }} elevation={0}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={4}>
                      <DatePicker
                        label="Başlangıç"
                        value={filters['createdDate.greaterThanOrEqual'] || null}
                        onChange={(v) => setFilter('createdDate.greaterThanOrEqual', v)}
                        slotProps={{ textField: { variant: 'standard', fullWidth: true } }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                      <DatePicker
                        label="Bitiş"
                        value={filters['createdDate.lessThanOrEqual'] || null}
                        onChange={(v) => setFilter('createdDate.lessThanOrEqual', v)}
                        slotProps={{ textField: { variant: 'standard', fullWidth: true } }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        select
                        SelectProps={{
                          multiple: true,
                          renderValue: (selected) => (selected || []).map((v) => MOVEMENT_TYPE_LABELS[v] ?? v).join(', '),
                        }}
                        label="Hareket Tipleri"
                        variant="standard"
                        fullWidth
                        value={Array.isArray(filters['addressMovementType.in']) ? filters['addressMovementType.in'] : []}
                        onChange={(e) => setFilter('addressMovementType.in', e.target.value)}
                      >
                        {MOVEMENT_TYPE_OPTIONS.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>
                </LocalizationProvider>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                  <Button variant="outlined" color="inherit" onClick={clearFilters}>
                    Temizle
                  </Button>
                  <Button variant="outlined" color="primary" onClick={() => applyFilters()}>
                    Filtreyi Uygula
                  </Button>
                </Box>
              </Paper>
            </Collapse>

            {/* ---------------- Tablo ---------------- */}
            {loading ? (
              <Skeleton animation="wave" variant="rounded" width={'100%'} height={'calc(100dvh - 360px)'} />
            ) : (
              <Box
                sx={{
                  width: '100%',
                  overflowX: { xs: 'auto', sm: 'visible' },
                  WebkitOverflowScrolling: 'touch',
                }}
              >
                <DataGrid
                  autoHeight
                  columns={columns}
                  rows={tmpList}
                  getRowId={(row) => row.id}
                  hideFooter
                  disableColumnFilter
                  disableSelectionOnClick
                  paginationMode="server"
                  rowCount={count}
                  page={page}
                  pageSize={rowsPerPage}
                  onPageChange={(newPage) => setPage(newPage)}
                  onPageSizeChange={(newSize) => {
                    setRowsPerPage(newSize)
                    setPage(0)
                  }}
                  localeText={trTR.components.MuiDataGrid.defaultProps.localeText}
                  components={{ Toolbar: SearchToolbar }}
                  componentsProps={{
                    toolbar: {
                      value: filters['multiSearch.contains'] || '',
                      onApply: (val) => applyFilters({ ...filters, 'multiSearch.contains': val }),
                    },
                  }}
                  sx={{
                    borderRadius: theme.shape.borderRadius,
                    minWidth: { xs: 1_200, sm: 'auto' },
                    '& .MuiDataGrid-columnHeaders, & .MuiDataGrid-cell': {
                      whiteSpace: { xs: 'nowrap', sm: 'normal' },
                    },
                    '& .MuiDataGrid-virtualScroller': { overflowX: 'hidden' },
                  }}
                />
              </Box>
            )}

            <TablePagination
              sx={{
                position: 'sticky',
                bottom: 0,
                backgroundColor: 'background.paper',
                zIndex: 13,
              }}
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={count}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Sayfa başına satır sayısı:"
            />
          </>
        )}
      </QueryFilterPanel>
    </>
  )
}
