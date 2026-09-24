import { getErrorMessage } from '../utils/Utils'

export async function getWarehouses(headers, query) {
  const response = await fetch(`/api/warehouse?${query}`, {
    headers: headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const warehouses = await response.json()
  return warehouses
}

export async function createWarehouse(headers, payload) {
  const response = await fetch('/api/depos', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  return response.json()
}

export async function updateWarehouse(headers, id, payload) {
  const response = await fetch(`/api/depos/${id}`, {
    method: 'PATCH',
    headers: { ...headers, 'content-type': 'application/merge-patch+json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  return response.json()
}

export async function deleteWarehouse(headers, id) {
  const response = await fetch(`/api/depos/${id}`, {
    method: 'DELETE',
    headers: headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
}
