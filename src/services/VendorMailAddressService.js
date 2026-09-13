import { getErrorMessage } from '../utils/Utils'

export async function getVendorMails(headers, companyCode) {
  const response = await fetch(`/api/customers/${companyCode}`, { headers: headers })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const vendorMails = await response.json()
  return vendorMails
}

export async function createVendorMail(payload) {
  const response = await fetch(`/api/customer`, payload)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const newVendorMail = await response.json()
  return newVendorMail
}

export async function deleteVendorMail(id, headers) {
  const response = await fetch(`/api/customer/${id}`, {
    method: 'DELETE',
    headers: headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
}
