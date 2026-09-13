import React, { useEffect } from 'react'
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { useState } from 'react'
import { OrderSituation } from '../../utils/Utils'

const OrderStatus = ({ initialStatus, handleOrderStatus }) => {
  const [orderStatusCombo, setOrderStatusCombo] = useState(initialStatus)

  useEffect(() => {
    handleOrderStatus(orderStatusCombo)
  }, [orderStatusCombo])

  useEffect(() => {
    setOrderStatusCombo(initialStatus)
  }, [initialStatus])

  const handleChange = (event) => {
    setOrderStatusCombo(event.target.value)
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <FormControl fullWidth>
        <InputLabel id="order-status-simple-select-label">Statu Seçiniz</InputLabel>
        <Select labelId="order-status-simple-select-label" id="order-status-simple-select" value={orderStatusCombo} label="Statu Seciniz" onChange={handleChange}>
          {Object.keys(OrderSituation).map((id) => (
            <MenuItem key={id} value={OrderSituation[id].status}>
              {OrderSituation[id].description}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}

export default OrderStatus
