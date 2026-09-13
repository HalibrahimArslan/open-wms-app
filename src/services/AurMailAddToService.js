import { getErrorMessage } from '../utils/Utils'

export async function getPublicMails(companyCode, headers) {
  const response = await fetch(`/api/public-mails/${companyCode}`, { headers: headers })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const mailList = await response.json()
  return mailList
}

export async function createPublicMail(payload) {
  const response = await fetch(`/api/public-mail`, payload)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const newPublicMail = await response.json()
  return newPublicMail
}

export async function deletePublicMail(id, headers) {
  const response = await fetch(`/api/public-mail/${id}`, {
    method: 'DELETE',
    headers: headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
}
