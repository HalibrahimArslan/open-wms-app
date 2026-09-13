import * as React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import OrderCombineAccordionItem from './OrderCombineAccordionItem'

export default function OrderCombineAccordion({ orderList, handleClose, handleCheckedList, handleCombine }) {
  return (
    <Dialog open={true} scroll={'paper'}>
      <DialogTitle>Sipariş Birleştirme</DialogTitle>
      <DialogContent>
        {orderList.map((order) => (
          <OrderCombineAccordionItem order={order} handleCheckedList={handleCheckedList} />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Kapat</Button>
        <Button onClick={handleCombine}>BIRLESTIR</Button>
      </DialogActions>
    </Dialog>
  )
}
