import React from 'react'
import LotProductDefinitionContainer from '../../container/UniqueBarcode/LotProduct/LotProductDefinitionContainer'
import Seo from '../../shared/components/Seo'

export default function LotProductDefinitionView() {
  return (
    <>
      <Seo title="Lot'lu Ürün Tanımlama" />
      <LotProductDefinitionContainer />
    </>
  )
}
