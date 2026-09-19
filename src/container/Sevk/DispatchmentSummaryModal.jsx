import { Autocomplete, Box, Button, Divider, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, useTheme } from '@mui/material'
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
const DispatchmentSummaryModal = ({ open, orderDetail, addresses, selectedAddress, handleSelectedAddress, handleClose, handleAction }) => {
  const theme = useTheme()
  if (!open) {
    return null
  }
  return (
    <Modal sx={{ display: 'flex', overflow: 'auto' }} open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={style}>
        {selectedAddress && Object.keys(selectedAddress).length > 0 && <ActionHeader title={`${selectedAddress.adres} kontrol adresine ürünler aktarılacaktır.`} hide={true} />}
        {addresses.length === 0 ? (
          <NotFound msg="Kontrol Adres bulunamadı" />
        ) : (
          <Box
            sx={{
              display: addresses.length === 1 ? 'none' : 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Autocomplete
              disablePortal
              value={selectedAddress}
              onChange={(event, newValue) => {
                handleSelectedAddress(newValue)
              }}
              options={addresses}
              renderInput={(params) => <TextField {...params} label={'Adres'} />}
              fullWidth
              getOptionLabel={(option) => option.adres}
            />
          </Box>
        )}
        <TableContainer direction="column" sx={{ overflow: 'auto' }}>
          <Table stickyHeader sx={{ flexGrow: 1, maxHeight: '50%' }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Ürün Adı</TableCell>
                <TableCell align="left">Stok Kodu</TableCell>
                <TableCell align="left">Siparis Miktar</TableCell>
                <TableCell align="left">Teslim Miktar</TableCell>
                <TableCell align="center">Fark</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderDetail
                .filter((orderItem) => orderItem.teslimMiktar > 0)
                .map((row) => (
                  <TableRow
                    key={row.stokKodu}
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                    }}
                  >
                    <TableCell align="left">{row.stokAdi}</TableCell>
                    <TableCell align="left">{row.stokKodu}</TableCell>
                    <TableCell align="left">{row.siparisMiktar}</TableCell>
                    <TableCell align="left">{row.teslimMiktar}</TableCell>
                    {(row.siparisMiktar - row.teslimMiktar).toFixed(2) < 0 ? (
                      <TableCell sx={{ backgroundColor: theme.palette.error.main }} align="center">
                        {(row.siparisMiktar - row.teslimMiktar).toFixed(2)}
                      </TableCell>
                    ) : (
                      <TableCell sx={{ backgroundColor: theme.palette.success.main }} align="center">
                        {(row.siparisMiktar - row.teslimMiktar).toFixed(2)}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Divider />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
            mt: 2,
          }}
        >
          <Button variant="outlined" onClick={handleClose}>
            Kapat
          </Button>
          <Button variant="contained" onClick={handleAction} disabled={addresses.length === 0 || selectedAddress === null}>
            Sevkiyat Alanına Taşı
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default DispatchmentSummaryModal
