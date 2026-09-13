import { getErrorMessage } from '../utils/Utils'

export async function saveCountingUserAddressRel(payload) {
  const response = await fetch('/api/counting-user-addresses', payload)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  return response.json()
}

export async function getCountingUserAddressRel(payload) {
  const response = await fetch('/api/search-counting-user-addresses', payload)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  return response.json()
}

export async function deleteCountingUserAddressRel(payload) {
  const response = await fetch('/api/counting-user-addresses', payload)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
}
