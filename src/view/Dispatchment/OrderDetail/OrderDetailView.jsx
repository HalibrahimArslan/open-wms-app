import React from 'react'
import Seo from '../../../shared/components/Seo'
import OrderProgressSevkiyat from '../../../container/Sevk/FirmayaSevkiyat/OrderProgressSevkiyat'

const OrderDetailView = () => {
  return (
    <>
      <Seo title={'Sipariş Detayları'} />
      <OrderProgressSevkiyat />
    </>
  )
}

export default OrderDetailView
