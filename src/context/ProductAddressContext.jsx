import { createContext, useEffect, useReducer, useState } from 'react'
import statusReducer, { initalEnableSituation } from '../reducers/ProductAddressReducer'

const ProductAddressContext = createContext(null)

const ProductAddressProvider = ({ children }) => {
  const [product, setProduct] = useState({ stokKodu: '', stokAdi: '' })
  const [state, dispatch] = useReducer(statusReducer, initalEnableSituation)
  const [barcode, setBarcode] = useState('')
  const [addressId, setAddressId] = useState(0)
  const [productAddressId, setProductAddressId] = useState(0)
  const [productAddressAmount, setProductAddressAmount] = useState(0)
  const [tmpAreaAmount, setTmpAreaAmount] = useState(0)
  const [address, setAddress] = useState('')
  const [transferAddressId, setTransferAddressId] = useState(0)
  const [transferAddress, setTransferAddress] = useState('')

  const handleAddressId = (id) => {
    setAddressId(id)
  }

  const handleProductAddressId = (id) => {
    setProductAddressId(id)
  }

  const handleProductAddressAmount = (quantity) => {
    setProductAddressAmount(quantity)
  }

  const handleBarcode = (e) => {
    setBarcode(e.target.value)
  }

  const handleChangeStatus = (actionType) => {
    dispatch(actionType)
  }

  const handleProduct = (product) => {
    setProduct(product)
  }

  const handleTmpAreaAmount = (quantity) => {
    setTmpAreaAmount(quantity)
  }

  const handleAddress = (txt) => {
    setAddress(txt)
  }

  const handleChangeTransferAddressId = (id) => {
    setTransferAddressId(id)
  }

  const handleChangeTransferAddressName = (name) => {
    setTransferAddress(name)
  }

  useEffect(() => {
    if (state.step === 2) {
      setBarcode('')
    }
    if (state.step === 1) {
      setBarcode('')
      handleChangeTransferAddressName('')
      handleProductAddressAmount(0)
    }
  }, [state.step])

  return (
    <ProductAddressContext.Provider
      value={{
        product,
        state,
        barcode,
        addressId,
        productAddressId,
        productAddressAmount,
        tmpAreaAmount,
        address,
        transferAddress,
        transferAddressId,
        handleBarcode,
        handleAddressId,
        handleProductAddressId,
        handleProductAddressAmount,
        handleChangeStatus,
        handleProduct,
        handleTmpAreaAmount,
        handleAddress,
        handleChangeTransferAddressId,
        handleChangeTransferAddressName,
      }}
    >
      {children}
    </ProductAddressContext.Provider>
  )
}
export { ProductAddressContext }

export default ProductAddressProvider
