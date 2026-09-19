import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Modal,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material'
import PalletBarcodeRows from './PalletBarcodeRows'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import BasicSlider from '../../shared/components/Slider/BasicSlider'
import { GridCloseIcon } from '@mui/x-data-grid'

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

export default function PalletBarcodeGenerator({
  openPalletDialog,
  handlePalletDialog,
  orderDetail,
  palletBarcodeList,
  handlePalletBarcodeList,
  createPalletBarcode,
  palletList,
  fetchDeletePalletBarcodeById,
  fetchDeletePalletBarcodeDetailById,
  addProductPalletBarcode,
  handlePrintBarcode,
}) {
  const theme = useTheme()

  if (!openPalletDialog) {
    return null
  }
  return (
    <Modal
      sx={{ display: 'flex', overflow: 'auto' }}
      open={openPalletDialog}
      onClose={handlePalletDialog}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <TableContainer direction="column" sx={{ overflow: 'auto', maxHeight: 400 }}>
          <Table stickyHeader sx={{ flexGrow: 1 }} aria-label="simple table">
            <TableHead sx={{ backgroundColor: '#9BE8D6' }}>
              <TableRow>
                <TableCell align="left"></TableCell>
                <TableCell align="left">Ürün Adı</TableCell>
                <TableCell align="left">Stok Kodu</TableCell>
                <TableCell align="left">Siparis Miktar</TableCell>
                <TableCell align="left">Teslim Miktar</TableCell>
                <TableCell align="center">Fark</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderDetail
                .filter((q) => q.teslimMiktar > 0)
                .map((row, index) => (
                  <PalletBarcodeRows key={index} row={row} handlePalletBarcodeList={handlePalletBarcodeList} />
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Divider />
        <Box
          sx={{
            mt: 2,
            display: 'flex',
            justifyContent: 'space-evenly',
          }}
        >
          <Stack>
            <Button variant="contained" disabled={!(orderDetail.filter((q) => q.teslimMiktar > 0).length > 0)} onClick={createPalletBarcode}>
              Palet Oluştur
            </Button>
          </Stack>
          <Stack>
            <Button variant="contained" disabled={!(palletList.length > 0)} onClick={() => handlePrintBarcode(palletList)}>
              Barkod Çıkar
            </Button>
          </Stack>
        </Box>
        <Box
          sx={{
            mt: 2,
            overflow: 'auto',
          }}
        >
          {palletList &&
            palletList.length > 0 &&
            palletList
              .filter((q) => q.palletBarcodeStatus === true)
              .map((pallet, index) => (
                <Card
                  key={index}
                  sx={{
                    flexGrow: 1,
                    mb: 2,
                    border: '1px solid',
                    borderColor: theme.palette.primary.main,
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box>
                          <Chip label={pallet.palletBarcodeList.filter((q) => q.status === true).length} sx={{ borderRadius: 1, fontSize: '15px' }} />
                        </Box>
                        <Box>
                          Palet Barkodu
                          <Typography
                            sx={{
                              textAlign: 'center',
                            }}
                          >
                            {pallet.palletBarcode}
                          </Typography>
                        </Box>
                      </Box>
                      <Box>
                        <Stack
                          direction={'row'}
                          sx={{
                            gap: 1,
                          }}
                        >
                          <Button variant="contained" onClick={() => addProductPalletBarcode(pallet.palletBarcodeId)}>
                            EKLE
                          </Button>
                          <Button variant="contained" onClick={() => fetchDeletePalletBarcodeById(pallet.palletBarcodeId)}>
                            Sİl
                          </Button>
                        </Stack>
                      </Box>
                    </Box>
                  </CardContent>
                  <Divider />
                  <BasicSlider
                    children={
                      <>
                        {pallet.palletBarcodeList
                          .filter((q) => q.status === true)
                          .map((barcode, index) => (
                            <Card
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                minWidth: '200px',
                                alignItems: 'center',
                                gap: 1,
                                p: 1,
                              }}
                              key={index}
                            >
                              <Box>
                                <Button
                                  endIcon={<DeleteOutlineOutlinedIcon />}
                                  variant="outlined"
                                  onClick={() => fetchDeletePalletBarcodeDetailById(barcode.palletBarcodeOrderRelId, barcode.stockCode, pallet.palletBarcodeId)}
                                >
                                  Sil
                                </Button>
                              </Box>
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  flexDirection: 'column',
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontWeight: 'bold',
                                  }}
                                >
                                  {barcode.quantity}
                                </Typography>
                                <Typography>{barcode.stockCode}</Typography>
                              </Box>
                              <Box>
                                <Typography>
                                  {barcode.stockName.substring(0, 25)}
                                  <br />
                                  {barcode.stockName.substring(15)}
                                </Typography>
                              </Box>
                            </Card>
                          ))}
                      </>
                    }
                  />
                  <Box>
                    <Stack></Stack>
                  </Box>
                </Card>
              ))}
        </Box>
        <IconButton onClick={handlePalletDialog} sx={{ position: 'absolute', top: 0, right: 0 }}>
          <GridCloseIcon />
        </IconButton>
      </Box>
    </Modal>
  )
}
