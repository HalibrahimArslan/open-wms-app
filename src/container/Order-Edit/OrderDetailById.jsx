import { CircularProgress } from '@mui/material'
import { useState } from 'react'
import { useParams } from 'react-router'
import OrderDetailForm from '../../components/Form/OrderDetailForm'
import useOrderDetailById from '../../hooks/useOrderDetailById'
import Seo from '../../shared/components/Seo'
import ExtendedDialog from '../../shared/components/Dialog/ExtendedDialog'

export default function OrderDetailById() {
  const [open, setOpen] = useState(true)
  const { orderId } = useParams()
  const { orderDetail, isLoading, isError } = useOrderDetailById(orderId)

  if (isLoading) return <CircularProgress />
  if (isError) return <div>Something went wrong ...</div>

  return (
    <>
      <Seo title="Detay Düzenleme" />
      <ExtendedDialog open={open} dialogHeader={'Sipariş Düzenleme'} dialogContent={orderDetail && <OrderDetailForm orderDetail={orderDetail} />} />
    </>
  )
}
