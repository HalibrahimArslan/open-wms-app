import { getErrorMessage } from '../utils/Utils'

export async function getAuthorityList(headers) {
  const response = await fetch('/api/admin/authorities', { headers })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
  return response.json()
}

export async function createAuthority(headers, name) {
  const response = await fetch('/api/admin/authorities', {
    headers,
    method: 'POST',
    body: JSON.stringify({ name }),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
  return response.json()
}

export async function deleteAuthority(headers, name) {
  const response = await fetch(`/api/admin/authorities/${encodeURIComponent(name)}`, {
    headers,
    method: 'DELETE',
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
  return response.status
}
