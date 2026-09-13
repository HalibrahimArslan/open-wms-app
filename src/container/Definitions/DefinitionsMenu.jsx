import { Divider, ListItemButton, Paper } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useSWRConfig } from 'swr'
import { getMenuTree, getMenuTreeView } from '../../services/MenuService'
import { notifyError } from '../../layout/Layout'
import usePersistedToken from '../../hooks/usePersistedToken'
import useAuthHeader from '../../hooks/useAuthHeader'
import useDepoCode from '../../hooks/useDepoCode'

export default function DefinationsMenu() {
  const token = usePersistedToken()
  const nav = useNavigate()
  const [menuList, setMenuList] = useState()
  const { cache } = useSWRConfig()
  const header = useAuthHeader()
  const depoCode = useDepoCode()

  const fetchMenuList = async () => {
    if (cache.get('tree-menu')) {
      setMenuList(cache.get('tree-menu'))
    } else {
      let query = 'menuId=97'
      const res = await getMenuTree(header, query)
      res && setMenuList(res)
      cache.set('tree-menu', res)
    }
  }

  const handleListItemClick = (item) => {
    if (depoCode === undefined) {
      notifyError('Lütfen Depo Seçiniz :)')
    }

    if (item.path !== null && item.path != '') {
      nav(`/d:${depoCode}/${item.path}`)
    }
  }

  useEffect(() => {
    if (token.length > 0) {
      fetchMenuList()
    }
  }, [token])

  return (
    <Paper elevation={3}>
      {menuList && menuList.length > 0 && (
        <>
          {menuList[0].children.map((item) => {
            return (
              <>
                <ListItemButton onClick={() => handleListItemClick(item)}>{item.name}</ListItemButton>
                <Divider />
              </>
            )
          })}
        </>
      )}
    </Paper>
  )
}
