import { getErrorMessage } from '../utils/Utils'

export async function getMenuRoleList(headers) {
  const response = await fetch('/api/aur-menu-role-rels', {
    headers: headers,
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
  const menuList = await response.json()

  return menuList
}

export async function saveMenuRole(payload) {
  const response = await fetch('/api/aur-menu-role-rels', payload)
  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
  const menuRoleItem = await response.json()

  return menuRoleItem
}

export async function deleteMenuRole(headers, payload) {
  const response = await fetch('/api/aur-menu-role-rels', {
    headers: headers,
    method: 'DELETE',
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
}
