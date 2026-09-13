import PlacementBox from '../../../components/Stepper/PlacementBox'
import useAuthHeader from '../../../hooks/useAuthHeader'
import { getDepoUrunStockAddressByDepoAndBarcode } from '../../../services/AdressService'
import { notify, notifyError } from '../../../layout/Layout'

export default function SearchProductAtTemporaryAddress({ barcode, disable, handleChangeBarcode, handleResponse, transferCode }) {
  const headers = useAuthHeader()

  const fetchUrunAdres = async () => {
    try {
      const res = await getDepoUrunStockAddressByDepoAndBarcode(transferCode, barcode, headers)
      if (res) {
        notify(`${res.stokKod} stok kodlu ürün bulundu`)
        handleResponse(res)
      }
    } catch (e) {
      notifyError(e.message)
    }
  }

  return <PlacementBox label={'Barkodu giriniz'} value={barcode} handleChange={handleChangeBarcode} fetchData={fetchUrunAdres} disable={disable} />
}
