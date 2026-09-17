import { Box, Skeleton } from '@mui/material'
import { getDepoUrunAddresses, getAddressList } from '../../services/AdressService'
import { getProductAddresses } from '../../services/ProductAddressService'
import { getProductInfo } from '../../services/MikroService'
import { getPickingTmpOrderByUserName } from '../../services/OrderService'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useAuthHeader from '../../hooks/useAuthHeader'
import { generatePayload, getTransferDepoCode } from '../../utils/Utils'
import useDepoCode from '../../hooks/useDepoCode'
import produce from 'immer'
import SelectPartialItemContainer from './SelectPartialItemContainer'
import { updateOrderDetailsFromMicroService, saveOrderDetails } from '../../services/OrderDetailService'
import { notify, notifyError } from '../../layout/Layout'
import PickingSelect from '../../components/OrderPicking/PickingSelect'
import OrderPickingInputContainer from './OrderPickingInputContainer'
import OrderQuantityInputContainer from './OrderQuantityInputContainer'
import OrderActionFooter from './OrderActionFooter'
import DispatchmentAddressContainer from './DispatchmentAddressContainer'
import ExtendedDialog from '../../shared/components/Dialog/ExtendedDialog'
import DispatchmentSummaryModal from './DispatchmentSummaryModal'
import { useContainer } from 'unstated-next'
import { DataStore } from '../../store/DataStore'
import { DepoContainer } from '../../store/DepoContainer'
import PalletManagementContainer from './PalletManagementContainer'
import { processAssignedOrderDetails, calculateDistribution, validateDispatchment, updateDraftQuantities } from '../../services/OrderManagementService'
import OrderPreparationHeader from './OrderPreparationHeader'

