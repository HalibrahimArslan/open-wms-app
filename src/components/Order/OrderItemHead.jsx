import React, { useState } from 'react'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import { Button, Stack } from '@mui/material'

export default function OrderItemHead({ list, handleState, isPressed, handleAddButton }) {
  const [disable, setDisable] = useState(false)
  const handleButton = () => {
    list.map((todo) => {
      if (todo.teslimMiktar < todo.siparisMiktar) {
        handleAddButton(todo.barkod, todo.teslimMiktar, todo.siparisMiktar, todo.stokAdi, todo.stokKodu, todo.stokBirimi)
      }
    })
    setDisable(true)
    handleState()
  }

  function showHead() {
    if (isPressed !== true) {
      return (
        <TableRow>
          <TableCell align="left">Ürün Adı</TableCell>
          <TableCell align="left">Stok Kodu</TableCell>
          <TableCell align="left">Stok Birimi</TableCell>
          <TableCell align="left">Barkod</TableCell>
          <TableCell align="left">Kalan Miktar</TableCell>
          <TableCell align="center">
            <Stack>
              <Button variant="contained" disabled={disable} onClick={() => handleButton()}>
                SİPARİS ATA
              </Button>
            </Stack>
          </TableCell>
        </TableRow>
      )
    }
  }
  return <>{showHead()}</>
}
