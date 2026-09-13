import { getErrorMessage } from '../utils/Utils'

export async function getInitialDrivers(headers) {
  const response = await fetch('/api/drivers?page=0&size=3&sort=lastModifiedDate,desc', {
    headers: headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const lastModifiedDrivers = await response.json()

  return lastModifiedDrivers
}

export async function updateDrivers(headers, id, payload) {
  const response = await fetch(`/api/driver/${id}`, {
    method: 'PUT',
    headers: headers,
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const drivers = await response.json()

  return drivers
}

export async function getDrivers(headers, query) {
  const response = await fetch(`/api/drivers?${query}`, {
    headers: headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const serachListDrivers = await response.json()

  return serachListDrivers
}

export async function getFilterDrivers(headers, query) {
  const response = await fetch(`/api/drivers?query.contains=${encodeURIComponent(query)}`, {
    headers: headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const serachListDrivers = await response.json()

  return serachListDrivers
}

export async function saveDriver(headers, payload) {
  const response = await fetch('/api/driver', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const error = await response.json()
    const message = `${getErrorMessage(response.status, error)}`
    throw new Error(message)
  }

  const createdDriver = await response.json()
  return createdDriver
}

export async function deleteDriver(id, headers) {
  const response = await fetch(`/api/driver/${id}`, {
    method: 'DELETE',
    headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
}
