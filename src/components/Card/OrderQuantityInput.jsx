import DialogContentText from '@mui/material/DialogContentText'
import { Box, Chip, DialogContent, Divider, TextField, Tooltip, Typography, useTheme } from '@mui/material'

function OrderQuantityInput({ order, quantity, handleChange, handleKeyPress, erpAmount }) {
  const theme = useTheme()
  return (
    <Box
      sx={{
        borderTopRightRadius: theme.shape.borderRadius,
        borderTopLeftRadius: theme.shape.borderRadius,
        p: 4,
        background: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      <DialogContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <TextField
            label="Miktar Giriniz"
            id="order-quantity"
            value={quantity}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
            color="primary"
            sx={{
              '& fieldset': { border: 'none' },
              border: '2px solid',
              borderRadius: theme.shape.borderRadius,
              background: theme.palette.grey[300],
              borderColor: 'transparent',
            }}
            type="number"
          />
        </Box>
      </DialogContent>
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          justifyContent: erpAmount !== null && erpAmount !== undefined ? 'space-between' : 'flex-end',
          alignItems: 'center',
        }}
      >
        <Chip
          sx={{ display: erpAmount !== undefined && erpAmount !== null ? 'inherit' : 'none' }}
          label={`Mikro Miktarı: ${erpAmount}`}
          color="primary"
          variant="outlined"
          size="medium"
        />
        <Chip variant="outlined" color="primary" size="medium" label={`${order.teslimMiktar} / ${order.siparisMiktar}`} />
      </Box>
      <Divider />
      <DialogContentText>
        <Typography variant="subtitle2">{order.stokKodu}</Typography>
        <Tooltip title={order.stokAdi}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
            }}
          >
            {order.stokAdi}
          </Typography>
        </Tooltip>
      </DialogContentText>
    </Box>
  )
}

export default OrderQuantityInput
