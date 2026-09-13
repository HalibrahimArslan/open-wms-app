export async function getDispatchAreaList(headers, orderId) {
  const response = await fetch(`/api/dispatch-area-list/${orderId}`, {
    headers: headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const dispatchList = await response.json()

  return dispatchList
}

export async function saveDispatchAreaList(headers, palletBarcode) {
  const response = await fetch(`/api/save-order-list-by-pallet-barcode/${palletBarcode}`, {
    headers: headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  return 'success'
}
