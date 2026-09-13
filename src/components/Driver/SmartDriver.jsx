import React, { useState } from 'react'
import { Box, TextField } from '@mui/material'
import SmartDriverSelect from './SmartDriverSelect'
import AddDriverModal from '../Dialog/AddDriverDialog'
import { notify } from '../../layout/Layout'

export default function SmartDriver({ firmCode, onSelect, errorMessages = {}, value }) {
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [addModalOpen, setAddModalOpen] = useState(false)

  const handleAddDriverClick = () => {
    setAddModalOpen(true)
  }

  const handleDriverSave = (newDriver) => {
    notify('Yeni şoför kaydedildi:', newDriver)
    setSelectedDriver(newDriver)
    onSelect(newDriver)
  }

  const handleChangeSelect = (driver) => {
    setSelectedDriver(driver)
    onSelect(driver)
  }

  return (
    <Box sx={{ minWidth: 200 }}>
      <SmartDriverSelect value={value} setValue={onSelect} onAddDriverClick={handleAddDriverClick} />

      {value && (
        <Box mt={2} display="flex" flexDirection="column" gap={1.5}>
          <TextField sx={{ display: (firmCode === '320.01.920' || firmCode === '320.99.001') && 'none' }} label="T.C No" value={value.identityNumber} fullWidth />
          <TextField sx={{ display: (firmCode === '320.01.920' || firmCode === '320.99.001') && 'none' }} label="Telefon" value={value.phoneNumber} fullWidth />
          <TextField sx={{ display: (firmCode === '320.01.920' || firmCode === '320.99.001') && 'none' }} label="Plaka" value={value.licensePlate} fullWidth />
          <TextField sx={{ display: (firmCode === '320.01.920' || firmCode === '320.99.001') && 'none' }} label="Dorse Plaka" value={value.trailerPlate} fullWidth />
          <TextField sx={{ display: (firmCode === '320.01.920' || firmCode === '320.99.001') && 'none' }} label="Ad Soyad" value={value.driverName} fullWidth />
        </Box>
      )}

      <AddDriverModal open={addModalOpen} onClose={() => setAddModalOpen(false)} onSave={handleDriverSave} />
    </Box>
  )
}
