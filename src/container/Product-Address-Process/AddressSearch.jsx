import { useContext, useEffect, useState } from 'react'
import { AddressBtnAction } from '../../reducers/ProductAddressReducer'
import PlacementBox from '../../components/Stepper/PlacementBox'
import { notify, notifyError } from '../../layout/Layout'
import { ProductAddressContext } from '../../context/ProductAddressContext'
import { getDepoUrunAddresses } from '../../services/AdressService'
import useDepoCode from '../../hooks/useDepoCode'
import useAuthHeader from '../../hooks/useAuthHeader'

export default function AddressSearch() {
  const depoCode = useDepoCode()
  const headers = useAuthHeader()

  const { state, handleAddressId, handleChangeStatus, handleAddress } = useContext(ProductAddressContext)
  const [address, setAddress] = useState('')

  const handleChange = (event) => {
    setAddress(event.target.value)
    handleAddress(event.target.value)
  }

  const fetchUrunAdres = async () => {
    try {
      if (address.length === 0) {
        notifyError('Urun Adresi Boş Olmamalıdır')
      } else {
        const res = await getDepoUrunAddresses(address, depoCode, headers)
        handleAddressId(res)
        res && notify('Adres Bulundu')
        res && handleChangeStatus(AddressBtnAction)
      }
    } catch (e) {
      notifyError(` Adres Bilgisi Bulunamadı ${e.message}`)
    }
  }

  useEffect(() => {
    if (state.step === 1) {
      setAddress('')
    }
  }, [state.step])

  return <PlacementBox disable={state.addressEnable} label={'Adres Barkodu Giriniz'} value={address} handleChange={handleChange} fetchData={fetchUrunAdres} />
}
