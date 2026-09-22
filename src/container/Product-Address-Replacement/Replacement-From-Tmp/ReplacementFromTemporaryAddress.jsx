import { useState } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import SearchProductAtTemporaryAddress from './SearchProductAtTemporaryAddress'
import AddressBarcode from '../../../components/Address/AddressBarcode'
import { Button, Stack, TextField } from '@mui/material'
import useAuthHeader from '../../../hooks/useAuthHeader'
import { getAddressPlacementHistory, saveProductAddress } from '../../../services/AdressService'
import HorizontalLinearStepper from '../../../components/Stepper/HorizontalLinearStepper'
import useDepoCode from '../../../hooks/useDepoCode'
import { notify, notifyError } from '../../../layout/Layout'
import StepperInput from '../../../components/Stepper/StepperInput'
import { generatePayload, getTransferDepoCode } from '../../../utils/Utils'
import { useContainer } from 'unstated-next'
import { DepoContainer } from '../../../store/DepoContainer'
import { DataStore } from '../../../store/DataStore'

const steps = ['Adres Raf Barkodu', 'Ürün Barkodu', 'Miktar']

export default function ReplacementFromTemporaryAddress() {
  const [searchProductAddress, setSearchProductAddress] = useState({})
  const [addressId, setAddressId] = useState(0)
  const [address, setAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [activeStep, setActiveStep] = useState(0)
  const [barcode, setBarcode] = useState('')
  const [disableSituation, setDisableSituation] = useState({
    address: false,
    product: true,
    quantity: true,
    saveButton: true,
  })

  const depoCode = useDepoCode()
  const { allDepoList } = useContainer(DepoContainer)
  const { account } = useContainer(DataStore)
  const transferCode = getTransferDepoCode(depoCode, allDepoList)

  const handleResponse = (res) => {
    setSearchProductAddress(res)
    setActiveStep((prev) => prev + 1)
    setDisableSituation({ ...disableSituation, product: true, quantity: false, saveButton: false })
  }

  const handleChangeBarcode = (event) => {
    setBarcode(event.target.value)
  }

  const handleAddressProcess = (res) => {
    setAddressId(res)
    setDisableSituation({ ...disableSituation, address: true, product: false })
    setActiveStep((prev) => prev + 1)
  }

  const handleChangeAddress = (event) => {
    setAddress(event.target.value)
  }

  const handleChange = (event) => {
    setAmount(event.target.value)
  }

  const saveAddress = async () => {
    try {
      setDisableSituation({ ...disableSituation, saveButton: true })
      const orderNo = 'AUR-'.concat(searchProductAddress.urunAdresId.toString())
      let payload = generatePayload({
        barkodTipi: 'RAF',
        barcode: barcode,
        companyCode: String(account?.companyCode),
        depoCode: transferCode,
        miktar: amount,
        orderNo: orderNo,
        status: true,
        stokKod: searchProductAddress.stokKod,
        urunAdres: address,
        stokAdi: 'system',
      })
      await saveProductAddress(payload)
      let transactionPayload = generatePayload({
        barcode: barcode,
        changeAmount: amount,
        depoCode: transferCode,
        originAddressId: searchProductAddress.urunAdresId,
        placementAddressId: addressId,
        stokKodu: searchProductAddress.stokKod,
      })
      await getAddressPlacementHistory(transactionPayload)
      notify('Adrese yerleştirme tamamlandı')
    } catch (e) {
      notifyError(e.message)
    } finally {
      deleteAll()
    }
  }

  const deleteAll = () => {
    setAddress('')
    setBarcode('')
    setAmount(0)
    setDisableSituation({
      address: false,
      product: true,
      quantity: true,
      saveButton: true,
    })
    setActiveStep(0)
  }

  return (
    <Grid container>
      <Grid sx={{ display: 'flex', flexGrow: 1 }}>
        <HorizontalLinearStepper
          processType={'Geçici Adresten Rafa Yerleştirme'}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          stepComponents={[
            <AddressBarcode
              depoCode={transferCode}
              address={address}
              handleChangeAddress={handleChangeAddress}
              disable={disableSituation.address}
              handleResponse={handleAddressProcess}
            />,
            <SearchProductAtTemporaryAddress
              transferCode={transferCode}
              barcode={barcode}
              disable={disableSituation.product}
              handleChangeBarcode={handleChangeBarcode}
              handleResponse={handleResponse}
            />,
            <StepperInput label={'Miktar Giriniz'} value={amount} handleChange={handleChange} type="number" disabled={disableSituation.quantity} />,
            <Box
              sx={{
                mb: 2,
                display: 'flex',
                flexDirection: 'row',
                flexGrow: 1,
                justifyContent: 'center',
                gap: 2,
              }}
            >
              <Button
                variant="contained"
                onClick={() => {
                  if (searchProductAddress.miktar < amount) {
                    notifyError('Geçici adresteki miktardan fazlasını giremezsin')
                  } else if (amount < 0) {
                    notifyError('0 dan küçük miktar giremezsiniz')
                  } else {
                    saveAddress()
                  }
                }}
                disabled={disableSituation.saveButton}
              >
                Kaydet
              </Button>
              <Button variant="outlined" onClick={() => deleteAll()}>
                Temizle
              </Button>
            </Box>,
          ]}
          steps={steps}
        />
      </Grid>
    </Grid>
  )
}