function AssignedDispatchmentContainer() {
  const headers = useAuthHeader()
  let depoCode = useDepoCode()
  const navigate = useNavigate()
  const { orderType, orderNumber } = useParams()
  const { account } = useContainer(DataStore)
  const { allDepoList } = useContainer(DepoContainer)
  const transferDepoCode = getTransferDepoCode(depoCode, allDepoList)

  const [orderDetail, setOrderDetail] = useState([])
  const [dialogs, setDialogs] = useState({
    quantityInput: false,
    summary: false,
    pallet: false,
    partial: false,
  })
  const [quantity, setQuantity] = useState('')
  const [barcode, setBarcode] = useState('')
  const [situation, setSituation] = useState(false)
  const [adresList, setAdresList] = useState([])
  const [addressBarcode, setAddressBarcode] = useState('')
  const [adresId, setAdresId] = useState('')
  const [productAddressId, setProductAddressId] = useState([])
  const [focus, setFocus] = useState(true)
  const [apiList, setApiList] = useState([])

  const [selectedBarcode, setSelectedBarcode] = useState('')
  const [orderInfo, setOrderInfo] = useState({})
  const [controlAddresses, setControlAddresses] = useState([])
  const [selectedControlAddress, setSelectedControlAddress] = useState(null)
  const [erpAmount, setErpAmount] = useState()
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('list')

  const handleDialog = (name, isOpen) => {
    setDialogs((prev) => ({ ...prev, [name]: isOpen }))
  }

  const resetInputs = () => {
    setBarcode('')
    setQuantity('')
    handleDialog('quantityInput', false)
    setAddressBarcode('')
    setSituation((prev) => !prev)
  }

  const [activeStockCode, setActiveStockCode] = useState('')

  const handleOpen = () => {
    handleDialog('partial', true)
  }

  const handleClosePartialDialog = async (stockCode) => {
    handleDialog('partial', false)

    const aurPartialItemId = parseInt(selectedBarcode.split('-')[0])
    const sipUid = selectedBarcode.split('*')[1]
    const amount = parseFloat(quantity)

    const filteredList = orderDetail.filter((detail) => detail.stokKodu === stockCode && detail.pieceId === aurPartialItemId && detail.sipUid === sipUid)
    const response = apiList.filter((api) => api.stokKodu === stockCode && api.aurPartialItemId === aurPartialItemId && api.sipUid === sipUid)

    const currentPickedOrderDetail = filteredList.reduce((acc, x) => acc + x.teslimMiktar, 0)
    const currentPickedApi = response.reduce((acc, x) => acc + x.teslimMiktar, 0)

    const validation = validateDispatchment({
      amount,
      totalSiparisMiktar: filteredList.reduce((acc, x) => acc + x.siparisMiktar, 0),
      totalTeslimMiktar: currentPickedOrderDetail,
      isPiece: filteredList[0]?.isPiece,
      pieceAmount: filteredList[0]?.pieceAmount,
      orderType,
      depotStockAmount: productAddressId.miktar,
    })

    if (!validation.isValid) {
      notifyError(validation.errorMessage)
      resetInputs()
      return
    }

    const updateBody = calculateDistribution(response, amount + currentPickedOrderDetail, adresId)

    const res = await fetchUpdateTmpDetail(
      {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          aurTmpDetailList: updateBody,
          opType: orderType,
          orderInfo: orderNumber,
          status: 'IN_PROGRESS',
          addressId: adresId === '' ? 0 : adresId,
        }),
      },
      amount,
      quantity,
      filteredList[0].siparisMiktar - filteredList[0].teslimMiktar
    )

    if (res) {
      setOrderDetail(
        produce((draft) => {
          updateDraftQuantities(draft, stockCode, amount, aurPartialItemId, sipUid)
        })
      )
    }

    resetInputs()
  }

  const navigateToOrderEdit = () => {
    navigate(
      `/d:${depoCode}/${orderInfo.firmCode}/${orderType}/${
        orderInfo.cariBaglantiTipi
      }/${orderInfo.cariBaglantiTipi === '4' ? (orderInfo.cariCode === '' || orderInfo.cariCode === null ? '0' : orderInfo.cariCode) : orderInfo.cariBaglantiTipi}/${
        orderInfo.orderId
      }/orderdetailsuspend`
    )
  }

  const fetchControlAddresses = async () => {
    const payload = `kontrolAdres.equals=true&geciciAdres.equals=false&status.equals=true&depoNo.equals=${transferDepoCode}&companyCode.equals=${account?.companyCode}&sort=adres,asc`
    const res = await getAddressList(headers, payload)
    if (res && res.length > 0) {
      setControlAddresses(res)
      setSelectedControlAddress(res[0])
    }
  }

  const fetchQuantityByStockCode = async (stockCode, pieceAmount = 1) => {
    let payload = {
      stokKodu: stockCode,
      stokAdi: '',
      barkod: '',
      barkodList: [''],
      depoNo: depoCode,
    }
    const res = await getProductInfo(generatePayload(payload))
    if (res && res.length > 0) {
      setErpAmount(res[0].depodakiMiktar * pieceAmount)
    }
  }

  const fetchUpdateFromMicro = async () => {
    try {
      const res = await updateOrderDetailsFromMicroService(headers, orderNumber)
      setOrderDetail(
        produce((draft) => {
          res.forEach((q) => {
            let data = draft.find((w) => w.sipUid === q.sipUid && w.barkod === q.barkod)
            data.siparisMiktar = q.siparisMiktar
            data.stokAdi = q.stokAdi
            data.stokKodu = q.stokKodu
            data.barkod = q.barkod
          })
        })
      )

      notify('Mikrodan Günceleme Başarılı')
    } catch (e) {
      notifyError(e.toString())
    }
  }

  async function transferToControlArea() {
    const res = await fetchUpdateTmpDetail({
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        aurTmpDetailList: [],
        opType: orderType,
        orderInfo: orderNumber,
        status: 'OUT_PROGRESS',
        addressId: 0,
        controlAddress: selectedControlAddress,
      }),
    })

    if (res === 'success') {
      navigate(`/d:${depoCode}/dispatchingorder`)
    }
  }

  const fetchUpdateTmpDetail = async (param) => {
    try {
      const res = await saveOrderDetails(param)

      if (res === 'success') {
        notify('Miktarlar Güncellendi')
      }

      return 'success'
    } catch (e) {
      notifyError(e.message)
    }
  }

  const handleChange = (event) => {
    setBarcode(event.target.value)
  }

  const handleChangeQuantity = (event) => {
    setQuantity(event.target.value)
  }

  const handleChangeAddressBarcode = (event) => {
    setAddressBarcode(event.target.value)
  }

  const handleListItemClick = async (event, stockCode) => {
    let amount = parseFloat(quantity)

    if (event.key === 'Enter') {
      if (amount > erpAmount) {
        notifyError('Mikrodaki stok miktarı yetersiz')
        return
      }
      let filteredList = orderDetail.filter((detail) => detail.stokKodu === stockCode)
      let response = apiList.filter((api) => api.stokKodu === stockCode)

      if (response.length > 1 && response.some((item) => item.piece)) {
        handleOpen()
      } else {
        const currentPickedOrderDetail = filteredList.reduce((acc, x) => acc + x.teslimMiktar, 0)
        const currentPickedApi = response.reduce((acc, x) => acc + x.teslimMiktar, 0)

        const validation = validateDispatchment({
          amount,
          totalSiparisMiktar: filteredList.reduce((acc, x) => acc + x.siparisMiktar, 0),
          totalTeslimMiktar: currentPickedOrderDetail,
          isPiece: filteredList[0]?.isPiece,
          pieceAmount: filteredList[0]?.pieceAmount,
          orderType,
          depotStockAmount: productAddressId.miktar,
        })

        if (!validation.isValid) {
          notifyError(validation.errorMessage)
          if (filteredList[0]?.isPiece) {
            resetInputs()
          }
          return
        }

        const updateBody = calculateDistribution(response, amount + currentPickedOrderDetail, adresId)

        try {
          const res = await fetchUpdateTmpDetail({
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
              aurTmpDetailList: updateBody,
              opType: orderType,
              orderInfo: orderNumber,
              status: 'IN_PROGRESS',
              addressId: adresId === '' ? 0 : adresId,
            }),
          })
          if (res) {
            setOrderDetail(
              produce((draft) => {
                updateDraftQuantities(draft, stockCode, amount)
              })
            )
          }
        } catch (e) {
          notifyError(e.message)
        } finally {
          resetInputs()
        }
      }
    }
  }

  const fetchAddressBarcode = async () => {
    try {
      const res = await getDepoUrunAddresses(addressBarcode, transferDepoCode, headers)
      res && notify('Adres Bulundu')
      setAdresId(res)
      setSituation(!situation)
      setFocus(!focus)
    } catch (e) {
      notifyError(e.message)
    }
  }

  const fetchOrder = async () => {
    try {
      setLoading(true)
      const res = await getPickingTmpOrderByUserName(headers, orderType, transferDepoCode, orderNumber)
      const { detailList, apiList, orderInfo, found } = processAssignedOrderDetails(res, orderNumber)
      if (found) {
        setApiList(apiList)
        setOrderDetail(detailList)
        setOrderInfo(orderInfo)
      }
    } catch (e) {
      notifyError(e.message)
    } finally {
      setLoading(false)
    }
  }

  console.log(apiList)

  const fetchAddressListData = async (query) => {
    const res = await getProductAddresses(headers, query)
    res && setAdresList(res)
  }

  const fetchCheckProductAddress = async () => {
    try {
      const companyPart = account?.companyCode ? `companyCode.equals=${account.companyCode}&` : ''
      const query = `${companyPart}depoCode.equals=${transferDepoCode}&addressId.equals=${adresId}&barcode.equals=${barcode}&status.equals=true&size=1`
      const res = await getProductAddresses(headers, query)
      if (!Array.isArray(res) || res.length === 0) {
        throw new Error('Bu adreste bu barkod yok')
      }
      setProductAddressId(res[0])
      handleDialog('quantityInput', true)
    } catch (e) {
      setSituation(!situation)
      setAddressBarcode('')
      setBarcode('')
      notifyError('Barkod Eşleşmedi', e.message)
    }
  }

  function completeDispatchment() {
    let sevkList = orderDetail.filter((orderItem) => orderItem.teslimMiktar > 0)
    if (sevkList.length === 0) {
      notifyError('Ürün Listesi Boş')
      return
    }

    transferToControlArea()
  }

  useEffect(() => {
    if (transferDepoCode.length > 0) {
      fetchControlAddresses()
      fetchOrder()
    }
  }, [transferDepoCode])

  useEffect(() => {
    const barcodes = orderDetail.map((x) => x.barkod).filter(Boolean)
    if (!transferDepoCode || barcodes.length === 0) return
    const companyPart = account?.companyCode ? `companyCode.equals=${account.companyCode}&` : ''
    const query = `${companyPart}depoCode.equals=${transferDepoCode}&barcode.in=${barcodes.join(',')}&status.equals=true&pickingAddress.equals=true&size=500`
    fetchAddressListData(query)
  }, [situation, orderDetail, headers, transferDepoCode, dialogs.quantityInput, account?.companyCode])

  return (
    <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', minHeight: '80vh', gap: 3 }}>
      <OrderPreparationHeader
        orderType={orderType}
        orderNumber={orderNumber}
        orderInfo={orderInfo}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onEdit={navigateToOrderEdit}
      />

      <OrderPickingInputContainer
        orderType={orderType}
        addressBarcode={addressBarcode}
        barcode={barcode}
        situation={situation}
        focus={focus}
        onChangeAddressBarcode={handleChangeAddressBarcode}
        onChangeBarcode={handleChange}
        onAddressBarcodeEnter={fetchAddressBarcode}
        onBarcodeEnter={fetchCheckProductAddress}
      />
      {loading ? (
        <Box p={2}>
          <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2, mb: 2 }} />
          <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
        </Box>
      ) : (
        <>
          <DispatchmentAddressContainer addressList={adresList} />
          {dialogs.quantityInput === false && (
            <PickingSelect
              list={orderDetail
                .map((item) => {
                  return {
                    ...item,
                    count: adresList.filter((todo) => todo.stockCode === item.stokKodu).length,
                  }
                })
                .sort(function (a, b) {
                  return b.count - a.count
                })}
              adresList={adresList}
              opType={'MSK'}
              viewMode={viewMode}
              handleNavigate={navigateToOrderEdit}
            />
          )}
        </>
      )}

      <OrderQuantityInputContainer
        open={dialogs.quantityInput}
        onClose={() => {
          setBarcode('')
          handleDialog('quantityInput', false)
          setErpAmount()
        }}
        orderDetail={orderDetail}
        barcode={barcode}
        quantity={quantity}
        erpAmount={erpAmount}
        fetchQuantityByStockCode={fetchQuantityByStockCode}
        onChangeQuantity={handleChangeQuantity}
        onListItemClick={handleListItemClick}
        resetInputs={resetInputs}
        activeStockCode={activeStockCode}
        setActiveStockCode={setActiveStockCode}
      />
      <ExtendedDialog
        buttonName={'TAMAMLA'}
        open={dialogs.partial}
        handleClose={() => handleDialog('partial', false)}
        dialogContent={
          <SelectPartialItemContainer
            barcode={activeStockCode}
            apiList={apiList}
            setSelectedBarcode={setSelectedBarcode}
            handleComplete={() => handleClosePartialDialog(activeStockCode)}
          />
        }
      />
      <DispatchmentSummaryModal
        open={dialogs.summary}
        orderDetail={orderDetail}
        addresses={controlAddresses}
        selectedAddress={selectedControlAddress}
        handleSelectedAddress={setSelectedControlAddress}
        handleClose={() => handleDialog('summary', false)}
        handleAction={completeDispatchment}
      />
      <PalletManagementContainer orderNumber={orderNumber} orderDetail={orderDetail} openPalletDialog={dialogs.pallet} onClose={() => handleDialog('pallet', false)} />
      {!loading && (
        <OrderActionFooter
          onComplete={() => handleDialog('summary', true)}
          onPallet={() => handleDialog('pallet', true)}
          onUpdate={fetchUpdateFromMicro}
          updateDisabled={orderNumber === ''}
        />
      )}
    </Box>
  )
}

export default AssignedDispatchmentContainer
