import { IconButton, InputAdornment, TextField } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'

/**
 * Liste ekranlarinin ortak arama kutusu.
 *
 * Cerceveli (outlined) ve buyutec ikonlu olmasi sart: arama alani ekranda
 * kendi basina durdugu icin, cercevesi olmadiginda tablo ile serit arasinda
 * bos bir bant gibi gorunuyor ve tiklanabilir oldugu anlasilmiyordu.
 *
 * Kose yariçapi tema uzerinden gelir; burada ayrica verilirse ekrandaki diger
 * girdilerden farkli bir yariçap olusur.
 */
export default function TableSearchField({ placeholder = 'Ara', value, onChange, width = 260 }) {
  const handleClear = () => onChange({ target: { value: '' } })

  return (
    <TextField
      size="small"
      variant="outlined"
      placeholder={placeholder}
      value={value ?? ''}
      onChange={onChange}
      sx={{ width: { xs: '100%', sm: width } }}
      slotProps={{
        input: {
          'aria-label': placeholder,
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
            </InputAdornment>
          ),
          endAdornment: value ? (
            <InputAdornment position="end">
              <IconButton size="small" onClick={handleClear} aria-label="Aramayı temizle" edge="end">
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null,
        },
      }}
    />
  )
}
