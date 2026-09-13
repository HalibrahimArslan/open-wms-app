import { useMemo } from 'react'
import { Box, Chip, Paper, useTheme } from '@mui/material'
import { MdSupportAgent } from 'react-icons/md'
import DynamicSelect from '../../components/Filter/DynamicSelect'
import DateFilterButton from '../../components/Filter/DateFilterButton'

const bulkList = [
  { id: 'FEEDBACK', value: 'DESTEK' },
  { id: 'ERROR', value: 'HATA' },
]

const FeedbackFilterContainer = ({ checkedFilter, setCheckedFilter, startDate, handleStartDate, endDate, handleEndDate }) => {
  let filterChipList = useMemo(() => {
    return [
      checkedFilter.map((item) => <Chip label={`Destek Tipi - ${item}`} color="primary" onDelete={() => setCheckedFilter(checkedFilter.filter((i) => i !== item))} />),
      startDate && <Chip label={`Başlangıç Tarihi - ${startDate?.toLocaleDateString()}`} color="primary" onDelete={() => handleStartDate(null)} />,
      endDate && <Chip label={`Bitiş Tarihi - ${endDate?.toLocaleDateString()}`} color="primary" onDelete={() => handleEndDate(null)} />,
    ]
  }, [checkedFilter, startDate, endDate])

  const theme = useTheme()

  return (
    <Box
      component={Paper}
      display={'flex'}
      padding={1}
      justifyContent={'flex-start'}
      borderRadius={2}
      bgcolor={theme.palette.secondary.light}
      alignItems={'flex-start'}
      elevation={0}
      gap={2}
      overflow={'auto'}
      flexDirection={'column'}
    >
      {(startDate || endDate || checkedFilter.length > 0) && (
        <Box display={'flex'} alignItems={'center'} gap={1} p={1}>
          {filterChipList.map((item) => item)}
        </Box>
      )}

      <Box display={'flex'} alignItems={'center'} gap={1}>
        <DateFilterButton date={startDate} handleDate={handleStartDate} label={'Başlangıç Tarihi'} />
        <DateFilterButton date={endDate} handleDate={handleEndDate} label={'Bitiş Tarihi'} />
        <DynamicSelect buttonName="Destek Tipi" data={bulkList} checkedFilter={checkedFilter} setCheckedFilter={setCheckedFilter} icon={<MdSupportAgent />} />
      </Box>
    </Box>
  )
}

export default FeedbackFilterContainer
