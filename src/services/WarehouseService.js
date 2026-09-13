export async function getWarehouses(headers, query) {
  const response = await fetch(`/api/warehouse?${query}`, {
    headers: headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const vendorMails = await response.json()
  return vendorMails
}
