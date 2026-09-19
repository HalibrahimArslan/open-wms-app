import React from 'react'
import { useState, useEffect } from 'react'
import { Outlet, useLocation, useNavigate, useParams, useSearchParams } from 'react-router'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import useAuthHeader from '../../../hooks/useAuthHeader'
import { getDoneOrderByOrderInfo } from '../../../services/OrderService'
import OrderDoneItem from '../../../components/Order/OrderDoneItem'
import { Alert, AlertTitle, Chip, Typography, useTheme } from '@mui/material'
import { useRef } from 'react'
import { suspendOrders, saveOrderDetails } from '../../../services/OrderDetailService'
import { getPalletBarcodeList } from '../../../services/PalletBarcodeOrderRelService'
import useDepoCode from '../../../hooks/useDepoCode'
import { notify, notifyError } from '../../../layout/Layout'
import InvoiceDialog from '../../../components/Dialog/InvoiceDialog'
import { getDispatchAreaList, saveDispatchAreaList } from '../../../services/DispatchAreaControlService'
import ConfirmDialog from '../../../components/Dialog/ConfirmDialog'
import CompleteDispatchmentSummaryModal from './CompleteDispatchmentSummaryModal'
import CompleteDispatchmentScanContainer from './CompleteDispatchmentScanContainer'
import { combineSameStockCodes, prepareShippingPayload, prepareUpdateOrderPayload } from '../../../services/OrderManagementService'
import { dispatchOrder } from '../../../services/MikroService'

