import { Table, TableContainer, TableHead, TableCell, TableBody, TableRow, Box, useMediaQuery, Chip, Tooltip } from '@mui/material'
import { Button, Stack, Typography } from '@mui/material'
import TablePanel, { tableHeadSx } from '../../shared/components/Table/TablePanel'
import TableSearchField from '../../shared/components/Table/TableSearchField'
import React, { useCallback, useMemo } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { utils, writeFile } from 'xlsx'
import { styled } from '@mui/material/styles'
import { useTheme } from '@mui/material'
import DownloadTwoToneIcon from '@mui/icons-material/DownloadTwoTone'
import excelimg from '../../assets/images/cards/excel.png'
import * as XLSX from 'xlsx'

const StyledTableRow = styled(TableRow)(({ theme, siparisMiktar, teslimMiktar, isPiece }) => ({
  backgroundColor: teslimMiktar <= 0 ? '#D77676  !important' : teslimMiktar < siparisMiktar ? 'antiquewhite' : '#EAFAF1 !important',
}))

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  position: 'sticky',
  right: 0,
  backgroundColor: theme.palette.secondary.main,
}))

function OrderProgressItemBasic({ list, opType, adresList, handleStart }) {
  const [enable, setEnable] = useState(true)
  const [value, setValue] = useState('')
  const [data, setData] = useState([])
  const theme = useTheme()
  const pieceSize = list.filter((row) => row.hasPiece === true).length

  const excelDataArray = useMemo(() => {
    return []
  }, [])

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
          let adressesList = adresList.filter((row) => row.stockCode === todo.stokKodu)
          adressesList.forEach((cycle) => {
            let response = false

            if (excelDataArray.length > 0) {
              excelDataArray.forEach((excelData) => {
                if (excelData.stokKodu === todo.stokKodu && excelData.address === cycle.address) {
                  response = true
                }
              })
            }

            if (response === false) {
              excelDataArray.push(generateExcelBody(cycle.address, todo.stokKodu, todo.stokAdi, todo.siparisMiktar, todo.teslimMiktar, ''))
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

  const handleExportListExcel = useCallback(() => {
    const sheetData = (list || []).map((row) => {
      const siparis = Number(row.siparisMiktar)
      const teslim = Number(row.teslimMiktar)
      const kalan = Number.isFinite(siparis) && Number.isFinite(teslim) ? siparis - teslim : ''

      return {
        'Stok Kodu': row.stokKodu ?? '',
        'Ürün Adı': row.stokAdi ?? '',
        Barkod: row.barkod ?? '',
        'Sipariş Miktar': Number.isFinite(siparis) ? siparis : row.siparisMiktar ?? '',
        'Teslim Miktar': Number.isFinite(teslim) ? teslim : row.teslimMiktar ?? '',
        'Kalan Miktar': kalan,
        'Parça Var mı': row.hasPiece ? 'Evet' : 'Hayır',
      }
    })

    const headers = ['Stok Kodu', 'Ürün Adı', 'Barkod', 'Sipariş Miktar', 'Teslim Miktar', 'Kalan Miktar', 'Parça Var mı']

    const ws = XLSX.utils.json_to_sheet(sheetData.length ? sheetData : [headers.reduce((acc, h) => ((acc[h] = ''), acc), {})])

    ws['!cols'] = headers.map((h) => ({ wch: Math.max(h.length + 2, 16) }))

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'SiparisListesi')
    XLSX.writeFile(wb, 'siparis_listesi.xlsx')
  }, [list])

  const handleChange = (e) => {
    let input = e.target.value
    setValue(input.toLocaleUpperCase('TR'))
  }

  useEffect(() => {
    if (opType == 'FMK') {
      if (value.length > 0) {
        setData(list.filter((q) => q.stokAdi.toLocaleUpperCase('TR').includes(value)))
      } else {
        setData(list)
      }
    } else {
      setData(list)
    }
  }, [value, list])

  return (
    <Box p={2}>
      <TablePanel
        title="Sipariş Kalemleri"
        meta={<Chip size="small" variant="outlined" label={`${list.length} kalem`} />}
        actions={
          <>
            <TableSearchField placeholder="Stok adı ara" onChange={handleChange} />
            <Tooltip title="Excel'e aktar">
              <Button
                onClick={handleExportListExcel}
                variant="outlined"
                color="success"
                startIcon={<img src={excelimg} alt="" width={18} height={18} />}
                sx={{ whiteSpace: 'nowrap', borderRadius: 2 }}
              >
                Excel
              </Button>
            </Tooltip>
          </>
        }
      >
        <TableContainer sx={{ display: 'flex' }}>
          <Table aria-label="simple table">
            <TableHead sx={tableHeadSx}>
              <TableRow>
                {opType !== 'FMK' ? (
                  <>
                    <TableCell align="left">Adresler</TableCell>
                  </>
                ) : (
                  <></>
                )}

                <TableCell align="left">Stok Kodu</TableCell>
                <TableCell align="left">Ürün Adı</TableCell>
                <TableCell align="left">Barkod</TableCell>
                <TableCell align="left">Siparis Miktar</TableCell>
                <TableCell align="left">Teslim Miktar</TableCell>
                <TableCell align="left">Kalan Miktar</TableCell>
                {opType === 'FMK' && pieceSize > 0 ? (
                  <>
                    <StyledTableCell align="left">Miktar Gir</StyledTableCell>
                  </>
                ) : (
                  <></>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <>
                  {row.isPiece ? (
                    <StyledTableRow>
                      <TableCell align="left">Parça Sahibi</TableCell>
                      <TableCell align="left">{row.pieceMaster.stokKodu}</TableCell>
                      <TableCell align="left">{row.pieceMaster.stokAdi}</TableCell>
                      <TableCell align="left"></TableCell>
                      <TableCell align="left">{row.siparisMiktar / row.pieceAmount}</TableCell>
                      <TableCell align="left"></TableCell>
                      <TableCell align="left"></TableCell>
                      {opType === 'FMK' && pieceSize > 0 ? <TableCell align="left"></TableCell> : null}
                    </StyledTableRow>
                  ) : (
                    <></>
                  )}

                  <StyledTableRow siparisMiktar={row.siparisMiktar} teslimMiktar={row.teslimMiktar} key={row.stokKodu} isPiece={row.hasPiece}>
                    {opType !== 'FMK' ? (
                      <TableCell align="right">
                        <Stack sx={{ overflow: 'auto', height: '100px' }}>
                          {adresList && adresList.length > 0 ? (
                            adresList.filter((todo) => todo.stockCode === row.stokKodu).map((cycle) => <Typography align="left">{cycle.address}</Typography>)
                          ) : (
                            <></>
                          )}
                        </Stack>
                      </TableCell>
                    ) : (
                      <></>
                    )}

                    <TableCell sx={{ fontWeight: 'bold' }} align="left">
                      {row.stokKodu}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="left">
                      {row.stokAdi}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="left">
                      {row.barkod}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="left">
                      {row.siparisMiktar}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="left">
                      {row.teslimMiktar}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="left">
                      {(row.siparisMiktar - row.teslimMiktar).toFixed(2)}
                    </TableCell>
                    {opType === 'FMK' && pieceSize > 0 ? (
                      <StyledTableCell align="left">
                        {row.hasPiece ? (
                          <Button variant="contained" onClick={() => handleStart(row.barkod)}>
                            Miktar Gir
                          </Button>
                        ) : null}
                      </StyledTableCell>
                    ) : null}
                  </StyledTableRow>
                </>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TablePanel>
    </Box>
  )
}

export default React.memo(OrderProgressItemBasic)
