import { IconButton, Tooltip } from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList'
import CloseIcon from '@mui/icons-material/Close'

/**
 * Filtre panelini acip kapatan dugme.
 *
 * Her ekranda ayni ikon, ayni ipucu ve ayni yer (ActionHeader'in actions
 * alani, yani basligin karsisi) kullanilsin diye ortak bilesen.
 */
export default function FilterToggleButton({ open, onToggle }) {
  return (
    <Tooltip title={open ? 'Filtreleri gizle' : 'Filtrele'}>
      <IconButton size="small" onClick={onToggle} aria-label={open ? 'Filtreleri gizle' : 'Filtrele'}>
        {open ? <CloseIcon /> : <FilterListIcon />}
      </IconButton>
    </Tooltip>
  )
}