function CompleteDispatchmentContainer() {
  const navigate = useNavigate()
  const location = useLocation()
  const headers = useAuthHeader()
  const scannedItems = useRef([])
  const selectedItems = useRef([])
  const theme = useTheme()

  let depoCode = useDepoCode()
  let { orderType, orderInfo } = useParams()

  const [searchParams, setSearchParams] = useSearchParams()
  const [visible, setVisible] = useState(false)
  const [firmCode, setFirmCode] = useState('')
  const [firmName, setFirmName] = useState('')
  const [order, setOrder] = useState([])
  const [show, setShow] = useState(false)
  const [quantity, setQuantity] = useState('')
  const [value, setValue] = useState('')
  const [modal, setModal] = useState(false)
  const [open, setOpen] = useState(false)
  const [disabled, setDisabled] = useState(true)
  const [dispatchList, setDispatchList] = useState([])

  const [irsaliyeInformation, setIrsaliyeInformation] = useState({
    seriNo: '',
    seriNoLast: '',
    soforName: '',
    soforTel: '',
    soforTc: '',
    aracPlaka: '',
    dorsePlaka: '',
  })
  const [orderDetail, setOrderDetail] = useState([])
  const [id, setId] = useState(0)
  const [enableIrsaliyeBtn, setEnableIrsaliyeBtn] = useState(false)
  const [palletList, setPalletList] = useState([])
  const [product, setProduct] = useState('')
  const [checkBoxEnable, setCheckBoxEnable] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState(false)
  const navigateOptions = useRef(null)

  let tamamla = {}
  const controlAddressId = searchParams.get('controlAddressId')

  const selectedOrderDetail = selectedItems.current.length > 0 ? order.filter((q) => selectedItems.current.includes(q.stokKodu)) : order

  const clearScanning = () => {
    setValue('')
    setVisible(false)
    setShow(false)
  }

  const handleChange = (event) => {
    setValue(event.target.value)
  }

  const handleComplete = () => {
    setOpen(false)
    setModal(true)
  }

  const handleDialogOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setModal(false)
  }

  const handleChangeQuantity = (event) => {
    setQuantity(event.target.value)
  }

  const handleSwitch = (event) => {
    setCheckBoxEnable(event.target.checked)
  }

  const handleOpenConfirmDialog = () => {
    setConfirmDialog(true)
  }

  const handleCloseConfirmDialog = () => {
    setConfirmDialog(false)
  }

  const handleListItemClick = async (event, stockCode) => {
    if (event.key === 'Enter') {
      let filteredList = order.filter((q) => q.stokKodu === stockCode)

      let updateBody = []
      let response = orderDetail.filter((q) => q.stokKodu === stockCode)
      if (response.length > 1) {
        let referenceValue = parseInt(quantity)
        for (let i = 0; i < response.length; i++) {
          if (response[i].siparisMiktar >= referenceValue) {
            let aurTmpDetailList = {
              sipUid: response[i].sipUid,
              teslimMiktar: response[i].teslimMiktar,
              status: 'OUT_PROGRESS',
              observerAmount: referenceValue,
              barkod: response[i].barkod,
              aurPartialItemId: 0,
              isPiece: false,
            }
            updateBody.push(aurTmpDetailList)
            break
          }
          if (response[i].siparisMiktar < referenceValue) {
            let aurTmpDetailList = {
              sipUid: response[i].sipUid,
              teslimMiktar: response[i].teslimMiktar,
              status: 'OUT_PROGRESS',
              observerAmount: response[i].siparisMiktar,
              barkod: response[i].barkod,
              aurPartialItemId: 0,
              isPiece: false,
            }
            updateBody.push(aurTmpDetailList)
            referenceValue = referenceValue - response[i].siparisMiktar
          }
        }
      } else {
        let aurTmpDetailList = {
          sipUid: response[0].sipUid,
          teslimMiktar: response[0].teslimMiktar,
          status: 'OUT_PROGRESS',
          observerAmount: quantity,
          barkod: response[0].barkod,
          aurPartialItemId: 0,
          isPiece: false,
        }

        updateBody.push(aurTmpDetailList)
      }

      if (quantity > filteredList[0].teslimMiktar) {
        notifyError('Kontrol edilen miktar, sevk miktarından fazla olamaz')
      } else {
        await fetchUpdateOrderDetail(
          prepareUpdateOrderPayload(headers, {
            aurTmpDetailList: updateBody,
            opType: orderType,
            orderInfo: orderInfo,
            status: 'OUT_PROGRESS',
          })
        )
        filteredList[0].observerAmount = quantity
        const instantValue = scannedItems.current
        instantValue.push(filteredList[0].stokKodu)
        scannedItems.current = instantValue
      }

      setValue('')
      setQuantity('')
      setShow(false)
      setVisible(false)
      setProduct('')
    }
  }

  const fetchDispatchOrder = async (payload) => {
    try {
      const res = await dispatchOrder(payload)
      res && notify('Güncelleme İşlemi Başarılı')
      navigate(`/d:${depoCode}/${orderType}/orders-to-be-dispatched?controlAddressId=${controlAddressId}`)
    } catch (err) {
      setEnableIrsaliyeBtn(false)
      notifyError(err.message)
    }
  }

  const fetchUpdateOrderDetail = async (param) => {
    try {
      const response = await saveOrderDetails(param)
      response && notify('Güncelleme İşlemi Başarılı')
    } catch (err) {
      notifyError(err.message)
    }
  }

  const fetchPalletBarcodeList = async (orderInfo) => {
    if (orderInfo !== '') {
      const res = await getPalletBarcodeList(headers, orderInfo)
      res && setPalletList(res)
    }
  }

  const handleNavigate = (barcode) => {
    navigate(`${barcode}/detail`)
  }

  const handleChosenItem = (key) => {
    if (key.length === 13 && key.startsWith('999999')) {
      let selectedPallet = palletList.filter((q) => q.palletBarcode === key)
      selectedPallet[0].palletBarcodeList.forEach((q) => {
        if (!selectedItems.current.includes(q.stockCode)) {
          selectedItems.current.push(q.stockCode)
        } else {
          let index = selectedItems.current.indexOf(q.stockCode)
          selectedItems.current.splice(index, 1)
        }
      })
    } else {
      if (!selectedItems.current.includes(key)) {
        selectedItems.current.push(key)
      } else {
        let index = selectedItems.current.indexOf(key)
        selectedItems.current.splice(index, 1)
      }
    }
  }

  const sevkiyatYap = async () => {
    setEnableIrsaliyeBtn(true)
    const res = await getDoneOrderByOrderInfo(headers, orderInfo)
    let filteredList = res && res.filter((todo) => todo.orderInfo === orderInfo)
    let sevkList = filteredList[0].aurTmpDetailList.filter((todo) => todo.observerAmount > 0 && todo.piece === false)

    if (sevkList.length === 0) {
      return <Box>{notifyError('Ürün Listesi Boş')}</Box>
    }

    let orderDetailList = []
    let complete = false
    let updateBody = []

    if (selectedItems.current.length === 0 || selectedItems.current.length === sevkList.length) {
      complete = true
    }

    let transferList =
      selectedItems.current.length > 0
        ? sevkList.filter((q) => {
            return selectedItems.current.find((q2) => {
              return q2 === q.stokKodu
            })
          })
        : sevkList

    transferList.map(
      (row) => (
        (tamamla = {
          kabulMiktar: row.observerAmount,
          sipUid: row.sipUid,
          stokKodu: row.stokKodu,
        }),
        orderDetailList.push(tamamla)
      )
    )

    tamamla = prepareShippingPayload(headers, {
      dorsePlakaNo: irsaliyeInformation.dorsePlaka,
      aracPlakaNo: irsaliyeInformation.aracPlaka,
      soforAdi: irsaliyeInformation.soforName,
      soforSoyadi: irsaliyeInformation.soforName,
      soforTckn: irsaliyeInformation.soforTc,
      soforTel: irsaliyeInformation.soforTel,
      transportationType: irsaliyeInformation.transportationType,
      companyLogistics: irsaliyeInformation.companyLogistics,
      carryType: irsaliyeInformation.carryType,
      depoNo: depoCode,
      belgeNo: '',
      erpUserCode: '11',
      firmCode: firmCode,
      orderDetail: orderDetailList,
      orderNo: orderInfo,
      tarih: new Date().toISOString().split('T')[0].concat('T00:00:00.000Z'),
      orderId: id,
    })

    await fetchDispatchOrder(tamamla)
  }

  const fetchSuspendOrder = async () => {
    const res = await suspendOrders(headers, id)
    res && notify('Sipariş Başarıyla Kapatıldı')
    res && navigate(`/d:${depoCode}/MSK/orders-to-be-dispatched?controlAddressId=${controlAddressId}`)
  }

  const fetchOrderData = async () => {
    try {
      const res = await getDoneOrderByOrderInfo(headers, orderInfo)
      res && setOrder(res)
      navigateOptions.current = {
        firmCode: res[0].firmCode,
        cariBaglantiTipi: res[0].cariBaglantiTipi,
        cariCode: res[0].cariCode,
        id: res[0].id,
      }
    } catch (err) {
      notifyError(err.message)
    }
  }

  const fetchSaveDispatchListByPalletBarcode = async (palletBarcode) => {
    try {
      const res = await saveDispatchAreaList(headers, palletBarcode)
      let pallet = palletList.find((q) => q.palletBarcode === palletBarcode)
      pallet.palletBarcodeList.forEach((x) => {
        scannedItems.current.push(x.stockCode)
      })
      setValue('')
      notify(`${palletBarcode} numaralı paletin kalemleri kontrol edildi`)
    } catch (err) {
      notifyError(err.message)
    }
  }

  const fetchDispatchAreaListByOrderId = async (orderId) => {
    try {
      const res = await getDispatchAreaList(headers, orderId)
      res &&
        res.forEach((x) => {
          scannedItems.current.push(x)
        })
      res && setDispatchList(res)
    } catch (err) {
      notifyError(err.message)
    }
  }

  useEffect(() => {
    if (id != 0) {
      fetchDispatchAreaListByOrderId(id)
    }
  }, [id])

  useEffect(() => {
    fetchOrderData()
    fetchPalletBarcodeList(orderInfo)
  }, [location])

  useEffect(() => {
    let filter = order.filter((q) => q.orderInfo === orderInfo)
    let detailList = []
    if (filter.length > 0) {
      detailList = combineSameStockCodes(filter)
      setOrderDetail(filter[0].aurTmpDetailList)
      setFirmCode(filter[0].firmCode)
      setFirmName(filter[0].firmName)
      setId(filter[0].id)
      setOrder(detailList)
    }
  }, [order, orderInfo])

  useEffect(() => {
    if (!checkBoxEnable) {
      selectedItems.current = []
    }
  }, [checkBoxEnable])

  return (
    <React.Fragment>
      <Stack
        spacing={0.25}
        sx={{
          overflow: 'auto',
          justifyContent: 'flex-start',
        }}
      >
        <Alert severity="info">{firmName} Siparişleri</Alert>
        <Alert severity="info">
          <Box
            sx={{
              display: 'flex',
              gap: 0.5,
              overflowX: 'auto',
            }}
          >
            {[...new Set(orderDetail.map((item) => item.siparisNo))].map((item) => (
              <Chip label={item} variant="outlined" />
            ))}
          </Box>
        </Alert>
      </Stack>

      <Box
        component="form"
        noValidate
        autoComplete="off"
        sx={{
          margin: 2,
          border: '1px soft',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <TextField
          disabled={visible}
          sx={{ flexGrow: '1' }}
          id="outlined-basic"
          label="Barkod Alanı"
          variant="outlined"
          value={value}
          onChange={handleChange}
          onKeyPress={(ev) => {
            if (ev.key === 'Enter') {
              ev.preventDefault()
              setShow(true)
            }
          }}
        />
      </Box>
      <Box
        sx={{
          mb: 2,
          gap: 2,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Stack spacing={2} direction="row">
          <Button variant="contained" onClick={handleDialogOpen} disabled={!disabled}>
            İrsaliye Bilgilerini Gir
          </Button>
        </Stack>
        <Stack spacing={2} direction="row">
          <Button variant="contained" onClick={() => navigate(`irsaliye`)} disabled={!disabled}>
            SIPARIS BIRLESTIR
          </Button>
        </Stack>
      </Box>
      <InvoiceDialog
        contentText={''}
        title={'E-İrsaliye'}
        open={open}
        setOpen={setOpen}
        setIrsaliyeInformation={setIrsaliyeInformation}
        irsaliyeInformation={irsaliyeInformation}
        opType={'MSK'}
        handleComplete={handleComplete}
        firmCode={firmCode}
      />
      {show === false ? (
        <OrderDoneItem
          list={order}
          scannedItems={scannedItems.current}
          palletList={palletList}
          handleNavigate={handleNavigate}
          fetchSuspendOrder={fetchSuspendOrder}
          checkBoxEnable={checkBoxEnable}
          handleSwitch={handleSwitch}
          handleChosenItem={handleChosenItem}
          handleOpenConfirmDialog={handleOpenConfirmDialog}
          handleNavigateEditPage={() =>
            navigate(
              `/d:${depoCode}/${navigateOptions.current.firmCode}/MSK/${navigateOptions.current.cariBaglantiTipi}/${navigateOptions.current.cariBaglantiTipi === '4' ? (navigateOptions.current.cariCode === '' || navigateOptions.current.cariCode === null ? '0' : navigateOptions.current.cariCode) : navigateOptions.current.cariBaglantiTipi}/${navigateOptions.current.id}/orderdetailsuspend`
            )
          }
        />
      ) : (
        <></>
      )}
      <ConfirmDialog
        dialogTitle={
          <Alert severity="warning" sx={{ padding: 1 }}>
            <AlertTitle>Sipariş Kapatma</AlertTitle>
            <Typography
              variant="h6"
              sx={{
                fontWeight: theme.typography.fontWeightBold,
              }}
            >
              Siparişi kapatmak istediğinizden emin misiniz?
            </Typography>
          </Alert>
        }
        dialogStatus={confirmDialog}
        handleClose={handleCloseConfirmDialog}
        handleOperate={fetchSuspendOrder}
      />
      <CompleteDispatchmentScanContainer
        visible={visible}
        orderDetail={order}
        palletList={palletList}
        value={value}
        product={product}
        quantity={quantity}
        theme={theme}
        barcode={value}
        setShow={setShow}
        fetchSaveDispatchListByPalletBarcode={fetchSaveDispatchListByPalletBarcode}
        setValue={setValue}
        setVisible={setVisible}
        setProduct={setProduct}
        show={show}
        handleChangeQuantity={handleChangeQuantity}
        handleListItemClick={handleListItemClick}
        clearScanning={clearScanning}
      />
      <CompleteDispatchmentSummaryModal modal={modal} handleClose={handleClose} orderDetail={selectedOrderDetail} enableIrsaliyeBtn={enableIrsaliyeBtn} sevkiyatYap={sevkiyatYap} />
      <Outlet />
    </React.Fragment>
  )
}

export default CompleteDispatchmentContainer
