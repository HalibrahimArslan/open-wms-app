import { Box, Button, Chip, Stack, Typography, useTheme } from '@mui/material'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import DynamicSelect from '../../components/Filter/DynamicSelect'
import DateFilterButton from '../../components/Filter/DateFilterButton'
import { FeedbackTitle } from '../../utils/Utils'

/**
 * Geri bildirim panosunun filtre paneli.
 *
 * Tip etiketleri Utils'teki FeedbackTitle haritasindan gelir. Burada ayri bir
 * sozluk vardi ("DESTEK"/"HATA"), secilen filtrenin cipinde ise ham servis
 * degeri yaziyordu ("Destek Tipi - FEEDBACK"); ayni sey ucuncu bir bicimde
 * kartlarda geciyordu. Uc yerde uc ayri ad kaldi.
 */
const typeList = Object.entries(FeedbackTitle).map(([id, value]) => ({ id, value }))

/** Tarih secici yazarken gecici olarak gecersiz Date uretebiliyor. */
const formatDate = (date) => (date && !Number.isNaN(date.getTime()) ? date.toLocaleDateString('tr-TR') : null)

const FeedbackFilterContainer = ({ checkedFilter, setCheckedFilter, startDate, handleStartDate, endDate, handleEndDate }) => {
  const theme = useTheme()
  const hasFilter = checkedFilter.length > 0 || startDate != null || endDate != null

  const handleClear = () => {
    setCheckedFilter([])
    handleStartDate(null)
    handleEndDate(null)
  }

  return (
    <Box
      sx={{
        padding: 2,
        borderRadius: theme.radius.card,
        backgroundColor: theme.palette.surface.filter,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
      }}
    >
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', flexWrap: 'wrap', rowGap: 1.5 }}>
        <DateFilterButton date={startDate} handleDate={handleStartDate} label={'Başlangıç Tarihi'} />
        <DateFilterButton date={endDate} handleDate={handleEndDate} label={'Bitiş Tarihi'} />
        <DynamicSelect buttonName="Destek Tipi" data={typeList} checkedFilter={checkedFilter} setCheckedFilter={setCheckedFilter} icon={<SupportAgentIcon fontSize="small" />} />
        <Box sx={{ flexGrow: 1 }} />
        <Button size="small" onClick={handleClear} disabled={!hasFilter}>
          Filtreleri temizle
        </Button>
      </Stack>

      {hasFilter && (
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap', rowGap: 1 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Uygulanan:
          </Typography>
          {checkedFilter.map((item) => (
            <Chip
              key={item}
              size="small"
              label={FeedbackTitle[item] ?? item}
              onDelete={() => setCheckedFilter(checkedFilter.filter((i) => i !== item))}
              sx={{ borderRadius: theme.radius.control }}
            />
          ))}
          {formatDate(startDate) && (
            <Chip key="start" size="small" label={`Başlangıç: ${formatDate(startDate)}`} onDelete={() => handleStartDate(null)} sx={{ borderRadius: theme.radius.control }} />
          )}
          {formatDate(endDate) && (
            <Chip key="end" size="small" label={`Bitiş: ${formatDate(endDate)}`} onDelete={() => handleEndDate(null)} sx={{ borderRadius: theme.radius.control }} />
          )}
        </Stack>
      )}
    </Box>
  )
}

export default FeedbackFilterContainer
