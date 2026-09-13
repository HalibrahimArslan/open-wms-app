import React from 'react'
import OrderTracingContainer from '../../container/Order-Tracing/OrderTracingContainer'
import Seo from '../../shared/components/Seo'

export default function OrderTracingView() {
  return (
    <>
      <Seo title="Sipariş Takibi" />
      <OrderTracingContainer />
    </>
  )
}
