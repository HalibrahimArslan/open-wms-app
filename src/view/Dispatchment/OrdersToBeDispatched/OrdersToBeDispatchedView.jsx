import React from 'react'
import Seo from '../../../shared/components/Seo'
import OrdersToBeDispatchedContainer from '../../../container/Sevk/Waybill/OrdersToBeDispatchedContainer'

const OrdersToBeDispatchedView = () => {
  return (
    <>
      <Seo title="Sevk Alanındaki Siparişler" />
      <OrdersToBeDispatchedContainer />
    </>
  )
}

export default OrdersToBeDispatchedView
