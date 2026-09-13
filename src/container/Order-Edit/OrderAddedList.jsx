import styled from '@emotion/styled'
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import NotFound from '../../shared/components/NotFound/NotFound'

const StyledTableRow = styled(TableRow)(({ theme }) => ({}))

export default function OrderAddedList({ list }) {
  if (list && list.length === 0) {
    return <NotFound msg="Eklenen Kalem Bulunamadı" />
  }

  return (
    <Paper>
      <TableContainer>
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
            {list.map((row) => (
              <StyledTableRow key={row.stokKodu}>
                <TableCell align="left">{row.stokKodu}</TableCell>
                <TableCell align="left">{row.stokAdi}</TableCell>
                <TableCell align="left">{row.barkod}</TableCell>
                <TableCell align="left">{row.siparisMiktar}</TableCell>
                <TableCell align="left">{row.teslimMiktar}</TableCell>
                <TableCell align="left">{(row.siparisMiktar - row.teslimMiktar).toFixed(2)}</TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}
