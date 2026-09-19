import React, { useEffect, useMemo, useState } from 'react'
import ActionHeader from '../../shared/components/ActionHeader'
import { getWaybillList } from '../../services/MikroService'
import { DataGrid } from '@mui/x-data-grid'
import QueryFilterPanel from '../../components/Filter/QueryFilterPanel'
import { Box, Button, Chip, CircularProgress, Collapse, Grid, IconButton, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useLocation, useNavigate } from 'react-router-dom'
import FilterListIcon from '@mui/icons-material/FilterList'
import CloseIcon from '@mui/icons-material/Close'
import * as XLSX from 'xlsx'
import excelimg from '../../assets/images/cards/excel.png'
import { generatePayload } from '../../utils/Utils'

const CustomNoRowsOverlay = () => {
  return (
    <Stack height="100%" alignItems="center" justifyContent="center">
      <Typography variant="body2">Veri yok</Typography>
    </Stack>
  )
}

const CustomLoadingOverlay = () => {
  return (
    <Stack height="100%" spacing={1} alignItems="center" justifyContent="center">
      <CircularProgress size={24} />
      <Typography variant="body2">Yükleniyor...</Typography>
    </Stack>
  )
}

const WaybillControlContainer = () => {
  const [waybillList, setWaybillList] = useState([])
  const [loading, setLoading] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  const columns = [
    { field: 'irsaliyeNo', headerName: 'İrsaliye No', flex: 1, minWidth: 150 },
    { field: 'siparisNo', headerName: 'Sipariş No', flex: 1, minWidth: 140 },
    { field: 'cariUnvan', headerName: 'Cari', flex: 1, minWidth: 220 },
    { field: 'tarih', headerName: 'Tarih', flex: 1, minWidth: 120 },
    { field: 'kullanici', headerName: 'Kullanıcı', flex: 1, minWidth: 140 },
    {
      field: 'kaynak',
      headerName: 'Kaynak',
      flex: 1,
      minWidth: 130,
      renderCell: (params) => {
        const source = params.value
        const label = source === 'ERP' ? 'Mikro' : source === 'DYS' ? 'DYS' : '-'
        const color = source === 'ERP' ? 'warning' : source === 'DYS' ? 'primary' : 'default'
        return <Chip size="small" label={label} color={color} variant="outlined" />
      },
    },
    {
      field: 'evrakTip',
      headerName: 'Evrak Tipi',
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        const typeValue = Number(params.value)
        const label = typeValue === 1 ? 'Sevkiyat' : typeValue === 13 ? 'Mal Kabul' : '-'
        const color = typeValue === 1 ? 'success' : typeValue === 13 ? 'info' : 'default'
        return <Chip size="small" label={label} color={color} variant="outlined" />
      },
    },
  ]

  const normalizeWaybillNo = (item) => {
    const seri = item.evrakSeri ?? ''
    const sira = item.evrakSira ?? ''
    const value = `${seri}-${sira}`
    return value || '-'
  }

  const normalizeOrderNo = (item) => item.siparisNo ?? '-'

  const normalizeDate = (item) => {
    const rawDate = item.tarih
    if (!rawDate) return '-'
    const parsed = dayjs(rawDate)
    return parsed.isValid() ? parsed.format('DD/MM/YYYY') : '-'
  }

  const normalizeUser = (item) => item.kullanici ?? '-'

  const filterKeys = useMemo(() => ['evrakTip', 'kaynak', 'beginDate', 'endDate'], [])

  const initialFilters = useMemo(
    () => ({
      evrakTip: '1',
      kaynak: 'DYS',
      beginDate: dayjs().subtract(7, 'day').startOf('day'),
      endDate: dayjs().endOf('day'),
    }),
    []
  )

  const [appliedFilters, setAppliedFilters] = useState(initialFilters)

  const serializeFilter = useMemo(
    () => (key, value) => {
      if ((key === 'beginDate' || key === 'endDate') && value) {
        return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
      }
      return String(value ?? '')
    },
    []
  )

  const deserializeFilter = useMemo(
    () => (key, raw) => {
      if (key === 'beginDate' || key === 'endDate') return raw ? dayjs(raw) : null
      return raw
    },
    []
  )

  useEffect(() => {
    if (location.search) return

    const params = new URLSearchParams()
    const evrakTip = serializeFilter('evrakTip', initialFilters.evrakTip)
    const kaynak = serializeFilter('kaynak', initialFilters.kaynak)
    const beginDate = serializeFilter('beginDate', initialFilters.beginDate)
    const endDate = serializeFilter('endDate', initialFilters.endDate)

    if (evrakTip) params.set('evrakTip', evrakTip)
    if (kaynak) params.set('kaynak', kaynak)
    if (beginDate) params.set('beginDate', beginDate)
    if (endDate) params.set('endDate', endDate)

    navigate({ search: params.toString() ? `?${params.toString()}` : '' }, { replace: true })
  }, [initialFilters, location.search, navigate, serializeFilter])

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const nextFilters = { ...initialFilters }

    filterKeys.forEach((key) => {
      const raw = searchParams.get(key)
      if (raw !== null) {
        nextFilters[key] = deserializeFilter(key, raw)
      }
    })

    setAppliedFilters(nextFilters)
  }, [deserializeFilter, filterKeys, initialFilters, location.search])

  useEffect(() => {
    const getWaybillList = async () => {
      const payload = generatePayload({
        firmCode: '',
        evrakTip: appliedFilters.evrakTip === '' ? null : Number(appliedFilters.evrakTip),
        kaynak: appliedFilters.kaynak ?? '',
        beginDate: dayjs(appliedFilters.beginDate).format('YYYY-MM-DD HH:mm:ss'),
        endDate: dayjs(appliedFilters.endDate).format('YYYY-MM-DD HH:mm:ss'),
      })

      try {
        setLoading(true)
        const response = await getWaybillList(payload)
        const normalizedRows = Array.isArray(response)
          ? response.map((item, index) => ({
              irsaliyeNo: normalizeWaybillNo(item),
              siparisNo: normalizeOrderNo(item),
              cariUnvan: item.cariUnvan ?? '-',
              evrakTip: item.evrakTip ?? '',
              tarih: normalizeDate(item),
              kullanici: normalizeUser(item),
              kaynak: item.kaynak ?? '-',
              id: `${item.evrakSeri ?? 'NA'}-${item.evrakSira ?? '0'}-${item.cariKod ?? 'NA'}-${index}`,
            }))
          : []
        setWaybillList(normalizedRows)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    getWaybillList()
  }, [appliedFilters])

  const handleExportExcel = () => {
    const sheetData = waybillList.map((row) => ({
      'İrsaliye No': row.irsaliyeNo ?? '-',
      'Sipariş No': row.siparisNo ?? '-',
      Cari: row.cariUnvan ?? '-',
      Tarih: row.tarih ?? '-',
      Kullanıcı: row.kullanici ?? '-',
      Kaynak: row.kaynak === 'ERP' ? 'Mikro' : (row.kaynak ?? '-'),
    }))

    const ws = XLSX.utils.json_to_sheet(sheetData.length ? sheetData : [{ 'İrsaliye No': '-', 'Sipariş No': '-', Cari: '-', Tarih: '-', Kullanıcı: '-', Kaynak: '-' }])
    ws['!cols'] = [{ wch: 14 }, { wch: 18 }, { wch: 22 }, { wch: 12 }, { wch: 16 }, { wch: 12 }]

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Irsaliye')

    const beginDate = dayjs(appliedFilters.beginDate).format('YYYYMMDD')
    const endDate = dayjs(appliedFilters.endDate).format('YYYYMMDD')
    XLSX.writeFile(wb, `irsaliye_kontrol_${beginDate}_${endDate}.xlsx`)
  }

  return (
    <>
      <ActionHeader title={'İrsaliye Kontrol'} hide={true} />
      <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', mb: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton size="small" onClick={handleExportExcel} aria-label="Excel indir" sx={{ opacity: waybillList.length === 0 ? 0.5 : 1 }} disabled={waybillList.length === 0}>
            <img src={excelimg} alt="Excel indir" width={24} height={24} />
          </IconButton>
          <IconButton size="small" onClick={() => setFiltersOpen((prev) => !prev)}>
            {filtersOpen ? <CloseIcon /> : <FilterListIcon />}
          </IconButton>
        </Stack>
      </Grid>
      <QueryFilterPanel
        initialFilters={initialFilters}
        filterKeys={filterKeys}
        preserveInitialOnEmpty={true}
        serialize={serializeFilter}
        deserialize={deserializeFilter}
        onFiltersChange={(filters) => setAppliedFilters(filters)}
      >
        {({ filters, setFilter, applyFilters, clearFilters }) => (
          <Collapse in={filtersOpen} timeout="auto" unmountOnExit>
            <Paper sx={{ p: 2, mb: 2, backgroundColor: '#F2F5FF' }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField select label="Evrak Tipi" variant="standard" fullWidth value={filters.evrakTip || ''} onChange={(e) => setFilter('evrakTip', e.target.value)}>
                      <MenuItem value="1">Sevkiyat</MenuItem>
                      <MenuItem value="13">Mal Kabul</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField select label="Kaynak" variant="standard" fullWidth value={filters.kaynak || ''} onChange={(e) => setFilter('kaynak', e.target.value)}>
                      <MenuItem value="DYS">Depo Yönetim Sistemi</MenuItem>
                      <MenuItem value="ERP">Mikro</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <DatePicker
                      label="Başlangıç Tarihi"
                      value={filters.beginDate || null}
                      onChange={(value) => setFilter('beginDate', value)}
                      slotProps={{ textField: { variant: 'standard', fullWidth: true } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <DatePicker
                      label="Bitiş Tarihi"
                      value={filters.endDate || null}
                      onChange={(value) => setFilter('endDate', value)}
                      slotProps={{ textField: { variant: 'standard', fullWidth: true } }}
                    />
                  </Grid>
                </Grid>
              </LocalizationProvider>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                <Button variant="outlined" color="inherit" onClick={clearFilters}>
                  Temizle
                </Button>
                <Button variant="outlined" onClick={() => applyFilters()}>
                  Filtreyi Uygula
                </Button>
              </Box>
            </Paper>
          </Collapse>
        )}
      </QueryFilterPanel>
      <DataGrid
        sx={{ height: 520 }}
        rows={waybillList}
        columns={columns}
        loading={loading}
        components={{
          NoRowsOverlay: CustomNoRowsOverlay,
          LoadingOverlay: CustomLoadingOverlay,
        }}
        localeText={{
          noRowsLabel: 'Veri yok',
        }}
      />
    </>
  )
}

export default WaybillControlContainer
