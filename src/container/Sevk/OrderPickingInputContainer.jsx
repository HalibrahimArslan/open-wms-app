import { Paper, Stack, InputAdornment, TextField } from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner'

const OrderPickingInputContainer = ({ orderType, addressBarcode, barcode, situation, focus, onChangeAddressBarcode, onChangeBarcode, onAddressBarcodeEnter, onBarcodeEnter }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: (theme) => (theme.palette.mode === 'light' ? 'rgba(0,0,0,0.01)' : 'rgba(255,255,255,0.01)'),
        mx: 1,
      }}
    >
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
        <TextField
          autoFocus={focus}
          fullWidth
          disabled={situation}
          label="Adres Barkodu"
          placeholder="Adres okutunuz..."
          value={addressBarcode}
          onChange={onChangeAddressBarcode}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocationOnIcon color={situation ? 'disabled' : 'primary'} />
              </InputAdornment>
            ),
          }}
          onKeyDown={(ev) => {
            if (ev.key === 'Enter') {
              ev.preventDefault()
              onAddressBarcodeEnter()
            }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              backgroundColor: 'background.paper',
            },
          }}
        />

        <TextField
          autoFocus={!focus || orderType !== 'MSK'}
          fullWidth
          disabled={orderType === 'MSK' ? !situation : false}
          label="Ürün Barkodu"
          placeholder="Ürün okutunuz..."
          value={barcode}
          onChange={onChangeBarcode}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <QrCodeScannerIcon color={!focus || orderType !== 'MSK' ? 'primary' : 'disabled'} />
              </InputAdornment>
            ),
          }}
          onKeyDown={(ev) => {
            if (ev.key === 'Enter') {
              ev.preventDefault()
              onBarcodeEnter()
            }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              backgroundColor: 'background.paper',
            },
          }}
        />
      </Stack>
    </Paper>
  )
}

export default OrderPickingInputContainer
