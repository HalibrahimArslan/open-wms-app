export async function getProductAddresses(headers, query) {
  const response = await fetch(`/api/v2/product-addresses?${query}`, { headers: headers })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const productAdresses = await response.json()

  return productAdresses
}
