import { getErrorMessage } from '../utils/Utils'

export async function getRules(headers) {
  const response = await fetch(`/api/rules`, {
    headers: headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const rules = await response.json()
  return rules
}

export async function updateRule(id, headers, payload) {
  const response = await fetch(`/api/rule/${id}`, {
    method: 'PUT',
    headers: headers,
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const updatedRule = await response.json()
  return updatedRule
}
