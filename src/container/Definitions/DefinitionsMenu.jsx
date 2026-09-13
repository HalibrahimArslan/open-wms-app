import { Box, Divider, ListItemButton, Paper, Skeleton } from '@mui/material'
import { Fragment, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useSWRConfig } from 'swr'
import { getMenuTree } from '../../services/MenuService'
import { notifyError } from '../../layout/Layout'
import usePersistedToken from '../../hooks/usePersistedToken'
import useAuthHeader from '../../hooks/useAuthHeader'
import useDepoCode from '../../hooks/useDepoCode'
import EmptyState from '../../shared/components/EmptyState/EmptyState'

/**
 * Bu panel, tanimlamalar rotasina karsilik gelen menu dugumunun alt
 * kalemlerini listeler. Dugum, veritabani id'siyle degil yoluyla bulunur:
 * id'ler kuruluma gore degistigi icin sabit bir id (eskiden menuId=97)
 * baska bir veritabaninda hicbir seye karsilik gelmez ve panel sessizce bos
 * kalir. Yol ise rota tanimiyla ayni oldugu icin her kurulumda gecerlidir.
 */
const DEFINITIONS_MENU_PATH = 'definitions'

/** Menu agacinda verilen yola sahip dugumu derinlemesine arar. */
const findMenuByPath = (nodes, path) => {
  if (!Array.isArray(nodes)) return null

  for (const node of nodes) {
    if (node?.path === path) return node

    const found = findMenuByPath(node?.children, path)
    if (found) return found
  }

  return null
}

export default function DefinationsMenu() {
  const token = usePersistedToken()
  const nav = useNavigate()
  // null: henuz yuklenmedi, []: yuklendi ama gosterilecek kalem yok
  const [items, setItems] = useState(null)
  const { cache } = useSWRConfig()
  const header = useAuthHeader()
  const depoCode = useDepoCode()

  const fetchMenuList = async () => {
    try {
      // Sol menu ayni agaci zaten cekiyor; onbellekteki veriyi yeniden
      // kullanarak ikinci bir istek atmiyoruz.
      let tree = cache.get('sideBarMenuTree')

      if (!tree) {
        tree = await getMenuTree(header)
        cache.set('sideBarMenuTree', tree)
      }

      setItems(findMenuByPath(tree, DEFINITIONS_MENU_PATH)?.children ?? [])
    } catch (error) {
      notifyError(error.message)
      setItems([])
    }
  }

  const handleListItemClick = (item) => {
    if (depoCode === undefined) {
      notifyError('Lütfen Depo Seçiniz :)')
      return
    }

    if (item.path !== null && item.path !== '') {
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
      {items === null && (
        <Box sx={{ padding: 2 }}>
          <Skeleton height={32} />
          <Skeleton height={32} />
          <Skeleton height={32} />
        </Box>
      )}

      {items !== null && items.length === 0 && <EmptyState title="Tanımlama bulunamadı" dense />}

      {items !== null &&
        items.map((item, index) => (
          <Fragment key={item.id ?? item.path ?? index}>
            <ListItemButton onClick={() => handleListItemClick(item)}>{item.name}</ListItemButton>
            {index < items.length - 1 && <Divider />}
          </Fragment>
        ))}
    </Paper>
  )
}
