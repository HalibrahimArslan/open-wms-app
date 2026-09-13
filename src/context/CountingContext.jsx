import { createContext, useState } from 'react'

const CountingContext = createContext()

export const CountingProvider = ({ children }) => {
  const [selectedCountingId, setSelectedCountingId] = useState(0)
  const [selectedCounting, setSelectedCounting] = useState(null)
  const [addresses, setAddresses] = useState([])

  const handleSelectedCounting = (counting) => {
    setSelectedCounting(counting)
  }

  const handleSelectedCountingId = (index) => {
    setSelectedCountingId(index)
  }

  const handleAddresses = (index) => {
    setAddresses(index)
  }

  const value = {
    selectedCountingId,
    handleSelectedCountingId,
    selectedCounting,
    handleSelectedCounting,
    addresses,
    handleAddresses,
  }

  return <CountingContext.Provider value={value}>{children}</CountingContext.Provider>
}

export { CountingContext }

export default CountingProvider
