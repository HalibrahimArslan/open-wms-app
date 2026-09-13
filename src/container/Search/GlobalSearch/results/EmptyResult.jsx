import SearchOffRoundedIcon from '@mui/icons-material/SearchOffRounded'
import EmptyState from '../../../../shared/components/EmptyState/EmptyState'

export default function EmptyResult({ msg = 'Arama sonucu bulunamadı.' }) {
  return <EmptyState title={msg} icon={<SearchOffRoundedIcon />} dense />
}
