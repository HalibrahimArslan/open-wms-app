import { getErrorMessage } from '../utils/Utils'

export async function getStockInfo(headers, query) {
  const queryString = query ? `?${query}` : ''
  const response = await fetch(`/api/product${queryString}`, { headers })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const stockInfoList = await response.json()
  const totalCount = response.headers.get('x-total-count')

  return {
    data: stockInfoList,
    totalCount: totalCount ? parseInt(totalCount, 10) : stockInfoList.length,
  }
}

export async function searchStockInfo(headers, search, companyCode, size = 5) {
  const q = (search ?? '').trim()
  const term = encodeURIComponent(q)
  let query = `page=0&size=${size}&companyCode.equals=${companyCode}&lotBasedTracking.equals=false`
  if (q) {
    query += `&multiSearch.contains=${term}`
  }

  return getStockInfo(headers, query)
}

export async function updateProductLotTracking(payload) {
  const response = await fetch('/api/product', payload)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  return response.json()
}
