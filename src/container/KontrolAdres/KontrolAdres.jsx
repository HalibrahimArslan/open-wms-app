import List from '@mui/material/List'
import ListSubheader from '@mui/material/ListSubheader'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useFetch from '../../hooks/useFetch'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import WarehouseIcon from '@mui/icons-material/Warehouse'
import Divider from '@mui/material/Divider'
import LoadingSpinner from '../../components/Loading/LoadingSpinner'
import { Typography } from '@mui/material'
import useDepoCode from '../../hooks/useDepoCode'
import { DepoContainer } from '../../store/DepoContainer'
import { getTransferDepoCode } from '../../utils/Utils'
import { useContainer } from 'unstated-next'

export default function KontrolAdres() {
  const [controlAddressList, setControlAddressList] = useState([])

  const depoCode = useDepoCode()
  const { allDepoList } = useContainer(DepoContainer)
  const transferDepoCode = getTransferDepoCode(depoCode, allDepoList)

  const [data] = useFetch(`/api/aur-depo-kontrol-adres/${transferDepoCode}`)

  const navigate = useNavigate()

  const handleListItemClick = (addressId) => {
    let orderType = 'MSK'
    navigate(`/d:${depoCode}/${orderType}/orders-to-be-dispatched?controlAddressId=${addressId}`)
  }

  useEffect(() => {
    setControlAddressList(data)
  }, [data])

  return (
    <List
      sx={{ display: 'flow' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          KONTROL ADRESİ SEÇİNİZ
        </ListSubheader>
      }
    >
      {controlAddressList && controlAddressList.length > 0 ? (
        controlAddressList.map((address) => (
          <ListItemButton key={address.urunAdresId} onClick={() => handleListItemClick(address.urunAdresId)}>
            <ListItemIcon>
              <WarehouseIcon />
            </ListItemIcon>
            <ListItemText primary={address.adres} />
            <Divider />
          </ListItemButton>
        ))
      ) : controlAddressList && controlAddressList.length === 0 ? (
        <Typography>Bu depoda kontrol adresi bulunmamaktadır.</Typography>
      ) : (
        <LoadingSpinner />
      )}
    </List>
  )
}
