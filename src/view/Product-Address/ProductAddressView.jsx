import Seo from '../../shared/components/Seo'
import ProductAddressContainer from '../../container/Product-Address/ProductAddressContainer'
import { Paper } from '@mui/material'

export default function ProductAddressView() {
  return (
    <>
      <Seo title="Ürün Adres Gözlem" />
      <Paper display={'flex'} flexDirection={'column'} elevation={1}>
        <ProductAddressContainer />
      </Paper>
    </>
  )
}
