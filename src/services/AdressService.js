import { getErrorMessage } from '../utils/Utils'

export async function saveProductAddress(payload) {
  const response = await fetch('/api/aur-depo-stok-adres', payload)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const msg = 'OK'

  return msg
}

export async function productAddressDefinition(payload) {
  const response = await fetch('/api/product-address-definition', payload)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  return response.statusText
}

export async function productAddressReplacement(payload) {
  const response = await fetch('/api/product-address-replacement', payload)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
}

export async function getDepoStockAddresses(headers) {
  const response = await fetch('/api/aur-depo-urun-adres-stok', {
    headers: headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const adresStockList = await response.json()

  return adresStockList
}

export async function getDepoAddresses(headers) {
  const response = await fetch('/api/aur-adres-tanim-bulk', {
    headers: headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const addressList = await response.json()

  return addressList
}

export async function getDepoUrunStockAddressByDepoAndBarcode(depoNo, barcode, headers) {
  const response = await fetch(`/api/check-temporary-area/${depoNo}/${barcode}`, {
    headers: headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const addressList = await response.json()

  return addressList
}

export async function getDepoUrunAddresses(address, depoCode, headers) {
  if (address === 'undefined' || address === null || address === '') {
    const message = `Adres bulunamadı`
    throw new Error(message)
  }

  const response = await fetch(`/api/address-by-depo-code/${address}/${depoCode}`, {
    headers: headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const addressId = await response.text()

  return addressId
}

export async function getAddressPlacementHistory(payload) {
  const response = await fetch('/api/aur-address-placement-history', payload)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const stockAddressList = await response.json()

  return stockAddressList
}

export async function getCountAddressList(headers, query) {
  const response = await fetch(`/api/address-list/count?${query}`, {
    headers: headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const addressListCount = await response.text()

  return Number(addressListCount)
}

export async function getAddressList(headers, query) {
  const response = await fetch(`/api/address-list?${query}`, {
    headers: headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const addressList = await response.json()

  return addressList
}

export async function getNotCountedAddressList(headers, sayimTanimId) {
  const response = await fetch(`/api/not-counted-address-list/${sayimTanimId}`, { headers: headers })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const addressList = await response.json()

  return addressList
}

export async function getEmptyAddressList(headers, warehouse, query) {
  const queryString = query ? `?${query}` : ''

  const response = await fetch(`/api/empty-addresses/${warehouse}${queryString}`, {
    headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const emptyAddressList = await response.json()
  return emptyAddressList
}

export async function createAddressBulk(payload) {
  const response = await fetch(`/api/address-bulk`, payload)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const newAddresses = await response.json()

  return newAddresses
}

export async function deleteAddress(id, headers) {
  const response = await fetch(`/api/address/${id}`, {
    headers: headers,
    method: 'DELETE',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
}

export async function getCountAddresses(headers, searchParams) {
  const response = await fetch(`/api/address-list/count?${searchParams}`, {
    headers: headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const count = await response.text()

  return parseInt(count)
}

export async function updateUrunAdres(payload, urunAdresId) {
  const response = await fetch(`/api/aur-depo-address/${urunAdresId}`, payload)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const stockAddressList = await response.json()

  return stockAddressList
}

export async function updateBulkUrunAdres(payload) {
  const response = await fetch(`/api/aur-depo-address-bulk`, payload)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const updatedAddressList = await response.json()

  return updatedAddressList
}
