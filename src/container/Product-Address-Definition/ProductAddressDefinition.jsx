import { useState } from 'react'
import Grid from '@mui/material/Grid'
import { Button, Stack } from '@mui/material'
import { productAddressDefinition } from '../../services/AdressService'
import HorizontalLinearStepper from '../../components/Stepper/HorizontalLinearStepper'
import ProductBarcodeContainer from './ProductBarcodeContainer'
import AddressBarcode from '../../components/Address/AddressBarcode'
import { notify, notifyError } from '../../layout/Layout'
import StepperInput from '../../components/Stepper/StepperInput'
import useDepoCode from '../../hooks/useDepoCode'
import { generatePayload, getTransferDepoCode } from '../../utils/Utils'
import { useContainer } from 'unstated-next'
import { DepoContainer } from '../../store/DepoContainer'

const steps = ['Adres Raf Barkodu', 'Ürün Barkodu', 'İşlem Tamamla']

export default function ProductAddressDefinition() {
  const [barcode, setBarcode] = useState('')
  const [addressId, setAddressId] = useState(0)
  const [urunAdres, setUrunAdres] = useState('')
  const [amount, setAmount] = useState(0)
  const [activeStep, setActiveStep] = useState(0)
  const [product, setProduct] = useState({})
  const [disableSituation, setDisableSituation] = useState({
    address: false,
    product: true,
    quantity: true,
    saveButton: true,
  })
  const { allDepoList } = useContainer(DepoContainer)
  const depoCode = useDepoCode()
  const transferCode = getTransferDepoCode(depoCode, allDepoList)

  const handleResponse = (res) => {
    if (res.id === null) {
      notify('Miktar Girebilirsiniz')
      setAmount(0)
    } else {
      notifyError('Ürün adreste bulunmaktadır')
      setAmount(res.miktar)
    }
    setDisableSituation({
      address: true,
      product: true,
      quantity: false,
      saveButton: false,
    })
    setActiveStep((prev) => prev + 1)
  }

  const handleAddressProcess = (res) => {
    setAddressId(res)
    setActiveStep((prev) => prev + 1)
    setDisableSituation({ ...disableSituation, address: true, product: false })
  }

  const handleChange = (event) => {
    setAmount(event.target.value)
  }

  const handleChangeBarcode = (event) => {
    setBarcode(event.target.value)
  }

  const handleChangeAddress = (event) => {
    setUrunAdres(event.target.value)
  }

  const clearAll = () => {
    setUrunAdres('')
    setAmount(0)
    setBarcode('')
    setActiveStep(0)
    setDisableSituation({
      address: false,
      product: true,
      quantity: true,
      saveButton: true,
    })
  }

  const saveAddress = async () => {
    if (amount < 0) {
      notifyError(`Ürün Miktarını 0 dan az Giremezsiniz`)
    }
    setDisableSituation({ ...disableSituation, saveButton: true })
    let payload = generatePayload({
      barcode: barcode,
      depoNo: transferCode,
      miktar: amount,
      urunAdresId: addressId,
      stokKodu: product.stokKodu,
      stokAdi: product.stokAdi,
    })
    const res = await productAddressDefinition(payload)

    if (res && res === 'OK') {
      notify(`Ürün Adrese Başarıyla Kaydedildi`)
      clearAll()
    }
  }

  return (
    <Grid container>
      <Grid item sx={{ display: 'flex', flexGrow: 1 }}>
        <HorizontalLinearStepper
          processType={'Ürün Adres Tanımlama'}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          stepComponents={[
            <AddressBarcode
              depoCode={transferCode}
              address={urunAdres}
              handleChangeAddress={handleChangeAddress}
              disable={disableSituation.address}
              handleResponse={handleAddressProcess}
            />,
            <ProductBarcodeContainer
              addressId={addressId}
              barcode={barcode}
              handleChangeBarcode={handleChangeBarcode}
              disable={disableSituation.product}
              handleProduct={(newProduct) => setProduct(newProduct)}
              handleResponse={handleResponse}
              depoCode={transferCode}
            />,
            <StepperInput label={'Miktar Giriniz'} value={amount} disabled={disableSituation.quantity} handleChange={handleChange} type="number" />,
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
      </Grid>
    </Grid>
  )
}
