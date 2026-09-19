import { Table, TableContainer, TableHead, TableCell, TableBody, TableRow, Box, Chip, Alert } from '@mui/material'
import { Button, Stack, Typography, useTheme } from '@mui/material'
import React, { useMemo } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { utils, writeFile } from 'xlsx'
import { styled } from '@mui/material/styles'
import groupBy from '../../utils/Utils'
import DownloadTwoToneIcon from '@mui/icons-material/DownloadTwoTone'

const ReserveBox = ({ description, theme }) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        //writingMode: "vertical-rl",
        whiteSpace: 'nowrap',
        //height: '100%',
        display: 'flex',
        //flexDirection: "column-reverse",
        pl: 1,
        pr: 1,
        gap: 1,
      }}
    >
      <Typography variant="h6" color={theme.palette.primary.main}>
        Rezerve :
      </Typography>
      <Typography variant="h6" sx={{ textDecoration: 'underline' }}>
        {description}
      </Typography>
    </Box>
  )
}

const StyledTableRow = styled(TableRow)(({ theme, siparismiktar, teslimmiktar, piece }) => ({
  backgroundColor:
    teslimmiktar <= 0 ? `${theme.palette.error.light} !important` : teslimmiktar < siparismiktar ? theme.palette.warning.light : `${theme.palette.success.light} !important`,
  border: piece ? `3px solid ${theme.palette.common.black}` : 'none',
  boxShadow: piece ? theme.shadows[10] : 'none',
  position: 'relative',
}))

const GroupHeaderRow = styled(TableRow)(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderTop: `2px solid ${theme.palette.primary.dark}`,
  borderLeft: `2px solid ${theme.palette.primary.dark}`,
  borderRight: `2px solid ${theme.palette.primary.dark}`,
  '& .MuiTableCell-root': {
    color: theme.palette.primary.contrastText,
    fontWeight: 600,
    borderBottom: 'none',
  },
}))

const GroupContentRow = styled(TableRow)(({ theme, siparismiktar, teslimmiktar }) => ({
  backgroundColor: teslimmiktar <= 0 ? theme.palette.error.light : teslimmiktar < siparismiktar ? theme.palette.warning.light : theme.palette.success.light,
  borderLeft: `2px solid ${theme.palette.primary.dark}`,
  borderRight: `2px solid ${theme.palette.primary.dark}`,
  '& .MuiTableCell-root': {
    borderBottom: `1px solid ${theme.palette.action.hover}`,
  },
}))

const GroupLastRow = styled(TableRow)(({ theme, siparismiktar, teslimmiktar }) => ({
  backgroundColor: teslimmiktar <= 0 ? theme.palette.error.light : teslimmiktar < siparismiktar ? theme.palette.warning.light : theme.palette.success.light,
  borderLeft: `2px solid ${theme.palette.primary.dark}`,
  borderRight: `2px solid ${theme.palette.primary.dark}`,
  borderBottom: `2px solid ${theme.palette.primary.dark}`,
  '& .MuiTableCell-root': {
    borderBottom: 'none',
  },
}))

