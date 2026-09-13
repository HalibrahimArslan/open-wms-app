import React, { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box } from '@mui/material'
import useAuthHeader from '../../hooks/useAuthHeader'
import { saveDriver } from '../../services/DriverService'
import { notifyError } from '../../layout/Layout'

const MAX_PLATE_LEN = 15

export default function AddDriverDialog({ open, onClose, onSave }) {
  const [formData, setFormData] = useState({
    soforAdi: '',
    soforTcno: '',
    soforTel: '',
    soforPlaka: '',
    dorsePlaka: '',
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const headers = useAuthHeader()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.soforAdi || formData.soforAdi.trim().length < 3) {
      newErrors.soforAdi = 'Ad soyad en az 3 karakter olmalı'
    }

    if (!formData.soforTcno || formData.soforTcno.length !== 11) {
      newErrors.soforTcno = 'T.C. No 11 haneli olmalı'
    }

    if (!formData.soforTel || formData.soforTel.length !== 11) {
      newErrors.soforTel = 'Telefon 11 haneli olmalı'
    }

    if (!formData.soforPlaka || formData.soforPlaka.length < 6) {
      newErrors.soforPlaka = 'Plaka en az 6 karakter olmalı'
    }

    if ((formData.soforPlaka || '').trim().length > MAX_PLATE_LEN) {
      newErrors.soforPlaka = 'Plaka 15 haneden fazla olamaz'
    }

    if ((formData.dorsePlaka || '').trim().length > MAX_PLATE_LEN) {
      newErrors.dorsePlaka = 'Dorse plaka 15 haneden fazla olamaz'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return

    const payload = {
      driverName: formData.soforAdi,
      identityNumber: formData.soforTcno,
      licensePlate: formData.soforPlaka.trim(),
      phoneNumber: formData.soforTel,
      opType: 'MSK',
      trailerPlate: (formData.dorsePlaka || '').trim(),
    }

    try {
      setLoading(true)
      const newDriver = await saveDriver(headers, payload)
      onSave(newDriver)

      setFormData({
        soforAdi: '',
        soforTcno: '',
        soforTel: '',
        soforPlaka: '',
        dorsePlaka: '',
      })
      setErrors({})
      onClose()
    } catch (err) {
      notifyError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Yeni Şoför Ekle</DialogTitle>

      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField label="Ad Soyad" name="soforAdi" value={formData.soforAdi} onChange={handleChange} error={!!errors.soforAdi} helperText={errors.soforAdi} fullWidth />

          <TextField label="T.C. No" name="soforTcno" value={formData.soforTcno} onChange={handleChange} error={!!errors.soforTcno} helperText={errors.soforTcno} fullWidth />

          <TextField label="Telefon" name="soforTel" value={formData.soforTel} onChange={handleChange} error={!!errors.soforTel} helperText={errors.soforTel} fullWidth />

          <TextField
            label="Plaka"
            name="soforPlaka"
            value={formData.soforPlaka}
            onChange={handleChange}
            error={!!errors.soforPlaka}
            helperText={errors.soforPlaka || 'Maksimum 15 karakter'}
            inputProps={{ maxLength: MAX_PLATE_LEN }}
            fullWidth
          />

          {/* ✅ trailerPlate input */}
          <TextField
            label="Dorse Plaka"
            name="dorsePlaka"
            value={formData.dorsePlaka}
            onChange={handleChange}
            error={!!errors.dorsePlaka}
            helperText={errors.dorsePlaka || 'Maksimum 15 karakter'}
            inputProps={{ maxLength: MAX_PLATE_LEN }}
            fullWidth
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          İptal
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={loading}>
          Kaydet
        </Button>
      </DialogActions>
    </Dialog>
  )
}
