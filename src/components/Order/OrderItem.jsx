import React, { useEffect, useState } from 'react'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import { Button, Stack } from '@mui/material'
import useAuthHeader from '../../hooks/useAuthHeader'
import { produceBarkod } from '../../services/MikroService'
import { notifyError } from '../../layout/Layout'

export default function OrderItem({ barkod, birimStok, teslimMiktar, siparisMiktar, stokAdi, stokKodu, handleAddButton, setPressed, fetchExecuteData, handleDeleteButton }) {
  const [disable, setDisable] = useState(false)

  const headers = useAuthHeader()

  const fetchgenerateBarcode = async (param) => {
    const res = await produceBarkod(headers, param)
    res && fetchExecuteData()
  }

  useEffect(() => {
    if (teslimMiktar >= siparisMiktar) {
      setDisable(true)
    }
  }, [])

  const handleButton = (barkod, teslimMiktar, siparisMiktar, stokAdi, stokKodu, stokBirimi) => {
    if (barkod.length === 0) {
      notifyError(`${stokKodu} numaralı ürün için barkod tanımlayınız`)
    } else {
      handleAddButton(barkod, teslimMiktar, siparisMiktar, stokAdi, stokKodu, stokBirimi)

      setDisable(true)
      setPressed(true)
    }
  }

  const handleDelete = (stokKodu) => {
    handleDeleteButton(stokKodu)
    setDisable(false)
  }
  return (
    <>
      <TableRow key={stokKodu} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
        <TableCell align="left">{stokAdi}</TableCell>
        <TableCell align="left">{stokKodu}</TableCell>
        <TableCell align="left">{birimStok}</TableCell>
        {barkod !== null && barkod !== '' ? (
          <TableCell align="left">{barkod}</TableCell>
        ) : (
          <TableCell align="center">
            <Stack>
              <Button variant="contained" onClick={() => fetchgenerateBarcode(stokKodu)}>
                Olustur
              </Button>
            </Stack>
          </TableCell>
        )}
        <TableCell align="left">{(siparisMiktar - teslimMiktar).toFixed(2)}</TableCell>
        {!disable ? (
          <TableCell align="center">
            <Stack>
              <Button
                variant="contained"
                sx={{ backgroundColor: 'green' }}
                disabled={disable}
                onClick={() => handleButton(barkod, teslimMiktar, siparisMiktar, stokAdi, stokKodu, birimStok)}
              >
                EKLE
              </Button>
            </Stack>
          </TableCell>
        ) : (
          <TableCell align="center">
            <Stack>
              <Button sx={{ backgroundColor: 'red' }} onClick={() => handleDelete(stokKodu)} variant="contained">
                SİL
              </Button>
            </Stack>
          </TableCell>
        )}
      </TableRow>
    </>
  )
}
