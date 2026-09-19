import { Box, Button, Stack, TextField, useTheme, InputAdornment, CircularProgress } from '@mui/material'
import CenterizedBox from '../../shared/components/Box/CenterizedBox'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import OrderProgressItemBasic from '../../components/Order/OrderProgressItemBasic'
import useAuthHeader from '../../hooks/useAuthHeader'
import usePayload from '../../hooks/usePayload'
import { getAddressList } from '../../services/AdressService'
import { getOrderDetailByOrderNo, getFirmOrderBulkList, malKabul } from '../../services/MikroService'
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner'
import { suspendOrders, getOrderDetailByFirmCodeAndOrderNo, saveOrderWithoutAssign } from '../../services/OrderDetailService'
import { notify, notifyError } from '../../layout/Layout'
import InvoiceDialog from '../../components/Dialog/InvoiceDialog'
import OrderQuantityInput from '../../components/Card/OrderQuantityInput'
import produce from 'immer'
import AurDialog from '../../shared/components/Dialog/AurDialog'
import ReceivingSummaryModal from './ReceivingSummaryModal'
import groupBy, { generatePayload } from '../../utils/Utils'
import { useContainer } from 'unstated-next'
import { DataStore } from '../../store/DataStore'
import useDepoCode from '../../hooks/useDepoCode'
import ConfirmDialog from '../../components/Dialog/ConfirmDialog'
import { createOrderPayloads } from './ReceivingHelper'
import { DepoContainer } from '../../store/DepoContainer'
import { getWarehouses } from '../../services/WarehouseService'
import BulkListDrawer from './BulkListDrawer'
import BRAND from '../../config/brand'

export default function ReceivingContainer() {
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

  const [dialog, setDialogs] = useState({
    confirmDialogOpen: false,
    moreAmountDialogOpen: false,
  })

  const [reservationDataList, setReservationDataList] = useState([])

  const orderItems = useRef([])

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
    res &&
      setOrderDetail(
        produce((draft) => {
          draft.map((x) => {
            if (x.stokKodu === barkodSipUid) {
              x.teslimMiktar = kabul
            }
          })
        })
      )

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

  const handleAddDepoList = useCallback((depoCode) => {
    setSelectedDepoList((prev) => (prev.find((q) => q === depoCode) ? prev.filter((q) => q !== depoCode) : [...prev, depoCode]))
  }, [])

  const handleListItemClick = async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      if (Number(kabul) < 0) {
        notifyError('Negatif Miktar Giremezsiniz')
        return
      }
      var filteredList = orderDetail.filter((todo) => todo.stokKodu === barkodSipUid)

      let updateBody = []
      let response = apiList.filter((todo) => todo.stokKodu === barkodSipUid)
      let teslimMiktarBulk = 0.0
      response.forEach((x) => (teslimMiktarBulk = x.teslimMiktar + teslimMiktarBulk))
      if (response.length > 1) {
        let referenceValue = parseFloat(kabul) + teslimMiktarBulk
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
          teslimMiktar: parseFloat(kabul) + response[0].teslimMiktar,
          status: 'IN_PROGRESS',
          observerAmount: parseFloat(kabul) + response[0].teslimMiktar,
        }

        updateBody.push(aurTmpDetailList)
      }

      if (kabul > filteredList[0].siparisMiktar) {
        orderItems.current = updateBody
        setDialogs((prev) => ({ ...prev, moreAmountDialogOpen: true }))
      } else {
        const res = await fetchAurTmpDetail(requestOptionsUpdate(headers, updateBody, opType, order.orderInfo, 'IN_PROGRESS', firmCode, depoCode, firmName))
        if (res) {
          setOrderDetail(
            produce((draft) => {
              draft.map((x) => {
                if (x.stokKodu === barkodSipUid) {
                  x.teslimMiktar = kabul
                }
              })
            })
          )
        }
      }
      setValue('')
      setKabul('')
      setShow(false)
    }
  }

  async function completeReceiving() {
    const { mikroRequest } = createOrderPayloads(orderDetail, apiList, orderInfo, kabul, reservationDataList)

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
        navigate(`/d:${depoCode}/${menuId}/firmlist`)
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

    if (completedItems.length === 0) {
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

  const createAurTmpList = (stokKodu, stokAdi, barkod, siparisMiktar, teslimMiktar, hasPiece) => {
    let dto = {
      stokKodu,
      stokAdi,
      barkod,
      siparisMiktar,
      teslimMiktar,
      hasPiece,
    }
    return dto
  }

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
          detailList.push(createAurTmpList(lissst[0].stokKodu, lissst[0].stokAdi, lissst[0].barkod, miktar, 0, lissst[0].hasPiece))
        } else {
          detailList.push(createAurTmpList(lissst[0].stokKodu, lissst[0].stokAdi, lissst[0].barkod, lissst[0].siparisMiktar - lissst[0].teslimMiktar, 0, lissst[0].hasPiece))
        }
        miktar = 0
      })
      if (isExist.length > 0 && isCancel === false) {
        detailList.forEach((x) => {
          let amount = 0
          let filteredList = isExist.filter((y) => y.stokKodu === x.stokKodu)
          filteredList.forEach((item) => {
            amount = item.teslimMiktar + amount
          })
          x.teslimMiktar = amount
          amount = 0
        })
      }
      setOrderDetail(detailList)
    }
  }, [apiList, isExist, isCancel])
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
              setShow(true)
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
          <OrderProgressItemBasic list={orderDetail} opType={'FMK'} handleStart={handleStart} />
        ))}

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
      <ReceivingSummaryModal
        open={modal}
        orderDetail={orderDetail}
        handleClose={() => setModal(false)}
        disabled={malkabulButton}
        handleAction={handleReceiving}
        addresses={temporaryAddresses}
        selectedAddress={selectedTemporaryAddress}
        handleSelectedAddress={handleSelectedAddress}
        reservationDataList={reservationDataList} // 👈 ekledik
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
