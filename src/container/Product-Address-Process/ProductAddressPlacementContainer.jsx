import React from 'react'
import { ProductAddressSearchProcess } from '../../utils/ProductAddress'
import ProductAddressProvider from '../../context/ProductAddressContext'
import AddressSearch from './AddressSearch'
import ProductAddressSearchContainer from './ProductAddressSearchContainer'
import QuantityContainer from './QuantityContainer'
import { Grid } from '@mui/material'

const ProductAddressPlacementContainer = () => {
  const processType = ProductAddressSearchProcess.ADDRESS_PLACEMENT

  return (
    <ProductAddressProvider>
      <Grid>
        <AddressSearch />
        <ProductAddressSearchContainer processType={processType} />
        <QuantityContainer processType={processType} />
      </Grid>
    </ProductAddressProvider>
  )
}

export default ProductAddressPlacementContainer
