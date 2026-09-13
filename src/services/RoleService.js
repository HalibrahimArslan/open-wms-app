import { getErrorMessage } from '../utils/Utils'

export async function getRoleList(headers, query) {
  const response = await fetch(`/api/aur-roles?${query}`, {
    headers: headers,
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
  const menuList = await response.json()

  return menuList
}

export async function saveRole(payload) {
  const response = await fetch('/api/aur-roles', payload)
  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
  const menuList = await response.json()

  return menuList
}

export async function deleteRole(headers, id) {
  const response = await fetch(`/api/aur-roles/${id}`, {
    headers: headers,
    method: 'DELETE',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  return response.status
}
