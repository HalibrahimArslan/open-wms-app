import { Checkbox, TableCell, TableRow } from '@mui/material'
import React, { useEffect } from 'react'

export default function PalletBarcodeRows({ row, handlePalletBarcodeList }) {
  const [checked, setChecked] = React.useState(false)

  const handleChange = (stokKod) => {
    setChecked(!checked)
    handlePalletBarcodeList(!checked, stokKod)
  }

  useEffect(() => {
    setChecked(false)
  }, [row])

  return (
    <TableRow key={row.stokKodu} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell align="left">
        <Checkbox checked={checked} onChange={() => handleChange(row.stokKodu)} inputProps={{ 'aria-label': 'controlled' }} />
      </TableCell>
      <TableCell align="left">{row.stokAdi}</TableCell>
      <TableCell align="left">{row.stokKodu}</TableCell>
      <TableCell align="left">{row.siparisMiktar}</TableCell>
      <TableCell align="left">{row.teslimMiktar}</TableCell>
      {(row.siparisMiktar - row.teslimMiktar).toFixed(2) < 0 ? (
        <TableCell sx={{ backgroundColor: '#D98880' }} align="center">
          {(row.siparisMiktar - row.teslimMiktar).toFixed(2)}
        </TableCell>
      ) : (
        <TableCell sx={{ backgroundColor: '#76D7C4' }} align="center">
          {(row.siparisMiktar - row.teslimMiktar).toFixed(2)}
        </TableCell>
      )}
    </TableRow>
  )
}
