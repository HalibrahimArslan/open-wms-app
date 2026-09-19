import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { tr as trLocale } from 'date-fns/locale/tr'
import { TextField } from '@mui/material'

const DateFilterButton = ({ date, handleDate, label, minDate }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={trLocale}>
      <DatePicker
        label={label}
        value={date}
        minDate={minDate}
        onChange={(newValue) => handleDate(newValue)}
        sx={{
          minWidth: 200,
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            size="small"
            sx={{
              minWidth: 200,
              '& .MuiInputBase-root': {
                height: 40,
              },
            }}
          />
        )}
      />
    </LocalizationProvider>
  )
}

export default DateFilterButton
