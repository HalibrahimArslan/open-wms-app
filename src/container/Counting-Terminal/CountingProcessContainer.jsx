import { useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { Button, Checkbox, FormControlLabel } from '@mui/material'
import { saveCountingDetail, updateCountingDetail } from '../../services/CountingDetailService'
import { useParams, useSearchParams } from 'react-router'
import { saveCountingTransaction } from '../../services/OrderPickingTransactionService'
import HorizontalLinearStepper from '../../components/Stepper/HorizontalLinearStepper'
import AddressBarcode from '../../components/Address/AddressBarcode'
import { notify, notifyError } from '../../layout/Layout'
import { generatePatchPayload, generatePayload } from '../../utils/Utils'
import { useContainer } from 'unstated-next'
import { DataStore } from '../../store/DataStore'
import StepperInput from '../../components/Stepper/StepperInput'
import CountingBarcodeContainer from './CountingBarcodeContainer'
import useDepoCode from '../../hooks/useDepoCode'

const steps = ['Adres Raf Barkodu', 'Ürün Barkodu', 'Miktar']

export default function CountingProcessContainer() {
  const [barcode, setBarcode] = useState('')
  const [addressId, setAddressId] = useState(0)
  const [urunAdres, setUrunAdres] = useState('')
  const [amount, setAmount] = useState(0)
  const [activeStep, setActiveStep] = useState(0)
  const [countingDetailId, setCountingDetailId] = useState(0)
  const [product, setProduct] = useState([])
  const [searchParams, setSearchParams] = useSearchParams()
  const [orderedScan, setOrderedScan] = useState((searchParams.get('ordered') === 'true' ? true : false) || false)
  const [disableButtons, setDisableButtons] = useState({
    address: false,
    product: true,
    quantity: true,
    saveButton: true,
  })

  const prevAmount = useRef(0)
  const depoCode = useDepoCode()

  const { account } = useContainer(DataStore)
  let { countingId } = useParams()

  const handleAddressProcess = (res) => {
    setAddressId(res)
    setDisableButtons({ ...disableButtons, address: true, product: false })
    setActiveStep((prev) => prev + 1)
  }

  const handleChangeAddress = (event) => {
    setUrunAdres(event.target.value)
  }

  const handleDisables = (newDisableSituation) => {
    setDisableButtons(newDisableSituation)
  }

  const handleChangeOrdered = (event) => {
    setOrderedScan(event.target.checked)
    const newParams = new URLSearchParams(searchParams)
    newParams.set('ordered', event.target.checked)
    setSearchParams(newParams)
  }

  const handleChangeBarcode = (event) => {
    setBarcode(event.target.value)
  }

  const handleChange = (event) => {
    setAmount(event.target.value)
  }

  const handleProduct = (product) => {
    setProduct(product)
  }

  const fetchNoneCountableBarcode = async (barcode) => {
    try {
      let payload = generatePayload({
        referenceId: countingId,
        stockCode: barcode,
        transactionType: 'NONE_COUNTABLE_ITEM',
        address: { urunAdresId: Number(addressId) },
      })
      await saveCountingTransaction(payload)
    } catch (e) {
      notifyError(e.message)
    }
  }

  const clearAll = () => {
    setUrunAdres('')
    setAmount(0)
    setBarcode('')
    setDisableButtons({
      address: false,
      product: true,
      quantity: true,
      saveButton: true,
    })
    setActiveStep(0)
    handleProduct([])
    setCountingDetailId(0)
  }

  const saveAddress = async () => {
    try {
      if (amount < 0) {
        notifyError('Miktar 0 dan küçük olamaz')
        return
      }
      setDisableButtons({ ...disableButtons, saveButton: true })
      if (countingDetailId === 0) {
        let payload = {
          countingDefinitionId: Number(countingId),
          barkod: barcode,
          miktar: amount,
          address: { urunAdresId: Number(addressId) },
          status: 'ACTIVE',
          stokKod: product[0].stokKodu,
          product: {
            companyCode: account.companyCode,
            barcode: barcode,
            stokAdi: product[0].stokAdi,
            stokKodu: product[0].stokKodu,
            miktar: product[0].depodakiMiktar,
            anaGrup: product[0].anagrupKodu,
            kategoriAdi: product[0].kategoriAdi,
            stokBirimi: product[0].stokBirimi,
            description: product[0].description,
          },
        }
        const res = await saveCountingDetail(generatePayload(payload))
        res && notify('İşlem Kaydedildi')
      }
      if (countingDetailId !== 0) {
        let payload = generatePatchPayload({
          id: countingDetailId,
          miktar: orderedScan ? Number(amount) + prevAmount.current : amount,
        })
        const res = await updateCountingDetail(countingDetailId, payload)
        notify('İşlem Kaydedildi')
      }
    } catch (e) {
      notifyError('İşlem Kaydedilemedi' + e.message)
    } finally {
      clearAll()
    }
  }

  return (
    <HorizontalLinearStepper
      processType={`${searchParams.get('sayimAdi') || ''} Adlı Sayım `}
      activeStep={activeStep}
      setActiveStep={setActiveStep}
      stepComponents={[
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <FormControlLabel control={<Checkbox checked={orderedScan} disabled={activeStep === 1} onChange={handleChangeOrdered} />} label="Sıralı Okutma" labelPlacement="end" />
        </Box>,
        <AddressBarcode
          address={urunAdres}
          handleChangeAddress={handleChangeAddress}
          disable={disableButtons.address}
          countingDefinitonId={countingId}
          handleResponse={handleAddressProcess}
          depoCode={depoCode}
        />,
        <CountingBarcodeContainer
          adres={addressId}
          barcode={barcode}
          product={product}
          sayimTanimId={countingId}
          orderedScan={orderedScan}
          prevAmount={prevAmount}
          disable={disableButtons}
          handleDisables={handleDisables}
          handleActiveStep={(newStep) => setActiveStep(newStep)}
          handleChangeBarcode={handleChangeBarcode}
          handleCountingDetailId={setCountingDetailId}
          handleChangeAmount={(newAmount) => setAmount(newAmount)}
          handleProduct={handleProduct}
          clearAll={clearAll}
          fetchNoneCountableBarcode={fetchNoneCountableBarcode}
        />,
        <StepperInput label={'Miktar Giriniz'} value={amount} disabled={disableButtons.quantity} handleChange={handleChange} type="number" />,
        <Grid
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <Button variant="outlined" onClick={() => clearAll()}>
            Temizle
          </Button>
          <Button variant="contained" onClick={() => saveAddress()} disabled={disableButtons.saveButton}>
            Kaydet
          </Button>
        </Grid>,
      ]}
      steps={steps}
    />
  )
}
