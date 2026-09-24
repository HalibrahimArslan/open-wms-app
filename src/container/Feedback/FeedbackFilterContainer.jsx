import { Box, Button, Grid, MenuItem, Paper, TextField } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { tr as trLocale } from 'date-fns/locale/tr'
import FilterAltOffOutlinedIcon from '@mui/icons-material/FilterAltOffOutlined'
import { FeedbackTitle } from '../../utils/Utils'

const dateFieldProps = { textField: { variant: 'standard', fullWidth: true }, field: { clearable: true } }

const FeedbackFilterContainer = ({ checkedFilter, setCheckedFilter, startDate, handleStartDate, endDate, handleEndDate }) => {
  const hasFilter = checkedFilter.length > 0 || startDate != null || endDate != null

  const handleClear = () => {
    setCheckedFilter([])
    handleStartDate(null)
    handleEndDate(null)
  }

  return (
    <Paper elevation={0} sx={(theme) => ({ p: 2, borderRadius: theme.radius.card, backgroundColor: theme.palette.surface.filter })}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={trLocale}>
        <Grid container spacing={2} sx={{ alignItems: 'flex-end' }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <DatePicker label="Başlangıç" value={startDate} maxDate={endDate ?? undefined} onChange={handleStartDate} slotProps={dateFieldProps} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <DatePicker label="Bitiş" value={endDate} minDate={startDate ?? undefined} onChange={handleEndDate} slotProps={dateFieldProps} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              select
              label="Talep Tipi"
              variant="standard"
              fullWidth
              value={checkedFilter[0] ?? ''}
              onChange={(e) => setCheckedFilter(e.target.value ? [e.target.value] : [])}
              slotProps={{ select: { displayEmpty: true }, inputLabel: { shrink: true } }}
            >
              <MenuItem value="">Tümü</MenuItem>
              {Object.entries(FeedbackTitle).map(([value, label]) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="outlined" onClick={handleClear} disabled={!hasFilter} startIcon={<FilterAltOffOutlinedIcon />}>
                Filtreleri Temizle
              </Button>
            </Box>
          </Grid>
        </Grid>
      </LocalizationProvider>
    </Paper>
  )
}

export default FeedbackFilterContainer
