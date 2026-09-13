import * as React from 'react'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { TablePagination } from '@mui/material'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
  },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}))

export default function CountingDataTable({ list, page, rowsPerPage, handleChangePage, handleChangeRowsPerPage, count, addresses }) {
  return (
    <Paper>
      <TableContainer component={Paper}>
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Stok Kodu</StyledTableCell>
              <StyledTableCell align="right">Adres</StyledTableCell>
              <StyledTableCell align="center">Barkod</StyledTableCell>
              <StyledTableCell align="right">Miktar</StyledTableCell>
              <StyledTableCell align="right">Sayım Durumu</StyledTableCell>
              <StyledTableCell align="right">Oluşturulma Tarihi</StyledTableCell>
              <StyledTableCell align="right">Oluşturulma Saati</StyledTableCell>
              <StyledTableCell align="right">İlk Kayıt Yapan</StyledTableCell>

              <StyledTableCell align="right">Son kayıt Güncelleyen</StyledTableCell>
              <StyledTableCell align="right">Güncelleme Tarihi</StyledTableCell>
              <StyledTableCell align="right">Güncelleme Saati</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map((row) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell component="th" scope="row">
                  {row.stokKod}
                </StyledTableCell>
                <StyledTableCell align="right">{row.address.adres}</StyledTableCell>
                <StyledTableCell align="right">{row.product.barcode}</StyledTableCell>
                <StyledTableCell align="right">{row.miktar}</StyledTableCell>
                <StyledTableCell align="right">{row.status}</StyledTableCell>
                <StyledTableCell align="right">{row.createdDate.split('T')[0]}</StyledTableCell>
                <StyledTableCell align="right">{row.createdDate.split('T')[1].slice(0, 5)}</StyledTableCell>
                <StyledTableCell align="right">{row.createdBy}</StyledTableCell>
                <StyledTableCell align="right">{row.lastModifiedBy}</StyledTableCell>
                <StyledTableCell align="right">{row.lastModifiedDate.split('T')[0]}</StyledTableCell>
                <StyledTableCell align="right">{row.lastModifiedDate.split('T')[1].slice(0, 5)}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={count}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Sayfa başına satır:"
      />
    </Paper>
  )
}
