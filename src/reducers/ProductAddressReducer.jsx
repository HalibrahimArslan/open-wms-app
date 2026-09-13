const StatusKind = {
  IsValidAddress: 'ISVALIDADDRESS',
  IsValidBarcode: 'ISVALIDBARCODE',
  IsValidQuantity: 'ISVALIDQUANTITY',
  IsPending: 'ISPENDING',
  ClearAll: 'CLEARALL',
  IsValidReplaceBarcode: 'ISVALIDREPLACEBARCODE',
  IsValidTransferAddress: 'ISVALIDTRANSFERADDRESS',
}

export const initalEnableSituation = {
  addressEnable: false,
  barcodeEnable: true,
  quantityEnable: true,
  saveBtnEnable: true,
  step: 1,
}

export const AddressBtnAction = {
  type: StatusKind.IsValidAddress,
  payload: true,
}

export const ProductBtnAction = {
  type: StatusKind.IsValidBarcode,
  payload: true,
}

export const ProductReplaceBtnAction = {
  type: StatusKind.IsValidReplaceBarcode,
  payload: true,
}

export const SaveBtnAction = {
  type: StatusKind.IsValidQuantity,
  payload: false,
}

export const PendingAction = {
  type: StatusKind.IsValidQuantity,
  payload: true,
}

export const ClearAllStatusAction = {
  type: StatusKind.ClearAll,
  payload: true,
}

export const TransferAddressAction = {
  type: StatusKind.IsValidTransferAddress,
  payload: true,
}

function statusReducer(state, action) {
  const { type, payload } = action

  switch (type) {
    case StatusKind.IsValidAddress:
      return {
        ...state,
        addressEnable: payload,
        barcodeEnable: !payload,
        step: state.step + 1,
      }

    case StatusKind.IsValidBarcode:
      return {
        ...state,
        barcodeEnable: payload,
        quantityEnable: !payload,
        saveBtnEnable: !payload,
        step: state.step + 1,
      }

    case StatusKind.IsValidQuantity:
      return {
        ...state,
        quantityEnable: payload,
        saveBtnEnable: payload,
        step: state.step + 1,
      }

    case StatusKind.IsPending:
      return {
        ...state,
        saveBtnEnable: payload,
      }

    case StatusKind.ClearAll:
      return {
        ...state,
        addressEnable: !payload,
        barcodeEnable: payload,
        quantityEnable: payload,
        saveBtnEnable: payload,
        step: 1,
      }

    case StatusKind.IsValidReplaceBarcode:
      return {
        ...state,
        addressEnable: payload,
        barcodeEnable: payload,
        quantityEnable: !payload,
        saveBtnEnable: payload,
        step: state.step + 1,
      }

    case StatusKind.IsValidTransferAddress:
      return {
        ...state,
        quantityEnable: payload,
        saveBtnEnable: !payload,
      }

    default:
      return state
  }
}

export default statusReducer
