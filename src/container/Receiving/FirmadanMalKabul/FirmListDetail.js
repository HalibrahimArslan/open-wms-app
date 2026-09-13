import { useState, useEffect } from 'react'
import ListSubheader from '@mui/material/ListSubheader'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import WarehouseIcon from '@mui/icons-material/Warehouse'
import { useNavigate, useParams } from 'react-router-dom'
import usePayload from '../../../hooks/usePayload'
import { getFirmOrderList } from '../../../services/MikroService'
import LoadingSpinner from '../../../components/Loading/LoadingSpinner'
import { Alert, Stack } from '@mui/material'
import SearchBox from '../../../components/SearchBox'
import Seo from '../../../shared/components/Seo'
import useDepoCode from '../../../hooks/useDepoCode'
import NotFound from '../../../shared/components/NotFound/NotFound'
import { notifyError } from '../../../layout/Layout'

function FirmListDetail() {
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  const [loading, setLoading] = useState(false)
  const [firmDetail, setFirmDetail] = useState([])

  let depoCode = useDepoCode()
  let { menuId, firmName, firmCode } = useParams()

  const payload = usePayload({
    depoList: [Number(depoCode)],
    firmCode: firmCode,
    sipTip: 1,
    transGroupCode: '',
  })

  const fetchOrderData = async () => {
    try {
      setLoading(true)
      const res = await getFirmOrderList(payload)
      setLoading(false)
      res && setFirmDetail(res)
    } catch (err) {
      setLoading(false)
      notifyError('Hata' + err.message)
    }
  }

  useEffect(() => {
    if (searchText.length > 0) {
      const filteredList = firmDetail.filter((todo) => todo.orderNo.includes(searchText))
      setFirmDetail(filteredList)
    } else {
      fetchOrderData()
    }
  }, [searchText])

  const handleChangeSearch = (search) => {
    setSearchText(search)
  }

  const handleListItemClick = (index) => {
    navigate(`/d:${depoCode}/${menuId}/${'FMK'}/${index}/${firmCode}/${firmName}/orderprogressfinish`)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <>
      <Seo title="Firma Sipariş Listesi" />
      <Stack>
        <Alert severity="info">{firmName} Satın Alma Siparişleri</Alert>
      </Stack>
      <SearchBox search={searchText} handleChangeSearch={handleChangeSearch} zIndex={true} />
      <List
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            SİPARİŞ SEÇİNİZ
          </ListSubheader>
        }
      >
        {firmDetail && firmDetail.length > 0 ? (
          firmDetail.map((todo) => (
            <>
              <ListItemButton key={todo.orderNo} onClick={() => handleListItemClick(todo.orderNo)}>
                <ListItemIcon>
                  <WarehouseIcon />
                </ListItemIcon>
                <ListItemText primary={todo.orderNo} />
                <ListItemText secondary={todo.orderLineItemCount} />
                <ListItemText />
              </ListItemButton>
              <Divider />
            </>
          ))
        ) : (
          <NotFound msg={'Sipariş Detayları Bulunumadı'} />
        )}
      </List>
    </>
  )
}

export default FirmListDetail
