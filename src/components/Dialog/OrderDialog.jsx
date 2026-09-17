import * as React from 'react'
import { useState, useEffect } from 'react'
import MultiSelectItem from '../MultiSelectItem'
import { getOrderDetailListByOrderNos } from '../../services/MikroService'
import usePayload from '../../hooks/usePayload'
import { useSearchParams } from 'react-router-dom'
import useDepoCode from '../../hooks/useDepoCode'
import { notifyError } from '../../layout/Layout'
import ExtendedDialog from '../../shared/components/Dialog/ExtendedDialog'

export default function OrderDialog({ open, handleClose, handleBulkList, handleSelectedOrderList, setSevkAddressInfo }) {
  const [orderList, setOrderList] = useState([])
  const [selectedList, setselectedList] = useState([])
  const [originalData, setOriginalData] = useState([])
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(false)

  let depoCode = useDepoCode()

  const executeReq = usePayload({
    orderNoList: selectedList,
    sipTip: 0,
    depoList: [Number(depoCode)],
  })

  const handleChangeSelectedList = (value) => {
    setselectedList(value)
  }

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
        handleBulkList(res)
        handleClose()
      }
    } catch (error) {
      notifyError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleSelectedOrderList(selectedList)
  }, [selectedList])

  useEffect(() => {
    let list = []
    const filteredlist = JSON.parse(searchParams.get('orderNo'))
    filteredlist.forEach((item) => list.push(item.orderNo))
    setOrderList(list)
    setOriginalData(filteredlist)
  }, [searchParams])

  const handleOrderComplete = () => {
    fetchExecuteData()
  }

  return (
    <ExtendedDialog
      open={open}
      handleClose={handleClose}
      dialogHeader={'Müsteri Siparis Listesi'}
      actionButtonName={'Siparisleri Getir'}
      handleSave={() => handleOrderComplete()}
      dialogContent={
        <MultiSelectItem options={orderList} selectedValues={selectedList} handleChangeValues={handleChangeSelectedList} label={'Siparisler'} originalData={originalData} />
      }
      actionButtonDisaled={selectedList.length === 0 || loading}
    />
  )
}
