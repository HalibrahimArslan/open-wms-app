import { Alert } from '@mui/material'
import PlacementBox from '../../components/Stepper/PlacementBox'
import useAuthHeader from '../../hooks/useAuthHeader'
import usePayload from '../../hooks/usePayload'
import { executeServiceMikro } from '../../services/MikroService'
import { getEnableCountingDetails, saveCountingDetailByPalletBarcode } from '../../services/CountingDetailService'
import { notify, notifyError } from '../../layout/Layout'
import { useContainer } from 'unstated-next'
import { DataStore } from '../../store/DataStore'

export default function CountingBarcodeContainer({
  adres,
  barcode,
  product,
  sayimTanimId,
  orderedScan,
  prevAmount,
  disable,
  handleDisables,
  handleActiveStep,
  handleChangeBarcode,
  handleCountingDetailId,
  handleChangeAmount,
  handleProduct,
  clearAll,
  fetchNoneCountableBarcode,
}) {
  const headers = useAuthHeader()
  const { account } = useContainer(DataStore)

  const searchProductPayload = usePayload({
    data: {
      stokKodu: '',
      stokAdi: '',
      barkod: barcode,
      barkodList: [''],
      depoNo: 0,
    },
    serviceName: 'stokService.stokDetaySorgula',
  })

  const fetchExecuteData = async () => {
    const res = await executeServiceMikro(searchProductPayload)
    res && handleProduct(res)
    return res
  }

  const fetchSaveByPallet = async () => {
    try {
      const res = await saveCountingDetailByPalletBarcode(headers, sayimTanimId, barcode, adres)
      res && notify('Palet sayımı kaydedildi')
      res && clearAll()
    } catch (err) {
      notifyError(err.message)
      clearAll()
    }
  }

  const fetchUrunAdres = async () => {
    try {
      if (barcode.length === 13 && barcode.startsWith('999999')) {
        fetchSaveByPallet()
        return
      }

      const res = await getEnableCountingDetails(headers, adres.toString(), barcode, sayimTanimId, account.companyCode)

      const productResponse = await fetchExecuteData()
      if (productResponse && productResponse.length > 0) {
        if (res.length === 0) {
          notify('Sayım miktar alanına geçebilirsiniz')
          handleCountingDetailId(0)
          handleDisables({
            ...disable,
            product: true,
            quantity: false,
            saveButton: false,
          })
          handleChangeAmount(0)
          handleActiveStep(2)
          prevAmount.current = 0
        } else {
          notifyError('Ürün sayılmıştır')
          handleCountingDetailId(res[0].id)
          orderedScan ? handleChangeAmount(0) : handleChangeAmount(res[0].miktar)
          handleDisables({
            ...disable,
            product: true,
            quantity: false,
            saveButton: false,
          })

          handleActiveStep(2)

          prevAmount.current = res[0].miktar
        }
      } else {
        notifyError('Ürün ile ilgili stok kodu bulunamadı.Miktar giremezsiniz')
        fetchNoneCountableBarcode(barcode)
        clearAll()
      }
    } catch (e) {
      notifyError(e.message)
      fetchNoneCountableBarcode(barcode)
      clearAll()
    }
  }

  return (
    <>
      {product && product.length > 0 && (
        <Alert>
          {product[0].stokKodu} - {product[0].stokAdi}
        </Alert>
      )}
      <PlacementBox
        label={'Ürün Barkodu giriniz'}
        value={barcode}
        handleChange={handleChangeBarcode}
        fetchData={fetchUrunAdres}
        disable={disable.product}
        setDisable={() => {
          handleDisables({ ...disable, product: true })
        }}
      />
    </>
  )
}
