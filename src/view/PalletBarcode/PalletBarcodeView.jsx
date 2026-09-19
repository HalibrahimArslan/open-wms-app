import React from 'react'
import PalletBarcodeContainer from '../../container/Pallet-Barcode/PalletBarcodeContainer'
import Seo from '../../shared/components/Seo'
import { Outlet } from 'react-router'

export default function PalletBarcodeView() {
  return (
    <>
      <Seo title="Palet Barkod" />
      <PalletBarcodeContainer />
      <Outlet />
    </>
  )
}
