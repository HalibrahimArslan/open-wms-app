import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Modal,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import NotFound from '../../shared/components/NotFound/NotFound'
import ActionHeader from '../../shared/components/ActionHeader'

const style = {
  position: 'relative',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  height: 'auto',
  width: 'auto',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  overflow: 'auto',
}

const UniqueBarcodeSummaryModal = ({
  open,
  orderDetail,
  addresses,
  selectedAddress,
  handleSelectedAddress,
  handleClose,
  disabled,
  handleAction,
  reservationDataList = [],
  handleReservationChange,
}) => {
  const theme = useTheme()

  if (!open) return null

  return (
    <Modal sx={{ display: 'flex', overflow: 'auto' }} open={open} aria-labelledby="receiving-summary-modal-title" aria-describedby="receiving-summary-modal-description">
      <Box sx={style}>
        {selectedAddress && Object.keys(selectedAddress).length > 0 && <ActionHeader title={`${selectedAddress.adres} geçici adresine ürünler aktarılacaktır.`} hide={true} />}

        {addresses.length === 0 ? (
          <NotFound msg="Geçici Adres bulunamadı" />
        ) : (
          <Box display={addresses.length === 1 ? 'none' : 'flex'} justifyContent="space-between" alignItems="center">
            <Autocomplete
              disablePortal
              value={selectedAddress}
              onChange={(event, newValue) => handleSelectedAddress(newValue)}
              options={addresses}
              renderInput={(params) => <TextField {...params} label={'Adres'} />}
              fullWidth
              getOptionLabel={(option) => option.adres}
            />
          </Box>
        )}

        <TableContainer direction="column" sx={{ overflow: 'auto' }}>
          <Table sx={{ flexGrow: 1 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Rezerve?</TableCell>
                <TableCell>Ürün Adı</TableCell>
                <TableCell>Stok Kodu</TableCell>
                <TableCell>Sipariş Miktar</TableCell>
                <TableCell>Teslim Miktar</TableCell>
                <TableCell align="center">Fark</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderDetail.map((orderItem) => {
                const rezervasyon = reservationDataList.find((r) => r.stokKodu === orderItem.stokKodu) || {
                  isReserve: 'H',
                  reserveNo: '',
                  description: '',
                }

                return (
                  <TableRow
                    key={orderItem.stokKodu}
                    sx={{
                      opacity: orderItem.teslimMiktar === 0 ? 0.4 : 1,
                      pointerEvents: orderItem.teslimMiktar === 0 ? 'none' : 'auto',
                    }}
                  >
                    <TableCell>
                      {orderItem.teslimMiktar > 0 ? (
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={rezervasyon.isReserve === 'E'}
                              onChange={(e) => handleReservationChange(orderItem.stokKodu, 'isReserve', e.target.checked ? 'E' : 'H')}
                            />
                          }
                          label=""
                        />
                      ) : (
                        <Box sx={{ width: 24, height: 24 }} />
                      )}
                    </TableCell>

                    <TableCell>{orderItem.stokAdi}</TableCell>
                    <TableCell>{orderItem.stokKodu}</TableCell>
                    <TableCell>{orderItem.siparisMiktar}</TableCell>
                    <TableCell>{orderItem.teslimMiktar}</TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        backgroundColor: orderItem.siparisMiktar - orderItem.teslimMiktar < 0 ? theme.palette.success.main : theme.palette.error.main,
                      }}
                    >
                      {(orderItem.siparisMiktar - orderItem.teslimMiktar).toFixed(2)}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {orderDetail.map((orderItem) => {
          const rezervasyon = reservationDataList.find((r) => r.stokKodu === orderItem.stokKodu) || {
            isReserve: 'H',
            reserveNo: '',
            description: '',
          }

          return (
            rezervasyon.isReserve === 'E' && (
              <Box key={orderItem.stokKodu} mt={2}>
                <Typography fontWeight={600}>{orderItem.stokAdi}</Typography>
                <Stack direction="row" spacing={2} mt={1}>
                  <TextField
                    label="Reserve No"
                    value={rezervasyon.reserveNo}
                    onChange={(e) => handleReservationChange(orderItem.stokKodu, 'reserveNo', e.target.value)}
                    fullWidth
                  />
                  <TextField
                    label="Açıklama"
                    value={rezervasyon.description}
                    onChange={(e) => handleReservationChange(orderItem.stokKodu, 'description', e.target.value)}
                    fullWidth
                  />
                </Stack>
              </Box>
            )
          )
        })}

        <Divider sx={{ my: 2 }} />

        <Stack direction="row" justifyContent="flex-end" spacing={2}>
          <Button variant="outlined" onClick={handleClose}>
            Kapat
          </Button>
          <Button variant="contained" disabled={disabled || addresses.length === 0 || selectedAddress === null} onClick={handleAction}>
            Irsaliye Oluştur
          </Button>
        </Stack>
      </Box>
    </Modal>
  )
}

export default UniqueBarcodeSummaryModal
