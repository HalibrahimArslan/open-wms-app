import { getErrorMessage } from '../utils/Utils'

export async function getPartialItemDetails(payload) {
  const response = await fetch('/api/aur-partial-items-with-detail', payload)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const data = await response.json()

  return data
}

export async function getPartialItemDetailsById(body) {
  const response = await fetch('/api/aur-partial-items-by-id', body)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const data = await response.json()

  return data
}

export async function getPartialItemList(headers, query) {
  const response = await fetch(`/api/aur-partial-items?${query}`, {
    headers: headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const parentList = await response.json()

  return parentList
}

export async function updatePartialItemFromMicro(headers, partialItemId) {
  const response = await fetch(`/api/update-partial-item/${partialItemId}`, {
    headers: headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const updatedPartialItem = await response.json()

  return updatedPartialItem
}

export async function partialUpdateAurPartialItem(id, payload) {
  const response = await fetch(`/api/aur-partial-items/${id}`, payload)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const updatedPartialItem = await response.json()

  return updatedPartialItem
}

export async function transferPartialItemFromMicro(headers, stockCode) {
  const response = await fetch(`/api/transfer-from-micro/${stockCode}`, { headers: headers })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const partialItem = await response.json()

  return partialItem
}
