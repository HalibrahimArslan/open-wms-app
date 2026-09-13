import AurTabs from '../../components/Tabs/AurTabs'
import ProductAddressDefinitionContainer from '../../container/Product-Address-Process/ProductAddressDefinitionContainer'
import ProductAddressPlacementContainer from '../../container/Product-Address-Process/ProductAddressPlacementContainer'
import ProductAddressReplacementContainer from '../../container/Product-Address-Process/ProductAddressReplacementContainer'

export default function ProductAddressOperatorView() {
  return (
    <AurTabs
      scrollButtonEnable={true}
      section={[
        {
          label: 'Ürün Adres Tanımlama',
          value: '1',
        },
        {
          label: 'Ürün Rafa Yerleştirme',
          value: '2',
        },
        {
          label: 'Ürün Yer Değiştirme',
          value: '3',
        },
      ]}
      sectionPanel={[
        {
          label: 'Ürün Adres Tanımlama',
          value: '1',
          component: <ProductAddressDefinitionContainer />,
        },
        {
          label: 'Ürün Rafa Yerleştirme',
          value: '2',
          component: <ProductAddressPlacementContainer />,
        },
        {
          label: 'Ürün Yer Değiştirme',
          value: '3',
          component: <ProductAddressReplacementContainer />,
        },
      ]}
    />
  )
}
