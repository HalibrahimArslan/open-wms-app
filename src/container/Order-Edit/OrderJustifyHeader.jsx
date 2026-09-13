import { AppBar, Box, Button, IconButton, Toolbar, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import React from 'react'
import OrderStatus from '../../components/Adresleme/ComboBox/OrderStatus'

export default function OrderJustifyHeader({ handleSaveChanges, orderStatus, handleStatus, handleClose, firmName }) {
  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
          <CloseIcon />
        </IconButton>
        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
          Sipariş İçi Düzeltme
        </Typography>
        <Box sx={{ flexGrow: 0.1 }}>
          <OrderStatus initialStatus={orderStatus} handleOrderStatus={handleStatus} />
        </Box>
        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
          {firmName}
        </Typography>
        <Button color="success" onClick={handleSaveChanges} position="end" variant="contained">
          KAYDET
        </Button>
      </Toolbar>
    </AppBar>
  )
}
