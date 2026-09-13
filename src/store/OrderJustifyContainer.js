import { useState } from 'react'

import { createContainer } from 'unstated-next'

export const useStore = () => {
  const [firmCode, setFirmCode] = useState([])
  const [cancelledItem, setCancelledItem] = useState([])
  const [orderSituation, setOrderSituation] = useState(false)
  const [updatedOne, setUpdatedOne] = useState([])

  const handleFirmCode = (index) => {
    setFirmCode([...firmCode, index])
  }

  const handleFirmList = (index) => {
    setFirmCode(index)
  }

  const handleSituation = () => {
    setOrderSituation(false)
  }

  const handleCancelledItem = (index) => {
    setCancelledItem([...cancelledItem, index])
  }

  const handleCancelledList = (index) => {
    setCancelledItem(index)
  }

  const handleOrderSituation = () => {
    setOrderSituation(!orderSituation)
  }

  const clearCancelledItem = () => {
    setCancelledItem([])
  }

  const handleUpdatedOne = (index) => {
    setUpdatedOne(index)
  }

  return {
    firmCode,
    handleFirmCode,
    handleFirmList,
    handleCancelledItem,
    cancelledItem,
    handleCancelledList,
    orderSituation,
    handleOrderSituation,
    clearCancelledItem,
    handleSituation,
    handleUpdatedOne,
    updatedOne,
  }
}

export const OrderJustifyContainer = createContainer(useStore)
