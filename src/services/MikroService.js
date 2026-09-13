import { getErrorMessage } from '../utils/Utils'

export async function getDepoListFromErp(headers) {
  const response = await fetch('/api/depoList', {
    headers: headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const depoList = await response.json()

  return depoList
}

export async function getUserCompanyInfo(headers) {
  const response = await fetch('/api/users/companyInfo', {
    headers: headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
  const companyInfo = await response.json()

  const info = companyInfo.companyName

  return info
}

export async function getUserCompanyCode(headers) {
  const response = await fetch('/api/users/company', {
    headers: headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
  const companyCode = await response.text()

  return companyCode
}

export async function getFirmList(headers, depoCode, sipTip) {
  const response = await fetch(`/api/firmList/${depoCode}/${sipTip}`, {
    headers: headers,
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
  const firmList = await response.json()

  return firmList
}

export async function getFirmOrderList(payload) {
  const response = await fetch('/api/firmOrderList', payload)
  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
  const firmOrderList = await response.json()

  return firmOrderList
}

export async function getFirmOrderBulkList(payload) {
  const response = await fetch('/api/firmOrderBulkList', payload)
  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
  const firmOrderList = await response.json()

  return firmOrderList
}

export async function produceBarkod(headers, stokKod) {
  const response = await fetch(`/api/produceBarkod/${stokKod}`, {
    headers: headers,
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
  const firmOrderList = await response.text()

  return firmOrderList
}

export async function executeServiceMikro(payload) {
  const response = await fetch('/api/executeServiceMikro', payload)
  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
  const executeList = await response.json()

  return executeList
}

export async function getOrderDetailByOrderNo(headers, orderNo, sipTip, depoNo) {
  const response = await fetch(`/api/orderDetail/${orderNo}/${sipTip}/${depoNo}`, {
    headers: headers,
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
  const executeList = await response.json()

  return executeList
}

export async function getOrderByOrderNo(payload) {
  const response = await fetch('/api/v16/order-details', payload)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  return response.json()
}

export async function dispatchOrder(payload) {
  const response = await fetch(`/api/musteriSevkiyat`, payload)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
}

export async function malKabul(payload, adresId) {
  const response = await fetch(`/api/firmadanMalKabul/${adresId}`, payload)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  return response.text()
}
