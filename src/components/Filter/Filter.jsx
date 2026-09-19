import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import ListItemText from '@mui/material/ListItemText'
import Select from '@mui/material/Select'
import Checkbox from '@mui/material/Checkbox'
import { Box, Stack, TextField } from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import { tr as trLocale } from 'date-fns/locale/tr'

function DateItem({ label, value, handleChange }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={trLocale}>
      <Stack spacing={3}>
        <DesktopDatePicker label={label} inputFormat="MM/dd/yyyy" value={value} onChange={handleChange} renderInput={(params) => <TextField {...params} />} />
      </Stack>
    </LocalizationProvider>
  )
}

export default function Filter({ data, filter, handleFilter, type, multiple, label }) {
  const handleChange = (event) => {
    const {
      target: { value },
    } = event
    handleFilter(event.target.value)
  }

  if (type === 'Date') {
    return (
      <Box sx={{ m: 1, minWidth: 150 }}>
        <DateItem label={label} value={filter} handleChange={handleFilter} />
      </Box>
    )
  }

  return (
    <FormControl sx={{ m: 1, minWidth: 150 }}>
      <InputLabel id="filter-label">{label}</InputLabel>
      <Select
        labelId="filter-label"
        id="filter"
        multiple={multiple}
        value={filter}
        onChange={handleChange}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) => (selected.length === 1 ? selected[0] : `${selected[0]}+${selected.length - 1}`)}
        autoWidth
      >
        {data.map((name) => (
          <MenuItem key={name} value={name}>
            <Checkbox checked={filter.indexOf(name) > -1} />
            <ListItemText primary={name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
