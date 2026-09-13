import React from 'react'
import PalletBarcodeDetailContainer from '../../container/Pallet-Barcode/PalletBarcodeDetailContainer'
import Seo from '../../shared/components/Seo'

export default function PalletBarcodeDetailView() {
  return (
    <>
      <Seo title={'Palet Detayları'} />
      <PalletBarcodeDetailContainer />
    </>
  )
}
