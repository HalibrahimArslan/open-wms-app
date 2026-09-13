import { useState } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { Button, Stack } from '@mui/material'
import { productAddressReplacement } from '../../services/AdressService'
import HorizontalLinearStepper from '../../components/Stepper/HorizontalLinearStepper'
import AddressBarcode from '../../components/Address/AddressBarcode'
import ProductBarcodeContainer from '../Product-Address-Definition/ProductBarcodeContainer'
import { notify, notifyError } from '../../layout/Layout'
import StepperInput from '../../components/Stepper/StepperInput'
import useDepoCode from '../../hooks/useDepoCode'
import { generatePayload, getTransferDepoCode } from '../../utils/Utils'
import { useContainer } from 'unstated-next'
import { DepoContainer } from '../../store/DepoContainer'

const steps = ['Adres Raf Barkodu', 'Ürün Barkodu', 'Miktar', 'Ürün Yeni Adresi']

export default function ProductAddressReplacement() {
  const [barcode, setBarcode] = useState('')
  const [addressId, setAddressId] = useState(0)
  const [transferAddressId, setTransferAddressId] = useState(0)
  const [address, setAddress] = useState('')
  const [targetAddress, setTargetAddress] = useState('')
  const [amount, setAmount] = useState(0)
  const [activeStep, setActiveStep] = useState(0)
  const [product, setProduct] = useState({})
  const [disableSituation, setDisableSituation] = useState({
    address: false,
    product: true,
    quantity: true,
    targetAddress: true,
    saveButton: true,
  })

  const depoCode = useDepoCode()
  const { allDepoList } = useContainer(DepoContainer)
  const transferCode = getTransferDepoCode(depoCode, allDepoList)

  const handleResponse = (res) => {
    if (res.id === null) {
      notifyError('Bu adreste ilgili barkodla alakalı  ürün yoktur')
      setDisableSituation({ ...disableSituation, targetAddress: false })
    } else {
      notifyError(`Ürün adreste bulunmaktadır.`)
      setAmount(res.miktar)
    }
    setDisableSituation({
      address: true,
      product: true,
      quantity: false,
      saveButton: false,
      targetAddress: false,
    })
    setActiveStep((prev) => prev + 1)
  }

  const handleAddressProcess = (res) => {
    setAddressId(res)
    setDisableSituation({ ...disableSituation, address: true, product: false })
    setActiveStep((prev) => prev + 1)
  }

  const handleTargetAddressProcess = (res) => {
    setTransferAddressId(res)
    setDisableSituation({ ...disableSituation, targetAddress: true, saveButton: false })
    setActiveStep((prev) => prev + 2)
  }

  const handleChangeAddress = (event) => {
    setAddress(event.target.value)
  }

  const handleChangeNewAddress = (event) => {
    setTargetAddress(event.target.value)
  }

  const handleChangeBarcode = (event) => {
    setBarcode(event.target.value)
  }

  const handleChange = (event) => {
    setAmount(event.target.value)
  }

  const clearAll = () => {
    setAddress('')
    setAmount('')
    setTargetAddress('')
    setBarcode('')
    setTransferAddressId(0)
    setDisableSituation({
      address: false,
      product: true,
      quantity: true,
      saveButton: true,
      targetAddress: true,
    })
    setActiveStep(0)
  }

  const saveAddress = async () => {
    if (amount < 0) {
      notifyError(`Ürün Miktarını 0 dan az Giremezsiniz`)
      return
    }
    if (transferAddressId === 0) {
      notifyError(`Ürün Yeni Adresi Boş Olamaz veya Eski Adres ile Aynı Olamaz`)
      return
    }
    setDisableSituation({ ...disableSituation, saveButton: true })
    try {
      let payload = generatePayload({
        barcode: barcode,
        depoNo: transferCode,
        miktar: amount,
        oldUrunAdresId: addressId,
        newUrunAdresId: transferAddressId,
        stokKodu: product.stokKodu,
      })
      await productAddressReplacement(payload)
      notify(`Ürün Adrese Başarıyla Kaydedildi`)
      clearAll()
    } catch (error) {
      notifyError(error.message)
    }
  }

  return (
    <Box sx={{ display: 'flex', flexGrow: 1 }}>
      <HorizontalLinearStepper
        processType={'Ürün Yer Değiştirme'}
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
          <ProductBarcodeContainer
            addressId={addressId}
            barcode={barcode}
            disable={disableSituation.product}
            depoCode={transferCode}
            handleChangeBarcode={handleChangeBarcode}
            handleProduct={(newProduct) => setProduct(newProduct)}
            handleResponse={handleResponse}
          />,
          <StepperInput label={'Miktar Giriniz'} value={amount} disabled={disableSituation.quantity} handleChange={handleChange} />,
          <AddressBarcode
            depoCode={transferCode}
            address={targetAddress}
            handleChangeAddress={handleChangeNewAddress}
            disable={disableSituation.targetAddress}
            handleResponse={handleTargetAddressProcess}
          />,
          <Grid
            container
            mb={2}
            gap={2}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              flexGrow: 1,
              justifyContent: 'center',
            }}
          >
            <Stack>
              <Button variant="outlined" onClick={() => saveAddress()} disabled={disableSituation.saveButton}>
                Kaydet
              </Button>
            </Stack>
            <Stack>
              <Button variant="outlined" onClick={() => clearAll()}>
                Temizle
              </Button>
            </Stack>
          </Grid>,
        ]}
        steps={steps}
      />
    </Box>
  )
}
