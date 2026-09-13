import { getErrorMessage } from '../utils/Utils'

export async function assignOrder(payload) {
  const response = await fetch('/api/aur-tmp-detail', payload)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  return response
}

export async function getPickingTmpOrderByUserName(headers, opType, depoCode, info) {
  const response = await fetch(`/api/aur-picking-tmp-detail/${opType}/${depoCode}/${info}`, {
    headers: headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const userOrderList = await response.json()

  return userOrderList
}

export async function getDoneOrderByOrderInfo(headers, orderInfo) {
  const response = await fetch(`/api/aur-done-order-by-order-info/${orderInfo}`, {
    headers: headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const userOrderList = await response.json()

  return userOrderList
}

export const orderDetailRequest = (headers, aurOrderDetailList, opType, orderInfo, status) => {
  let dto = {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
      aurOrderDetailList,
      opType,
      orderInfo,
      status,
    }),
  }

  return dto
}

export async function updateOrderMasterById(id, payload) {
  const response = await fetch(`/api/order-masters/${id}`, payload)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const resp = await response.json()

  return resp
}

export async function getOrderIdByOrderInfo(headers, orderInfo) {
  const response = await fetch(`/api/order-id/${orderInfo}`, {
    headers: headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(getErrorMessage(response.status, error))
  }

  const orderId = await response.text()

  return orderId
}
