import { Alert, Box, Button, Chip, CircularProgress, Divider, Drawer, Grid, IconButton, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { selectionModelToIds } from '../../../shared/components/DataGrid/selection'
import TablePanel, { dataGridSx } from '../../../shared/components/Table/TablePanel'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'
import { getFirmOrderBulkList, getFirmOrdersByCariKod, getOrderDetailListByOrderNos } from '../../../services/MikroService'
import DispatchAssignDialog from '../../../components/Dialog/DispatchAssignDialog'
import useDepoCode from '../../../hooks/useDepoCode'
import usePayload from '../../../hooks/usePayload'
import { notify, notifyError } from '../../../layout/Layout'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { styled, alpha } from '@mui/material/styles'
import ActionHeader from '../../../shared/components/ActionHeader'
import MultiSelectItem from '../../../components/MultiSelectItem'
import { getTransferDepoCode } from '../../../utils/Utils'
import { useContainer } from 'unstated-next'
import { DepoContainer } from '../../../store/DepoContainer'

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  // Cerceve ve baslik gorunumu TablePanel ile ortak
  ...dataGridSx(theme),
  '& .sticky-actions-column': {
    position: 'sticky',
    left: 0,
    backgroundColor: theme.palette.background.paper,
    zIndex: 2,
  },
  '& .not-selectable-row': {
    cursor: 'not-allowed',
    backgroundImage: `repeating-linear-gradient(
      -45deg,
      transparent 0,
      transparent 8px,
      ${alpha(theme.palette.text.primary, 0.05)} 8px,
      ${alpha(theme.palette.text.primary, 0.05)} 9px
    )`,
    '&:hover, &.Mui-selected, &.Mui-selected:hover': {
      backgroundColor: 'transparent',
      backgroundImage: `repeating-linear-gradient(
        -45deg,
        transparent 0,
        transparent 8px,
        ${alpha(theme.palette.text.primary, 0.05)} 8px,
        ${alpha(theme.palette.text.primary, 0.05)} 9px
      )`,
    },
  },
  '& .not-selectable-row .MuiDataGrid-cellCheckbox': {
    opacity: 0.45,
    pointerEvents: 'none',
  },
  '& .numeric-cell': {
    fontVariantNumeric: 'tabular-nums',
    fontFeatureSettings: '"tnum"',
  },
}))

function GridLoadingOverlay() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      <CircularProgress />
    </Box>
  )
}

