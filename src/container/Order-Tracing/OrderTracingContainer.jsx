import { Box, Button, Collapse, Grid, IconButton, Paper, Skeleton, Stack, TextField, Typography, MenuItem } from '@mui/material'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import useAuthHeader from '../../hooks/useAuthHeader'
import { getOrderMasterList } from '../../services/OrderDetailService'
import { DataGrid, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid'
import { selectionModelToIds } from '../../shared/components/DataGrid/selection'
import MouseIcon from '@mui/icons-material/Mouse'
import TracingItem from '../../components/TracingItem'
import { useTheme } from '@mui/material/styles'
import OrderTracingDrawer from '../../components/Drawer/OrderTracingDrawer'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import { useLocation, useNavigate, useParams } from 'react-router'
import { DepoContainer } from '../../store/DepoContainer'
import useDepoCode from '../../hooks/useDepoCode'
import EditIcon from '@mui/icons-material/Edit'
import { notifyError } from '../../layout/Layout'
import NotFound from '../../shared/components/NotFound/NotFound'
import { useContainer } from 'unstated-next'
import useIsMobile from '../../hooks/useIsMobile'
import ExtendedDialog from '../../shared/components/Dialog/ExtendedDialog'
import { generateDocument } from '../../services/PrintService'
import { generatePayload } from '../../utils/Utils'
import CloseIcon from '@mui/icons-material/Close'
import FilterListIcon from '@mui/icons-material/FilterList'
import PrintIcon from '@mui/icons-material/Print'
import ActionHeader from '../../shared/components/ActionHeader'
import QueryFilterPanel from '../../components/Filter/QueryFilterPanel'
import SplitButton from '../../components/Button/SplitButton'
import excelimg from '../../assets/images/cards/excel.png'
import BRAND from '../../config/brand'
import XLSX from 'xlsx-js-style'
import dayjs from 'dayjs'
import { ORDER_STATUS_COLORS } from '../../constants/orderStatusColors'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

export default function OrderTracingContainer() {
  const PAGE_SIZE = 1000
  const theme = useTheme()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const { authorityList } = useContainer(DepoContainer)
  const headers = useAuthHeader()
  const depoCode = useDepoCode()
  const location = useLocation()
  const { status: filtersParam } = useParams()

  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const [data, setData] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedRows, setSelectedRows] = useState([])
  const [printDialog, setPrintDialog] = useState(false)
  const [printLoading, setPrintLoading] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(true)

  const printDocRef = useRef('')

  const handleDrawerClose = () => {
    setOpen(false)
  }

  const basePath = useMemo(() => {
    const [prefix] = location.pathname.split('/ordertracing')
    return `${prefix}/ordertracing`
  }, [location.pathname])

  const filtersString = useMemo(() => (filtersParam ? decodeURIComponent(filtersParam) : ''), [filtersParam])

  const filterKeys = useMemo(() => ['stokKodu.contains', 'lastModifiedDate.greaterThan', 'lastModifiedDate.lessThan', 'status.in'], [])

  const initialFilters = useMemo(
    () => ({
      'stokKodu.contains': '',
      'status.in': '',
      'lastModifiedDate.greaterThan': dayjs().subtract(5, 'day').startOf('day'),
      'lastModifiedDate.lessThan': dayjs().add(1, 'day').startOf('day'),
    }),
    []
  )

  const serializeFilter = useMemo(
    () => (key, value) => {
      if (key.startsWith('lastModifiedDate') && value) {
        return `${dayjs(value).startOf('day').format('YYYY-MM-DDTHH:mm:ss')}Z`
      }
      return String(value ?? '')
    },
    []
  )

  const deserializeFilter = useMemo(
    () => (key, raw) => {
      if (key.startsWith('lastModifiedDate')) return dayjs(raw)
      return raw
    },
    []
  )

  useEffect(() => {
    if (filtersParam) return
    const nextParams = new URLSearchParams({
      'lastModifiedDate.greaterThan': `${dayjs().subtract(5, 'day').startOf('day').format('YYYY-MM-DDTHH:mm:ss')}Z`,
      'lastModifiedDate.lessThan': `${dayjs().add(1, 'day').startOf('day').format('YYYY-MM-DDTHH:mm:ss')}Z`,
    })
    navigate(`${basePath}/${encodeURIComponent(nextParams.toString())}`, { replace: true })
  }, [basePath, filtersParam, navigate])

  const downloadPdf = (id) => {
    const selectedOrders = data.filter((row) => row.id === id)

    const payload = {
      data: selectedOrders,
      template: 'malzeme-teslim-tutanagi.pug',
      format: 'a4',
      locale: 'tr',
      landscape: true,
    }
    fetchDocument(generatePayload(payload))
  }

  const changeOrderId = (id) => {
    setOpen(true)
    setSelectedOrderId(id)
  }

  const handlePrint = () => {
    const selectedOrders = data.filter((row) => selectedRows.includes(row.id))

    const mergedOrders = selectedOrders.map((order) => {
      const list = (Array.isArray(order.details) ? order.details : []).filter((item) => item.status !== 'SUSPENDED')

      const grouped = Object.values(
        list.reduce((acc, item) => {
          const key = `${item.stokKodu}_${item.orderNo}`

          if (!acc[key]) {
            acc[key] = { ...item }
          } else {
            acc[key].siparisMiktar += item.siparisMiktar || 0
            acc[key].teslimMiktar += item.teslimMiktar || 0
          }

          return acc
        }, {})
      )

      const { details: _details, ...orderRest } = order

      return {
        ...orderRest,
        firmName: normalizeFirmNameForPrint(order.firmName),
        details: grouped,
      }
    })

    const payload = {
      data: mergedOrders,
      template: BRAND.printTemplates.orderList,
      format: 'a4',
      locale: 'tr',
      landscape: true,
    }

    fetchDocument(generatePayload(payload))
  }

  const handleExportExcel = () => {
    const selectedOrders = data.filter((row) => selectedRows.includes(row.id))
    const HEADERS = ['KODU', 'İSMİ', 'KONTROL', 'K.SİP MİKTAR', 'BİRİMİ', 'SERİ NO', 'SIRA NO', 'CARİ İSMİ', 'İl / İLÇE']
    const CARI_COL = 7
    const IL_COL = 8
    const detailRows = []
    const merges = []
    const orderEndRows = []
    let rowCursor = 1

    selectedOrders.forEach((order) => {
      const list = (Array.isArray(order.details) ? order.details : []).filter((item) => item.status !== 'SUSPENDED')

      const grouped = Object.values(
        list.reduce((acc, item) => {
          const key = `${item.stokKodu}_${item.orderNo}`
          if (!acc[key]) {
            acc[key] = { ...item }
          } else {
            acc[key].siparisMiktar += item.siparisMiktar || 0
            acc[key].teslimMiktar += item.teslimMiktar || 0
          }
          return acc
        }, {})
      )

      if (grouped.length === 0) return

      const cariIsmi = normalizeFirmNameForPrint(order.firmName)
      const ilIlce = order.customerAddress?.sevkAddress ?? ''
      const orderStartRow = rowCursor

      grouped.forEach((item) => {
        const siparisParts = (item.siparisNo ?? '').split('-')
        const seriNo = siparisParts[0] ?? ''
        const siraNo = siparisParts.length > 1 ? siparisParts.slice(1).join('-') : ''

        detailRows.push([item.stokKodu ?? '', item.stokAdi ?? '', '', item.siparisMiktar ?? '', item.stokBirimi ?? '', seriNo, siraNo, cariIsmi, ilIlce])
        rowCursor++
      })

      const orderEndRow = rowCursor - 1
      orderEndRows.push(orderEndRow)

      if (grouped.length > 1) {
        merges.push({ s: { r: orderStartRow, c: CARI_COL }, e: { r: orderEndRow, c: CARI_COL } })
        merges.push({ s: { r: orderStartRow, c: IL_COL }, e: { r: orderEndRow, c: IL_COL } })
      }
    })

    const orderBoundarySet = new Set(orderEndRows.slice(0, -1))

    if (detailRows.length === 0) {
      notifyError('Dışa aktarılacak veri bulunamadı')
      return
    }

    const firstOrder = selectedOrders[0] ?? {}

    const aoa = [HEADERS, ...detailRows]
    aoa.push(['AD SOYAD', firstOrder.soforAdi ?? '', 'PLAKA', firstOrder.soforPlaka ?? '', '', '', '', 'PALET', ''])
    aoa.push(['TC', firstOrder.soforTcNo ?? '', 'ARAÇ TİPİ', firstOrder.transportationType ?? '', '', '', '', 'PAKET', ''])
    aoa.push(['TEL', firstOrder.soforTel ?? '', 'SEVK GÜNÜ', '', '', '', '', 'BAŞ./BİT SAATİ', ''])

    const ws = XLSX.utils.aoa_to_sheet(aoa)
    ws['!cols'] = [{ wch: 16 }, { wch: 50 }, { wch: 14 }, { wch: 14 }, { wch: 10 }, { wch: 16 }, { wch: 12 }, { wch: 28 }, { wch: 22 }]
    if (merges.length > 0) {
      ws['!merges'] = merges
    }

    const totalRows = aoa.length
    const totalCols = HEADERS.length
    const footerStartRow = totalRows - 3
    const ISMI_COL = 1
    const FOOTER_LABEL_COLS = new Set([0, 2, 7])

    const border = {
      top: { style: 'thin', color: { rgb: '000000' } },
      bottom: { style: 'thin', color: { rgb: '000000' } },
      left: { style: 'thin', color: { rgb: '000000' } },
      right: { style: 'thin', color: { rgb: '000000' } },
    }

    for (let R = 0; R < totalRows; R++) {
      for (let C = 0; C < totalCols; C++) {
        const ref = XLSX.utils.encode_cell({ r: R, c: C })
        if (!ws[ref]) ws[ref] = { v: '', t: 's' }

        const isHeader = R === 0
        const isFooter = R >= footerStartRow
        const isFooterLabel = isFooter && FOOTER_LABEL_COLS.has(C)
        const isDetailIsmi = !isHeader && !isFooter && C === ISMI_COL
        const isOrderBoundary = orderBoundarySet.has(R)

        ws[ref].s = {
          font: {
            bold: isHeader || isFooterLabel,
            sz: 11,
          },
          alignment: {
            horizontal: isDetailIsmi ? 'left' : 'center',
            vertical: 'center',
            wrapText: true,
          },
          fill: isHeader ? { patternType: 'solid', fgColor: { rgb: 'F2F2F2' } } : undefined,
          border: {
            ...border,
            bottom: isOrderBoundary ? { style: 'medium', color: { rgb: '000000' } } : border.bottom,
          },
        }
      }
    }

    ws['!rows'] = []
    for (let R = 0; R < totalRows; R++) {
      ws['!rows'][R] = { hpt: 22 }
    }
    ws['!rows'][0] = { hpt: 28 }

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sipariş Takip')
    XLSX.writeFile(wb, `siparis_takip_${dayjs().format('YYYYMMDD_HHmmss')}.xlsx`)
  }

  const { openOrderCount, progressOrderCount, outProgressOrderCount, doneOrderCount } = useMemo(() => {
    return data.reduce(
      (acc, order) => {
        order.orderTmpDetailList?.forEach((row) => {
          if (order.status === 'OPEN' && row.status === 'OPEN') acc.openOrderCount += 1
          if (order.status === 'IN_PROGRESS' && row.status === 'IN_PROGRESS') acc.progressOrderCount += 1
          if (order.status === 'DONE' && row.status === 'DONE') acc.outProgressOrderCount += 1
          if (order.opType === 'MSK' && order.status === 'OUT_PROGRESS' && row.status === 'OUT_PROGRESS') acc.doneOrderCount += 1
        })
        return acc
      },
      { openOrderCount: 0, progressOrderCount: 0, outProgressOrderCount: 0, doneOrderCount: 0 }
    )
  }, [data])

  const fetchDocument = async (payload) => {
    try {
      setPrintLoading(true)
      const bodyContent = await generateDocument(payload)
      printDocRef.current = bodyContent
      setPrintDialog(true)
    } catch (error) {
      notifyError(error.message)
    } finally {
      setPrintLoading(false)
    }
  }

  const fetchOrderList = async () => {
    try {
      setLoading(true)
      let query = `page=0&size=${PAGE_SIZE}&sort=id,desc`
      if (filtersString) {
        query += `&${filtersString}`
      }
      const res = await getOrderMasterList(headers, query)
      res && setData(res)
    } catch (e) {
      notifyError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrderList()
  }, [filtersString])

  function getUserName(params) {
    if (params.row.aurUser === null || params.row.aurUser === undefined) {
      return 'Kullanıcı Bulunamadı'
    }
    return params.row.aurUser.login
  }

  function getSiparisDurumuTr(params) {
    const s = params?.row?.status

    if (s === 'OPEN' || s === 'IN_PROGRESS') return 'Yeni Atanmış Sipariş'
    if (s === 'OUT_PROGRESS') return 'Sevk İçin Beklemede'
    if (s === 'DONE') return 'Bitti'
    if (s === 'SUSPENDED') return 'İptal Edildi'

    return ''
  }

  function getSiparisNo(params) {
    const list = params?.row?.details

    if (!Array.isArray(list) || list.length === 0) return ''

    const siparisNo = list[0]?.siparisNo

    if (!siparisNo) return ''

    return siparisNo
  }

  function getOpType(params) {
    if (params.row.opType === 'FMK') {
      return 'Firmadan Mal Kabul'
    }
    if (params.row.opType === 'MSK') {
      return 'Müşteri Sevkiyat'
    }
    return ''
  }

  function getCreatedDate(params) {
    return params.row.createdDate.split('T')[0]
  }

  const parseFirmName = (firmName) => {
    if (!firmName) return { firma: '', altCari: '' }

    const parts = firmName.split('-')

    if (parts.length > 1) {
      return {
        firma: parts[0],
        altCari: parts.slice(1).join('-'),
      }
    }

    return { firma: firmName, altCari: '' }
  }

  const normalizeFirmNameForPrint = (firmName) => {
    if (!firmName) return ''

    const parts = firmName.split('-')

    if (parts.length > 1) {
      return (parts[1] ?? '').trim()
    }

    return firmName.trim()
  }

  const hasAltCari = useMemo(() => {
    return data.some((row) => row.firmName?.includes('-'))
  }, [data])

  const columns = useMemo(() => {
    const cols = [
      { field: 'id', headerName: 'Sıra No', width: 90, align: 'center', hide: true },

      {
        field: 'aurUser.login',
        headerName: 'Kullanıcı Id',
        width: 140,
        valueGetter: (value, row) => getUserName({ row }),
      },
      {
        field: 'siparisNo',
        headerName: 'Sipariş No',
        width: 160,
        valueGetter: (value, row) => getSiparisNo({ row }),
      },

      { field: 'firmCode', headerName: 'Firma Kodu', hide: true },

      {
        field: 'belgeNo',
        headerName: 'İrsaliye Kodu',
        width: 160,
      },

      {
        field: 'firmaAdi',
        headerName: 'Firma Adı',
        flex: 1.2,
        minWidth: 220,
        valueGetter: (value, row) => parseFirmName(row.firmName).firma,
      },

      {
        field: 'opTypeEdited',
        headerName: 'Operasyon Tipi',
        width: 170,
        editable: true,
        valueGetter: (value, row) => getOpType({ row }),
      },

      {
        field: 'statusEdited',
        headerName: 'Siparis Durumu',
        width: 220,
        editable: true,
        valueGetter: (value, row) => getSiparisDurumuTr({ row }),
      },

      {
        field: 'editedCreateDate',
        headerName: 'Oluşturulma Tarihi',
        width: 150,
        align: 'center',
        valueGetter: (value, row) => getCreatedDate({ row }),
      },

      {
        field: 'addColumn',
        type: 'actions',
        headerName: 'Detay',
        width: 90,
        getActions: (params) => [<GridActionsCellItem key="detay" icon={<MouseIcon />} label="Detay" onClick={() => changeOrderId(params.row.id)} />],
      },
      {
        field: 'generatePdf',
        type: 'actions',
        headerName: 'PDF',
        width: 80,
        getActions: (params) => [
          <GridActionsCellItem key="pdf" disabled={!(params.row.status === 'DONE')} icon={<PictureAsPdfIcon />} label="PDF" onClick={() => downloadPdf(params.row.id)} />,
        ],
      },
      {
        field: 'siparisIptal',
        type: 'actions',
        headerName: 'Düzenle',
        width: 100,
        getActions: (params) => [
          <GridActionsCellItem
            key="duzenle"
            disabled={!(params.row.status === 'DONE' || authorityList.includes('SUPERUSER'))}
            icon={<EditIcon />}
            label="Düzenle"
            onClick={() =>
              navigate(
                `/d:${depoCode}/${params.row.firmCode}/${params.row.opType}/${params.row.baglantiTipi}/${
                  params.row.baglantiTipi === '4' ? (params.row.cariCode === '' || params.row.cariCode === null ? '0' : params.row.cariCode) : params.row.baglantiTipi
                }/${params.row.id}/orderdetailsuspend`
              )
            }
          />,
        ],
      },
    ]

    if (hasAltCari) {
      const firmaIndex = cols.findIndex((c) => c.field === 'firmaAdi')

      cols.splice(firmaIndex + 1, 0, {
        field: 'altCari',
        headerName: 'Alt Cari',
        flex: 1,
        minWidth: 200,
        valueGetter: (value, row) => parseFirmName(row.firmName).altCari,
      })
    }

    return cols
  }, [hasAltCari, authorityList, depoCode, navigate, data])

  return (
    <>
      <ActionHeader title={'Sipariş Takip'} hide={true} />

      <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', mb: 2 }}>
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: 'center',
          }}
        >
          <SplitButton
            variant="outlined"
            size="medium"
            disabled={selectedRows.length === 0 || printLoading}
            ariaLabel="Dışa aktarma aksiyonları"
            primary={{
              label: 'Excel',
              icon: <img src={excelimg} alt="Excel" width={20} height={20} />,
              onClick: handleExportExcel,
            }}
            options={[
              {
                label: printLoading ? 'Yazdırılıyor...' : 'Yazdır',
                icon: <PrintIcon fontSize="small" />,
                onClick: handlePrint,
                disabled: printLoading,
              },
            ]}
          />
          <IconButton size="small" onClick={() => setFiltersOpen((prev) => !prev)}>
            {filtersOpen ? <CloseIcon /> : <FilterListIcon />}
          </IconButton>
        </Stack>
      </Grid>

      <Grid sx={{ mb: 2 }}>
        <Collapse in={filtersOpen} timeout="auto" unmountOnExit>
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
              <Paper sx={{ p: 3, backgroundColor: (theme) => theme.palette.surface.filter }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Grid container spacing={3}>
                    <Grid
                      size={{
                        xs: 12,
                        sm: 6,
                        md: 4,
                      }}
                    >
                      <DatePicker
                        label="Başlangıç"
                        value={filters['lastModifiedDate.greaterThan'] || null}
                        onChange={(v) => setFilter('lastModifiedDate.greaterThan', v)}
                        slotProps={{ textField: { variant: 'standard', fullWidth: true } }}
                      />
                    </Grid>

                    <Grid
                      size={{
                        xs: 12,
                        sm: 6,
                        md: 4,
                      }}
                    >
                      <DatePicker
                        label="Bitiş"
                        value={filters['lastModifiedDate.lessThan'] || null}
                        onChange={(v) => setFilter('lastModifiedDate.lessThan', v)}
                        slotProps={{ textField: { variant: 'standard', fullWidth: true } }}
                      />
                    </Grid>

                    <Grid
                      size={{
                        xs: 12,
                        sm: 6,
                        md: 4,
                      }}
                    >
                      <TextField
                        label="Stok Kodu"
                        variant="standard"
                        fullWidth
                        value={filters['stokKodu.contains'] || ''}
                        onChange={(e) => setFilter('stokKodu.contains', e.target.value)}
                      />
                    </Grid>

                    {/* ✅ STATUS FILTER */}
                    <Grid
                      size={{
                        xs: 12,
                        sm: 6,
                        md: 4,
                      }}
                    >
                      <TextField
                        select
                        label="Sipariş Durumu"
                        variant="standard"
                        fullWidth
                        value={filters['status.in'] || ''}
                        onChange={(e) => setFilter('status.in', e.target.value)}
                      >
                        <MenuItem value="">Hepsi</MenuItem>
                        <MenuItem value="OPEN,IN_PROGRESS">Yeni Atanmış Sipariş</MenuItem>
                        <MenuItem value="OUT_PROGRESS">Sevk İçin Beklemede</MenuItem>
                        <MenuItem value="DONE">Bitti</MenuItem>
                        <MenuItem value="SUSPENDED">İptal Edildi</MenuItem>
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
            )}
          </QueryFilterPanel>
        </Collapse>
      </Grid>

      <Grid
        sx={{
          display: 'none',
          justifyContent: 'space-around',
          flexDirection: isMobile ? 'column' : 'row',
          gap: 2,
        }}
      >
        {data ? (
          <>
            <TracingItem content={openOrderCount} header={'Açıkta Bekleyen Siparişler'} />
            <TracingItem content={progressOrderCount} header={'İşlem Halindeki Siparişler'} />
            <TracingItem content={outProgressOrderCount} header={'İrsaliyesi oluşan Siparişler'} />
            <TracingItem content={doneOrderCount} header={'Sevk için Bekleyen Siparişler'} />
          </>
        ) : (
          <NotFound msg={'Veri Bulunamadı'} />
        )}
      </Grid>

      <Grid>
        {loading ? (
          <Skeleton animation="wave" variant="rounded" width={'100%'} height={'calc(100dvh - 220px)'} />
        ) : data && data.length === 0 ? (
          <NotFound msg={'Sipariş Bulunamadı'} />
        ) : (
          <DataGrid
            sx={{
              '& .grid-row-theme--OPEN': { bgcolor: ORDER_STATUS_COLORS.OPEN },
              '& .grid-row-theme--IN_PROGRESS': { bgcolor: ORDER_STATUS_COLORS.IN_PROGRESS },
              '& .grid-row-theme--OUT_PROGRESS': { bgcolor: ORDER_STATUS_COLORS.OUT_PROGRESS },
              '& .grid-row-theme--DONE': { bgcolor: ORDER_STATUS_COLORS.DONE },
              '& .grid-row-theme--SUSPENDED': { bgcolor: ORDER_STATUS_COLORS.SUSPENDED },
              height: 'calc(100dvh - 220px)',
            }}
            rows={data}
            rowsPerPageOptions={[PAGE_SIZE]}
            pageSize={PAGE_SIZE}
            pagination
            columns={columns}
            disableSelectionOnClick
            getRowClassName={(params) => `grid-row-theme--${params.row.status}`}
            slots={{ toolbar: GridToolbar }}
            checkboxSelection
            isRowSelectable={(params) => params.row.opType === 'MSK'}
            onRowSelectionModelChange={(model) => {
              setSelectedRows(selectionModelToIds(model, data, (row) => row.opType === 'MSK'))
            }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            showToolbar
          />
        )}
      </Grid>

      <OrderTracingDrawer order={data} open={open} id={selectedOrderId} handleDrawerClose={handleDrawerClose} />

      <ExtendedDialog
        fullScreen={true}
        open={printDialog}
        handleClose={() => setPrintDialog(false)}
        dialogContent={<iframe style={{ width: '100%', height: 'calc(100dvh - 50px)' }} src={printDocRef.current} />}
      />
    </>
  )
}
