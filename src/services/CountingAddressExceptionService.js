import { getErrorMessage } from '../utils/Utils'

export async function getCountingAddressExceptionList(headers, query) {
  const response = await fetch(`/api/counting-address-exceptions?${query}`, { headers })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const addressExceptionList = await response.json()

  return addressExceptionList
}

export async function getCountOfCountingAddressExceptions(headers, query) {
  const response = await fetch(`/api/counting-address-exceptions/count?${query}`, { headers })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const addressExceptionList = await response.text()

  return Number(addressExceptionList)
}

export async function deleteCountingAddressException(headers, id) {
  const response = await fetch(`/api/counting-address-exception/${id}`, {
    method: 'DELETE',
    headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
}

export async function saveCountingAddressExceptionList(payload) {
  const response = await fetch(`/api/counting-address-exception-bulk`, payload)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const savedAddressExceptionList = await response.json()

  return savedAddressExceptionList
}
