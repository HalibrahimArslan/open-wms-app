import { Box, Typography, useTheme } from '@mui/material'
import { useEffect, useState } from 'react'
import SearchBox from '../SearchBox'
import AddressInfo from '../Address/AddressInfo'

export default function ProductAddressList({ data }) {
  const theme = useTheme()
  const [inputText, setInputText] = useState('')
  const [filteredList, setFilteredList] = useState([])

  const handleChangeSearch = (search) => {
    setInputText(search)
  }

  useEffect(() => {
    if (inputText.length !== 0) {
      setFilteredList(data.filter((q) => q.urunAdres.adres.includes(inputText.toUpperCase())))
    }
    if (inputText.length === 0) {
      setFilteredList(data)
    }
  }, [inputText, data])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        m: 1,
        p: 1,
        backgroundColor: theme.palette.secondary.main,
        border: '1px solid',
        borderColor: theme.palette.primary.main,
        borderRadius: 1,
      }}
    >
      <Typography p={1}>Adresler</Typography>
      <SearchBox search={inputText} handleChangeSearch={handleChangeSearch} />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          flexDirection: 'column',
          overflowY: 'auto',
          overflowX: 'hidden',
          p: 2,
          gap: 1,
        }}
      >
        {filteredList && filteredList.length > 0 && filteredList.map((item, index) => <AddressInfo key={index} miktar={item.miktar} address={item.urunAdres.adres} />)}
      </Box>
    </Box>
  )
}
