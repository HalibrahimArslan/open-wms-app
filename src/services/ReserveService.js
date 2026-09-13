import { getErrorMessage } from '../utils/Utils'

export async function getResereveProducts(headers, companyCode) {
  const response = await fetch(`/api/aur-reserves?companyCode=${companyCode}`, {
    headers: headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const reserves = await response.json()

  return reserves
}

export async function updateReserveProduct(headers, payload) {
  const response = await fetch(`/api/aur-reserve`, {
    method: 'PUT',
    headers: headers,
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const reserveProduct = await response.json()

  return reserveProduct
}
