import { Table, TableContainer, TableHead, TableCell, TableBody, TableRow, Box, Button, Checkbox, Switch, FormControlLabel, Divider, Menu } from '@mui/material'
import React from 'react'
import { styled } from '@mui/material/styles'
import { useTheme } from '@mui/system'
import './orderdoneitem.css'
import Edit from '@mui/icons-material/Edit'
import MoreVertButton from '../MenuWrapper/MoreVertButton'
import CloseIcon from '@mui/icons-material/Close'
const StyledTableRow = styled(TableRow)(({ theme }) => ({}))

export default function OrderDoneItem({
  list,
  scannedItems,
  palletList,
  handleNavigate,
  checkBoxEnable,
  handleSwitch,
  handleChosenItem,
  handleNavigateEditPage,
  fetchSuspendOrder,
  handleOpenConfirmDialog,
}) {
  const theme = useTheme()
  return (
    <Box sx={{ boxShadow: theme.shadows[1] }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 0.5 }}>
        <FormControlLabel sx={{ display: 'flex', justifyContent: 'flex-start', ml: 2 }} control={<Switch onChange={handleSwitch} />} label="Kalem Seç" />
        <MoreVertButton
          btnList={[
            {
              id: 'edit',
              name: 'Düzenle',
              onClick: handleNavigateEditPage,
              icon: <Edit />,
            },
            {
              id: 'delete',
              name: 'Sipariş Kapat',
              onClick: handleOpenConfirmDialog,
              icon: <CloseIcon />,
            },
          ]}
        />
      </Box>
      <Divider />
      {palletList.map((pallet) => (
        <TableContainer sx={{ display: 'flex', flexDirection: 'column' }}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                {checkBoxEnable && <Checkbox sx={{ position: 'sticky', left: 0 }} onClick={() => handleChosenItem(pallet.palletBarcode)} />}
                <TableCell sx={{ position: 'sticky', left: 0 }}>
                  <Button onClick={() => handleNavigate(pallet.palletBarcode)} size="small">
                    Düzenle
                  </Button>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableCell align="center" className="palet-barcode">
                {pallet.palletBarcode}
              </TableCell>
              <TableContainer sx={{ display: 'flex' }}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">Stok Kodu</TableCell>
                      <TableCell align="left">Ürün Adı</TableCell>
                      <TableCell align="left">Barkod</TableCell>
                      <TableCell align="left">Siparis Miktar</TableCell>
                      <TableCell align="left">Teslim Miktar</TableCell>
                      <TableCell align="left">Kalan Miktar</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <>
                      {list
                        .filter((q) => {
                          let filteredList = []
                          filteredList = palletList.filter((q2) => q2.palletBarcode === pallet.palletBarcode)
                          return filteredList.find((q2) => {
                            return q2.palletBarcodeList.find((q3) => {
                              return q3.stockCode === q.stokKodu
                            })
                          })
                        })
                        .map((row) => (
                          <StyledTableRow
                            key={row.id}
                            sx={{
                              backgroundColor: scannedItems.includes(row.stokKodu) ? theme.palette.order.primary.successful : theme.palette.order.primary.error,
                            }}
                          >
                            <TableCell align="left">{row.stokKodu}</TableCell>
                            <TableCell align="left">{row.stokAdi}</TableCell>
                            <TableCell align="left">{row.barkod}</TableCell>
                            <TableCell align="left">{row.siparisMiktar}</TableCell>
                            <TableCell align="left">{row.observerAmount}</TableCell>
                            <TableCell align="left">{(row.siparisMiktar - row.observerAmount).toFixed(2)}</TableCell>
                          </StyledTableRow>
                        ))}
                    </>
                  </TableBody>
                </Table>
              </TableContainer>
            </TableBody>
          </Table>
        </TableContainer>
      ))}

      {list.filter((q) => {
        return !palletList.find((q2) => {
          return q2.palletBarcodeList.find((q3) => {
            return q3.stockCode === q.stokKodu
          })
        })
      }).length > 0 && (
        <TableContainer sx={{ display: 'flex' }}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                {checkBoxEnable && <TableCell align="left"> </TableCell>}
                <TableCell align="left">Stok Kodu</TableCell>
                <TableCell align="left">Ürün Adı</TableCell>
                <TableCell align="left">Barkod</TableCell>
                <TableCell align="left">Siparis Miktar</TableCell>
                <TableCell align="left">Teslim Miktar</TableCell>
                <TableCell align="left">Kalan Miktar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <>
                {list
                  .filter((q) => {
                    return !palletList.find((q2) => {
                      return q2.palletBarcodeList.find((q3) => {
                        return q3.stockCode === q.stokKodu
                      })
                    })
                  })
                  .map((row) => (
                    <StyledTableRow
                      key={row.id}
                      sx={{
                        backgroundColor: scannedItems.includes(row.stokKodu) ? theme.palette.order.primary.successful : theme.palette.order.primary.error,
                      }}
                    >
                      {checkBoxEnable && <Checkbox key={row.id} sx={{ position: 'sticky', left: 0 }} onClick={() => handleChosenItem(row.stokKodu)} />}{' '}
                      <TableCell align="left">{row.stokKodu}</TableCell>
                      <TableCell align="left">{row.stokAdi}</TableCell>
                      <TableCell align="left">{row.barkod}</TableCell>
                      <TableCell align="left">{row.siparisMiktar}</TableCell>
                      <TableCell align="left">{row.observerAmount}</TableCell>
                      <TableCell align="left">{(row.siparisMiktar - row.observerAmount).toFixed(2)}</TableCell>
                    </StyledTableRow>
                  ))}
              </>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  )
}
