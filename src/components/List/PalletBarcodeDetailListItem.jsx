import { Typography, Divider, Box, useTheme } from '@mui/material'
import React from 'react'

export default function PalletBarcodeDetailListItem({ palletItem }) {
  const theme = useTheme()
  return (
    <Box
      key={palletItem.id}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        border: '2px solid',
        borderColor: theme.palette.primary.main,
        p: 1,
        mt: 1,
        background: theme.palette.secondary.secondary,
        borderRadius: theme.shape.borderRadius,
      }}
    >
      <Typography>Stok Kodu : {palletItem.stockCode}</Typography>
      <Divider />
      <Typography>Stok Adı : {palletItem.stockName}</Typography>
      <Divider />
      <Typography>Barkod : {palletItem.barcode}</Typography>
      <Divider />
      <Typography>Miktar : {palletItem.amount}</Typography>
      <Divider />
      <Typography>Cari Adı : {palletItem.cariName.slice(0, 15)}</Typography>
      <Divider />
      <Typography>Siparis No : {palletItem.orderNo}</Typography>
    </Box>
  )
}
