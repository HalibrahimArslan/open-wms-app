import { getErrorMessage } from '../utils/Utils'

export async function getOrderMasterList(headers, query) {
  const response = await fetch(`/api/order-master?${query}`, {
    headers: headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const orderMasterList = await response.json()

  return orderMasterList
}

export async function suspendOrders(headers, id) {
  const response = await fetch(`/api/suspend-order/${id}`, { headers: headers })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const resp = await response.text()

  return resp
}

export async function reformOrders(payload) {
  const response = await fetch(`/api/aur-reform-order`, payload)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const resp = await response.text()

  return resp
}

export async function reformDispatchOrders(payload) {
  const response = await fetch(`/api/aur-reform-order-sevkiyat`, payload)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
  const resp = await response.text()

  return resp
}

export async function saveOrderWithoutAssign(payload) {
  const response = await fetch(`/api/aur-tmp-detail-without-assign`, payload)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const resp = await response.json()

  return resp
}

export async function getOrderDetailByFirmCodeAndOrderNo(headers, depoCode, firmCode, opType, orderNo) {
  const response = await fetch(`/api/aur-tmp-order/${depoCode}/${firmCode}/${opType}/${orderNo}`, { headers: headers })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const resp = await response.json()

  return resp
}

export async function getOrderDetailList(payload) {
  const response = await fetch(`/api/aur-tmp-order-list`, payload)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const resp = await response.json()

  return resp
}

export async function getOrderDetailAtDispatchArea(payload) {
  const response = await fetch(`/api/aur-tmp-order-list-at-dispatch-area`, payload)
  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const resp = await response.json()

  return resp
}

export async function updateOrderDetailById(id, payload) {
  const response = await fetch(`/api/aur-tmp-detail/${id}`, payload)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const resp = await response.json()

  return resp
}

export async function getSameFirmOrders(headers, orderInfo) {
  const response = await fetch(`/api/firm-related-orders/${orderInfo}`, {
    headers: headers,
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const resp = await response.json()

  return resp
}

export async function combineOrders(payload) {
  const response = await fetch(`/api/combine-orders`, payload)
  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  return 'success'
}

export async function updateOrderDetailsFromMicroService(headers, orderInfo) {
  const response = await fetch(`/api/update-order-detail-from-micro/${orderInfo}`, { headers: headers })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }
  const resp = await response.json()

  return resp
}

export async function saveOrderDetails(param) {
  const response = await fetch(`/api/aur-tmp-detail`, param)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  return 'success'
}
