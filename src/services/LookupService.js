import { getErrorMessage } from '../utils/Utils'

export async function getLookupsByLookupNames(payload) {
  const response = await fetch('/api/lookups', payload)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const lookupList = await response.json()

  return lookupList
}

export async function createOrUpdateLookup(payload) {
  const response = await fetch('/api/lookup', payload)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const newLookUp = await response.json()

  return newLookUp
}

export async function deleteMails(headers, id) {
  const response = await fetch(`/api/lookup/${id}`, {
    headers: headers,
    method: 'DELETE',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  return response.status
}

export async function getLogisticType(headers, logType) {
  const response = await fetch(`/api/lookup/${logType}`, {
    headers: headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const logTypes = await response.json()
  return logTypes
}

export async function saveLookup(payload) {
  const response = await fetch('/api/lookup', payload)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const lookups = await response.json()

  return lookups
}
