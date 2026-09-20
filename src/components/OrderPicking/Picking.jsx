import { useMemo } from 'react'
import { Box, Grid } from '@mui/material'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import groupBy from '../../utils/Utils'
import PickingItem from './PickingItem'
import PickingCard from './PickingCard'
import EmptyState from '../../shared/components/EmptyState/EmptyState'

/**
 * Siparis detayinin kutu gorunumu.
 *
 * Once parcali urun gruplari, sonra tekil urunlerin izgarasi gelir. Izgara
 * ogeleri esnek kutu cocuklaridir ve kartlar height: 100% tasidigi icin ayni
 * satirdaki kartlar esit yukseklikte durur.
 */
export default function Picking({ list, adresList }) {
  const { partialList, notPartialList, partialMasters } = useMemo(() => {
    const grouped = groupBy(list ?? [], (item) => item.isPiece)
    const partial = grouped.get(true) ?? []
    const masters = [...new Set(partial.map((item) => item.pieceMaster?.stokKodu).filter(Boolean))]
    return { partialList: partial, notPartialList: grouped.get(false) ?? [], partialMasters: masters }
  }, [list])

  if (partialMasters.length === 0 && notPartialList.length === 0) {
    return <EmptyState icon={<Inventory2OutlinedIcon />} title="Ürün yok" description="Bu siparişte gösterilecek ürün bulunmuyor." />
  }

  return (
    <Box sx={{ padding: 2 }}>
      {partialMasters.map((master) => (
        <PickingItem key={master} master={master} list={partialList} adresList={adresList} />
      ))}

      <Grid container spacing={2}>
        {notPartialList.map((item) => (
          <Grid
            key={item.id}
            size={{
              xs: 12,
              sm: 6,
              md: 4,
              lg: 3,
            }}
          >
            <PickingCard item={item} adresList={adresList} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
