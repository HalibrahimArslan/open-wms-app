import React from 'react'
import FirmList from '../../container/Receiving/FirmadanMalKabul/FirmList'
import Seo from '../../shared/components/Seo'

const ReceivingFirmsView = () => {
  return (
    <>
      <Seo title={'Ürün Kabulü Olan Cariler'} />
      <FirmList />
    </>
  )
}

export default ReceivingFirmsView
