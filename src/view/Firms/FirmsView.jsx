import React from 'react'
import Seo from '../../shared/components/Seo'
import CariSelect from '../../container/Sevk/SelectCari/CariSelect'

const FirmsView = () => {
  return (
    <>
      <Seo title={'Açık Siparişi olan Firmalar'} />
      <CariSelect />
    </>
  )
}

export default FirmsView
