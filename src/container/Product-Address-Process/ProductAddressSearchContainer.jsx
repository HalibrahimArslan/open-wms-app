import { useContext } from 'react'
import { useContainer } from 'unstated-next'
import { notify, notifyError } from '../../layout/Layout'
import { ProductAddressContext } from '../../context/ProductAddressContext'

import { ClearAllStatusAction, ProductBtnAction } from '../../reducers/ProductAddressReducer'

import PlacementBox from '../../components/Stepper/PlacementBox'
import { ProductAddressSearchProcess } from '../../utils/ProductAddress'
import useAuthHeader from '../../hooks/useAuthHeader'
import useDepoCode from '../../hooks/useDepoCode'
import usePayload from '../../hooks/usePayload'
import { getDepoUrunStockAddressByDepoAndBarcode } from '../../services/AdressService'
import { getProductAddresses } from '../../services/ProductAddressService'
import { getProductInfo } from '../../services/MikroService'
import { DataStore } from '../../store/DataStore'

export default function ProductAddressSearchContainer({ processType }) {
  const { state, barcode, addressId, handleBarcode, handleProductAddressId, handleProductAddressAmount, handleChangeStatus, handleProduct, handleTmpAreaAmount } =
    useContext(ProductAddressContext)

  const headers = useAuthHeader()
  const depoCode = useDepoCode()
  const { account } = useContainer(DataStore)

  const fetchEnableStockAddress = async () => {
    const companyPart = account?.companyCode ? `companyCode.equals=${account.companyCode}&` : ''
    const query = `${companyPart}depoCode.equals=${depoCode?.replace(' ', '')}&addressId.equals=${addressId}&barcode.equals=${barcode}&status.equals=true&size=1`
    const list = await getProductAddresses(headers, query)
    return Array.isArray(list) && list.length > 0 ? list[0] : { id: null, miktar: 0 }
  }

  const payload = usePayload({
    stokKodu: '',
    stokAdi: '',
    barkod: barcode,
    barkodList: [''],
    depoNo: depoCode,
  })

  const fetchExecuteData = async () => {
    try {
      const res = await getProductInfo(payload)
      if (res && res.length > 0) {
        handleProduct(res[0])
        return 'success'
      }
      throw new Error('')
    } catch (e) {
      notifyError('Mikro ürün bilgisi bulunamadı')
    }
  }

  const completeProcessDefiniton = async () => {
    try {
      const res = await fetchEnableStockAddress()
      handleProductAddressId(res.id)
      res.id === null ? handleProductAddressAmount(0) : handleProductAddressAmount(res.miktar)
      res.id === null ? notify('İlgili Adrese Ürün Kaydedebilirsiniz') : notify('İlgili Adresteki Ürünün Miktarını güncelleyebilirsiniz')
      handleChangeStatus(ProductBtnAction)
    } catch (e) {
      notifyError(e.message)
    }
  }

  const completeProcessPlacement = async (tempAreaResponse) => {
    try {
      const res = await fetchEnableStockAddress()
      handleProductAddressId(res.id)
      handleProductAddressAmount(tempAreaResponse.miktar)
      handleTmpAreaAmount(tempAreaResponse.miktar)
      handleChangeStatus(ProductBtnAction)
    } catch (e) {
      notifyError(e.message)
    }
  }

  const fetchUrunAdres = async () => {
    const regExp = /[a-zA-Z]/g

    try {
      if (barcode === '') {
        notifyError(`Ürün barkodu boş olmamalıdır`)
      } else if (regExp.test(barcode)) {
        notifyError(`Ürün barkodu sayı harici değer içermemelidir`)
      } else {
        const response = await fetchExecuteData()

        if (response === 'success') {
          if (processType === ProductAddressSearchProcess.ADDRESS_DEFINITION) {
            await completeProcessDefiniton()
          } else if (processType === ProductAddressSearchProcess.ADDRESS_PLACEMENT) {
            const tempAreaResponse = await getDepoUrunStockAddressByDepoAndBarcode(depoCode?.replace(' ', ''), barcode, headers)
            if (tempAreaResponse) {
              await completeProcessPlacement(tempAreaResponse)
              notify(`${barcode} barkodlu ürün bulundu.`)
            } else {
              notifyError(`Geçici Adreste ürün bulunamadı`)
            }
          } else if (processType === ProductAddressSearchProcess.ADDRESS_REPLACEMENT) {
            notify('Mock işlem: completeProcessReplacement() çağrıldı')
          }
        }
      }
    } catch (e) {
      handleChangeStatus(ClearAllStatusAction)
      notifyError(e?.message || e.toString())
    }
  }

  return <PlacementBox label={'Ürün Barkodu giriniz'} value={barcode} handleChange={handleBarcode} fetchData={fetchUrunAdres} disable={state.barcodeEnable} />
}
