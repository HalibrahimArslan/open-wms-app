import { useEffect, useState } from 'react'
import ListSubheader from '@mui/material/ListSubheader'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import WarehouseIcon from '@mui/icons-material/Warehouse'
import { getMenuTree } from '../../services/MenuService'
import { useNavigate } from 'react-router'
import useAuthHeader from '../../hooks/useAuthHeader'
import { useSWRConfig } from 'swr'
import useDepoCode from '../../hooks/useDepoCode'
import { notifyError } from '../../layout/Layout'
import { Box, Skeleton } from '@mui/material'
import Iconify from '../../components/Iconify/Iconify'

function MenuTreeContainer() {
  const [menuList, setMenuList] = useState([])
  const [parentMenuId, setParentMenuId] = useState(null)
  const [loading, setLoading] = useState(false)

  let filteredMenuList = parentMenuId === null ? menuList : menuList.filter((menuItem) => menuItem.id === parentMenuId)[0].children

  const depoCode = useDepoCode()
  const navigate = useNavigate()
  const { cache } = useSWRConfig()
  const header = useAuthHeader()

  const handleListItemClick = (item) => {
    if (item.path === null || item.path === '') {
      setParentMenuId(item.id)
      return
    }

    if (item.index) {
      navigate(`/d:${depoCode}/${item.id}/${item.path}`)
      return
    }

    navigate(`/d:${depoCode}/${item.path}`)
  }

  const fetchMenuList = async () => {
    try {
      setLoading(true)
      if (cache.get('menuTree')) {
        setMenuList(cache.get('menuTree'))
      } else {
        const res = await getMenuTree(header)
        res && cache.set('menuTree', res)
        res && setMenuList(res)
      }
    } catch (error) {
      notifyError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMenuList()
  }, [])

  if (loading) {
    return (
      <Box display={'flex'} flexDirection={'column'} gap={1}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton variant="rectangular" height={75} />
        ))}
      </Box>
    )
  }

  return (
    <>
      <List
        sx={{ display: 'flow' }}
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            Kullanıcı Menü Listesi
          </ListSubheader>
        }
      >
        {filteredMenuList &&
          filteredMenuList.length > 0 &&
          filteredMenuList.map((menuItem) => (
            <ListItemButton key={menuItem.id} value={menuItem.name} onClick={() => handleListItemClick(menuItem)}>
              <ListItemIcon>{menuItem.icon ? <Iconify icon={menuItem.icon} /> : <WarehouseIcon />}</ListItemIcon>
              <ListItemText key={menuItem.id} primary={menuItem.name} />
              <Divider />
            </ListItemButton>
          ))}
      </List>
    </>
  )
}

export default MenuTreeContainer
