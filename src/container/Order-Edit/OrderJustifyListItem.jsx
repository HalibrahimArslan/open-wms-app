import React from 'react'
import { OrderJustifyContainer } from '../../store/OrderJustifyContainer'
import { Box, Button, useTheme } from '@mui/material'
import { red } from '@mui/material/colors'
import OrderItemColumn from '../../components/Order/OrderItemColumn'

export default function OrderJustifyListItem({ stockCode, stockName, orderQuantity, deliveryQuantity, sipUid, orderNo, orderType }) {
  const { handleFirmCode, handleFirmList, firmCode } = OrderJustifyContainer.useContainer()

  const theme = useTheme()

  const handleOrderItem = (key) => {
    handleFirmCode(key)
  }

  const handleReduceItem = (key) => {
    const list = firmCode.filter((i) => !i.includes(key))
    handleFirmList(list)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        gap: 1,
        p: 1,
        borderRadius: theme.shape.borderRadius,
        bgcolor: theme.palette.secondary.main,
        overflow: 'auto',
      }}
    >
      {orderType === 'MSK' ? (
        <React.Fragment>
          <OrderItemColumn title={'Sipariş No'} value={orderNo} />
          <OrderItemColumn title={'Stok Kodu'} value={stockCode} />
          <OrderItemColumn title={'Sipariş Miktar'} value={(orderQuantity - deliveryQuantity).toFixed(2)} />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <OrderItemColumn title={'Stok İsmi'} value={stockName} />
          <OrderItemColumn title={'Stok Kodu'} value={stockCode} />
          <OrderItemColumn title={'Siparis Miktar'} value={(orderQuantity - deliveryQuantity).toFixed(2)} />
        </React.Fragment>
      )}

      {firmCode.includes(orderType === 'MSK' ? sipUid : stockCode) ? (
        <Button
          variant="contained"
          onClick={() => handleReduceItem(orderType === 'MSK' ? sipUid : stockCode)}
          sx={{
            backgroundColor: theme.palette.error.main,
            '&:hover': {
              backgroundColor: red[800],
            },
          }}
        >
          SİL
        </Button>
      ) : (
        <Button variant="contained" onClick={() => handleOrderItem(orderType === 'MSK' ? sipUid : stockCode)}>
          Ekle
        </Button>
      )}
    </Box>
  )
}
