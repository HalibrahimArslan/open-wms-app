import { getErrorMessage } from '../utils/Utils'

export async function resetPasswordInit(headers, email) {
  const response = await fetch('/api/account/reset-password/init', {
    method: 'POST',
    headers: headers,
    body: email,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
}

export async function resetPasswordFinish(payload) {
  const response = await fetch('/api/account/reset-password/finish', payload)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
}

export async function changePassword(payload) {
  const response = await fetch('/api/account/change-password', payload)

  if (!response.ok) {
    const title = await response.json()
    if (title.status === 400) {
      const message = `Yeni Şifreniz kriterlere uymamaktadır`
      throw new Error(message)
    }
  }

  return 'success'
}

export async function getAuthorities(headers) {
  const response = await fetch('/api/authorities', { headers })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.title)
  }

  const authorityList = await response.json()

  return authorityList
}

export async function getUserAuthorities(headers) {
  const response = await fetch('/api/user-authorities', { headers })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const authorityList = await response.json()

  return authorityList
}

export async function getAccount(headers) {
  const response = await fetch(`/api/account`, { headers })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error)
  }
  const account = await response.json()
  return account
}
