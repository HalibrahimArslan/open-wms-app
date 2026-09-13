import { getErrorMessage } from '../utils/Utils'

export async function saveCountingTransaction(body) {
  const response = await fetch(`/api/order-picking-transactions`, body)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
}

export async function getNonCountableSayimTransaction(headers, aurTanimId, page, size, transactionType) {
  const response = await fetch(`/api/order-picking-transactions?referenceId.equals=${aurTanimId}&page=${page}&size=${size}&transactionType.equals=${transactionType}`, {
    headers: headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const transactionList = await response.json()

  return transactionList
}

export async function getNonCountableSayimTransactionCount(headers, aurTanimId, transactionType) {
  const response = await fetch(`/api/order-picking-transactions/count?referenceId.equals=${aurTanimId}&transactionType.equals=${transactionType}`, { headers: headers })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const sizeOfList = await response.text()

  return sizeOfList
}

export async function getPerformanceList(headers, query) {
  const response = await fetch(`/api/user-performance?${query}`, { headers })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const performanceList = await response.json()

  return performanceList
}
