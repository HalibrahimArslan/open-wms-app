import { Button, Stack } from '@mui/material'
import { useNavigate } from 'react-router'
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import NumbersRoundedIcon from '@mui/icons-material/NumbersRounded'
import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded'
import GlobalSearchResultCard, { ResultChip } from '../GlobalSearchResultCard'
import EmptyResult from './EmptyResult'
import { translateToEnglish } from '../../../../utils/Utils'
import useDepoCode from '../../../../hooks/useDepoCode'

export default function SiparisResult({ data, onActionDone }) {
  const navigate = useNavigate()
  const depoCode = useDepoCode()
  const order = data?.order

  if (!order) {
    return <EmptyResult msg="Bu evrak numarasına ait sipariş bulunamadı." />
  }

  const handleAssign = () => {
    const bolgeKodu = order.bolgeKodu || 0
    const cariBaglantiTipi = order.cariBaglantiTipi || 0
    const cariUnvanSlug = translateToEnglish((order.cariUnvan || '').replace(/[\/\s]/g, '')).toUpperCase()
    navigate(
      `/d:${depoCode}/8/${cariUnvanSlug}/${order.cariKod}/${cariBaglantiTipi}/${bolgeKodu}/orderprogresssevkiyat?orderNo=${JSON.stringify(order.orderList)}&orderCount=${order.orderLineItemCount}`
    )
    onActionDone?.()
  }

  return (
    <Stack spacing={1.5}>
      <GlobalSearchResultCard
        icon={<ReceiptLongRoundedIcon />}
        typeLabel="Sipariş Eşleşmesi"
        title={order.cariUnvan || '-'}
        subtitle={`Cari Kodu: ${order.cariKod || '-'}`}
        headerChip={<ResultChip color="primary" label={`${order.orderLineItemCount ?? 0} kalem`} icon={<NumbersRoundedIcon />} />}
        rows={[
          {
            icon: <PersonRoundedIcon fontSize="small" />,
            label: 'Cari Bağlantı Tipi',
            value: <ResultChip variant="outlined" label={order.cariBaglantiTipi ?? '-'} />,
          },
          {
            icon: <NumbersRoundedIcon fontSize="small" />,
            label: 'Bölge Kodu',
            value: <ResultChip variant="outlined" label={order.bolgeKodu ?? '-'} />,
          },
        ]}
        footer={
          <Button variant="contained" color="primary" size="small" onClick={handleAssign} startIcon={<AssignmentTurnedInRoundedIcon />}>
            Sipariş Atama
          </Button>
        }
      />
    </Stack>
  )
}
