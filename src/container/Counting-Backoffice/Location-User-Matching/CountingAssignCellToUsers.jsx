import { useEffect, useState } from 'react'
import { Box, Button, Typography, Checkbox, FormControlLabel, CircularProgress, Divider, IconButton } from '@mui/material'

import useAuthHeader from '../../../hooks/useAuthHeader'
import { useContainer } from 'unstated-next'
import { DataStore } from '../../../store/DataStore'
import { getAddressHalls } from '../../../services/AddressComponentService'
import useDepoCode from '../../../hooks/useDepoCode'
import { notifyError } from '../../../layout/Layout'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import HallMapContainer from './HallMapContainer'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import { DepoContainer } from '../../../store/DepoContainer'
import { getTransferDepoCode } from '../../../utils/Utils'

const CountingAssignCellToUsers = ({ handleClose }) => {
  const [halls, setHalls] = useState([])
  const [loading, setLoding] = useState(false)
  const [step, setStep] = useState(0)
  const [selectedHall, setSelectedHall] = useState('')

  const headers = useAuthHeader()
  const { account } = useContainer(DataStore)
  const depoCode = useDepoCode()
  const { allDepoList } = useContainer(DepoContainer)
  const transferDepoCode = getTransferDepoCode(depoCode, allDepoList)

  const selectedHallObject = halls.find((h) => selectedHall === h.code) || null

  const fetchAddressHalls = async () => {
    try {
      setLoding(true)
      const res = await getAddressHalls(headers, account.companyCode, transferDepoCode)
      res && setHalls(res)
    } catch (error) {
      notifyError(error.message)
    } finally {
      setLoding(false)
    }
  }

  useEffect(() => {
    fetchAddressHalls()
  }, [])

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          {step === 1 && (
            <IconButton sx={{ minWidth: 0, mr: 1 }} onClick={() => setStep(0)}>
              <ArrowBackIosNewIcon />
            </IconButton>
          )}
          <Typography variant="h6" component="div">
            {step === 0 ? 'Koridor Seçimi' : 'Kroki'}
          </Typography>
        </Box>
        {handleClose && (
          <IconButton onClick={handleClose} sx={{ ml: 2 }}>
            <CloseOutlinedIcon color="primary" />
          </IconButton>
        )}
      </Box>
      <Divider sx={{ mb: 2 }} />
      {step === 0 && (
        <Box>
          <Box mb={2}>
            {loading ? (
              <CircularProgress />
            ) : (
              <Box display="flex" flexWrap="wrap" gap={1}>
                {halls.map((hall) => (
                  <FormControlLabel
                    key={hall.id}
                    control={
                      <Checkbox
                        checked={selectedHall === hall.code}
                        onChange={() => setSelectedHall(selectedHall === hall.code ? '' : hall.code)}
                        name={hall.code}
                        disabled={loading}
                      />
                    }
                    label={hall.code}
                  />
                ))}
              </Box>
            )}
          </Box>
          <Button variant="contained" disabled={!selectedHall} onClick={() => setStep(1)}>
            Krokiyi Göster
          </Button>
        </Box>
      )}
      {step === 1 && (
        <Box>
          <HallMapContainer hall={selectedHallObject} loading={loading} />
        </Box>
      )}
    </Box>
  )
}

export default CountingAssignCellToUsers
