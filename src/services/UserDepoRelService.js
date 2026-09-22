import { getErrorMessage } from '../utils/Utils'

export async function getUserDepoRels(headers, query) {
  const response = await fetch(`/api/user-depo-rels?${query}`, {
    headers: headers,
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
  return response.json()
}

export async function assignUserDepos(headers, payload) {
  const response = await fetch('/api/user-depo-rels-bulk', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
}

export async function deleteUserDepoRel(headers, id) {
  const response = await fetch(`/api/user-depo-rels/${id}`, {
    method: 'DELETE',
    headers: headers,
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
}
