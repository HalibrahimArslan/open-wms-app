import { useContainer } from 'unstated-next'
import useAuthHeader from '../../hooks/useAuthHeader'
import usePayload from '../../hooks/usePayload'
import { getProductAddresses } from '../../services/ProductAddressService'
import { executeServiceMikro } from '../../services/MikroService'
import PlacementBox from '../../components/Stepper/PlacementBox'
import { notifyError } from '../../layout/Layout'
import { DataStore } from '../../store/DataStore'

export default function ProductBarcodeContainer({ addressId, barcode, disable, depoCode, handleResponse, handleProduct, handleChangeBarcode }) {
  const headers = useAuthHeader()
  const { account } = useContainer(DataStore)

  const searchProductPayload = usePayload({
    data: {
      stokKodu: '',
      stokAdi: '',
      barkod: barcode,
      barkodList: [''],
      depoNo: depoCode,
    },
    serviceName: 'stokService.stokDetaySorgula',
  })

  const fetchExecuteData = async () => {
    const res = await executeServiceMikro(searchProductPayload)
    return res
  }

  const fetchProductAdres = async () => {
    var regExp = /[a-zA-Z]/g

    try {
      if (barcode === 0) {
        notifyError(`Ürün barkodu boş olmamalıdır`)
      }
      if (barcode.length !== 13) {
        notifyError(`Ürün barkodu 13 rakam olmalıdır`)
      }
      if (regExp.test(barcode)) {
        notifyError(`Ürün barkodu sayı harici değer içermemelidir`)
      }

      if (barcode !== 0 && barcode.length === 13 && !regExp.test(barcode)) {
        const companyPart = account?.companyCode ? `companyCode.equals=${account.companyCode}&` : ''
        const query = `${companyPart}depoCode.equals=${depoCode}&addressId.equals=${addressId}&barcode.equals=${barcode}&status.equals=true&size=1`
        const list = await getProductAddresses(headers, query)
        const res = Array.isArray(list) && list.length > 0 ? list[0] : { id: null, miktar: 0 }
        const productResponse = await fetchExecuteData()
        if (productResponse && productResponse.length === 0) {
          notifyError('Ürün Bulunamadı')
          return
        }
        handleProduct(productResponse[0])
        handleResponse(res)
      }
    } catch (e) {
      notifyError(e.message)
    }
  }

  return <PlacementBox label={'Ürün Barkodu giriniz'} value={barcode} handleChange={handleChangeBarcode} fetchData={fetchProductAdres} disable={disable} />
}
