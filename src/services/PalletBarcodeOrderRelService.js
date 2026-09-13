import { getErrorMessage } from '../utils/Utils'

export async function generateOrderPalletBarcodeRelation(body) {
  const response = await fetch(`/api/generate-order-pallet-barcode-rel`, body)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const orderId = await response.json()

  return orderId
}

export async function getPalletBarcodeList(headers, orderInfo) {
  const response = await fetch(`/api/pallet-barcodes/${orderInfo}`, { headers })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const orderId = await response.json()

  return orderId
}

export async function deletePalletBarcode(id, headers) {
  const response = await fetch(`/api/pallet-barcodes/${id}`, {
    headers: headers,
    method: 'DELETE',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  return 'success'
}

export async function deletePalletBarcodeDetail(headers, payload) {
  const response = await fetch(`/api/pallet-barcodes-detail`, {
    headers: headers,
    method: 'POST',
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  return 'success'
}

export async function getPrintablePalletBarcodeList(headers) {
  const response = await fetch(`/api/pallet-list`, {
    headers: headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const palletList = await response.json()

  return palletList
}

export async function getPalletBarcodeOrderDetail(headers, palletBarcode) {
  const response = await fetch(`/api/pallet-barcodes-order-detail/${palletBarcode}`, { headers: headers })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const palletList = await response.json()

  return palletList
}
