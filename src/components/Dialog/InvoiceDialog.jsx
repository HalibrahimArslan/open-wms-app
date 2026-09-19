import { forwardRef, useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Slide from '@mui/material/Slide'
import { TextField, Box, Typography, IconButton } from '@mui/material'
import { translateToEnglish } from '../../utils/Utils'
import useAuthHeader from '../../hooks/useAuthHeader'
import useDepoCode from '../../hooks/useDepoCode'
import Record from '../Combobox/Record'
import AurTabs from '../Tabs/AurTabs'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import useIsMobile from '../../hooks/useIsMobile'
import SmartDriver from '../Driver/SmartDriver'
import { FABRIKA_FIRM_CODE, FABRIKA_DEFAULT_DRIVER } from '../../utils/InvoiceConstants'
import { notifyError } from '../../layout/Layout'

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

export default function InvoiceDialog({ contentText, open, setOpen, setIrsaliyeInformation, opType, handleComplete, irsaliyeInformation, firmCode }) {
  const isMobile = useIsMobile()
  const headers = useAuthHeader()
  const depoCode = useDepoCode()
  const [tcErrorText, setTcErrorText] = useState('')
  const [telErrorText, setTelErrorText] = useState('')
  const [plakaErrorText, setPlakaErrorText] = useState('')
  const [nameErrorText, setNameErrorText] = useState('')
  const [seriNoLastErrorText, setSeriNoLastErrorText] = useState('')
  const [seriNoErrorText, setSeriNoErrorText] = useState('')
  const [dorsePlakaErrortext, setDorsePlakaErrortext] = useState('')
  const [transportationTypeErrorText, setTransportationTypeErrorText] = useState('')
  const [companyLogisticsErrorText, setCompanyLogisticsErrorText] = useState('')
  const [carryTypeErrorText, setCarryTypeErrorText] = useState('')
  const [selectedDriver, setSelectedDriver] = useState(null)

  useEffect(() => {
    if (opType === 'FMK' && firmCode === FABRIKA_FIRM_CODE) {
      setIrsaliyeInformation((prev) => ({
        ...prev,
        soforName: translateToEnglish(FABRIKA_DEFAULT_DRIVER.soforName),
        soforTel: FABRIKA_DEFAULT_DRIVER.soforTel,
        soforTc: FABRIKA_DEFAULT_DRIVER.soforTc,
        aracPlaka: FABRIKA_DEFAULT_DRIVER.aracPlaka,
        dorsePlaka: FABRIKA_DEFAULT_DRIVER.dorsePlaka,
      }))
    }
  }, [opType, firmCode])

  const handleClose = (event, reason) => {
    if (reason === 'backdropClick' || (event && event.keyCode === 27)) return
    setOpen(false)
  }

  const handleChange = (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setIrsaliyeInformation((prev) => ({
      ...prev,
      seriNo: data.get('seriNo'),
      seriNoLast: data.get('seriNoLast'),
      dorsePlaka: data.get('dorsePlaka'),
    }))
  }

  const handleChangeLookup = (newValue, type) => {
    setIrsaliyeInformation((prev) => ({ ...prev, [type]: newValue }))
  }

  const handleSubmit = (event, reason) => {
    event.preventDefault()
    setTcErrorText('')
    setTelErrorText('')
    setPlakaErrorText('')
    setNameErrorText('')
    setSeriNoLastErrorText('')
    setSeriNoErrorText('')
    setDorsePlakaErrortext('')
    setTransportationTypeErrorText('')
    setCompanyLogisticsErrorText('')
    setCarryTypeErrorText('')

    if (reason && reason === 'backdropClick') return

    const { soforTc = '', soforTel = '', aracPlaka = '', soforName = '', seriNo = '', seriNoLast = '', transportationType, companyLogistics, carryType } = irsaliyeInformation

    let nakliyeValid = true
    if (!transportationType) {
      setTransportationTypeErrorText('Logistic Tipi seçiniz')
      nakliyeValid = false
    }
    if (!companyLogistics) {
      setCompanyLogisticsErrorText('Firma Tipi seçiniz')
      nakliyeValid = false
    }
    if (!carryType) {
      setCarryTypeErrorText('Yükleme Tipi seçiniz')
      nakliyeValid = false
    }
    if (!nakliyeValid) {
      notifyError('Nakliye bilgilerini (Logistic Tipi, Firma Tipi, Yükleme Tipi) seçiniz')
    }

    if (opType === 'MSK') {
      if (soforTc.length !== 11) setTcErrorText('T.C No 11 haneli olmalı')
      if (soforTel.length !== 11) setTelErrorText('Cep No 11 haneli olmalı')
      if (aracPlaka.length < 6) setPlakaErrorText('Plaka en az 6 karakter olmalı')
      if (soforName.length < 3) setNameErrorText('Ad soyad boş olamaz')
      if (nakliyeValid && soforTc.length === 11 && soforTel.length === 11 && aracPlaka.length >= 6 && soforName.length >= 3) handleComplete()
    } else if (opType === 'FMK' && firmCode === FABRIKA_FIRM_CODE) {
      if (nakliyeValid) setOpen(false)
    } else if (opType === 'FMK' && firmCode !== '320.01.920') {
      if (soforTc.length !== 11) setTcErrorText('T.C No 11 haneli olmalı')
      if (soforTel.length !== 11) setTelErrorText('Cep No 11 haneli olmalı')
      if (!aracPlaka) setPlakaErrorText('Plaka boş olamaz')
      if (!soforName) setNameErrorText('Ad boş olamaz')
      if (seriNoLast.length !== 10) setSeriNoLastErrorText('10 haneli olmalı')
      if (seriNo.length < 2) setSeriNoErrorText('En az 2 karakter olmalı')
      if (nakliyeValid && soforTc.length === 11 && soforTel.length === 11 && aracPlaka && soforName && seriNoLast.length === 10 && seriNo.length >= 2) setOpen(false)
    } else if (opType === 'FMK') {
      if (!seriNoLast) setSeriNoLastErrorText('Boş olamaz')
      if (seriNo.length < 2) setSeriNoErrorText('En az 2 karakter olmalı')
      if (nakliyeValid && seriNoLast && seriNo.length >= 2) setOpen(false)
    }
  }

  return (
    <Dialog
      sx={{ minWidth: '200px' }}
      open={open}
      scroll="paper"
      keepMounted
      fullScreen={isMobile}
      onClose={handleClose}
      slots={{
        transition: Transition,
      }}
    >
      <DialogContent dividers>
        <AurTabs
          section={[
            { label: 'Irsaliye', value: '1' },
            { label: 'Nakliye', value: '2' },
          ]}
          sectionPanel={[
            {
              label: 'Irsaliye',
              value: '1',
              component: (
                <>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1.5,
                    }}
                  >
                    <Typography>{contentText}</Typography>
                    {firmCode !== FABRIKA_FIRM_CODE && (
                      <SmartDriver
                        firmCode={firmCode}
                        value={selectedDriver}
                        onSelect={(driver) => {
                          setSelectedDriver(driver)
                          if (!driver) return
                          setIrsaliyeInformation((prev) => ({
                            ...prev,
                            soforName: translateToEnglish(driver.driverName),
                            soforTel: driver.phoneNumber,
                            soforTc: driver.identityNumber,
                            aracPlaka: driver.licensePlate,
                            dorsePlaka: driver.trailerPlate || '',
                          }))
                        }}
                        errorMessages={{
                          soforName: nameErrorText,
                          soforTc: tcErrorText,
                          soforTel: telErrorText,
                          aracPlaka: plakaErrorText,
                        }}
                      />
                    )}

                    <Box component="form" onSubmit={handleSubmit} onChange={handleChange} noValidate>
                      {opType === 'FMK' ? (
                        <Box
                          sx={{
                            display: 'flex',
                            gap: 2,
                          }}
                        >
                          <TextField
                            fullWidth
                            name="seriNo"
                            label="Irsaliye Seri"
                            value={irsaliyeInformation.seriNo || ''}
                            helperText={seriNoErrorText}
                            error={!!seriNoErrorText}
                          />
                          <TextField
                            fullWidth
                            name="seriNoLast"
                            label="Irsaliye No"
                            value={irsaliyeInformation.seriNoLast || ''}
                            helperText={seriNoLastErrorText}
                            error={!!seriNoLastErrorText}
                          />
                        </Box>
                      ) : (
                        // <TextField
                        //   fullWidth
                        //   name="dorsePlaka"
                        //   label="Dorse Plaka"
                        //   value={irsaliyeInformation.dorsePlaka || ''}
                        //   helperText={dorsePlakaErrortext}
                        //   error={!!dorsePlakaErrortext}
                        // />
                        <></>
                      )}
                    </Box>
                  </Box>
                </>
              ),
            },
            {
              label: 'Nakliye',
              value: '2',
              component: (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                  }}
                >
                  <Record
                    handleChangeLookup={handleChangeLookup}
                    label="Logistic Tipi"
                    log={irsaliyeInformation.transportationType}
                    type="transportationType"
                    error={!!transportationTypeErrorText}
                    helperText={transportationTypeErrorText}
                  />
                  <Record
                    handleChangeLookup={handleChangeLookup}
                    label="Firma Tipi"
                    log={irsaliyeInformation.companyLogistics}
                    type="companyLogistics"
                    error={!!companyLogisticsErrorText}
                    helperText={companyLogisticsErrorText}
                  />
                  <Record
                    handleChangeLookup={handleChangeLookup}
                    label="Yükleme Tipi"
                    log={irsaliyeInformation.carryType}
                    type="carryType"
                    error={!!carryTypeErrorText}
                    helperText={carryTypeErrorText}
                  />
                </Box>
              ),
            },
          ]}
        />
      </DialogContent>
      <IconButton onClick={() => setOpen(false)} sx={{ position: 'absolute', top: 5, right: 0 }}>
        <CloseRoundedIcon />
      </IconButton>
      <DialogActions>
        <Button variant="contained" onClick={handleSubmit}>
          Tamamla
        </Button>
      </DialogActions>
    </Dialog>
  )
}
