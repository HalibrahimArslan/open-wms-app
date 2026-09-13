import { InputAdornment, TextField } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

/** Liste ekranlarinin ortak arama kutusu. */
export default function TableSearchField({ placeholder = 'Ara', onChange, width = 240 }) {
  return (
    <TextField
      size="small"
      variant="outlined"
      placeholder={placeholder}
      onChange={onChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize="small" color="action" />
          </InputAdornment>
        ),
      }}
      sx={{ width: { xs: '100%', sm: width }, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
    />
  )
}
