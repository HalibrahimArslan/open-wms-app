import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import { useState } from 'react'
import { Button, Stack } from '@mui/material'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import AddressModelCreate from './AddressModelCreate'
import AddressCreateForm from '../../components/Form/AddressCreateForm'
import ExtendedDialog from '../../shared/components/Dialog/ExtendedDialog'

const steps = ['Adres Sırası', 'Adres Oluştur']

const AddressCreateContainer = ({ createDialog, addressModel, setAddressModel, data, handleSubmit, handleCloseCreateDialog }) => {
  const [activeStep, setActiveStep] = useState(0)

  return (
    <ExtendedDialog
      open={createDialog}
      handleClose={handleCloseCreateDialog}
      dialogContent={
        <>
          <Box>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
          <Box
            sx={{
              mb: 2,
            }}
          >
            {activeStep === 0 && <AddressModelCreate addressModel={addressModel} setAddressModel={setAddressModel} />}
            {activeStep === 1 && data && <AddressCreateForm data={data} addressModel={addressModel} handleSubmit={handleSubmit} />}
          </Box>
          <Stack
            direction={'row'}
            sx={{
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'sticky',
              bottom: 0,
            }}
          >
            <Button disabled={activeStep === 0} onClick={() => setActiveStep(0)} startIcon={<KeyboardArrowLeftIcon />}>
              Geri
            </Button>
            <Button variant="outlined" disabled={activeStep === 1} onClick={() => setActiveStep(1)} endIcon={<KeyboardArrowRightIcon />}>
              İlerle
            </Button>
          </Stack>
        </>
      }
    />
  )
}

export default AddressCreateContainer
