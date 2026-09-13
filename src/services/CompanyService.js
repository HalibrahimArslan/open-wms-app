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
