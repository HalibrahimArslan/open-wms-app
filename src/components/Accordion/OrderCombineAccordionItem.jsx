import { Accordion, AccordionDetails, AccordionSummary, Box, Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import React, { useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

export default function OrderCombineAccordionItem({ order, handleCheckedList }) {
  const [checked, setChecked] = useState(false)

  const handleChange = (id) => {
    setChecked(!checked)
    handleCheckedList(id)
  }

  return (
    <Box display="flex" flexDirection={'row'} marginBottom="2px">
      <Checkbox checked={checked} onChange={() => handleChange(order.masterId)} sx={{ position: 'sticky', left: 0, zIndex: 1 }} />
      <Accordion key={order.masterId}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <Typography>{order.masterId}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Sipariş</TableCell>
                  <TableCell>Stok Kodu</TableCell>
                  <TableCell>Teslim/Siparis</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.aurTmpDetailList.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.siparisNo}</TableCell>
                    <TableCell>{item.stokKodu}</TableCell>
                    <TableCell align="center">
                      {item.teslimMiktar} / {item.siparisMiktar}{' '}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
    </Box>
  )
}
