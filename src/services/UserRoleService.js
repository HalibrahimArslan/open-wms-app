import { getErrorMessage } from '../utils/Utils'

export async function getUserRoleList(headers, query) {
  const response = await fetch(`/api/user-roles?${query}`, {
    headers: headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const userRoles = await response.json()
  const totalCount = response.headers.get('x-total-count')

  return {
    data: userRoles,
    totalCount: totalCount ? parseInt(totalCount, 10) : 0,
  }
}

export async function saveUserRoleBulk(payload) {
  const response = await fetch('/api/user-role', payload)
  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
  const userRoles = await response.json()

  return userRoles
}

export async function deleteUserRole(headers, userId, roleId) {
  const response = await fetch(`/api/user-role?userId=${userId}&roleId=${roleId}`, {
    headers: headers,
    method: 'DELETE',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  return response.status
}
