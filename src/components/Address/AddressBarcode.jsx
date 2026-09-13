import PlacementBox from '../Stepper/PlacementBox'
import useAuthHeader from '../../hooks/useAuthHeader'
import { getDepoUrunAddresses } from '../../services/AdressService'
import { notify, notifyError } from '../../layout/Layout'
import useDepoCode from '../../hooks/useDepoCode'
import { checkCountingAddress } from '../../services/CountingDefinitionService'

export default function AddressBarcode({ address, disable, countingDefinitonId, referenceDepoCode, handleChangeAddress, handleResponse, depoCode }) {
  const headers = useAuthHeader()

  const checkAddress = async () => {
    const res = await getDepoUrunAddresses(address, referenceDepoCode ? referenceDepoCode : depoCode, headers)
    if (res) {
      countingDefinitonId === undefined && notify('Adres Bulundu')
      return res
    }
  }

  const fetchUrunAdres = async () => {
    try {
      if (address.length === 0) {
        notifyError('Urun Adresi Boş Olmamalıdır')
        return
      }
      if (address.length !== 6) {
        notifyError(`Ürün Adresi 6 hane olmalıdır`)
        return
      }

      const res = await checkAddress()

      if (res && countingDefinitonId !== undefined) {
        await checkCountingAddress(headers, countingDefinitonId, res)
        notify('Adres Sayıma Uygundur')
      }

      handleResponse(res)
    } catch (e) {
      notifyError(e.message)
    }
  }

  return <PlacementBox disable={disable} label={'Adres Barkodu Giriniz'} value={address} handleChange={handleChangeAddress} fetchData={fetchUrunAdres} />
}
