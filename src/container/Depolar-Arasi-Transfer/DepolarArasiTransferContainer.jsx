import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { Button, Stack } from '@mui/material'
import HorizontalLinearStepper from '../../components/Stepper/HorizontalLinearStepper'
import AddressBarcode from '../../components/Address/AddressBarcode'
import { depolarArasiTransfer } from '../../services/DepolarArasiTransferService'
import usePayload from '../../hooks/usePayload'
import { notify, notifyError } from '../../layout/Layout'
import StepperInput from '../../components/Stepper/StepperInput'
import SelectWarehouseContainer from './SelectWarehouseContainer'
import ProductBarcodeContainer from '../Product-Address-Definition/ProductBarcodeContainer'
import useDepoCode from '../../hooks/useDepoCode'
import useAuthHeader from '../../hooks/useAuthHeader'
import { useContainer } from 'unstated-next'
import { DepoContainer } from '../../store/DepoContainer'

const steps = ['Adres Raf Barkodu', 'Ürün Barkodu', 'İşlem Tamamla']

export default function DepolarArasiTransferContainer() {
  const depoCode = useDepoCode()
  const [targetDepoCode, setTargetDepoCode] = useState(depoCode)
  const [transferDepoCode, setTransferDepoCode] = useState(depoCode)
  const [barcode, setBarcode] = useState('')
  const [addressId, setAddressId] = useState(0)
  const [address, setAddress] = useState('')
  const [amount, setAmount] = useState(0)
  const [activeStep, setActiveStep] = useState(0)
  const [referenceQuantity, setReferenceQuantity] = useState(0)
  const [product, setProduct] = useState({})
  const [description, setDescription] = useState('')
  const { allDepoList } = useContainer(DepoContainer)
  const [disableSituation, setDisableSituation] = useState({
    address: false,
    product: true,
    description: true,
    quantity: true,
    saveButton: true,
  })

  const payload = usePayload({
    girisDepo: targetDepoCode,
    cikisDepo: transferDepoCode,
    barcode: barcode,
    urunAdresId: addressId,
    miktar: parseFloat(amount),
    description: description,
    stokKodu: product.stokKodu,
  })

  const handleResponse = (res) => {
    if (res.id === null) {
      setReferenceQuantity(0)
      notifyError('Bu adreste ilgili barkodla alakalı  ürün yoktur')
    } else {
      setReferenceQuantity(res.miktar)
      notify(`Ürün adreste bulunmaktadır.`)
    }
    setActiveStep((prev) => prev + 1)
    setDisableSituation({
      product: true,
      description: false,
      quantity: false,
      saveButton: false,
    })
  }

  const handleChangeTransferWarehouse = (event) => {
    setTransferDepoCode(event.target.value)
  }

  const handleChangeTargetWarehouse = (event) => {
    setTargetDepoCode(event.target.value)
  }

  const handleAddressProcess = (res) => {
    setAddressId(res)
    setDisableSituation({ ...disableSituation, address: true, product: false })
    setActiveStep((prev) => prev + 1)
  }

  const handleChangeAddress = (event) => {
    setAddress(event.target.value)
  }

  const handleChangeBarcode = (event) => {
    setBarcode(event.target.value)
  }

  const handleChange = (event) => {
    setAmount(event.target.value)
  }

  const handleChangeDescription = (event) => {
    setDescription(event.target.value)
  }

  const clearAll = () => {
    setAddress('')
    setBarcode('')
    setAmount(0)
    setDisableSituation({
      address: false,
      product: true,
      quantity: true,
      description: true,
      saveButton: true,
    })
    setActiveStep(0)
    setReferenceQuantity(0)
    setDescription('')
  }

  const fetchTransferInterwarehouse = async () => {
    try {
      setDisableSituation({ ...disableSituation, saveButton: true })
      const res = await depolarArasiTransfer(payload)
      if (res) {
        notify('Transfer Gerçekleşti düşüldü')
      }
    } catch (e) {
      notifyError(e.message)
    } finally {
      clearAll()
    }
  }

  const saveAddress = async () => {
    if (amount <= 0) {
      notifyError(`Ürün Miktarını 0 veya daha az Giremezsiniz`)
    } else if (amount > referenceQuantity) {
      notifyError(`Ürün Miktarını adresteki miktardan fazla Giremezsiniz`)
    } else if (transferDepoCode === targetDepoCode) {
      notifyError(`Giriş Depo ile Çıkış Depo Aynı Olamaz`)
    } else if (description === '') {
      notifyError(`Açıklama Giriniz`)
    } else if (transferDepoCode === 0 || targetDepoCode === 0) {
      notifyError('Depo seçimlerini kontrol ediniz')
    } else {
      await fetchTransferInterwarehouse()
    }
  }

  return (
    <Box sx={{ display: 'flex', flexGrow: 1, flexDirection: 'column' }}>
      <SelectWarehouseContainer
        transferWarehouse={transferDepoCode}
        targetWarehouse={targetDepoCode}
        handleChangeTransfer={handleChangeTransferWarehouse}
        handleChangeTarget={handleChangeTargetWarehouse}
        depoList={allDepoList}
      />
      <HorizontalLinearStepper
        processType={'Depolar Arası Transfer'}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        stepComponents={[
          <AddressBarcode
            address={address}
            handleChangeAddress={handleChangeAddress}
            disable={disableSituation.address}
            handleResponse={handleAddressProcess}
            referenceDepoCode={transferDepoCode}
          />,
          <ProductBarcodeContainer
            addressId={addressId}
            barcode={barcode}
            disable={disableSituation.product}
            handleChangeBarcode={handleChangeBarcode}
            handleProduct={(newProduct) => setProduct(newProduct)}
            handleResponse={handleResponse}
            depoCode={transferDepoCode}
          />,
          <StepperInput label={'Açıklama Giriniz'} value={description} disabled={disableSituation.description} handleChange={handleChangeDescription} />,
          <StepperInput label={'Miktar Giriniz'} value={amount} disabled={disableSituation.quantity} handleChange={handleChange} />,
          <Grid
            container
            sx={{
              mb: 2,
              gap: 2,
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
