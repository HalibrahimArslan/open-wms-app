import { getErrorMessage } from '../utils/Utils'

export async function getPlacemetHistory(headers, query) {
  const response = await fetch(query && query.length > 0 ? `/api/address-movement-history?${query}` : '/api/address-movement-history', { headers: headers })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const placementHistoryList = await response.json()

  return placementHistoryList
}

export async function getPlacemetHistoryCount(headers, query) {
  const response = await fetch(query && query.length > 0 ? `/api/address-movement-history/count?${query}` : '/api/address-movement-history/count', { headers: headers })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const countOfPlacementHistoryList = await response.text()

  return countOfPlacementHistoryList
}
