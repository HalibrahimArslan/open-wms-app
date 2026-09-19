import { Box, Button, Divider, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'

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

const CompleteDispatchmentSummaryModal = ({ modal, handleClose, orderDetail, enableIrsaliyeBtn, sevkiyatYap }) => {
  return (
    <Modal sx={{ display: 'flex', overflow: 'auto' }} open={modal} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={style}>
        <TableContainer direction="column" sx={{ overflow: 'auto' }}>
          <Table sx={{ flexGrow: 1 }} aria-label="simple table">
            <TableHead sx={{ backgroundColor: '#9BE8D6' }}>
              <TableRow>
                <TableCell align="left">SiparisNo</TableCell>
                <TableCell align="left">Ürün Adı</TableCell>
                <TableCell align="left">Stok Kodu</TableCell>
                <TableCell align="left">Siparis Miktar</TableCell>
                <TableCell align="left">Toplanan Miktar</TableCell>
                <TableCell align="center">Fark</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderDetail.map((row) => (
                <TableRow key={row.sipUid} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="left">{row.siparisNo}</TableCell>
                  <TableCell align="left">{row.stokAdi}</TableCell>
                  <TableCell align="left">{row.stokKodu}</TableCell>
                  <TableCell align="left">{row.siparisMiktar}</TableCell>
                  <TableCell align="left">{row.observerAmount}</TableCell>
                  {row.siparisMiktar - row.observerAmount === 0 ? (
                    <TableCell sx={{ backgroundColor: 'green' }} align="center">
                      {row.siparisMiktar - row.observerAmount}
                    </TableCell>
                  ) : (
                    <TableCell sx={{ backgroundColor: 'red' }} align="center">
                      {row.siparisMiktar - row.observerAmount}
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
          <Button variant="contained" disabled={enableIrsaliyeBtn} onClick={() => sevkiyatYap()}>
            Irsaliye Oluştur
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default CompleteDispatchmentSummaryModal
