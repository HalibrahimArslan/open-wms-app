import { Box, Paper, Typography, useTheme } from '@mui/material'
import ProductAddressView from '../../view/Product-Address/ProductAddressView'
import AddressContainer from './AddressContainer'
import AurTabs from '../../components/Tabs/AurTabs'
import operationsImage from '../../assets/images/cards/operations.svg'
import EmptyAddressContainer from './EmptyAddressContainer'
function AddressOperationsContainer() {
  const theme = useTheme()

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(1),
      }}
    >
      <Box
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: theme.palette.secondary.main,
          borderRadius: theme.shape.borderRadius,
          p: theme.spacing(0, 2),
          display: { xs: 'none', sm: 'flex' },
        }}
      >
        <Box>
          <Typography variant="h5" gutterBottom align="left">
            Ürün ve Adres İşlemleri
          </Typography>
          <Typography variant="body1" gutterBottom align="left">
            Ürün ve adreslere ait işlemleri gerçekleştirebilirsiniz.
          </Typography>
        </Box>
        <Box>
          <img src={operationsImage} alt="" height={'200px'} />
        </Box>
      </Box>

      <AurTabs
        section={[
          {
            label: 'Ürün Adres Gözlem',
            value: '1',
          },
          {
            label: 'Adresler',
            value: '2',
          },
          {
            label: 'Boş Adresler',
            value: '3',
          },
        ]}
        sectionPanel={[
          {
            label: 'Ürün Adres Gözlem',
            value: '1',
            component: <ProductAddressView />,
          },
          {
            label: 'Adresler',
            value: '2',
            component: <AddressContainer />,
          },
          {
            label: 'Boş Adresler',
            value: '3',
            component: <EmptyAddressContainer />,
          },
        ]}
        scrollButtonEnable={true}
      />
    </Box>
  )
}

export default AddressOperationsContainer
