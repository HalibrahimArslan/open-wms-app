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
    color: theme.palette.primary.contrastText,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
  },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}))

export default function NonCountableData({ list, page, rowsPerPage, handleChangePage, handleChangeRowsPerPage, count, addresses }) {
  return (
    <Paper>
      <TableContainer component={Paper}>
        <Table sx={{ flexGrow: 1 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">Barkod</StyledTableCell>
              <StyledTableCell align="center">Urun Adres </StyledTableCell>
              <StyledTableCell align="center">Kullanıcı Adı </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map((row) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell align="center">{row.stockCode}</StyledTableCell>
                <StyledTableCell align="center">{addresses?.find((item) => item.urunAdresId === row.urunAdresId)?.adres ?? '-'}</StyledTableCell>
                <StyledTableCell align="center">{row.createdBy}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
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
