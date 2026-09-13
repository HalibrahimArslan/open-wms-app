import { Grid } from '@mui/material'
import { ProductAddressSearchProcess } from '../../utils/ProductAddress'
import AddressSearch from './AddressSearch'
import ProductAddressSearchContainer from './ProductAddressSearchContainer'
import QuantityContainer from './QuantityContainer'
import ProductAddressProvider from '../../context/ProductAddressContext'

export default function ProductAddressDefinitionContainer() {
  const processType = ProductAddressSearchProcess.ADDRESS_DEFINITION
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