export default function OrderProgressItem({ list, opType, adresList, handleNavigate }) {
  const theme = useTheme()
  const [enable, setEnable] = useState(true)
  const hasReserve = list.find((orderItem) => {
    if (orderItem.isPiece && orderItem.pieceMaster.reserve) {
      return true
    }

    return orderItem.reserve
  })

  const excelDataArray = useMemo(() => {
    return []
  }, [])

  let partialList = groupBy(list, (criteria) => criteria.isPiece).get(true)
  let notPartialList = groupBy(list, (criteria) => criteria.isPiece).get(false)

  let distinctPartialItems = partialList && partialList.length > 0 ? [...new Set(partialList.map((item) => item.pieceMaster.stokKodu))] : []

  function generateExcelBody(address, stokKodu, stokAdi, siparisMiktar, teslimMiktar, onay) {
    let dto = {
      address: address,
      stokKodu: stokKodu,
      stokAdi: stokAdi,
      siparisMiktar: siparisMiktar,
      teslimMiktar: teslimMiktar,
      onay: onay,
    }
    return dto
  }

  useEffect(() => {
    if (opType === 'MSK') {
      if (adresList.length > 0 && list.length > 0) {
        list.forEach((todo) => {
          let adressesList = adresList.filter((row) => row.stokKod === todo.stokKodu)
          adressesList.forEach((cycle) => {
            let response = false
            const cycleAddress = cycle.urunAdres?.adres

            if (excelDataArray.length > 0) {
              excelDataArray.forEach((excelData) => {
                if (excelData.stokKodu === todo.stokKodu && excelData.address === cycleAddress) {
                  response = true
                }
              })
            }

            if (response === false) {
              excelDataArray.push(generateExcelBody(cycleAddress, todo.stokKodu, todo.stokAdi, todo.siparisMiktar, todo.teslimMiktar, ''))
            }
          })
        })
        setEnable(false)
      }
    }
  }, [adresList, list, opType, excelDataArray])

  const handleOnExport = () => {
    var wb = utils.book_new()
    var ws = utils.json_to_sheet(excelDataArray)
    utils.book_append_sheet(wb, ws, 'AdresListesi')
    writeFile(wb, 'adresler.xlsx')
  }

  return (
    <Box
      sx={{
        p: 2,
      }}
    >
      <Stack
        direction={'row'}
        sx={{
          gap: 2,
          justifyContent: hasReserve ? 'space-between' : 'flex-end',
        }}
      >
        {hasReserve && (
          <Alert variant="filled" color="warning">
            Rezerve Ürünler Bulunmaktadır
          </Alert>
        )}
        <Button variant="outlined" onClick={() => handleOnExport()} disabled={enable} startIcon={<DownloadTwoToneIcon />}>
          Excel
        </Button>
      </Stack>
      <TableContainer sx={{ display: 'flex' }}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Adresler</TableCell>
              <TableCell align="left">Stok Kodu</TableCell>
              <TableCell align="left">Ürün Adı</TableCell>
              <TableCell align="left">Barkod</TableCell>
              <TableCell align="left">Siparis Miktar</TableCell>
              <TableCell align="left">Teslim Miktar</TableCell>
              <TableCell align="left">Kalan Miktar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {distinctPartialItems.length > 0 &&
              distinctPartialItems.map((row, groupIndex) => {
                const groupItems = partialList.filter((todo) => todo.pieceMaster.stokKodu === row)
                const headerItem = groupItems[0]

                return (
                  <React.Fragment key={`group-${row}-${groupIndex}`}>
                    <GroupHeaderRow>
                      {headerItem.pieceMaster.reserve && <ReserveBox description={headerItem.pieceMaster.reserveDescription} theme={theme} />}
                      <TableCell align="left">Parça Sahibi</TableCell>
                      <TableCell align="left">{headerItem.pieceMaster.stokKodu}</TableCell>
                      <TableCell align="left">{headerItem.pieceMaster.stokAdi}</TableCell>
                      <TableCell align="left"></TableCell>
                      <TableCell align="left">{headerItem.siparisMiktar / headerItem.pieceAmount}</TableCell>
                      <TableCell align="left"></TableCell>
                      <TableCell align="left"></TableCell>
                    </GroupHeaderRow>

                    {groupItems.map((item, itemIndex) => {
                      const isLastItem = itemIndex === groupItems.length - 1
                      const RowComponent = isLastItem ? GroupLastRow : GroupContentRow

                      return (
                        <RowComponent key={`${item.stokKodu}-${itemIndex}`} siparismiktar={item.siparisMiktar} teslimmiktar={item.teslimMiktar}>
                          {opType !== 'FMK' ? (
                            <TableCell align="right">
                              <Stack sx={{ overflow: 'auto', height: '60px' }}>
                                {adresList && adresList.length > 0
                                  ? adresList
                                      .filter((todo) => todo.stokKod === item.stokKodu)
                                      .map((cycle, cycleIndex) => (
                                        <Typography key={cycleIndex} align="left">
                                          {cycle.urunAdres?.adres}
                                        </Typography>
                                      ))
                                  : null}
                              </Stack>
                            </TableCell>
                          ) : null}

                          <TableCell sx={{ fontWeight: 'bold' }} align="left">
                            {item.orderNo} / {item.stokKodu}
                          </TableCell>
                          <TableCell align="left">{item.stokAdi}</TableCell>
                          <TableCell align="left">{item.barkod}</TableCell>
                          <TableCell align="left">{item.siparisMiktar}</TableCell>
                          <TableCell align="left">{item.teslimMiktar}</TableCell>
                          <TableCell align="left">{(item.siparisMiktar - item.teslimMiktar).toFixed(2)}</TableCell>
                        </RowComponent>
                      )
                    })}
                  </React.Fragment>
                )
              })}
          </TableBody>
          <TableBody>
            {notPartialList &&
              notPartialList.length > 0 &&
              notPartialList.map((row) => (
                <>
                  {row.isPiece && (
                    <StyledTableRow>
                      <TableCell align="left">Parça Sahibi</TableCell>
                      <TableCell align="left">{row.pieceMaster.stokKodu}</TableCell>
                      <TableCell align="left">{row.pieceMaster.stokAdi}</TableCell>
                      <TableCell align="left"></TableCell>
                      <TableCell align="left">{row.siparisMiktar / row.pieceAmount}</TableCell>
                      <TableCell align="left"></TableCell>
                      <TableCell align="left"></TableCell>
                    </StyledTableRow>
                  )}

                  <StyledTableRow siparismiktar={row.siparisMiktar} teslimmiktar={row.teslimMiktar}>
                    <TableCell align="right">
                      {row.reserve && <ReserveBox description={row.reserveDescription} theme={theme} />}
                      <Stack sx={{ overflow: 'auto', mb: 0.5 }}>{row.stokMiktar && <Chip label={row.stokMiktar} color="default" />}</Stack>
                      <Stack sx={{ overflow: 'auto', height: '60px' }}>
                        {adresList &&
                          adresList.length > 0 &&
                          adresList
                            .filter((todo) => todo.stokKod === row.stokKodu)
                            .map((cycle, cycleIndex) => (
                              <Typography key={cycleIndex} align="left">
                                {cycle.urunAdres?.adres}
                              </Typography>
                            ))}
                      </Stack>
                    </TableCell>
                    <TableCell align="left">{row.stokKodu}</TableCell>
                    <TableCell align="left">{row.stokAdi}</TableCell>
                    <TableCell align="left">{row.barkod}</TableCell>
                    <TableCell align="left">{row.siparisMiktar}</TableCell>
                    <TableCell align="left">{row.teslimMiktar}</TableCell>
                    <TableCell align="left">{(row.siparisMiktar - row.teslimMiktar).toFixed(2)}</TableCell>
                  </StyledTableRow>
                </>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
