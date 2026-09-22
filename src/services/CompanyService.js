import { getErrorMessage } from '../utils/Utils'

export async function getCompanies(headers) {
  const response = await fetch('/api/aur-companies', {
    headers: headers,
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
  const companies = await response.json()

  return companies
}

export async function createCompany(headers, payload) {
  const response = await fetch('/api/aur-companies', {
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

export async function updateCompany(headers, id, payload) {
  const response = await fetch(`/api/aur-companies/${id}`, {
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

export async function deleteCompany(headers, id) {
  const response = await fetch(`/api/aur-companies/${id}`, {
    method: 'DELETE',
    headers: headers,
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
}
