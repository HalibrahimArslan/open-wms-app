import { useState, useEffect } from 'react'
import ListSubheader from '@mui/material/ListSubheader'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import WarehouseIcon from '@mui/icons-material/Warehouse'
import Box from '@mui/material/Box'
import { useLocation, useNavigate } from 'react-router-dom'
import { getFirmList } from '../../../services/MikroService'
import useAuthHeader from '../../../hooks/useAuthHeader'
import SearchBox from '../../../components/SearchBox'
import { Typography } from '@mui/material'
import LoadingSpinner from '../../../components/Loading/LoadingSpinner'
import { useSWRConfig } from 'swr'
import { translateToEnglish } from '../../../utils/Utils'
import Seo from '../../../shared/components/Seo'
import useDepoCode from '../../../hooks/useDepoCode'
import NotFound from '../../../shared/components/NotFound/NotFound'
import { notifyError } from '../../../layout/Layout'

function FirmList() {
  const navigate = useNavigate()
  const headers = useAuthHeader()
  const location = useLocation()
  const { cache } = useSWRConfig()

  const [firmList, setFirmList] = useState([])
  const [filteredList, setFilteredList] = useState([])
  const [loading, setLoading] = useState(false)
  const [inputText, setInputText] = useState('')

  let depo = useDepoCode()
  let menuId = location.pathname.split('/')[2]

  const handleChangeSearch = (search) => {
    setInputText(search)
  }

  const fetchFirmListData = async () => {
    let key = `firmList-${depo}-${menuId}`
    if (cache.get(key)) {
      setFirmList(cache.get(key))
      setFilteredList(cache.get(key))
    } else {
      try {
        setLoading(true)
        const res = await getFirmList(headers, depo, 1)
        res && setFirmList(res)
        res && setFilteredList(res)
        res && cache.set(key, res)
        setLoading(false)
      } catch (err) {
        setLoading(false)
        notifyError(err.message)
      }
    }
  }

  const handleListItemClick = (firmCode, firmName) => {
    navigate(`/d:${depo}/${menuId}/${translateToEnglish(firmName.replace(/[\/\s]/g, '')).toUpperCase()}/${firmCode}/firmListDetail`)
  }

  useEffect(() => {
    fetchFirmListData()
  }, [])

  useEffect(() => {
    if (inputText === '') {
      setFilteredList(firmList)
    } else {
      setFilteredList(firmList.filter((todo) => todo.cariUnvan.toUpperCase().includes(inputText)))
    }
  }, [inputText, firmList])

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <>
      <SearchBox search={inputText} handleChangeSearch={handleChangeSearch} zIndex={true} />
      <List
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            SATIN ALMA SİPARİSİ OLAN FİRMALAR
          </ListSubheader>
        }
      >
        {filteredList && filteredList.length > 0 ? (
          filteredList.map((todo) => (
            <ListItemButton key={todo.cariKod} onClick={() => handleListItemClick(todo.cariKod, todo.cariUnvan)}>
              <ListItemIcon>
                <WarehouseIcon />
              </ListItemIcon>
              <ListItemText sx={{ wordWrap: 'break-word' }} primary={todo.cariUnvan} />
              <Divider />
            </ListItemButton>
          ))
        ) : filteredList && filteredList.length === 0 && inputText.length > 0 ? (
          <Box sx={{ display: 'flex' }}>
            <Typography>Eşleşme Bulunamadı</Typography>
          </Box>
        ) : filteredList && filteredList.length === 0 && inputText.length === 0 ? (
          <NotFound msg={'Firma Bulunamadı'} />
        ) : (
          <LoadingSpinner />
        )}
      </List>
    </>
  )
}

export default FirmList
