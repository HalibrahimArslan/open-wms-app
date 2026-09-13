import { Box, Typography } from '@mui/material'
import AurTabs from '../../../components/Tabs/AurTabs'
import CountingResult from './Counting-Result/CountingResult'
import CountingTransaction from './Counting-Transaction/CountingTransaction'
import NonCountableBarcodeContainer from './NonCountableBarcode/NonCountableBarcodeContainer'
import NonCountableAddressContainer from './NonCountableAddress/NonCountableAddressContainer'

const sectionList = [
  {
    label: 'Sayım Hareketleri',
    value: '1',
    component: <CountingTransaction />,
  },
  {
    label: 'Sayım Sonuçları',
    value: '2',
    component: <CountingResult />,
  },
  {
    label: 'Hatalı Barkodlar',
    value: '3',
    component: <NonCountableBarcodeContainer />,
  },
  {
    label: 'Sayım Dışı Adresler',
    value: '4',
    component: <NonCountableAddressContainer />,
  },
]

export default function CountingTabs() {
  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Operasyon Detayları
        </Typography>
      </Box>
      <Box
        sx={{
          '& .MuiTab-root': {
            fontSize: (theme) => theme.typography.pxToRem(14),
            fontWeight: 500,
          },
          '& .MuiTabPanel-root': {
            fontSize: (theme) => theme.typography.pxToRem(14),
          },
        }}
      >
        <AurTabs
          section={sectionList.map((item) => ({
            label: item.label,
            value: item.value,
          }))}
          sectionPanel={sectionList}
          scrollButtonEnable={true}
        />
      </Box>
    </Box>
  )
}
