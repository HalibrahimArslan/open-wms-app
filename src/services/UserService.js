import { getErrorMessage } from '../utils/Utils'

export async function getAdminUsers(headers, query) {
  const response = await fetch(`/api/admin/users?${query}`, { headers })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const adminUserList = await response.json()

  return adminUserList
}

export async function updateUser(headers, payload) {
  const response = await fetch(`/api/admin/users`, {
    method: 'PUT',
    headers: headers,
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const updatedUser = await response.json()

  return updatedUser
}

export async function getUserByLogin(headers, login) {
  const response = await fetch(`/api/admin/users/${login}`, {
    headers: headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const user = await response.json()
  return user
}

export async function createUser(headers, payload) {
  const response = await fetch('/api/admin/users', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
  const createUser = await response.json()
  return createUser
}

export async function getUsers(headers) {
  const response = await fetch('/api/aur-users', {
    headers: headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
  const userList = await response.json()

  return userList
}
