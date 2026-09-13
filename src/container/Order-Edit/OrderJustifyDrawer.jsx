import { Alert, Box, Stack } from '@mui/material'
import { useEffect, useState } from 'react'
import LoadingSpinner from '../../components/Loading/LoadingSpinner'
import SearchBox from '../../components/SearchBox'
import OrderJustifyListItem from './OrderJustifyListItem'

export default function OrderJustifyDrawer({ list, orderType, cariBaglantiTipi }) {
  const [searchText, setSearchText] = useState('')
  const [filteredList, setFilteredList] = useState(list)

  const handleChangeSearch = (search) => {
    setSearchText(search)
  }

  useEffect(() => {
    if (searchText === '') {
      setFilteredList(list)
    } else {
      setFilteredList(list.filter((todo) => todo.stokAdi.toUpperCase().includes(searchText) || todo.stokKodu.includes(searchText)))
    }
  }, [searchText, list])

  useEffect(() => {
    setFilteredList(list)
  }, [list])

  return (
    <Box>
      <SearchBox search={searchText} handleChangeSearch={handleChangeSearch} zIndex={true} top={5} />
      {filteredList && filteredList.length > 0 ? (
        filteredList.map((todo) => (
          <Box p={1} key={orderType === 'MSK' ? todo.sipUid : todo.stokKodu}>
            <OrderJustifyListItem
              key={orderType === 'MSK' ? todo.sipUid : todo.stokKodu}
              pk={orderType === 'MSK' ? todo.sipUid : todo.stokKodu}
              stockCode={todo.stokKodu}
              stockName={todo.stokAdi}
              orderQuantity={todo.siparisMiktar}
              deliveryQuantity={todo.teslimMiktar}
              sipUid={todo.sipUid}
              orderNo={todo.orderNo}
              orderType={orderType}
            />
          </Box>
        ))
      ) : filteredList && filteredList.length === 0 ? (
        <Stack sx={{ width: '100%' }} spacing={2}>
          <Alert severity="info">Kalem bulunamadı.</Alert>
        </Stack>
      ) : (
        <LoadingSpinner />
      )}
    </Box>
  )
}
