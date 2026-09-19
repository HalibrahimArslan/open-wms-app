import {
  Box,
  Button,
  Stack,
  TextField,
  useTheme,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  CircularProgress,
  LinearProgress,
  Avatar,
  Chip,
} from '@mui/material'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import PrintIcon from '@mui/icons-material/Print'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import UniqueBarcodeOrderList from './UniqueBarcodeOrderList'
import UniqueBarcodeListPanel from './UniqueBarcodeListPanel'
import BarcodePrintDialog from './BarcodePrintDialog'
import { generateDocument } from '../../services/PrintService'
import useAuthHeader from '../../hooks/useAuthHeader'
import usePayload from '../../hooks/usePayload'
import { getAddressList } from '../../services/AdressService'
import { getOrderDetailByOrderNo, getFirmOrderBulkList, malKabul } from '../../services/MikroService'
import { createUniqueBarcodes, getUniqueBarcodeByCode } from '../../services/UniqueBarcodeService'
import { getStockInfo } from '../../services/StockInfoService'
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner'
import { suspendOrders, getOrderDetailByFirmCodeAndOrderNo, saveOrderWithoutAssign } from '../../services/OrderDetailService'
import { notify, notifyError } from '../../layout/Layout'
import InvoiceDialog from '../../components/Dialog/InvoiceDialog'
import OrderQuantityInput from '../../components/Card/OrderQuantityInput'
import produce from 'immer'
import AurDialog from '../../shared/components/Dialog/AurDialog'
import UniqueBarcodeSummaryModal from './UniqueBarcodeSummaryModal'
import groupBy, { generatePayload } from '../../utils/Utils'
import { useContainer } from 'unstated-next'
import { DataStore } from '../../store/DataStore'
import useDepoCode from '../../hooks/useDepoCode'
import ConfirmDialog from '../../components/Dialog/ConfirmDialog'
import { createOrderPayloads } from './UniqueBarcodeHelper'
import { DepoContainer } from '../../store/DepoContainer'
import { getWarehouses } from '../../services/WarehouseService'
import BulkListDrawer from './BulkListDrawer'
import CenterizedBox from '../../shared/components/Box/CenterizedBox'
import BRAND from '../../config/brand'
const PRINT_CHUNK_SIZE = 60

// Parça barkodlarının saklandığı bileşik anahtar. Bileşen state'ine bağlı olmadığı için
// modül seviyesinde tanımlı; böylece useCallback bağımlılıklarını bozmadan kullanılabilir.
const pieceKey = (parentStokKodu, pieceStokKodu) => `${parentStokKodu}|${pieceStokKodu}`

