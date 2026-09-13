import { Stack } from '@mui/material'
import ViewInArRoundedIcon from '@mui/icons-material/ViewInArRounded'
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

export default function PaletResult({ data, query }) {
  const items = data?.items || []

  if (items.length === 0) {
    return <EmptyResult msg={`"${query}" palet barkoduna ait kayıt bulunamadı.`} />
  }

  const totalQty = items.reduce((acc, it) => acc + (it.amount || 0), 0)

  return (
    <Stack spacing={1.5}>
      <GlobalSearchResultCard
        icon={<ViewInArRoundedIcon />}
        typeLabel="Palet Barkodu"
        title={query}
        subtitle={`${items.length} kalem, toplam ${totalQty} adet`}
        headerChip={<ResultChip color="primary" label={`${items.length} kalem`} />}
      />

      {items.map((item, idx) => (
        <GlobalSearchResultCard
          key={idx}
          icon={<Inventory2RoundedIcon />}
          typeLabel="Palet İçeriği"
          title={item?.stockName || '-'}
          subtitle={item?.stockCode}
          headerChip={<ResultChip color={qtyChipColor(item?.amount)} label={item?.amount ?? 0} icon={<NumbersRoundedIcon />} />}
          rows={[
            {
              icon: <Inventory2RoundedIcon fontSize="small" />,
              label: 'Stok Kodu',
              value: <ResultChip color="primary" variant="outlined" label={item?.stockCode || '-'} />,
            },
            {
              icon: <QrCodeRoundedIcon fontSize="small" />,
              label: 'Barkod',
              value: <ResultChip variant="outlined" label={item?.barcode || '-'} />,
            },
          ]}
        />
      ))}
    </Stack>
  )
}
