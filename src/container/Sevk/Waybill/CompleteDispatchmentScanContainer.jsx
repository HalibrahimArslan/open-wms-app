import AurDialog from '../../../shared/components/Dialog/AurDialog'
import OrderQuantityInput from '../../../components/Card/OrderQuantityInput'
import { notifyError } from '../../../layout/Layout'

const CompleteDispatchmentScanContainer = ({
  visible,
  orderDetail,
  palletList,
  value,
  quantity,
  theme,
  barcode,
  setShow,
  fetchSaveDispatchListByPalletBarcode,
  show,
  handleChangeQuantity,
  handleListItemClick,
  clearScanning,
}) => {
  let orderItem
  orderItem = orderDetail.filter((q) => q.barkod === value)
  if (
    orderItem.length > 0 &&
    palletList.find((q) => {
      return q.palletBarcodeList.find((p) => p.stockCode === orderItem[0].stokKodu)
    })
  ) {
    notifyError('Bu ürünün paleti zaten var')
    clearScanning()
    return
  }

  if (value.length === 13 && value.startsWith('999999') && visible === false) {
    if (palletList.find((q) => q.palletBarcode === value)) {
      setShow(false)
      fetchSaveDispatchListByPalletBarcode(value)
      return
    } else {
      notifyError(`${value} numaralı palet ilgili siparişte bulunamadı`)
      setShow(false)
    }
  }

  if (orderItem.length > 0) {
    let modifiedItem = {
      ...orderItem[0],
      siparisMiktar: orderItem[0].siparisMiktar,
      teslimMiktar: orderItem[0].observerAmount,
    }

    return (
      <AurDialog
        open={show}
        handleClose={() => {
          clearScanning()
        }}
        scroll="body"
        paperProps={{
          style: {
            borderRadius: '20px',
            borderBottom: '15px solid',
            borderBottomColor: theme.palette.primary.main,
          },
        }}
      >
        {barcode && (
          <OrderQuantityInput
            order={modifiedItem}
            quantity={quantity}
            handleChange={handleChangeQuantity}
            handleKeyPress={(event) => handleListItemClick(event, orderItem[0].stokKodu)}
          />
        )}
      </AurDialog>
    )
  }

  if (barcode.length === 0 && value.length > 0) {
    clearScanning()
    notifyError('Yanlış Barkod')
    return
  }

  barcode.length > 0 && notifyError('Barkod ile eşleşen sipariş kalemi bulunamadı')
  clearScanning()
  return null
}

export default CompleteDispatchmentScanContainer
