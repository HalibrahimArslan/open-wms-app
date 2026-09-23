import { useEffect, useState } from 'react'
import { Box, Button, CircularProgress, Stack, Step, StepLabel, Stepper } from '@mui/material'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import AddressModelCreate from './AddressModelCreate'
import AddressCreateForm, { ADDRESS_CREATE_FORM_ID } from '../../components/Form/AddressCreateForm'
import ExtendedDialog from '../../shared/components/Dialog/ExtendedDialog'

const steps = ['Adres Sırası', 'Adres Oluştur']

/**
 * Adres olusturma diyalogu.
 *
 * Adim degistiren dugmeler ile formun gonder dugmesi ayri satirlardaydi:
 * form kendi "Olustur" dugmesini tasiyor, hemen altinda diyalogun
 * "Geri / Ilerle" seridi geliyordu. Artik tek bir alt serit var; gonder
 * dugmesi form attribute'u ile forma bagli.
 *
 * Adres bilesenleri (bolum, koridor, unite, kat, oda, adres tipi) diyalog
 * acilinca cekilir. Yuklenirken ikinci adim yerine bir gosterge cizilir.
 */
const AddressCreateContainer = ({ createDialog, addressModel, setAddressModel, data, handleSubmit, handleCloseCreateDialog, loading }) => {
  const [activeStep, setActiveStep] = useState(0)

  // Diyalog kapanip yeniden acildiginda bilesen sokulmedigi icin adim son
  // birakildigi yerde kaliyordu.
  useEffect(() => {
    if (createDialog) {
      setActiveStep(0)
    }
  }, [createDialog])

  const isLastStep = activeStep === steps.length - 1

  return (
    <ExtendedDialog
      open={createDialog}
      handleClose={handleCloseCreateDialog}
      dialogContent={
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box>
            {activeStep === 0 && <AddressModelCreate addressModel={addressModel} setAddressModel={setAddressModel} />}
            {activeStep === 1 &&
              (loading ? (
                <Box sx={{ minHeight: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CircularProgress />
                </Box>
              ) : (
                <AddressCreateForm data={data} addressModel={addressModel} handleSubmit={handleSubmit} />
              ))}
          </Box>

          <Stack direction="row" spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Button disabled={activeStep === 0} onClick={() => setActiveStep(0)} startIcon={<KeyboardArrowLeftIcon />}>
              Geri
            </Button>
            {isLastStep ? (
              <Button type="submit" form={ADDRESS_CREATE_FORM_ID} variant="contained" disabled={loading}>
                Oluştur
              </Button>
            ) : (
              <Button variant="outlined" onClick={() => setActiveStep(1)} disabled={!addressModel.some((model) => model.visible)} endIcon={<KeyboardArrowRightIcon />}>
                İlerle
              </Button>
            )}
          </Stack>
        </Box>
      }
    />
  )
}

export default AddressCreateContainer
