import { Box, Card, CardActionArea, CardActions, CardContent, Divider, IconButton, Typography } from '@mui/material'
import React from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import OrderItemColumn from '../Order/OrderItemColumn'

export default function PalletBarcodeDetailCardItem({ palletInfo, theme, handleDelete, handleAdd }) {
  return (
    <Card
      sx={{
        border: '2px solid',
        borderColor: theme.palette.primary.main,
        background: theme.palette.secondary.secondary,
        borderRadius: theme.shape.borderRadius,
        maxWidth: 300,
        display: 'flex',
      }}
    >
      <CardActionArea sx={{ display: 'flex' }}>
        <CardContent sx={{ display: 'flex', gap: 2 }}>
          <OrderItemColumn title={'Stok Kodu'} value={palletInfo.stockCode || palletInfo.stokKodu} />
          <Divider orientation="vertical" flexItem />
          <OrderItemColumn title={'Sipariş No'} value={palletInfo.orderNo || palletInfo.siparisNo} />
        </CardContent>
        <CardContent>
          <Typography
            variant="h4"
            sx={{
              fontWeight: theme.typography.fontWeightMedium,
            }}
          >
            {palletInfo.amount} {palletInfo.teslimMiktar}
          </Typography>
        </CardContent>
      </CardActionArea>

      <CardActions>
        {palletInfo.cariName ? (
          <IconButton onClick={() => handleDelete(palletInfo.palletBarcodeOrderRelId)}>
            <DeleteIcon />
          </IconButton>
        ) : (
          <IconButton onClick={() => handleAdd(palletInfo.stokKodu)}>
            <AddIcon />
          </IconButton>
        )}
      </CardActions>
    </Card>
  )
}
