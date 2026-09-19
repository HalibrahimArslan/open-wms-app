import { Button, Grid, Stack } from '@mui/material'
import React, { useContext } from 'react'
import { notify, notifyError } from '../../layout/Layout'
import useAuthHeader from '../../hooks/useAuthHeader'
import useDepoCode from '../../hooks/useDepoCode'
import usePayload from '../../hooks/usePayload'
import { ClearAllStatusAction, PendingAction, TransferAddressAction } from '../../reducers/ProductAddressReducer'
// import {
//   saveProductAddressReplacement,
//   saveProductAddressDefinition,
//   getAddressByDepoCode,
//   operateTemporaryOrControlAddress,
// } from '../../services/AurAdressResource'
import { generatePayload } from '../../utils/Utils'
import { useContainer } from 'unstated-next'
import { DataStore } from '../../store/DataStore'
import { ProductAddressSearchProcess } from '../../utils/ProductAddress'
import PlacementBox from '../../components/Stepper/PlacementBox'
import { ProductAddressContext } from '../../context/ProductAddressContext'
import { productAddressDefinition } from '../../services/AdressService'

const QuantityContainer = ({ processType }) => {
  const { account } = useContainer(DataStore)
  const {
    state,
    product,
    barcode,
    addressId,
    productAddressAmount,
    tmpAreaAmount,
    address,
    transferAddress,
    transferAddressId,
    handleProductAddressAmount,
    handleChangeStatus,
    handleChangeTransferAddressId,
    handleChangeTransferAddressName,
  } = useContext(ProductAddressContext)
  const depoCode = useDepoCode()

  const request = usePayload({
    depoNo: Number(depoCode?.replace(' ', '')),
    miktar: productAddressAmount,
    urunAdresId: addressId,
    stokKodu: product.stokKodu,
    stokAdi: product.stokAdi,
    barcode,
  })
  const headers = useAuthHeader()

  function payloadAddressReplacement(headers, miktar, adres, newUrunAdres, barcode, mikroStokKod) {
    let dto = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        barcode: barcode,
        depoNo: depoCode?.replace(' ', ''),
        miktar: miktar,
        oldUrunAdresId: adres,
        newUrunAdresId: newUrunAdres,
        stokKodu: mikroStokKod,
      }),
    }

    return dto
  }

  const handleChangeQuantity = (e) => {
    handleProductAddressAmount(e.target.value)
  }

  const handleChange = (e) => {
    handleChangeTransferAddressName(e.target.value)
  }

  const clearAll = () => {
    handleChangeStatus(ClearAllStatusAction)
  }

  const saveDefinitionProcess = async () => {
    try {
      if (productAddressAmount < 0) {
        notifyError(`Ürün Miktarını 0 dan az Giremezsiniz`)
        return
      }
      const res = await productAddressDefinition(request)
      notify(`Ürün Adrese Başarıyla Kaydedildi`)
      clearAll()
    } catch (error) {
      notifyError(error.message)
      clearAll()
    }
  }

  const savePlacementProcess = async () => {
    if (productAddressAmount < 0) {
      notifyError(`Ürün Miktarını 0 dan az Giremezsiniz`)
      return
    }
    if (productAddressAmount > tmpAreaAmount) {
      notifyError(`Ürün Miktarı Geçici Alan Miktarından Büyük Olamaz`)
      return
    }
    const orderNo = 'AUR-'.concat(addressId.toString())
    try {
      let payload = {
        barkodTipi: 'RAF',
        barcode: barcode,
        companyCode: account?.companyCode,
        depoCode: depoCode?.replace(' ', ''),
        miktar: productAddressAmount,
        orderNo: orderNo,
        status: true,
        stokKod: product.stokKodu,
        urunAdres: address,
        stokAdi: product.stokAdi,
      }
      // const response = await operateTemporaryOrControlAddress(generatePayload(payload))
      response && notify(`Ürün Adrese Başarıyla Kaydedildi`)
      clearAll()
    } catch (e) {
      notifyError(e)
      clearAll()
    }
  }

  const saveReplacementProcess = async () => {
    // if (productAddressAmount < 0) {
    //   notifyError(`Ürün Miktarını 0 dan az Giremezsiniz`)
    //   clearAll()
    // } else if (productAddressAmount > tmpAreaAmount) {
    //   notifyError(`Transfer Miktarı Ürün Miktarından Büyük Olamaz`)
    //   clearAll()
    // } else if (addressId === transferAddressId) {
    //   notifyError(`Transfer Adresi Ürün Adresi ile Aynı Olamaz`)
    //   clearAll()
    // } else {
    //   const orderNo = 'AUR-'.concat(addressId.toString())
    //   try {
    //     const res = await saveProductAddressReplacement(
    //       payloadAddressReplacement(headers, productAddressAmount, addressId, transferAddressId, barcode, product.stokKodu)
    //     )
    //     res && notify(`Ürün Adrese Başarıyla Kaydedildi`)
    //     clearAll()
    //   } catch (e) {
    //     notifyError('Hata ' + e)
    //     clearAll()
    //   }
    // }
  }

  const saveAddress = async () => {
    handleChangeStatus(PendingAction)
    if (processType === ProductAddressSearchProcess.ADDRESS_DEFINITION) {
      saveDefinitionProcess()
    } else if (processType === ProductAddressSearchProcess.ADDRESS_PLACEMENT) {
      savePlacementProcess()
    } else if (processType === ProductAddressSearchProcess.ADDRESS_REPLACEMENT) {
      saveReplacementProcess()
    }
  }

  const fetchUrunAdres = async () => {
    // try {
    //   if (address.length === 0) {
    //     notifyError('Urun Adresi Boş Olmamalıdır')
    //   } else {
    //     const res = await getAddressByDepoCode(transferAddress, headers, depoCode)
    //     handleChangeTransferAddressId(res)
    //     res && notify('Adres Bulundu')
    //     res && handleChangeStatus(TransferAddressAction)
    //   }
    // } catch (e) {
    //   notifyError(` Adres Bilgisi Bulunamadı ${e}`)
    // }
  }

  return (
    <>
      <PlacementBox label="Miktarı giriniz" value={productAddressAmount} disable={state.quantityEnable} handleChange={handleChangeQuantity} />

      {processType === ProductAddressSearchProcess.ADDRESS_REPLACEMENT && (
        <PlacementBox label="Transfer adresini giriniz" value={transferAddress} disable={state.quantityEnable} handleChange={handleChange} fetchData={fetchUrunAdres} />
      )}
      <Grid
        container
        sx={{
          gap: 2,
          display: 'flex',
          flexDirection: 'row',
          flexGrow: 1,
          justifyContent: 'center',
          marginTop: 2,
        }}
      >
        <Stack>
          <Button variant="contained" onClick={() => saveAddress()} disabled={state.saveBtnEnable}>
            Kaydet
          </Button>
        </Stack>
        <Stack>
          <Button variant="contained" onClick={() => clearAll()}>
            Temizle
          </Button>
        </Stack>
      </Grid>
    </>
  )
}

export default QuantityContainer
