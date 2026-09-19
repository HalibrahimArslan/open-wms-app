import { Table, TableContainer, TableHead, TableCell, TableBody, TableRow, Box, Paper } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Button, Stack, useTheme } from '@mui/material'
import { OrderJustifyContainer } from '../../store/OrderJustifyContainer'
import { useState } from 'react'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router'
import EditIcon from '@mui/icons-material/Edit'
import { useEffect } from 'react'
import { produce } from 'immer'
import { useContainer } from 'unstated-next'

const StyledTableRow = styled(TableRow)(({ theme }) => ({}))

export default function OrderSuspendItem({ list }) {
  const nav = useNavigate()
  const theme = useTheme()
  const location = useLocation()
  const [response, setResponse] = useState([])
  const avaliableList = response.filter((responseItem) => responseItem.status !== 'SUSPENDED')

  const { orderType } = useParams()

  const { firmCode, updatedOne, handleFirmList, handleCancelledItem, clearCancelledItem, handleCancelledList, cancelledItem, handleOrderSituation, orderSituation } =
    useContainer(OrderJustifyContainer)

  const handleReduceItem = (key) => {
    const list = firmCode.filter((i) => !i.includes(key))
    handleFirmList(list)
  }

  const handleWholeOrder = () => {
    if (orderSituation) {
      clearCancelledItem()
    } else {
      let stockCodes = list.map((i) => (orderType === 'MSK' ? i.sipUid : i.stokKodu))
      handleCancelledList(stockCodes)
    }
    handleOrderSituation()
  }

  const handleCancel = (key) => {
    handleCancelledItem(key)
  }

  const handleRemove = (key) => {
    let emptyList = []
    emptyList = cancelledItem.filter((i) => !i.includes(key))
    handleCancelledList(emptyList)
  }

  const handleOpenDialog = (id) => {
    nav(`order-detail/${id}`)
  }

  useEffect(() => {
    if (list.length > 0) {
      setResponse(list)
    }
  }, [list])

  useEffect(() => {
    if (updatedOne.length > 0 && response.length > 0) {
      setResponse(
        produce((draft) => {
          const searchItem = draft.find((i) => i.id === updatedOne[0].id)
          if (searchItem) {
            searchItem.siparisMiktar = updatedOne[0].siparisMiktar
            searchItem.teslimMiktar = updatedOne[0].teslimMiktar
            searchItem.observerAmount = updatedOne[0].observerAmount
          }
        })
      )
    }
  }, [updatedOne, response])

  return (
    <Paper>
      <TableContainer sx={{ maxHeight: '65dvh' }}>
        <Table stickyHeader aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left"></TableCell>
              {orderType === 'MSK' && <TableCell align="left">Siparis No</TableCell>}
              <TableCell align="left">Stok Kodu</TableCell>
              <TableCell align="left">Ürün Adı</TableCell>
              <TableCell align="left">Barkod</TableCell>
              <TableCell align="left">Siparis Miktar</TableCell>
              <TableCell align="left">Teslim Miktar</TableCell>
              <TableCell align="left">Kalan Miktar</TableCell>
              <TableCell align="left" sx={{ position: 'sticky', right: 0, backgroundColor: theme.palette.background.paper }}>
                <Stack>
                  <Button variant="contained" onClick={() => handleWholeOrder()}>
                    {orderSituation ? 'GERİ AL' : 'SİPARİS İPTAL'}
                  </Button>
                </Stack>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {avaliableList.length > 0 &&
              avaliableList.map((row) => (
                <StyledTableRow
                  key={orderType === 'MSK' ? row.id : row.stokKodu}
                  sx={{
                    backgroundColor: cancelledItem.includes(orderType === 'MSK' ? row.sipUid : row.stokKodu) ? theme.palette.error.main : theme.palette.background.default,
                  }}
                >
                  <TableCell align="left">
                    <Button onClick={() => handleOpenDialog(row.id)}>
                      <EditIcon />
                    </Button>
                  </TableCell>
                  {orderType === 'MSK' && <TableCell align="left">{row.siparisNo}</TableCell>}
                  <TableCell align="left">{row.stokKodu}</TableCell>
                  <TableCell align="left">{row.stokAdi}</TableCell>
                  <TableCell align="left">{row.barkod}</TableCell>
                  <TableCell align="left">{row.siparisMiktar}</TableCell>
                  <TableCell align="left">{row.teslimMiktar}</TableCell>
                  <TableCell align="left">{(row.siparisMiktar - row.teslimMiktar).toFixed(2)}</TableCell>
                  {firmCode.includes(orderType === 'MSK' ? row.sipUid : row.stokKodu) ? (
                    <TableCell
                      sx={{
                        position: 'sticky',
                        right: 0,
                        backgroundColor: theme.palette.background.paper,
                      }}
                    >
                      <Stack>
                        <Button onClick={() => handleReduceItem(orderType === 'MSK' ? row.id : row.stokKodu)} variant="contained">
                          EKLENENİ GERİ AL
                        </Button>
                      </Stack>
                    </TableCell>
                  ) : (
                    <TableCell
                      align="center"
                      sx={{
                        position: 'sticky',
                        right: 0,
                        backgroundColor: theme.palette.background.paper,
                      }}
                    >
                      <Stack
                        direction={'row'}
                        sx={{
                          gap: 2,
                        }}
                      >
                        <Button
                          disabled={cancelledItem.includes(orderType === 'MSK' ? row.sipUid : row.stokKodu)}
                          onClick={() => handleCancel(orderType === 'MSK' ? row.sipUid : row.stokKodu)}
                          variant="contained"
                          sx={{
                            fontWeight: theme.typography.fontWeightBold,
                            '&:hover': {
                              backgroundColor: 'red',
                            },
                          }}
                          size="small"
                        >
                          SİL
                        </Button>
                        <Button
                          disabled={!cancelledItem.includes(orderType === 'MSK' ? row.sipUid : row.stokKodu) || orderSituation}
                          onClick={() => handleRemove(orderType === 'MSK' ? row.sipUid : row.stokKodu)}
                          variant="contained"
                          sx={{
                            backgroundColor: theme.palette.button.success.main,
                            fontWeight: theme.typography.fontWeightBold,
                            '&:hover': {
                              backgroundColor: 'green',
                            },
                          }}
                        >
                          GERİ AL
                        </Button>
                      </Stack>
                    </TableCell>
                  )}
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Outlet />
    </Paper>
  )
}
