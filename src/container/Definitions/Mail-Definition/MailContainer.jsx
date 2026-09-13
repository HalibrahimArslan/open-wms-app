import PublicMailContainer from './PublicMailContainer'
import StockMailContainer from './StockMailContainer'
import VendorMailContainer from './VendorMailContainer'
import AurTabs from '../../../components/Tabs/AurTabs'
import MailSettingsContainer from './MailSettingsContainer'

const MailContainer = () => {
  return (
    <AurTabs
      section={[
        {
          label: 'Genel Alıcılar',
          value: '1',
        },
        {
          label: 'Stok Alıcıları',
          value: '2',
        },
        {
          label: 'Bayiler',
          value: '3',
        },
        {
          label: 'Genel Mail Ayarları',
          value: '4',
        },
      ]}
      sectionPanel={[
        {
          label: 'Genel Alıcılar',
          value: '1',
          component: <PublicMailContainer />,
        },
        {
          label: 'Stok Alıcıları',
          value: '2',
          component: <StockMailContainer />,
        },
        {
          label: 'Bayiler',
          value: '3',
          component: <VendorMailContainer />,
        },
        {
          label: 'Genel Mail Ayarları ',
          value: '4',
          component: <MailSettingsContainer />,
        },
      ]}
      scrollButtonEnable={true}
      tabValue={'3'}
    />
  )
}

export default MailContainer
