import { getErrorMessage } from '../utils/Utils'

export async function getMenuTree(headers, query) {
  const params = query ? `?${new URLSearchParams(query)}` : ''
  const response = await fetch(`/api/menu-tree${params}`, {
    headers: headers,
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
  const menuList = await response.json()

  return menuList
}

export async function getMenuList(headers, query) {
  const response = await fetch(`/api/aur-menus?${query}`, {
    headers: headers,
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
  const menuList = await response.json()

  return menuList
}

export async function getCountOfMenuList(headers) {
  const response = await fetch('/api/aur-menus/count', {
    headers: headers,
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
  const countOfMenuList = await response.text()

  return Number(countOfMenuList)
}

export async function createMenu(payload) {
  const response = await fetch('/api/aur-menus', payload)
  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
  const newMenu = await response.json()

  return newMenu
}

export async function updateMenu(headers, payload) {
  const response = await fetch(`/api/aur-menus/${payload.id}`, {
    method: 'PUT',
    headers: headers,
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
  const updatedMenu = await response.json()

  return updatedMenu
}

export async function deleteMenu(id, headers) {
  const response = await fetch(`/api/aur-menus/${id}`, {
    method: 'DELETE',
    headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
}
