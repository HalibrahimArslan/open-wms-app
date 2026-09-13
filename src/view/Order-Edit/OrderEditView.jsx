import React from 'react'
import OrderEditContainer from '../../container/Order-Edit/OrderEditContainer'
import Seo from '../../shared/components/Seo'

export default function OrderEditView() {
  return (
    <>
      <Seo title="Sipariş Düzenleme" />
      <OrderEditContainer />
    </>
  )
}
