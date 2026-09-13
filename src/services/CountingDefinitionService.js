import { getErrorMessage } from '../utils/Utils'

export async function partialUpdateCounting(id, patchPayload) {
  const response = await fetch(`/api/aur-sayim-tanims/${id}`, patchPayload)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const definitionList = await response.json()
  return definitionList
}

export async function completeCounting(headers, id) {
  const response = await fetch(`/api/complete-counting-definition/${id}?clearHistory=true`, { headers })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
}

export async function checkCountingAddress(headers, id, addressId) {
  const response = await fetch(`/api/check-counting-address/${id}/${addressId}`, { headers })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
}
