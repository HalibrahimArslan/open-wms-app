import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import useAuthHeader from '../../../hooks/useAuthHeader'
import { combineOrders, getSameFirmOrders } from '../../../services/OrderDetailService'
import OrderCombineAccordion from '../../../components/Accordion/OrderCombineAccordion'
import usePayload from '../../../hooks/usePayload'
import useDepoCode from '../../../hooks/useDepoCode'
import LinearProgress from '@mui/material/LinearProgress'
import { notify, notifyError } from '../../../layout/Layout'
import NotFound from '../../../shared/components/NotFound/NotFound'
import { CircularProgress } from '@mui/material'
import ExtendedDialog from '../../../shared/components/Dialog/ExtendedDialog'

export default function OrderCombineContainer() {
  const nav = useNavigate()
  const headers = useAuthHeader()
  const depoCode = useDepoCode()

  const [orderList, setOrderList] = useState([])
  const [checkedList, setCheckedList] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  let { orderInfo, orderType } = useParams()

  const payload = usePayload({
    orderInfo: orderInfo,
    orderIdList: checkedList,
  })

  const handleCheckedList = (id) => {
    if (checkedList.includes(id)) {
      setCheckedList(checkedList.filter((item) => item !== id))
    } else {
      setCheckedList([...checkedList, id])
    }
  }

  const handleCombine = () => {
    if (checkedList.length === 0) {
      notifyError('Lütfen en az bir sipariş seçiniz.')
    } else {
      fetchCombineRelatedOrders()
    }
  }
  const fetchOtherOrdersAtDispatchArea = async () => {
    try {
      setIsLoading(true)
      const response = await getSameFirmOrders(headers, orderInfo)
      response && setOrderList(response)
      setIsLoading(false)
    } catch (e) {
      notifyError(e.detail)
      setIsLoading(false)
    }
  }

  const fetchCombineRelatedOrders = async () => {
    try {
      const response = await combineOrders(payload)
      response && notify('Siparişler birleştirildi.')
      nav(`/d:${depoCode}/${orderType}/${orderInfo}/complete-dispatchment`)
      window.location.reload()
    } catch (e) {
      notifyError(e + '')
    }
  }

  useEffect(() => {
    fetchOtherOrdersAtDispatchArea(orderInfo)
  }, [orderInfo])

  return (
    <ExtendedDialog
      open={true}
      dialogContent={
        <>
          {isLoading ? (
            <CircularProgress />
          ) : orderList && orderList.length > 0 ? (
            <OrderCombineAccordion orderList={orderList} handleClose={() => nav(-1)} handleCheckedList={handleCheckedList} handleCombine={handleCombine} />
          ) : orderList && orderList.length === 0 ? (
            <NotFound msg={'Bu siparişe ait başka sipariş bulunamadı.'} />
          ) : (
            <LinearProgress />
          )}
        </>
      }
    />
  )
}
