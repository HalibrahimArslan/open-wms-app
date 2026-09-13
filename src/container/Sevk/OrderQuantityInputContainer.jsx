import React, { useEffect, useMemo } from 'react'
import { Box, useTheme } from '@mui/material'
import AurDialog from '../../shared/components/Dialog/AurDialog'
import OrderQuantityInput from '../../components/Card/OrderQuantityInput'
import { notifyError } from '../../layout/Layout'

const OrderQuantityInputContainer = ({
  open,
  onClose,
  orderDetail,
  barcode,
  quantity,
  erpAmount,
  fetchQuantityByStockCode,
  onChangeQuantity,
  onListItemClick,
  resetInputs,
  activeStockCode,
  setActiveStockCode,
}) => {
  const theme = useTheme()

  const orderItem = useMemo(() => {
    return orderDetail.filter((todo) => todo.barkod === barcode)
  }, [orderDetail, barcode])

  const modifiedItem = useMemo(() => {
    if (orderItem.length === 0) return null

    const siparisMiktar = orderItem.reduce((sum, item) => sum + item.siparisMiktar, 0)
    const teslimMiktar = orderItem.reduce((sum, item) => sum + item.teslimMiktar, 0)

    return {
      ...orderItem[0],
      siparisMiktar,
      teslimMiktar,
    }
  }, [orderItem])

  useEffect(() => {
    if (open && modifiedItem) {
      const stockCode = modifiedItem.isPiece ? modifiedItem.pieceMaster.stokKodu : modifiedItem.stokKodu
      const pieceAmount = modifiedItem.isPiece ? modifiedItem.pieceAmount : 1
      fetchQuantityByStockCode(stockCode, pieceAmount)

      if (activeStockCode !== modifiedItem.stokKodu) {
        setActiveStockCode(modifiedItem.stokKodu)
      }
    }
  }, [open, modifiedItem, fetchQuantityByStockCode, activeStockCode, setActiveStockCode])

  if (!open) return null

  if (orderItem.length === 0 && barcode !== '') {
    resetInputs()
    onClose()
    notifyError('Yanlış Barkod')
    return null
  }

  if (orderItem.length === 0) return null

  return (
    <AurDialog
      open={open}
      handleClose={onClose}
      scroll="body"
      paperProps={{
        style: {
          borderRadius: '20px',
          borderBottom: '15px solid',
          borderBottomColor: theme.palette.primary.main,
        },
      }}
    >
      <OrderQuantityInput
        erpAmount={erpAmount}
        order={modifiedItem}
        quantity={quantity}
        handleChange={onChangeQuantity}
        handleKeyPress={(ev) => onListItemClick(ev, orderItem[0].stokKodu)}
      />
    </AurDialog>
  )
}

export default OrderQuantityInputContainer