const chunkArray = (arr, size) => {
  const out = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

// orderDetail response'unda ölçüler `physicalAttributes` altında nested gelir; eski (düz) şema
// hâlâ desteklensin diye önce düz alan, yoksa physicalAttributes okunur.
const pickDimensions = (src) => {
  const pa = src?.physicalAttributes || {}
  return {
    genislik: src?.genislik ?? pa.genislik ?? '',
    derinlik: src?.derinlik ?? pa.derinlik ?? '',
    yukseklik: src?.yukseklik ?? pa.yukseklik ?? '',
    agirlik: src?.agirlik ?? pa.agirlik ?? '',
    birimIciAdet: src?.birimIciAdet ?? '',
  }
}

function dataUrlToBlobUrl(dataUrl) {
  try {
    const [meta, b64] = dataUrl.split(',')
    const mime = (meta.match(/:(.*?);/) || [])[1] || 'application/pdf'
    const bin = atob(b64)
    const bytes = new Uint8Array(bin.length)
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
    return URL.createObjectURL(new Blob([bytes], { type: mime }))
  } catch (e) {
    return dataUrl
  }
}

function openPdfInNewTab(dataUrl) {
  const blobUrl = dataUrlToBlobUrl(dataUrl)
  window.open(blobUrl, '_blank')
  if (blobUrl !== dataUrl) setTimeout(() => URL.revokeObjectURL(blobUrl), 60000)
}

export default function UniqueBarcodeContainer() {
  const headers = useAuthHeader()
  const navigate = useNavigate()
  const theme = useTheme()
  const { account } = useContainer(DataStore)
  const { warehouseList } = useContainer(DepoContainer)
  const { menuId, opType, orderInfo, firmCode, firmName } = useParams()
  const depoCode = useDepoCode()

  const [orderDetail, setOrderDetail] = useState([])
  const [situation, setSituation] = useState(false)
  const [value, setValue] = useState('')
  const [show, setShow] = useState(false)
  const [modal, setModal] = useState(false)
  const [kabul, setKabul] = useState('')
  const [apiList, setApiList] = useState([])
  const [isExist, setIsExist] = useState([])
  const [order, setOrder] = useState({
    orderInfo: '',
    orderId: null,
  })
  const [malkabulButton, setMalKabulButton] = useState(false)
  const [open, setOpen] = useState(false)
  const [isCancel, setIsCancel] = useState(false)
  const [irsaliyeInformation, setIrsaliyeInformation] = useState({})
  const [bulkList, setBulkList] = useState([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [checked, setChecked] = React.useState([0])
  const [depoList, setDepoList] = useState([])
  const [selectedDepoList, setSelectedDepoList] = useState([Number(depoCode)])
  const [isLoading, setLoading] = useState(false)
  const [orderListLoading, setOrderListLoading] = useState(true)
  const [temporaryAddresses, setTemporaryAddresses] = useState([])
  const [selectedTemporaryAddress, setSelectedTemporaryAddress] = useState(null)
  const [lotScan, setLotScan] = useState({ open: false, stokKodu: null, scanned: '', order: null, data: null, candidate: null })

  const [dialog, setDialogs] = useState({
    confirmDialogOpen: false,
    moreAmountDialogOpen: false,
  })

  const [reservationDataList, setReservationDataList] = useState([])

  const [lotStokSet, setLotStokSet] = useState(() => new Set())

  const [barcodeMap, setBarcodeMap] = useState({})
  // Parça bazında toplanan (teslim) miktarları. Anahtar: `${parentStokKodu}|${pieceStokKodu}`
  const [pieceReceipts, setPieceReceipts] = useState({})
  // Okutulan stok kodu hem bağımsız kalem hem parça olabildiğinde kullanıcıya seçtirme dialogu
  const [pieceSelect, setPieceSelect] = useState({ open: false, candidates: [], scanned: '', data: null })
  const [barcodeDialog, setBarcodeDialog] = useState({ open: false, row: null })
  const [barcodePrintLoading, setBarcodePrintLoading] = useState(false)
  const [selectedStokKodu, setSelectedStokKodu] = useState(null)
  // Drawer seçimi: bağımsız kalem stok koduyla, parça bileşik anahtarla (`${anaÜrün}|${parça}`) açılır.
  // mapKey -> barcodeMap anahtarı, product -> başlık, source -> yazdırma alanları.
  const [panel, setPanel] = useState({ open: false, mapKey: null, product: null, source: null })
  const [panelPrintLoading, setPanelPrintLoading] = useState(false)
  const [printQueue, setPrintQueue] = useState({ open: false, items: [] })

  const orderItems = useRef([])
  const printWinRef = useRef(null)

  let barkodSipUid = ''

  const bulkListPayload = usePayload({
    depoList: [Number(depoCode), ...selectedDepoList],
    firmCode: firmCode,
    sipTip: 1,
    transGroupCode: '',
  })

  const handleSelectedAddress = (address) => {
    setSelectedTemporaryAddress(address)
  }

  const handleCloseDialog = useCallback(() => setDialogOpen(false), [])

  const handleReservationChange = (stokKodu, key, value) => {
    setReservationDataList((prev) => {
      const existing = prev.find((item) => item.stokKodu === stokKodu)

      if (key === 'isReserve' && value === 'H') {
        return prev.filter((item) => item.stokKodu !== stokKodu)
      }

      if (!existing) {
        return [...prev, { stokKodu, isReserve: 'H', reserveNo: '', description: '', [key]: value }]
      }

      return prev.map((item) => (item.stokKodu === stokKodu ? { ...item, [key]: value } : item))
    })
  }

  const handleChange = (event) => {
    setValue(event.target.value)
  }
  const handleChangeKabul = (event) => {
    setKabul(event.target.value)
  }
  const handleComplete = () => {
    setOpen(true)
  }

  const handleCloseIrsaliye = () => {
    setOpen(false)
    setModal(true)
  }

  const handleStart = useCallback((barcode) => {
    setValue(barcode)
    setShow(true)
  }, [])

  const handleOpenBarcodeDialog = useCallback(
    (row) => {
      setSelectedStokKodu(row.stokKodu)
      const source = apiList.find((x) => x.stokKodu === row.stokKodu)
      setBarcodeDialog({
        open: true,
        row: { ...row, stokBirimi: source?.stokBirimi ?? row.stokBirimi, lotBasedTracking: row.lotBasedTracking ?? lotStokSet.has(row.stokKodu) },
      })
    },
    [apiList, lotStokSet]
  )

  // Bağımsız/normal ürün satırı: drawer'ı stok koduyla açar. Parçalı ana ürün: açmaz (parçalara tıklanır).
  const handleSelectBarcodeRow = useCallback(
    (row) => {
      if (row.hasPiece) return
      setSelectedStokKodu(row.stokKodu)
      const source = apiList.find((x) => x.stokKodu === row.stokKodu) || row
      setPanel({ open: true, mapKey: row.stokKodu, product: row, source })
    },
    [apiList]
  )

  // Parça satırı: drawer'ı bileşik anahtarla (`${anaÜrün}|${parça}`) açar; o parçanın okutulan barkodları görünür.
  const handleSelectPieceRow = useCallback((parentRow, piece) => {
    const mapKey = pieceKey(parentRow.stokKodu, piece.stokKodu)
    const product = {
      stokKodu: piece.stokKodu,
      stokAdi: piece.stokAdi,
      barkod: piece.barkod,
      stokBirimi: piece.stokBirimi,
      lotBasedTracking: piece.lotBasedTracking ?? false,
    }
    const source = {
      stokKodu: piece.stokKodu,
      stokAdi: piece.stokAdi,
      barkod: piece.barkod,
      stokBirimi: piece.stokBirimi || 'ADET',
      anaGrup: piece.anaGrup ?? parentRow?.anaGrup ?? parentRow?.anaGrupAdi ?? '',
      kategoriAdi: piece.kategoriAdi ?? parentRow?.kategoriAdi ?? '',
      physicalAttributes: piece.physicalAttributes ?? null,
    }
    setPanel({ open: true, mapKey, product, source })
  }, [])

  const handleCloseBarcodeDialog = () => {
    setBarcodeDialog({ open: false, row: null })
  }

  const markBarcodeScanned = (stokKodu, scannedCode, info = {}) => {
    if (!stokKodu || !scannedCode) return
    const raw = info.raw || {
      barcode: scannedCode,
      quantity: info.quantity,
      description: info.description ?? {},
      status: 'RECEIVING_SCANNED',
    }
    setBarcodeMap((prev) => {
      const list = (prev[stokKodu] || []).filter((b) => b.code !== scannedCode)
      return { ...prev, [stokKodu]: [...list, { id: info.id, code: scannedCode, used: true, raw }] }
    })
    setSelectedStokKodu(stokKodu)
  }

  // Parça barkodları bileşik anahtarla (`${anaÜrün}|${parça}`) saklanır; aynı stok kodlu
  // bağımsız kalemin veya başka bir ana ürünün parçasının barkodlarıyla karışmaz.
  // Not: setSelectedStokKodu çağrılmaz (drawer/panel stokKodu tabanlı, parçalar için kullanılmaz).
  const markPieceBarcodeScanned = (mapKey, scannedCode, info = {}) => {
    if (!mapKey || !scannedCode) return
    const raw = info.raw || {
      barcode: scannedCode,
      quantity: info.quantity,
      description: info.description ?? {},
      status: 'RECEIVING_SCANNED',
    }
    setBarcodeMap((prev) => {
      const list = (prev[mapKey] || []).filter((b) => b.code !== scannedCode)
      return { ...prev, [mapKey]: [...list, { id: info.id, code: scannedCode, used: true, raw }] }
    })
  }

  const formatReceivingDate = (date) => `${String(date.getFullYear()).slice(-2)}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`

  const handleGenerateBarcodes = async (items) => {
    const row = barcodeDialog.row
    if (!row || !Array.isArray(items) || items.length === 0) {
      notifyError('Geçerli bir miktar giriniz')
      return
    }

    setBarcodePrintLoading(true)
    try {
      const source = apiList.find((x) => x.stokKodu === row.stokKodu) || {}
      // Parça satırında zengin alanlar (anaGrup, kategori, birim, ölçüler) row üzerinde taşınır
      // (parçanın product kaydından); bağımsız kalemde apiList (orderDetail) kaydından okunur.
      const fieldSrc = row.isPiece ? row : source

      const product = {
        barcode: row.barkod,
        companyCode: account?.companyCode,
        stokAdi: row.stokAdi,
        stokKodu: row.stokKodu,
        anaGrup: fieldSrc.anaGrup ?? fieldSrc.anaGrupAdi ?? '',
        kategoriAdi: fieldSrc.kategoriAdi ?? '',
        stokBirimi: fieldSrc.stokBirimi ?? row.stokBirimi ?? '',
        description: '',
        sktFlag: false,
      }

      const requestBody = items.map((it) => ({
        product,
        customerCode: firmCode,
        erpOrderNo: orderInfo,
        receivingDate: formatReceivingDate(new Date()),
        adet: it.adet,
        quantity: it.quantity,
        referenceAmount: row.siparisMiktar,
        description: it.en != null && it.boy != null ? { en: String(it.en), boy: String(it.boy) } : {},
        status: 'CREATED',
        // Parçalı ürünün parçası ise barkodu ilgili parça (paket) kaydına bağla
        ...(row.isPiece ? { partialItemId: row.partialItemId } : {}),
      }))

      const res = await createUniqueBarcodes(generatePayload(requestBody))

      const dimensions = pickDimensions(fieldSrc)
      const generated = (res || []).map((b) => ({
        id: b.id,
        code: b.barcode,
        used: b.status === 'RECEIVING_SCANNED',
        raw: { ...b, ...dimensions },
      }))

      setSelectedStokKodu(row.stokKodu)
      const uniqueGeneratedCount = new Set(generated.map((g) => g.code)).size
      notify(`${uniqueGeneratedCount} adet barkod üretildi`)
      handleCloseBarcodeDialog()

      await printBarcodes(row, generated)
    } catch (error) {
      notifyError(error.message || 'Barkod üretimi sırasında hata oluştu')
    } finally {
      setBarcodePrintLoading(false)
    }
  }

  const printChunk = async (chunk) => {
    const payload = generatePayload({
      data: chunk,
      template: 'unique-barkod-etiketi.pug',
      format: 'a4',
      locale: 'tr',
      landscape: false,
    })
    const res = await generateDocument(payload)
    return res ? dataUrlToBlobUrl(res) : null
  }

  const patchQueueItem = (i, patch) =>
    setPrintQueue((prev) => ({
      ...prev,
      items: prev.items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)),
    }))

  const printBarcodeDocs = async (rawList) => {
    const chunks = chunkArray(rawList, PRINT_CHUNK_SIZE)
    if (chunks.length === 0) return
    setPrintQueue({
      open: true,
      items: chunks.map((c) => ({ count: c.length, status: 'pending', url: null })),
    })

    const urls = []
    for (let i = 0; i < chunks.length; i++) {
      patchQueueItem(i, { status: 'loading' })
      let url = null
      try {
        url = await printChunk(chunks[i])
      } catch (e) {
        url = null
      }
      urls[i] = url
      patchQueueItem(i, url ? { status: 'ready', url } : { status: 'error' })
    }

    if (chunks.length === 1 && urls[0]) {
      window.open(urls[0], '_blank')
      setTimeout(() => URL.revokeObjectURL(urls[0]), 60000)
      setPrintQueue({ open: false, items: [] })
    }
  }

  const openQueuedChunk = (item) => {
    if (!item || item.status !== 'ready' || !item.url) return
    if (printWinRef.current && !printWinRef.current.closed) {
      printWinRef.current.location.href = item.url
      printWinRef.current.focus()
    } else {
      printWinRef.current = window.open(item.url, 'barkod_print_tab')
    }
  }

  const closePrintQueue = () => {
    printQueue.items.forEach((it) => it.url && URL.revokeObjectURL(it.url))
    setPrintQueue({ open: false, items: [] })
  }

  const renderPrintQueue = () => {
    const { open, items } = printQueue
    const total = items.length
    const doneCount = items.filter((it) => it.status === 'ready' || it.status === 'error').length
    const generating = items.some((it) => it.status === 'pending' || it.status === 'loading')
    const progressPct = total ? (doneCount / total) * 100 : 0
    const badgeColor = (s) => (s === 'ready' ? 'success.main' : s === 'error' ? 'error.main' : s === 'loading' ? 'primary.main' : 'grey.400')

    return (
      <Dialog open={open} onClose={generating ? undefined : closePrintQueue} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PictureAsPdfIcon color="primary" />
          Barkod Yazdırma
        </DialogTitle>

        <Box sx={{ px: 3, pb: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
            <Typography variant="body2" color="text.secondary">
              {generating ? 'Parçalar hazırlanıyor…' : 'Tüm parçalar hazır'}
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              {doneCount} / {total}
            </Typography>
          </Stack>
          <LinearProgress variant={generating && doneCount === 0 ? 'indeterminate' : 'determinate'} value={progressPct} sx={{ borderRadius: 1, height: 6 }} />
        </Box>

        <DialogContent dividers sx={{ pt: 1.5 }}>
          <Typography variant="caption" color="text.secondary">
            Barkodlar {total} parçaya bölündü. Her parça hazır oldukça açıp yazdırabilirsiniz.
          </Typography>
          <Stack spacing={1} mt={1.5}>
            {items.map((it, i) => (
              <Stack
                key={i}
                direction="row"
                alignItems="center"
                spacing={1.5}
                sx={{
                  border: '1px solid',
                  borderColor: it.status === 'ready' ? 'success.light' : 'divider',
                  borderRadius: 1.5,
                  p: 1,
                  bgcolor: it.status === 'ready' ? 'action.hover' : 'transparent',
                  opacity: it.status === 'pending' ? 0.55 : 1,
                  transition: 'all .2s',
                }}
              >
                <Avatar variant="rounded" sx={{ bgcolor: badgeColor(it.status), width: 40, height: 40 }}>
                  {it.status === 'ready' ? <CheckCircleIcon /> : it.status === 'error' ? <ErrorOutlineIcon /> : <PictureAsPdfIcon />}
                </Avatar>

                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Parça {i + 1}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {it.count} barkod
                  </Typography>
                </Box>

                {it.status === 'pending' && <Chip size="small" label="Sırada" variant="outlined" />}
                {it.status === 'loading' && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CircularProgress size={20} />
                    <Typography variant="caption" color="text.secondary">
                      Hazırlanıyor…
                    </Typography>
                  </Stack>
                )}
                {it.status === 'error' && (
                  <Typography variant="caption" color="error" fontWeight={600}>
                    Hata
                  </Typography>
                )}
                {it.status === 'ready' && (
                  <Button size="small" variant="contained" startIcon={<PrintIcon />} onClick={() => openQueuedChunk(it)} sx={{ whiteSpace: 'nowrap' }}>
                    Aç / Yazdır
                  </Button>
                )}
              </Stack>
            ))}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={closePrintQueue} disabled={generating} color="inherit" variant="outlined">
            {generating ? 'Lütfen bekleyin…' : 'Kapat'}
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  const printBarcodes = async (row, generated) => {
    setBarcodePrintLoading(true)
    try {
      await printBarcodeDocs(generated.map((b) => b.raw))
    } catch (error) {
      notifyError(error.message || 'Barkod yazdırma sırasında hata oluştu')
    } finally {
      setBarcodePrintLoading(false)
    }
  }

  const handlePrintScanned = async (selectedBarcodes) => {
    if (!selectedBarcodes || selectedBarcodes.length === 0) {
      notifyError('Yazdırmak için en az bir barkod seçiniz')
      return
    }
    setPanelPrintLoading(true)
    try {
      const src = panel.source || apiList.find((x) => x.stokKodu === selectedStokKodu) || orderDetail.find((x) => x.stokKodu === selectedStokKodu) || {}
      const productFields = {
        stokKodu: src.stokKodu,
        stokAdi: src.stokAdi,
        anaGrup: src.anaGrup ?? src.anaGrupAdi ?? '',
        kategoriAdi: src.kategoriAdi ?? '',
        stokBirimi: src.stokBirimi ?? '',
        barkod: src.barkod,
        ...pickDimensions(src),
      }
      const rawList = selectedBarcodes.map((b) => ({
        ...productFields,
        ...(b.raw || { barcode: b.code, quantity: 1, status: 'RECEIVING_SCANNED' }),
      }))
      await printBarcodeDocs(rawList)
    } catch (error) {
      notifyError(error.message || 'Barkod yazdırma sırasında hata oluştu')
    } finally {
      setPanelPrintLoading(false)
    }
  }

  const handleApiList = useCallback(() => {
    let relatedList = []
    bulkList.forEach((item) => {
      if (checked.some((todo) => todo === item.sipUid)) {
        let obj = {
          barkod: item.barkod,
          durum: item.durum,
          hasPiece: false,
          onaylayanKullanici: '',
          partialList: [],
          planlananSevkTarihi: null,
          sipUid: item.sipUid,
          stokAdi: item.stokAdi,
          stokBirimi: item.stokBirimi,
          stokKodu: item.stokKodu,
          teslimMiktar: item.teslimMiktar,
          teslimTarihi: item.teslimTarihi,
          siparisMiktar: item.siparisMiktar,
          ...pickDimensions(item),
        }
        relatedList.push(obj)
      }
    })

    setApiList(apiList.concat(relatedList))
    handleCloseDialog()
  }, [bulkList, checked, apiList, handleCloseDialog])

  function requestOptionsUpdate(headers, aurTmpDetailList, opType, orderInfo, status, firmCode, depoNo, firmName) {
    let dto = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        aurTmpDetailList,
        opType,
        orderInfo,
        status,
        firmCode,
        depoNo,
        firmName,
        addressId: '1',
        cariBaglantiTipi: '1',
        cariCode: '',
        orderDepoCode: Number(depoNo),
      }),
    }

    return dto
  }

  const updateAurTmpDetail = async () => {
    setDialogs((prev) => ({ ...prev, moreAmountDialogOpen: false }))
    const res = await fetchAurTmpDetail(requestOptionsUpdate(headers, orderItems.current, opType, order.orderInfo, 'IN_PROGRESS', firmCode, depoCode, firmName))
    if (res) {
      const scanned = orderItems.current?.[0]
      setOrderDetail(
        produce((draft) => {
          draft.map((x) => {
            if (x.stokKodu === scanned?.stokKodu) {
              x.teslimMiktar = kabul
            }
          })
        })
      )
      markBarcodeScanned(scanned?.stokKodu, scanned?.uniqueBarcodeAssign?.barcode, {
        quantity: scanned?.uniqueBarcodeAssign?.quantity,
      })
    }

    setValue('')
    setKabul('')
    setShow(false)
  }

  const fetchAurTmpDetail = async (payload) => {
    try {
      const res = await saveOrderWithoutAssign(payload)
      if (res) {
        setOrder({
          orderId: res.id,
          orderInfo: res.orderInfo,
        })
        notify('İşlem Tamamlandı')
        return true
      }
    } catch (e) {
      notifyError(e.message)
    }
  }

  const fetchBulkOrderList = async () => {
    try {
      setLoading(true)
      const res = await getFirmOrderBulkList(bulkListPayload)
      res && setBulkList(res)
    } catch (e) {
      notifyError('Hata' + e)
    } finally {
      setLoading(false)
    }
  }

  const fetchDepoData = async () => {
    try {
      let query = `real.equals=true&companyCode.equals=${account?.companyCode}`
      const res = await getWarehouses(headers, query)
      res && setDepoList(res)
    } catch (e) {
      notifyError('Hata' + e)
    }
  }

  const fetchLotStocks = async () => {
    try {
      const query = `page=0&size=2000&companyCode.equals=${account?.companyCode}&lotBasedTracking.equals=true`
      const { data } = await getStockInfo(headers, query)
      setLotStokSet(new Set((data || []).map((x) => x.stokKodu)))
    } catch (e) {}
  }

  const handleAddDepoList = useCallback((depoCode) => {
    setSelectedDepoList((prev) => (prev.find((q) => q === depoCode) ? prev.filter((q) => q !== depoCode) : [...prev, depoCode]))
  }, [])

  // isExist kaydından parça id'sini (aurPartialItemId) okur (alan adı backend'e göre değişebilir).
  const readPartialItemId = (item) => item?.aurPartialItemId ?? item?.partialItemId ?? null

  // Parça stok kodu + aurPartialItemId ile ana ürünü (parent) kesin olarak bulur.
  // Aynı stok kodu birden çok yerde olabildiği için sadece stok koduyla değil id ile eşleştirilir.
  const findPieceContextById = (pieceStokKodu, aurPartialItemId) => {
    for (const parent of apiList) {
      if (!parent?.hasPiece || !Array.isArray(parent.partialList)) continue
      for (const pkg of parent.partialList) {
        const detail = (pkg?.packageDetail || []).find((d) => d.stockCode === pieceStokKodu && (d.aurPartialItem?.id ?? null) === aurPartialItemId)
        if (detail) return { parent, piece: detail, aurPartialItemId }
      }
    }
    return null
  }

  // Parça barkodu toplama: teslim parçanın kendi satırına işlenir, payload'da aurPartialItemId gönderilir.
  const submitPieceReceiving = async (amount, ctx, scannedBarcode, scannedData = null) => {
    if (Number(amount) < 0) {
      notifyError('Negatif Miktar Giremezsiniz')
      return
    }
    const { parent, piece, aurPartialItemId } = ctx
    const key = pieceKey(parent.stokKodu, piece.stockCode)
    const previousAmount = pieceReceipts[key] || 0
    const newTeslim = previousAmount + parseFloat(amount)

    const aurTmpDetailList = {
      stokAdi: piece.stockName,
      // Parça birimi gerçek ürün kaydından (product.stokBirimi) gelir; yoksa ADET'e düşer.
      stokBirimi: piece.product?.stokBirimi ?? 'ADET',
      stokKodu: piece.stockCode,
      barkod: piece.barcode,
      siparisNo: orderInfo,
      sipUid: parent.sipUid,
      // Parçanın sipariş miktarı = ana ürün sipariş miktarı * parça başına adet
      siparisMiktar: parent.siparisMiktar * piece.quantity,
      teslimMiktar: newTeslim,
      status: 'IN_PROGRESS',
      observerAmount: newTeslim,
      aurPartialItemId,
      uniqueBarcodeAssign: { barcode: scannedBarcode, quantity: parseFloat(amount) },
    }

    const res = await fetchAurTmpDetail(requestOptionsUpdate(headers, [aurTmpDetailList], opType, order.orderInfo, 'IN_PROGRESS', firmCode, depoCode, firmName))
    if (res) {
      setPieceReceipts((prev) => ({ ...prev, [key]: newTeslim }))
      markPieceBarcodeScanned(key, scannedBarcode, {
        quantity: parseFloat(amount),
        description: scannedData?.description,
        id: scannedData?.id,
      })
    }
    setValue('')
    setKabul('')
    setShow(false)
  }

  const submitReceiving = async (amount, stokKodu, scannedBarcode, isLot = false, scannedData = null) => {
    if (Number(amount) < 0) {
      notifyError('Negatif Miktar Giremezsiniz')
      return
    }
    const assign = { uniqueBarcodeAssign: { barcode: scannedBarcode, quantity: parseFloat(amount) } }
    var filteredList = orderDetail.filter((todo) => todo.stokKodu === stokKodu)
    let previousAmount = filteredList.length > 0 ? filteredList[0].teslimMiktar : 0

    let updateBody = []
    let response = apiList.filter((todo) => todo.stokKodu === stokKodu)
    let teslimMiktarBulk = 0.0
    response.forEach((x) => (teslimMiktarBulk = x.teslimMiktar + teslimMiktarBulk))
    if (response.length > 1) {
      let referenceValue = parseFloat(amount) + teslimMiktarBulk
      for (let i = 0; i < response.length; i++) {
        if (response[i].siparisMiktar >= referenceValue) {
          let aurTmpDetailList = {
            stokAdi: response[i].stokAdi,
            stokBirimi: response[i].stokBirimi,
            stokKodu: response[i].stokKodu,
            barkod: response[i].barkod,
            siparisNo: orderInfo,
            sipUid: response[i].sipUid,
            siparisMiktar: response[i].siparisMiktar,
            teslimMiktar: referenceValue,
            status: 'IN_PROGRESS',
            observerAmount: referenceValue,
            ...assign,
          }
          updateBody.push(aurTmpDetailList)
          break
        }
        if (response[i].siparisMiktar < referenceValue) {
          let aurTmpDetailList = {
            stokAdi: response[i].stokAdi,
            stokBirimi: response[i].stokBirimi,
            stokKodu: response[i].stokKodu,
            barkod: response[i].barkod,
            siparisNo: orderInfo,
            sipUid: response[i].sipUid,
            siparisMiktar: response[i].siparisMiktar,
            teslimMiktar: response[i].siparisMiktar,
            status: 'IN_PROGRESS',
            observerAmount: response[i].siparisMiktar,
            ...assign,
          }
          updateBody.push(aurTmpDetailList)
          referenceValue = referenceValue - response[i].siparisMiktar
        }
      }
    } else {
      let aurTmpDetailList = {
        stokAdi: response[0].stokAdi,
        stokBirimi: response[0].stokBirimi,
        stokKodu: response[0].stokKodu,
        barkod: response[0].barkod,
        siparisNo: orderInfo,
        sipUid: response[0].sipUid,
        siparisMiktar: response[0].siparisMiktar,
        teslimMiktar: parseFloat(amount) + parseFloat(previousAmount),
        status: 'IN_PROGRESS',
        observerAmount: parseFloat(amount) + parseFloat(previousAmount),
        ...assign,
      }

      updateBody.push(aurTmpDetailList)
    }

    if (amount > filteredList[0].siparisMiktar) {
      orderItems.current = updateBody
      setKabul(amount)
      setDialogs((prev) => ({ ...prev, moreAmountDialogOpen: true }))
      return
    }

    const res = await fetchAurTmpDetail(requestOptionsUpdate(headers, updateBody, opType, order.orderInfo, 'IN_PROGRESS', firmCode, depoCode, firmName))
    if (res) {
      setOrderDetail(
        produce((draft) => {
          draft.map((x) => {
            if (x.stokKodu === stokKodu) {
              x.teslimMiktar = parseFloat(amount) + parseFloat(previousAmount)
            }
          })
        })
      )
      markBarcodeScanned(stokKodu, scannedBarcode, {
        quantity: parseFloat(amount),
        description: scannedData?.description,
        id: scannedData?.id,
      })
    }
    setValue('')
    setKabul('')
    setShow(false)
  }

  // Okutulan stok kodunun olası hedeflerini bulur: bağımsız kalem (orderDetail'de parça olmayan satır)
  // ve/veya parça(lar) (apiList partialList). Aynı stok kodu birden çok hedefte olabilir.
  const resolveScanCandidates = (stokKodu) => {
    const map = new Map()
    const standalone = orderDetail.find((t) => t.stokKodu === stokKodu && !t.hasPiece)
    if (standalone) {
      map.set(`standalone:${stokKodu}`, { type: 'standalone', stokKodu, stokAdi: standalone.stokAdi })
    }
    apiList.forEach((parent) => {
      if (!parent?.hasPiece || !Array.isArray(parent.partialList)) return
      parent.partialList.forEach((pkg) => {
        ;(pkg?.packageDetail || []).forEach((d) => {
          if (d.stockCode !== stokKodu) return
          const aurPartialItemId = d.aurPartialItem?.id ?? null
          const key = `piece:${aurPartialItemId}*${parent.sipUid}`
          if (!map.has(key)) {
            map.set(key, {
              type: 'piece',
              stokKodu,
              stokAdi: d.stockName,
              parent,
              piece: d,
              aurPartialItemId,
            })
          }
        })
      })
    })
    return Array.from(map.values())
  }

  // Aday lot'lu mu? Bağımsız kalemde orderDetail kolonu (barkod datası fallback), parçada kendi ürün kaydı.
  const isCandidateLot = (candidate, data) => {
    if (candidate.type === 'piece') return !!candidate.piece?.product?.lotBasedTracking
    const matched = orderDetail.find((t) => t.stokKodu === candidate.stokKodu)
    return !!(matched?.lotBasedTracking || data?.lotBasedTracking)
  }

  // Lot'lu adayda (stokBirimi ne olursa olsun) miktarı OrderQuantityInput'tan almak için dialogu açar.
  const openLotDialog = (candidate, data, scanned) => {
    let order
    if (candidate.type === 'piece') {
      const { parent, piece } = candidate
      order = {
        stokKodu: piece.stockCode,
        stokAdi: piece.stockName,
        // Parçanın gereken miktarı = ana ürün sipariş miktarı * parça başına adet
        siparisMiktar: (Number(parent.siparisMiktar) || 0) * (Number(piece.quantity) || 0),
        teslimMiktar: pieceReceipts[pieceKey(parent.stokKodu, piece.stockCode)] || 0,
      }
    } else {
      order = orderDetail.find((t) => t.stokKodu === candidate.stokKodu)
    }
    setLotScan({ open: true, stokKodu: candidate.stokKodu, scanned, order, data, candidate })
    setKabul('')
  }

  // Seçilen/tek adaya göre toplama yolunu çalıştırır.
  const routeCandidate = async (candidate, data, scanned) => {
    if (candidate.type === 'piece') {
      await submitPieceReceiving(Number(data.quantity), { parent: candidate.parent, piece: candidate.piece, aurPartialItemId: candidate.aurPartialItemId }, scanned, data)
    } else {
      await submitReceiving(Number(data.quantity), candidate.stokKodu, scanned, false, data)
    }
  }

  const handleSelectCandidate = async (candidate) => {
    const { scanned, data } = pieceSelect
    setPieceSelect({ open: false, candidates: [], scanned: '', data: null })
    // Seçilen aday lot'lu ise (bağımsız/parça fark etmez, stokBirimi fark etmez) miktarı OrderQuantityInput'tan al.
    if (isCandidateLot(candidate, data)) {
      openLotDialog(candidate, data, scanned)
      return
    }
    await routeCandidate(candidate, data, scanned)
  }

  const handleListItemClick = async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      await submitReceiving(kabul, barkodSipUid, value)
    }
  }

  const handleLotQuantityKey = async (event) => {
    if (event.key !== 'Enter') return
    event.preventDefault()
    if (!kabul || Number(kabul) <= 0) {
      notifyError('Geçerli bir miktar giriniz')
      return
    }
    const { stokKodu, scanned, data, candidate } = lotScan
    setLotScan({ open: false, stokKodu: null, scanned: '', order: null, data: null, candidate: null })
    if (candidate?.type === 'piece') {
      await submitPieceReceiving(Number(kabul), { parent: candidate.parent, piece: candidate.piece, aurPartialItemId: candidate.aurPartialItemId }, scanned, data)
    } else {
      await submitReceiving(kabul, stokKodu, scanned, true, data)
    }
  }

  const handleScanEnter = async () => {
    const scanned = value.trim()
    if (!scanned) return
    try {
      const data = await getUniqueBarcodeByCode(headers, scanned)
      if (!data) {
        notifyError('Yanlış Barkod')
        setValue('')
        return
      }
      if (data.status === 'RECEIVING_SCANNED') {
        notifyError('Bu barkod daha önce toplandı.')
        setValue('')
        return
      }
      const stokKodu = data.stokKodu || orderDetail.find((t) => t.barkod === scanned.slice(0, 13))?.stokKodu

      // Okutulan stok kodu hem bağımsız kalem hem parça olabilir; olası hedefleri topla.
      const candidates = resolveScanCandidates(stokKodu)
      if (candidates.length === 0) {
        notifyError('Yanlış Barkod')
        setValue('')
        return
      }

      // Birden çok hedef varsa (ör. aynı kalem hem bağımsız hem parça) kullanıcıya seçtir.
      if (candidates.length > 1) {
        setPieceSelect({ open: true, candidates, scanned, data })
        setValue('')
        return
      }

      // Tek hedef: lot'lu ise (bağımsız/parça fark etmez, stokBirimi ADET dahil) miktar OrderQuantityInput'tan
      // alınır ve otomatik 1 yazılmaz; değilse doğrudan yönlendir.
      const only = candidates[0]
      if (isCandidateLot(only, data)) {
        openLotDialog(only, data, scanned)
        setValue('')
        return
      }
      await routeCandidate(only, data, scanned)
      setValue('')
    } catch (e) {
      notifyError(e.message || 'Barkod sorgulanamadı')
      setValue('')
    }
  }

  async function completeReceiving() {
    const { mikroRequest } = createOrderPayloads(orderDetail, apiList, orderInfo, kabul, reservationDataList, pieceReceipts)

    const irsaliyeRequest = {
      depoNo: depoCode,
      belgeNo: '',
      erpUserCode: '11',
      firmCode: firmCode,
      orderId: order.orderId,
      orderDetailList: mikroRequest,
      orderNo: irsaliyeInformation.seriNo + '-' + irsaliyeInformation.seriNoLast,
      tarih: new Date().toISOString().split('T')[0].concat('T00:00:00.000Z'),
      orderId: order.orderId,
      soforAdi: irsaliyeInformation.soforName,
      soforSoyadi: irsaliyeInformation.soforName,
      soforTckn: irsaliyeInformation.soforTc,
      soforTel: irsaliyeInformation.soforTel,
      aracPlakaNo: irsaliyeInformation.aracPlaka,
      dorsePlakaNo: irsaliyeInformation.dorsePlaka,
      transportationType: irsaliyeInformation.transportationType,
      companyLogistics: irsaliyeInformation.companyLogistics,
      carryType: irsaliyeInformation.carryType,
    }

    try {
      const res = await malKabul(generatePayload(irsaliyeRequest, headers), selectedTemporaryAddress.urunAdresId)
      if (res) {
        notify('Mal Kabul İşlemi Başarılı')
        navigate(`/d:${depoCode}/${menuId}/unique-barcode-firmlist`)
      }
    } catch (error) {
      setMalKabulButton(false)
      const { detail, message } = error
      notifyError(detail || message)
    }
  }

  function handleReceiving() {
    setMalKabulButton(true)
    let completedItems = orderDetail.filter((todo) => todo.teslimMiktar > 0)
    const hasPieceReceipts = Object.values(pieceReceipts).some((v) => Number(v) > 0)

    if (completedItems.length === 0 && !hasPieceReceipts) {
      notifyError('Ürün Listesi Boş')
      setMalKabulButton(false)
      return
    }

    const invalidReserve = reservationDataList.find((r) => r.isReserve === 'E' && !r.reserveNo?.trim())

    if (invalidReserve) {
      notifyError(`"${invalidReserve.stokKodu}" için Reserve No girmediniz`)
      setMalKabulButton(false)
      return
    }

    completeReceiving()
  }

  const fetchOrderList = async () => {
    try {
      setOrderListLoading(true)
      const res = await getOrderDetailByOrderNo(headers, orderInfo, opType === 'FMK' ? 1 : 0, Number(depoCode))
      let filtredList = res && res.filter((x) => x.durum === '0' && x.teslimMiktar < x.siparisMiktar)

      filtredList.forEach((item) => {
        item.siparisMiktar = item.siparisMiktar - item.teslimMiktar
        item.teslimMiktar = 0
      })

      res && setApiList(filtredList)
    } catch (err) {
      notifyError(err.message)
    } finally {
      setOrderListLoading(false)
    }
  }

  const fetchSuspendOrder = async (id) => {
    const res = await suspendOrders(headers, id)
    res && notify('Sipariş Başarıyla Kapatıldı')
  }

  const fetchTemporaryAddresses = async () => {
    const processWarehouse = warehouseList.find((warehouse) => warehouse.code === depoCode)
    if (processWarehouse === undefined) {
      return
    }
    const payload = `geciciAdres.equals=true&status.equals=true&depoNo.equals=${processWarehouse.receivingCode}&companyCode.equals=${account?.companyCode}&sort=adres,asc`
    const res = await getAddressList(headers, payload)
    if (res && res.length > 0) {
      setTemporaryAddresses(res)
      setSelectedTemporaryAddress(res[0])
    }
  }

  const fetchAurTmpListByOrderIdAndOrderIfo = async () => {
    const res = await getOrderDetailByFirmCodeAndOrderNo(headers, depoCode, firmCode, 'FMK', orderInfo)
    res && setIsExist(res)
    res &&
      res.length > 0 &&
      setOrder({
        orderId: res[0].orderId,
        orderInfo: res[0].orderInfo,
      })
    if (res.length > 0) {
      setDialogs((prev) => ({ ...prev, confirmDialogOpen: true }))
    }
  }

  useEffect(() => {
    if (account) {
      fetchDepoData()
      //TODO: Lotlu stoklar için tekrar sorgu atmaya gerek yok. içinde kolon olarak dönüyor.
      fetchLotStocks()
    }
  }, [account])

  useEffect(() => {
    fetchOrderList()
    fetchAurTmpListByOrderIdAndOrderIfo()
  }, [])

  useEffect(() => {
    fetchTemporaryAddresses()
  }, [warehouseList])

  // Dev listeyi sayfa açılışında değil, drawer ilk açıldığında çek.
  // Drawer açıkken depo seçimi değişirse yeniden çek.
  useEffect(() => {
    if (dialogOpen) {
      fetchBulkOrderList()
    }
  }, [dialogOpen, selectedDepoList])

  const createAurTmpList = (stokKodu, stokAdi, barkod, siparisMiktar, teslimMiktar, hasPiece, stokBirimi, partialList = []) => {
    let dto = {
      stokKodu,
      stokAdi,
      barkod,
      siparisMiktar,
      teslimMiktar,
      hasPiece,
      stokBirimi,
      partialList,
    }
    return dto
  }

  useEffect(() => {
    if (isExist.length === 0) return
    const map = {}
    isExist.forEach((item) => {
      if (!(item.uniqueBarcodeList && item.uniqueBarcodeList.length > 0)) return
      const barcodes = item.uniqueBarcodeList.map((b) => ({
        id: b.id,
        code: b.barcode,
        used: b.status === 'RECEIVING_SCANNED',
        raw: b,
      }))
      // Parça kaydıysa (aurPartialItemId dolu) barkodları bileşik anahtarla sakla; aksi halde stok koduyla.
      const apid = readPartialItemId(item)
      let key = item.stokKodu
      if (apid) {
        const ctx = findPieceContextById(item.stokKodu, apid)
        if (ctx) key = pieceKey(ctx.parent.stokKodu, item.stokKodu)
      }
      map[key] = barcodes
    })
    setBarcodeMap((prev) => ({ ...prev, ...map }))
  }, [isExist, apiList])

  // Sayfa yenilendiğinde mevcut parça teslimlerini isExist'ten pieceReceipts'e geri yükle.
  // Sadece parça kayıtları (aurPartialItemId dolu) parent id ile kesin eşleştirilir.
  useEffect(() => {
    if (isCancel) {
      setPieceReceipts({})
      return
    }
    if (isExist.length === 0 || apiList.length === 0) return
    const receipts = {}
    isExist.forEach((item) => {
      if (!item.teslimMiktar) return
      const apid = readPartialItemId(item)
      if (!apid) return
      const ctx = findPieceContextById(item.stokKodu, apid)
      if (!ctx) return
      const key = pieceKey(ctx.parent.stokKodu, item.stokKodu)
      receipts[key] = (receipts[key] || 0) + item.teslimMiktar
    })
    setPieceReceipts(receipts)
  }, [isExist, apiList, isCancel])

  useEffect(() => {
    let detailList = []
    if (apiList.length > 0) {
      let mainList = apiList
      const groupByStockCode = groupBy(mainList, (criteria) => criteria.stokKodu)
      let distinctStockCodes = [...new Set(apiList.map((item) => item.stokKodu))]
      let miktar = 0
      distinctStockCodes.forEach((todo) => {
        let lissst = groupByStockCode.get(todo)
        if (lissst.length > 1) {
          lissst.forEach((x) => {
            miktar = miktar + x.siparisMiktar - x.teslimMiktar
          })
          detailList.push(createAurTmpList(lissst[0].stokKodu, lissst[0].stokAdi, lissst[0].barkod, miktar, 0, lissst[0].hasPiece, lissst[0].stokBirimi, lissst[0].partialList))
        } else {
          detailList.push(
            createAurTmpList(
              lissst[0].stokKodu,
              lissst[0].stokAdi,
              lissst[0].barkod,
              lissst[0].siparisMiktar - lissst[0].teslimMiktar,
              0,
              lissst[0].hasPiece,
              lissst[0].stokBirimi,
              lissst[0].partialList
            )
          )
        }
        miktar = 0
      })
      if (isExist.length > 0 && isCancel === false) {
        detailList.forEach((x) => {
          let amount = 0
          // Aynı stok kodu hem bağımsız kalem hem parça olabilir; bağımsız satırın teslimine
          // sadece parça OLMAYAN (aurPartialItemId boş/0) kayıtlar sayılır. Parçalar pieceReceipts'te.
          let filteredList = isExist.filter((y) => y.stokKodu === x.stokKodu && !readPartialItemId(y))
          filteredList.forEach((item) => {
            amount = item.teslimMiktar + amount
          })
          x.teslimMiktar = amount
          amount = 0
        })
      }
      // Lot bilgisi artık orderDetail response'unda kolon olarak (lotBasedTracking) geliyor; öncelik ondadır.
      // "Kalem Ekle" ile bulkList'ten eklenen (kolonu içermeyen) kalemler için lotStokSet fallback kalır.
      detailList.forEach((x) => {
        const src = apiList.find((a) => a.stokKodu === x.stokKodu)
        x.lotBasedTracking = src?.lotBasedTracking ?? lotStokSet.has(x.stokKodu)
      })
      setOrderDetail(detailList)
    }
  }, [apiList, isExist, isCancel, lotStokSet])

  function getBarkod() {
    if (show === true) {
      var barcode = orderDetail.filter((todo) => todo.barkod === value.slice(0, 13))

      if (barcode.length > 0) {
        barkodSipUid = barcode[0].stokKodu

        return (
          <AurDialog
            open={show}
            handleClose={() => {
              setValue('')
              setShow(false)
            }}
            scroll="body"
            paperProps={{
              style: {
                borderRadius: '20px',
                borderBottom: '15px solid',
                borderBottomColor: theme.palette.primary.main,
              },
            }}
          >
            {barcode && <OrderQuantityInput order={barcode[0]} quantity={kabul} handleChange={handleChangeKabul} handleKeyPress={handleListItemClick} />}
          </AurDialog>
        )
      }

      if (barcode.length === 0 && value !== '') {
        setValue('')
        setShow(false)
        return <Box>{notifyError('Yanlış Barkod')}</Box>
      }
    }
  }

  // Özet/mal kabul listesi: parçalı üründe İrsaliyeye gerçek ürün (ana ürün) gider; bu yüzden
  // parçalar değil ana ürün, türetilmiş teslim (tamamlanan set = min(parçaTeslim/parçaBaşınaAdet)) ile gösterilir.
  const summaryOrderDetail = orderDetail.map((o) => {
    if (o.hasPiece && Array.isArray(o.partialList) && o.partialList.length > 0) {
      const pieces = o.partialList.flatMap((pkg) => pkg?.packageDetail || [])
      const ratios = pieces.map((d) => {
        const teslim = Number(pieceReceipts[pieceKey(o.stokKodu, d.stockCode)] || 0)
        const q = Number(d.quantity) || 0
        return q > 0 ? teslim / q : 0
      })
      const completed = ratios.length ? Math.min(...ratios) : 0
      return { ...o, teslimMiktar: completed }
    }
    return o
  })

  return (
    <>
      <Box component="form" sx={{ display: 'flex', justifyContent: 'center' }} noValidate autoComplete="off" margin={2}>
        <TextField
          sx={{ flexGrow: '0.5' }}
          disabled={false}
          id="outlined-basic"
          label="Barkod Alanı"
          variant="outlined"
          value={value}
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <QrCodeScannerIcon color="action" />
              </InputAdornment>
            ),
          }}
          onKeyDown={(ev) => {
            if (ev.key === 'Enter') {
              ev.preventDefault()
              handleScanEnter()
            }
          }}
        />
      </Box>

      <Box mb={2} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Stack spacing={2} direction="row">
          <Button variant="contained" onClick={handleComplete}>
            İşlem Tamamla
          </Button>
          <Button variant="contained" onClick={() => setDialogOpen(true)}>
            Kalem Ekle
          </Button>
        </Stack>
      </Box>
      {show === false &&
        (orderListLoading ? (
          <CenterizedBox>
            <CircularProgress />
          </CenterizedBox>
        ) : (
          <UniqueBarcodeOrderList
            list={orderDetail}
            opType={'FMK'}
            handleBarcode={handleOpenBarcodeDialog}
            barcodeMap={barcodeMap}
            pieceReceipts={pieceReceipts}
            onRowSelect={handleSelectBarcodeRow}
            onPieceSelect={handleSelectPieceRow}
            selectedStokKodu={selectedStokKodu}
          />
        ))}

      <UniqueBarcodeListPanel
        open={panel.open}
        onClose={() => setPanel((p) => ({ ...p, open: false }))}
        product={panel.product}
        barcodes={panel.mapKey ? barcodeMap[panel.mapKey] || [] : []}
        onPrint={handlePrintScanned}
        printing={panelPrintLoading}
      />

      <InvoiceDialog
        contentText={'E-İrsaliye Numarasını Giriniz'}
        title={'E-İrsaliye'}
        open={open}
        setOpen={handleCloseIrsaliye}
        setIrsaliyeInformation={setIrsaliyeInformation}
        irsaliyeInformation={irsaliyeInformation}
        opType={'FMK'}
        firmCode={firmCode}
      />

      <BulkListDrawer
        open={dialogOpen}
        onClose={handleCloseDialog}
        bulkList={bulkList}
        apiList={apiList}
        checked={checked}
        setChecked={setChecked}
        handleApiList={handleApiList}
        depoList={depoList}
        selectedDepoList={selectedDepoList}
        handleAddDepoList={handleAddDepoList}
        isLoading={isLoading}
      />

      {getBarkod()}

      {lotScan.open && lotScan.order && (
        <AurDialog
          open={lotScan.open}
          handleClose={() => {
            setLotScan({ open: false, stokKodu: null, scanned: '', order: null, data: null, candidate: null })
            setKabul('')
          }}
          scroll="body"
          paperProps={{
            style: {
              borderRadius: '20px',
              borderBottom: '15px solid',
              borderBottomColor: theme.palette.primary.main,
            },
          }}
        >
          <OrderQuantityInput order={lotScan.order} quantity={kabul} handleChange={handleChangeKabul} handleKeyPress={handleLotQuantityKey} />
        </AurDialog>
      )}

      <Dialog
        open={pieceSelect.open}
        onClose={() => setPieceSelect({ open: false, candidates: [], scanned: '', data: null })}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <QrCodeScannerIcon color="primary" />
          Hangi kaleme yazılsın?
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" mb={1.5}>
            Bu stok kodu siparişte birden çok yerde bulunuyor. Okutulan barkodun hangisine ait olduğunu seçin.
          </Typography>
          <Stack spacing={1}>
            {pieceSelect.candidates.map((c, i) => (
              <Button
                key={i}
                fullWidth
                variant="outlined"
                onClick={() => handleSelectCandidate(c)}
                sx={{ justifyContent: 'flex-start', textTransform: 'none', borderRadius: 2, p: 1.25, textAlign: 'left' }}
              >
                <Stack spacing={0.5} sx={{ width: '100%' }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip size="small" color={c.type === 'piece' ? 'primary' : 'default'} label={c.type === 'piece' ? 'Parça' : 'Bağımsız Kalem'} />
                    <Typography variant="body2" fontWeight={700}>
                      {c.stokKodu}
                    </Typography>
                  </Stack>
                  <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'normal' }}>
                    {c.stokAdi}
                  </Typography>
                  {c.type === 'piece' && (
                    <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'normal' }}>
                      Ana Ürün: <b>{c.parent.stokAdi}</b> ({c.parent.stokKodu})
                    </Typography>
                  )}
                </Stack>
              </Button>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setPieceSelect({ open: false, candidates: [], scanned: '', data: null })} color="inherit" variant="outlined">
            İptal
          </Button>
        </DialogActions>
      </Dialog>

      <BarcodePrintDialog open={barcodeDialog.open} onClose={handleCloseBarcodeDialog} row={barcodeDialog.row} onConfirm={handleGenerateBarcodes} loading={barcodePrintLoading} />

      {renderPrintQueue()}

      <UniqueBarcodeSummaryModal
        open={modal}
        orderDetail={summaryOrderDetail}
        handleClose={() => setModal(false)}
        disabled={malkabulButton}
        handleAction={handleReceiving}
        addresses={temporaryAddresses}
        selectedAddress={selectedTemporaryAddress}
        handleSelectedAddress={handleSelectedAddress}
        reservationDataList={reservationDataList}
        handleReservationChange={handleReservationChange}
      />
      <ConfirmDialog
        dialogStatus={dialog.confirmDialogOpen}
        dialogContentText={`${orderInfo} numaralı siparişe ait devam eden kayıt mevcuttur. Eski kayıt üzeriden devam etmek istiyor musunuz?`}
        dialogTitle={BRAND.productName}
        handleOperate={() => {
          setDialogs((prev) => ({ ...prev, confirmDialogOpen: false }))
          setIsCancel(false)
          notify('Eski kayıt üzerinden devam ediliyor')
        }}
        handleClose={() => {
          setDialogs((prev) => ({ ...prev, confirmDialogOpen: false }))
          setIsCancel(true)
          setBarcodeMap({})
          setSelectedStokKodu(null)
          fetchSuspendOrder(isExist[0].orderId)
        }}
      />
      <ConfirmDialog
        dialogStatus={dialog.moreAmountDialogOpen}
        dialogContentText={`Kabul Miktarı sipariş miktarından fazla kabul etmek istiyor musunuz ?`}
        dialogTitle={BRAND.productName}
        handleOperate={updateAurTmpDetail}
        handleClose={() => {
          setDialogs((prev) => ({ ...prev, moreAmountDialogOpen: false }))
          setValue('')
          setKabul('')
          setShow(false)
          setSituation(!situation)
          notifyError('İşlem İptal Edildi')
        }}
      />
    </>
  )
}
