import OrderSuspendItem from './OrderSuspendItem'
import OrderAddedList from './OrderAddedList'
import AurTabs from '../../components/Tabs/AurTabs'

export default function OrderEditTabs({ orderList, addedList }) {
  return (
    <AurTabs
      section={[
        {
          label: 'Mevcut Siparis',
          value: '1',
        },
        {
          label: 'Eklenen Kalemler',
          value: '2',
        },
      ]}
      sectionPanel={[
        {
          label: 'Mevcut Siparis',
          value: '1',
          component: <OrderSuspendItem list={orderList} />,
        },
        {
          label: 'Eklenen Kalemler',
          value: '2',
          component: <OrderAddedList list={addedList} />,
        },
      ]}
      scrollButtonEnable={true}
    />
  )
}
