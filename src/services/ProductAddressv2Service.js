import { getErrorMessage } from '../utils/Utils'

export async function getProductAddresses(headers, query) {
  const response = await fetch(`/api/v2/product-addresses?${query}`, { headers })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const productAddresses = await response.json()

  return productAddresses
}
