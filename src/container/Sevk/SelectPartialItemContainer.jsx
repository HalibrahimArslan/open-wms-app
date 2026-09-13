import React, { useEffect } from 'react'
import ComboItemPartial from '../../components/Combobox/ComboItemPartial'

export default function SelectPartialItemContainer({ barcode, apiList, setSelectedBarcode, handleComplete }) {
  const [value, setValue] = React.useState(0)
  const [list, setList] = React.useState([])

  const handleChange = (newValue) => {
    setValue(newValue)
    setSelectedBarcode(newValue)
  }

  useEffect(() => {
    let response = apiList.filter((todo) => todo.stokKodu === barcode)

    if (response.length > 1) {
      let mainList = response.map((todo) => {
        let key = todo.aurPartialItemId + '*' + todo.sipUid

        if (todo.aurPartialItemId === 0) {
          return {
            key: key,
            code: todo.stokAdi,
            stockCode: todo.stokKodu,
            orderNo: todo.orderNo,
          }
        } else {
          return {
            key: key,
            code: todo.pieceMaster.stokAdi,
            stockCode: todo.pieceMaster.stokKodu,
            orderNo: todo.orderNo,
          }
        }
      })
      setList(mainList)
    }
  }, [apiList, barcode])

  return (
    <ComboItemPartial
      label={'Ana ürün seçiniz'}
      value={value}
      handleChange={handleChange}
      list={list}
      placeholder="Ürün ara..."
      error={false}
      helperText=""
      handleComplete={handleComplete}
    />
  )
}