export default function OrderProgressSevkiyat() {
  const [bulkList, setBulkList] = useState([])
  const [selectedOrderList, setSelectedOrderList] = useState([])
  const [orderPickerSelection, setOrderPickerSelection] = useState([])
  const [appliedOrderPickerSelection, setAppliedOrderPickerSelection] = useState([])
  const [sevkAddressInfo, setSevkAddressInfo] = useState({})
  const [open, setOpen] = useState(false)
  const [isPressed, setPressed] = useState(false)
  const [orderNo, setOrderNo] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectionModel, setSelectionModel] = useState([])
  const [orderList, setOrderList] = useState([])
  const [originalData, setOriginalData] = useState([])
  const [initialOrderNosForFetch, setInitialOrderNosForFetch] = useState([])
  const [directCariMeta, setDirectCariMeta] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')

  const [searchParams] = useSearchParams()
  const nav = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { firmName: routeFirmName, firmCode: routeFirmCode, menuId, cariBaglantiTipi: routeCariBaglantiTipi, bolgeKodu: routeBolgeKodu, cariCode } = useParams()
  const depoCode = useDepoCode()
  const { allDepoList } = useContainer(DepoContainer)
  const drawerTopOffset = theme.mixins?.toolbar?.minHeight || 64

  const transferDepoCode = getTransferDepoCode(depoCode, allDepoList)
  const isDirectCariFlow = Boolean(cariCode)

  const effectiveFirmName = directCariMeta?.cariUnvan || routeFirmName || ''
  const effectiveFirmCode = directCariMeta?.cariKod || routeFirmCode || ''
  const effectiveCariBaglantiTipi = String(directCariMeta?.cariBaglantiTipi ?? routeCariBaglantiTipi ?? '')
  const effectiveBolgeKodu = String(directCariMeta?.bolgeKodu ?? routeBolgeKodu ?? '')

  const isSiparisHazir = (row) => String(row?.sipDurum ?? '').toLowerCase() === 'hazırlanıyor'
  const isOnaysiz = (row) => String(row?.onayDurum ?? '').toLowerCase() === 'onaysız'

  const isMGOrder = (orderNo) => /^MG/.test(String(orderNo || ''))
  const isOtherOrder = (orderNo) => /^(K|QT|KT|MH)/.test(String(orderNo || ''))

  const toNumber = (value) => {
    const num = Number(value)
    return Number.isFinite(num) ? num : 0
  }

  const hasMikroStock = (row) => toNumber(row?.stokMiktar) > 0

  const getSevkHazirMiktar = (row) => {
    if (!hasMikroStock(row)) return 0
    return Math.max(0, Math.min(toNumber(row?.stokMiktar), toNumber(row?.siparisMiktar)))
  }

  const columns = [
    {
      field: 'kullaniciAdi',
      headerName: 'Atananlar',
      width: 200,
      cellClassName: (params) => (params.row?.aktif ? 'reason-cell' : ''),
      renderCell: (params) =>
        params.value ? (
          <Chip label={params.value} color="warning" size="medium" sx={{ fontSize: '16px' }} />
        ) : (
          <Typography
            sx={{
              color: 'text.disabled',
              pl: 1,
            }}
          >
            —
          </Typography>
        ),
    },
    {
      field: 'sipDurum',
      headerName: 'Sipariş Durumu',
      width: 250,
      sortable: false,
      filterable: false,
      cellClassName: (params) => (isSiparisHazir(params.row) ? 'reason-cell' : ''),
      renderCell: (params) => {
        const sipDurum = params.value ?? 'Hazırlanıyor'
        const isReady = !isSiparisHazir(params.row)
        return <Chip label={sipDurum} color={isReady ? 'default' : 'warning'} size="medium" sx={{ fontSize: '16px' }} />
      },
    },
    {
      field: 'onayDurum',
      headerName: 'Onay Durumu',
      width: 160,
      cellClassName: (params) => (isOnaysiz(params.row) ? 'reason-cell' : ''),
      renderCell: (params) => {
        const value = params.value || 'Onaysız'
        const isOnayli = !isOnaysiz(params.row)
        return (
          <Chip
            label={value}
            variant="outlined"
            color={isOnayli ? 'success' : 'error'}
            size="medium"
            icon={isOnayli ? <CheckCircleOutlineIcon /> : <HighlightOffIcon />}
            sx={{ fontSize: '16px', fontWeight: 500 }}
          />
        )
      },
    },
    { field: 'orderNo', headerName: 'Mikro Sipariş No', width: 120 },
    { field: 'stokKodu', headerName: 'Stok Kodu', width: 120 },
    {
      field: 'sevkHazirMiktar',
      headerName: 'Sevk Edilebilir Miktar',
      width: 150,
      type: 'number',
      align: 'right',
      headerAlign: 'right',
      cellClassName: 'numeric-cell',
      valueGetter: (value, row) => getSevkHazirMiktar(row),
    },
    { field: 'teslimMiktar', headerName: 'Sevk Edilmiş Miktar', width: 150, type: 'number', align: 'right', headerAlign: 'right', cellClassName: 'numeric-cell' },
    { field: 'siparisMiktar', headerName: 'Sipariş Miktarı', width: 120, type: 'number', align: 'right', headerAlign: 'right', cellClassName: 'numeric-cell' },
    { field: 'stokMiktar', headerName: 'Mikro Miktar', width: 120, type: 'number', align: 'right', headerAlign: 'right', cellClassName: 'numeric-cell' },
    { field: 'stokAdi', headerName: 'Stok Adı', flex: 1, minWidth: 400 },
    { field: 'barkod', headerName: 'Ürün Barkodu', width: 150 },
    {
      field: 'teslimTarihi',
      headerName: 'Teslim Tarihi',
      width: 150,
      valueFormatter: (value) => (value ? String(value).slice(0, 10) : ''),
    },
    { field: 'sevkAddress', headerName: 'İl/İlçe', width: 150 },
    {
      field: 'firmName',
      headerName: 'Firma Adı',
      width: 250,
      renderCell: () => <span>{effectiveFirmName}</span>,
    },
  ]

  const params = usePayload({
    depoList: [Number(depoCode)],
    firmCode: effectiveFirmCode,
    sipTip: 0,
    transGroupCode: '',
  })

  const directCariReq = usePayload({
    depoNo: depoCode,
    sipTip: 0,
    cbt: 2,
    cariKod: cariCode,
  })

  const selectedRowOrderNos = useMemo(() => {
    if (!Array.isArray(selectedOrderList)) return []
    return selectedOrderList
      .map((it) => (typeof it === 'object' ? it?.orderNo : it))
      .filter(Boolean)
      .map(String)
  }, [selectedOrderList])

  const assignOrderList = useMemo(() => {
    if (!Array.isArray(selectedOrderList)) return []
    return selectedOrderList.map((row) => {
      const sevkHazirMiktar = getSevkHazirMiktar(row)
      return { ...row, sevkHazirMiktar, siparisMiktar: sevkHazirMiktar }
    })
  }, [selectedOrderList])

  const orderPickerNos = useMemo(() => {
    if (!Array.isArray(orderPickerSelection)) return []
    return orderPickerSelection.map(String).filter(Boolean)
  }, [orderPickerSelection])

  const appliedOrderPickerNos = useMemo(() => {
    if (!Array.isArray(appliedOrderPickerSelection)) return []
    return appliedOrderPickerSelection.map(String).filter(Boolean)
  }, [appliedOrderPickerSelection])

  const isRowSelectableData = (row) => !row?.aktif && !isOnaysiz(row) && hasMikroStock(row)

  const selectableCount = useMemo(() => bulkList.filter(isRowSelectableData).length, [bulkList])

  const filteredBulkList = useMemo(() => {
    switch (statusFilter) {
      case 'selectable':
        return bulkList.filter(isRowSelectableData)
      case 'onaysiz':
        return bulkList.filter(isOnaysiz)
      default:
        return bulkList
    }
  }, [bulkList, statusFilter])

  const orderLabelMap = useMemo(() => {
    if (!Array.isArray(originalData)) return {}
    return originalData.reduce((acc, item) => {
      const key = String(item?.orderNo ?? '')
      if (!key) return acc
      acc[key] = item?.transGroupName ? `${key} - ${item.transGroupName}` : key
      return acc
    }, {})
  }, [originalData])

  const handleClose = () => {
    setOpen(false)
    setOrderPickerSelection(appliedOrderPickerSelection)
  }
  const handleOpen = () => {
    setOrderPickerSelection(appliedOrderPickerSelection)
    setOpen(true)
  }
  const handleAssignedProduct = () => setPressed(true)

  const executeReq = usePayload({
    orderNoList: orderPickerNos,
    sipTip: 0,
    depoList: [Number(depoCode)],
  })

  const initialLoadReq = usePayload({
    orderNoList: initialOrderNosForFetch,
    sipTip: 0,
    depoList: [Number(depoCode)],
  })

  const fetchExecuteData = async () => {
    try {
      setLoading(true)
      const res = await getOrderDetailListByOrderNos(executeReq)
      if (res) {
        setSevkAddressInfo({
          sevkAddressId: res[0].addressNo,
          sevkAddress: res[0].sevkAddress,
          sevkTel: res[0].sevkTel,
          sevkMuhatap: res[0].sevkMuhatap,
          sevkAcikAdres: res[0].sevkAcikAdres,
        })
        setBulkList(res)
        setAppliedOrderPickerSelection(orderPickerNos)
        setOpen(false)
      }
    } catch (err) {
      setAppliedOrderPickerSelection([])
      notifyError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleOrderComplete = () => {
    fetchExecuteData()
  }

  const fetchBulkListData = async () => {
    if (!effectiveFirmCode) return
    try {
      setLoading(true)
      const res = await getFirmOrderBulkList(params)
      if (res) {
        setBulkList(res)
        const firstItem = effectiveCariBaglantiTipi === '4' ? res[0]?.orderDetail?.[0] : res[0]
        if (firstItem) {
          setSevkAddressInfo({
            sevkAddressId: firstItem.addressNo,
            sevkAddress: firstItem.sevkAddress,
            sevkTel: firstItem.sevkTel,
            sevkMuhatap: firstItem.sevkMuhatap,
            sevkAcikAdres: firstItem.sevkAcikAdres,
          })
        }
      }
    } catch (err) {
      notifyError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const hydrateOrderState = (orders, baglantiTipi) => {
    const normalizedOrders = Array.isArray(orders) ? orders : []
    const nextOrderList = normalizedOrders.map((item) => item?.orderNo).filter(Boolean)
    setOrderNo(JSON.stringify(normalizedOrders))
    setOrderList(nextOrderList)
    setOriginalData(normalizedOrders)

    if (String(baglantiTipi) !== '4') {
      const firstThree = nextOrderList.slice(0, 3).map(String)
      setOrderPickerSelection(firstThree)
      setAppliedOrderPickerSelection(firstThree)
    } else {
      setOrderPickerSelection([])
      setAppliedOrderPickerSelection([])
    }
  }

  useEffect(() => {
    if (isDirectCariFlow) {
      const fetchDirectCariData = async () => {
        try {
          setLoading(true)
          const res = await getFirmOrdersByCariKod(directCariReq)
          const selectedCari = Array.isArray(res) && res.length > 0 ? res[0] : null
          if (!selectedCari) {
            setBulkList([])
            setOrderList([])
            setOriginalData([])
            setOrderPickerSelection([])
            setAppliedOrderPickerSelection([])
            return
          }

          setDirectCariMeta(selectedCari)
          const baglantiTipi = String(selectedCari.cariBaglantiTipi ?? '')
          const orders = Array.isArray(selectedCari.orderList) ? selectedCari.orderList : []
          const count = Number(selectedCari.orderLineItemCount ?? orders.length)

          hydrateOrderState(orders, baglantiTipi)
          setSelectedOrderList([])

          if (baglantiTipi === '4' || count > 100) {
            setOpen(true)
          } else if (orders.length > 0) {
            setInitialOrderNosForFetch(
              orders
                .slice(0, 3)
                .map((item) => String(item.orderNo))
                .filter(Boolean)
            )
          } else {
            setBulkList([])
          }
        } catch (err) {
          notifyError(err.message)
        } finally {
          setLoading(false)
        }
      }

      fetchDirectCariData()
      return
    }

    const count = Number(searchParams.get('orderCount'))
    const rawOrderNo = searchParams.get('orderNo')
    setOrderNo(rawOrderNo || '')
    let nextOrderList = []
    if (rawOrderNo) {
      try {
        const parsedList = JSON.parse(rawOrderNo)
        nextOrderList = Array.isArray(parsedList) ? parsedList.map((item) => item.orderNo).filter(Boolean) : []
        setOrderList(nextOrderList)
        setOriginalData(Array.isArray(parsedList) ? parsedList : [])
        if (routeCariBaglantiTipi !== '4') {
          const firstThree = nextOrderList.slice(0, 3).map(String)
          setOrderPickerSelection(firstThree)
          setAppliedOrderPickerSelection(firstThree)
        } else {
          setOrderPickerSelection([])
          setAppliedOrderPickerSelection([])
        }
      } catch (err) {
        setOrderList([])
        setOriginalData([])
      }
    } else {
      setOrderList([])
      setOriginalData([])
      setOrderPickerSelection([])
      setAppliedOrderPickerSelection([])
    }
    if (routeCariBaglantiTipi === '4' || count > 100) {
      setOpen(true)
      setSelectedOrderList([])
    } else {
      if (rawOrderNo && nextOrderList.length > 0) {
        setInitialOrderNosForFetch(nextOrderList.slice(0, 3).map(String))
      } else {
        fetchBulkListData()
      }
    }
  }, [searchParams, routeCariBaglantiTipi, depoCode, isDirectCariFlow, cariCode])

  useEffect(() => {
    if (initialOrderNosForFetch.length === 0) return
    const fetchInitialOrders = async () => {
      try {
        setLoading(true)
        const res = await getOrderDetailListByOrderNos(initialLoadReq)
        if (res) {
          const list = Array.isArray(res) ? res : []
          setBulkList(list)
          const firstItem = list[0]
          if (firstItem) {
            setSevkAddressInfo({
              sevkAddressId: firstItem.addressNo,
              sevkAddress: firstItem.sevkAddress,
              sevkTel: firstItem.sevkTel,
              sevkMuhatap: firstItem.sevkMuhatap,
              sevkAcikAdres: firstItem.sevkAcikAdres,
            })
          }
        }
      } catch (err) {
        notifyError(err.message)
      } finally {
        setLoading(false)
        setInitialOrderNosForFetch([])
      }
    }
    fetchInitialOrders()
  }, [initialOrderNosForFetch.length])

  useEffect(() => {
    setSelectionModel([])
  }, [bulkList])

  return (
    <Grid
      container
      spacing={2}
      sx={{
        padding: 2,
      }}
    >
      <ActionHeader title="Sipariş Listesi" hide={true} />

      <Grid size={12}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          sx={{
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            mb: 1,
          }}
        >
          <Alert severity="info">Birden fazla sipariş seçebilirsiniz. MG ile diğer tipler birlikte seçilemez.</Alert>
          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            sx={{
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Chip size="small" label={`Seçili: ${appliedOrderPickerNos.length}`} />
            <Button variant="outlined" onClick={handleOpen}>
              Sipariş Seç
            </Button>
          </Stack>
        </Stack>
        {appliedOrderPickerNos.length > 0 && (
          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            sx={{
              flexWrap: 'wrap',
            }}
          >
            {appliedOrderPickerNos.map((orderNo) => (
              <Chip key={orderNo} size="small" variant="outlined" label={orderLabelMap[orderNo] || orderNo} />
            ))}
          </Stack>
        )}

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={1.5}
          sx={{
            alignItems: { xs: 'flex-start', md: 'center' },
            justifyContent: 'space-between',
            mt: 1.5,
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            sx={{
              flexWrap: 'wrap',
            }}
          >
            <Chip
              label={`Tümü (${bulkList.length})`}
              color={statusFilter === 'all' ? 'primary' : 'default'}
              variant={statusFilter === 'all' ? 'filled' : 'outlined'}
              onClick={() => setStatusFilter('all')}
              size="small"
            />
            <Chip
              label={`Seçilebilir (${selectableCount})`}
              color={statusFilter === 'selectable' ? 'success' : 'default'}
              variant={statusFilter === 'selectable' ? 'filled' : 'outlined'}
              onClick={() => setStatusFilter('selectable')}
              size="small"
            />
            <Chip
              label={`Onaysız (${bulkList.filter(isOnaysiz).length})`}
              color={statusFilter === 'onaysiz' ? 'error' : 'default'}
              variant={statusFilter === 'onaysiz' ? 'filled' : 'outlined'}
              onClick={() => setStatusFilter('onaysiz')}
              size="small"
            />
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            sx={{
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
              }}
            >
              Toplam: <strong>{bulkList.length}</strong>
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
              }}
            >
              ·
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'success.main',
              }}
            >
              Seçilebilir: <strong>{selectableCount}</strong>
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
              }}
            >
              ·
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'primary.main',
              }}
            >
              Seçili: <strong>{selectionModel.length}</strong>
            </Typography>
          </Stack>
        </Stack>
      </Grid>

      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              width: { xs: '100%', sm: 520 },
              p: 2,
              mt: `${drawerTopOffset}px`,
              height: `calc(100% - ${drawerTopOffset}px)`,
            },
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 1,
          }}
        >
          <Typography variant="h6">Müşteri Sipariş Listesi</Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Alert severity="info" sx={{ mb: 2 }}>
          Birden fazla sipariş seçebilirsiniz. MG ile diğer tipler birlikte seçilemez. Onaysız ve aktif siparişler seçilemez.
        </Alert>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Aynı Cariye ait siparişler birlikte seçilebilir; farklı Carilere ait siparişleri aynı anda seçemezsiniz.
        </Alert>
        <Divider sx={{ mb: 2 }} />
        <MultiSelectItem options={orderList} selectedValues={orderPickerNos} handleChangeValues={setOrderPickerSelection} label={'Siparişler'} originalData={originalData} />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: 2,
          }}
        >
          <Chip size="small" label={`Seçili: ${orderPickerNos.length}`} />
          <Button variant="contained" onClick={handleOrderComplete} disabled={orderPickerNos.length === 0 || loading}>
            Siparişleri Getir
          </Button>
        </Box>
      </Drawer>

      <Grid size={12}>
        <TablePanel title="Sipariş Listesi" meta={<Chip size="small" variant="outlined" label={`${filteredBulkList.length} sipariş`} />}>
          <StyledDataGrid
            rows={filteredBulkList}
            columns={columns}
            sx={{ height: 'calc(100vh - 440px)', minHeight: 500 }}
            getRowId={(row) => row.id}
            getRowClassName={(params) => {
              const row = params.row
              return isRowSelectableData(row) ? '' : 'not-selectable-row'
            }}
            checkboxSelection
            selectionModel={selectionModel}
            onRowSelectionModelChange={(model) => {
              let newSelection = selectionModelToIds(model, filteredBulkList)
              const beforeFilterCount = newSelection.length
              let selectedOrders = bulkList.filter((item) => newSelection.includes(item.id))
              selectedOrders = selectedOrders.filter(isRowSelectableData)
              const droppedBySelectability = beforeFilterCount - selectedOrders.length
              newSelection = selectedOrders.map((o) => o.id)

              const hasMG = selectedOrders.some((o) => isMGOrder(o.orderNo))
              const hasOthers = selectedOrders.some((o) => isOtherOrder(o.orderNo))

              if (hasMG && hasOthers) {
                const keepMG = selectedOrders.filter((o) => isMGOrder(o.orderNo))
                const keepOthers = selectedOrders.filter((o) => isOtherOrder(o.orderNo))

                const previousType = selectionModel.length > 0 ? (isMGOrder(bulkList.find((o) => o.id === selectionModel[0])?.orderNo) ? 'MG' : 'Other') : null

                const lastSelectedId = newSelection[newSelection.length - 1]
                const lastSelectedOrder = bulkList.find((o) => o.id === lastSelectedId)
                const fallbackType = isMGOrder(lastSelectedOrder?.orderNo) ? 'MG' : 'Other'

                const preferredType = previousType || fallbackType
                const finalOrders = preferredType === 'MG' ? keepMG : keepOthers
                const droppedLabel = preferredType === 'MG' ? 'Diğer' : 'MG'

                notify(`MG ile diğer tipler birlikte seçilemez. ${preferredType === 'MG' ? 'MG' : 'Diğer'} siparişler korundu, ${droppedLabel} siparişler kaldırıldı.`)

                setSelectionModel(finalOrders.map((o) => o.id))
                setSelectedOrderList(finalOrders)
                return
              }

              if (droppedBySelectability > 0) {
                notify(`${droppedBySelectability} sipariş seçilemediği için seçimden çıkarıldı.`)
              }

              setSelectionModel(newSelection)
              setSelectedOrderList(selectedOrders)
            }}
            disableSelectionOnClick
            isRowSelectable={(params) => {
              const row = params.row

              if (!isRowSelectableData(row)) return false

              const rowIsMG = isMGOrder(row.orderNo)

              const selectionHasMG = selectionModel.some((id) => {
                const order = bulkList.find((o) => o.id === id)
                return isMGOrder(order?.orderNo)
              })

              const selectionHasOthers = selectionModel.some((id) => {
                const order = bulkList.find((o) => o.id === id)
                return isOtherOrder(order?.orderNo)
              })

              if (selectionHasMG) return rowIsMG
              if (selectionHasOthers) return !rowIsMG

              return true
            }}
            loading={loading}
            slots={{
              loadingOverlay: GridLoadingOverlay,
              toolbar: GridToolbar,
            }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            showToolbar
          />
        </TablePanel>
      </Grid>

      <Button
        onClick={handleAssignedProduct}
        size="large"
        variant="contained"
        sx={{
          position: 'fixed',
          right: !isMobile && 26,
          bottom: 26,
          left: isMobile && 26,
        }}
      >
        <AddIcon />
      </Button>

      {isPressed && (
        <DispatchAssignDialog
          isPressed={isPressed}
          setPressed={setPressed}
          opType={'MSK'}
          firmName={effectiveFirmName}
          firmCode={effectiveFirmCode}
          transferDepoCode={transferDepoCode}
          cariBaglantiTipi={effectiveCariBaglantiTipi}
          orderNo={orderNo}
          menuId={menuId}
          sevkAddressInfo={sevkAddressInfo}
          bolgeKodu={effectiveBolgeKodu}
          orderList={assignOrderList}
          selectedOrderNos={selectedRowOrderNos}
        />
      )}
    </Grid>
  )
}
