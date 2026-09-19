import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import useSWR from 'swr'
import useAuthHeader from '../../hooks/useAuthHeader'
import LoadingSpinner from '../../components/Loading/LoadingSpinner'
import PalletBarcodeDetailCardList from '../../components/PalletBarcode/PalletBarcodeDetailCardList'
import { useTheme } from '@mui/system'
import { deletePalletBarcodeDetail, generateOrderPalletBarcodeRelation, getPalletBarcodeList } from '../../services/PalletBarcodeOrderRelService'
import { getDoneOrderByOrderInfo } from '../../services/OrderService'
import { requestAddPalletBarcode } from '../../utils/Utils'
import produce from 'immer'
import { notifyError } from '../../layout/Layout'
import ExtendedDialog from '../../shared/components/Dialog/ExtendedDialog'

export default function PalletBarcodeDetailContainer() {
  const [dialogOpen, setDialogOpen] = useState(true)
  const [orderDetail, setOrderDetail] = useState([])
  const [palletList, setPalletList] = useState([])
  const [orderListOutPallet, setOrderListOutPallet] = useState([])

  const params = useParams()
  const nav = useNavigate()
  const headers = useAuthHeader()
  const theme = useTheme()

  const selectedPalletList = palletList && palletList.filter((pallet) => pallet.palletBarcode === params.palletbarcode)
  const palletBarcodeId = selectedPalletList.length > 0 ? selectedPalletList[0].palletBarcodeId : null
  const url = `/api/pallet-barcodes-order-detail/${params.palletbarcode}`

  const { data, error, mutate } = useSWR([url, headers])

  const fetchPalletBarcodeList = async (orderInfo) => {
    if (orderInfo !== '' || orderInfo !== undefined) {
      const res = await getPalletBarcodeList(headers, orderInfo)
      res && setPalletList(res)
    }
  }

  const fetchOrderData = async () => {
    try {
      if (params.orderInfo) {
        const res = await getDoneOrderByOrderInfo(headers, params.orderInfo)
        res && setOrderDetail(res[0].aurTmpDetailList)
      }
    } catch (err) {
      notifyError(err)
    }
  }

  const fetchAddPalletBarcode = async (payload, palletBarcodeId) => {
    try {
      const res = await generateOrderPalletBarcodeRelation(payload)
      res &&
        setPalletList(
          produce((draft) => {
            const data = draft.find((q) => q.palletBarcodeId === palletBarcodeId)
            res.palletBarcodeList.forEach((q) => data.palletBarcodeList.push(q))
          })
        )

      return res
    } catch (e) {
      notifyError(e.message)
    }
  }

  const handleChangeShow = () => {
    setDialogOpen(!dialogOpen)
    nav(-1)
  }

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleDeleteById = async (palletBarcodeOrderRelId) => {
    try {
      const res = await deletePalletBarcodeDetail(headers, [palletBarcodeOrderRelId])
      res === 'success' && mutate(data.filter((q) => q.palletBarcodeOrderRelId !== palletBarcodeOrderRelId))
      res === 'success' &&
        palletList.length > 0 &&
        setPalletList(
          produce((draft) => {
            const data = draft.find((q) => q.palletBarcodeId === palletBarcodeId)
            data.palletBarcodeList = data.palletBarcodeList.filter((q) => q.palletBarcodeOrderRelId[0] !== palletBarcodeOrderRelId)
          })
        )
    } catch (e) {
      notifyError('Silme işleminde Hata Meydana Geldi')
    }
  }

  const addPalletBarcode = async (stockCode) => {
    const payload = requestAddPalletBarcode(headers, params.orderInfo, palletBarcodeId, [stockCode])
    try {
      const res = await fetchAddPalletBarcode(payload, palletBarcodeId)
      const updatedOne = [
        ...data,
        {
          stockCode: stockCode,
          barcode: '',
          orderNo: '',
          cariName: ' ',
          palletBarcodeOrderRelId: res.palletBarcodeList[0].palletBarcodeOrderRelId[0],
        },
      ]

      res &&
        mutate([
          ...data,
          {
            stockCode: stockCode,
            barcode: '',
            orderNo: '',
            cariName: ' ',
            palletBarcodeOrderRelId: res.palletBarcodeList[0].palletBarcodeOrderRelId[0],
          },
        ])
    } catch (e) {
      notifyError(e)
    }
  }

  useEffect(() => {
    fetchOrderData()
    if (params.orderInfo) {
      fetchPalletBarcodeList(params.orderInfo)
    }
  }, [])

  useEffect(() => {
    let filteredList = orderDetail.filter((q) => {
      return !palletList.find((q2) => {
        return q2.palletBarcodeList.find((q3) => {
          return q3.stockCode === q.stokKodu
        })
      })
    })

    setOrderListOutPallet(filteredList)
  }, [orderDetail, palletList])

  if (error) {
    return <>Hata</>
  }

  if (!data) {
    return <LoadingSpinner />
  }

  return (
    <ExtendedDialog
      open={dialogOpen}
      handleClose={handleChangeShow}
      dialogHeader={params.palletbarcode}
      subHeader={data.length > 0 && data[0].cariName}
      dialogContent={
        <PalletBarcodeDetailCardList
          palletInfoList={data}
          theme={theme}
          handleDelete={handleDeleteById}
          handleChange={handleChange}
          addableItemList={orderListOutPallet}
          addPalletBarcode={addPalletBarcode}
        />
      }
    />
  )
}
