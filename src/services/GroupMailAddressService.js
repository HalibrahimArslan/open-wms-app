import { getErrorMessage } from '../utils/Utils'

export async function getGroupMailAddress(headers) {
  const response = await fetch(`/api/group-mail-address`, { headers: headers })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const stockGroupMails = await response.json()
  return stockGroupMails
}

export async function createGroupMailAddress(payload) {
  const response = await fetch(`/api/group-mail-address`, payload)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const newGroupMail = await response.json()
  return newGroupMail
}

export async function deleteGroupMailAddress(id, headers) {
  const response = await fetch(`/api/group-mail-address/${id}`, {
    method: 'DELETE',
    headers: headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
}
