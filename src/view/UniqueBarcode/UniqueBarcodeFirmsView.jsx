import React from 'react'
import UniqueBarcodeFirmList from '../../container/UniqueBarcode/FirmadanMalKabul/UniqueBarcodeFirmList'
import Seo from '../../shared/components/Seo'

const UniqueBarcodeFirmsView = () => {
  return (
    <>
      <Seo title={'Ürün Kabulü Olan Cariler'} />
      <UniqueBarcodeFirmList />
    </>
  )
}

export default UniqueBarcodeFirmsView
