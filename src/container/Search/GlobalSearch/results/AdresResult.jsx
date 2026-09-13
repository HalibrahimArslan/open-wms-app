import { useMemo } from 'react'
import { Stack } from '@mui/material'
import WarehouseRoundedIcon from '@mui/icons-material/WarehouseRounded'
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded'
import QrCodeRoundedIcon from '@mui/icons-material/QrCodeRounded'
import NumbersRoundedIcon from '@mui/icons-material/NumbersRounded'
import GlobalSearchResultCard, { ResultChip } from '../GlobalSearchResultCard'
import EmptyResult from './EmptyResult'

function qtyChipColor(qty) {
  if (!qty || qty <= 0) return 'default'
  if (qty < 5) return 'warning'
  return 'success'
}

export default function AdresResult({ data }) {
  const items = data?.items || []
  const mikroByBarcode = data?.mikroByBarcode || new Map()
  const address = data?.address || ''

  const totalQty = useMemo(() => items.reduce((acc, it) => acc + (it.miktar || 0), 0), [items])

  if (items.length === 0) {
    return <EmptyResult msg={`"${address}" adresinde ürün bulunamadı.`} />
  }

  return (
    <Stack spacing={1.5}>
      <GlobalSearchResultCard
        icon={<WarehouseRoundedIcon />}
        typeLabel="Adres Eşleşmesi"
        title={address}
        subtitle={`${items.length} farklı ürün, toplam ${totalQty} adet`}
        headerChip={<ResultChip color="primary" label={`${items.length} kayıt`} />}
      />

      {items.map((item, idx) => {
        const stokAdi = (item?.stokAdi ?? '').trim() || (item?.barcode ? mikroByBarcode.get(String(item.barcode)) : '') || '-'
        return (
          <GlobalSearchResultCard
            key={`${item?.stokKod || 'stok'}-${item?.barcode || 'brc'}-${idx}`}
            icon={<Inventory2RoundedIcon />}
            typeLabel="Ürün"
            title={stokAdi}
            subtitle={item?.stokKod}
            headerChip={<ResultChip color={qtyChipColor(item?.miktar)} label={item?.miktar ?? 0} icon={<NumbersRoundedIcon />} />}
            rows={[
              {
                icon: <QrCodeRoundedIcon fontSize="small" />,
                label: 'Barkod',
                value: <ResultChip variant="outlined" label={item?.barcode || '-'} />,
              },
            ]}
          />
        )
      })}
    </Stack>
  )
}
