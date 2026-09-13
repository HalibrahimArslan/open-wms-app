import { Alert, Box, Button, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useContainer } from 'unstated-next'
import usePatchPayload from '../../hooks/usePatchPayload'
import { updateOrderDetailById } from '../../services/OrderDetailService'
import { updateOrderMasterById } from '../../services/OrderService'
import { OrderJustifyContainer } from '../../store/OrderJustifyContainer'
import OrderStatus from '../Combobox/OrderStatus'
import { notify, notifyError } from '../../layout/Layout'
import { DataStore } from '../../store/DataStore'

export default function OrderDetailForm({ orderDetail }) {
  const { account } = useContainer(DataStore)
  const { handleUpdatedOne } = OrderJustifyContainer.useContainer()

  const [form, setForm] = useState({
    id: orderDetail.id,
    siparisMiktar: orderDetail.siparisMiktar,
    teslimMiktar: orderDetail.teslimMiktar,
    status: orderDetail.status,
  })

  const patchPayload = usePatchPayload({
    ...form,
    observerAmount: form.teslimMiktar,
  })

  const isAdmin = Array.isArray(account?.authorities) && account.authorities.includes('ROLE_ADMIN')

  const handleChange = (field) => (e) => {
    const value = parseFloat(e.target.value) || 0
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleStatus = (value) => {
    setForm((prev) => ({
      ...prev,
      status: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await updateOrderDetailById(form.id, patchPayload)
      if (res) {
        handleUpdatedOne([form])
        notify('Güncelleme Başarılı')
      }
    } catch (e) {
      notifyError(e.message)
    }
  }

  if (!orderDetail) return null

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Alert severity="info" sx={{ mb: 2 }}>
        Yönetici yetkisine sahip kullanıcılar adres okutmadan miktar girebilir.
      </Alert>

      <OrderStatus initialStatus={form.status} handleOrderStatus={handleStatus} />

      <TextField value={orderDetail.stokAdi} disabled fullWidth margin="normal" />
      <TextField value={orderDetail.barkod} disabled fullWidth margin="normal" />
      <TextField value={orderDetail.stokKodu} disabled fullWidth margin="normal" />

      <TextField value={form.siparisMiktar} onChange={handleChange('siparisMiktar')} fullWidth margin="normal" label="Sipariş Miktar" type="number" />

      <TextField value={form.teslimMiktar} onChange={handleChange('teslimMiktar')} fullWidth margin="normal" label="Teslim Miktar" type="number" />

      <Button type="submit" variant="contained" fullWidth disabled={!isAdmin}>
        Güncelle
      </Button>
    </Box>
  )
}
