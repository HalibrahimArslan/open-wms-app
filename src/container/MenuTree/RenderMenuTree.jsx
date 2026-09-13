import React, { useEffect, useState } from 'react'
import { useSWRConfig } from 'swr'
import useAuthHeader from '../../hooks/useAuthHeader'
import usePersistedToken from '../../hooks/usePersistedToken'
import { getMenuTree } from '../../services/MenuService'
import MenuItem from '../../components/Menu/MenuItem'
import useDepoCode from '../../hooks/useDepoCode'
import { useNavigate } from 'react-router-dom'
import { notifyError } from '../../layout/Layout'
import LeftBar from '../../layout/sidebar/LeftBar'

export default function RenderMenuTree() {
  const [menuList, setMenuList] = useState([])
  const [openMenuId, setOpenMenuId] = useState(null)

  const token = usePersistedToken()
  const { cache } = useSWRConfig()
  const header = useAuthHeader()
  const depoKod = useDepoCode()
  const navigate = useNavigate()

  const handleToggle = (id) => {
    setOpenMenuId((prevState) => (prevState === id ? null : id))
  }

  const fetchMenuList = async () => {
    if (cache.get('sideBarMenuTree')) {
      setMenuList(cache.get('sideBarMenuTree'))
    } else {
      const res = await getMenuTree(header)
      res && setMenuList(res)
      cache.set('sideBarMenuTree', res)
    }
  }

  const handleListItemClick = (item) => {
    if (depoKod === undefined) {
      notifyError('Depo Seçiniz')
      return
    }

    if (item.path === null || item.path === '') {
      return
    }

    if (item.index) {
      navigate(`/d:${depoKod}/${item.id}/${item.path}`)
      return
    }

    navigate(`/d:${depoKod}/${item.path}`)
  }

  useEffect(() => {
    if (token.length > 0) {
      fetchMenuList()
    }
  }, [token])

  return <LeftBar menus={menuList} />
}
