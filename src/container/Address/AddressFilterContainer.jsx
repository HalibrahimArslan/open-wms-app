import { useSearchParams } from 'react-router'
import BooleanFilter from '../../components/Filter/BooleanFilter'
import { Box } from '@mui/material'

const AddressFilterContainer = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  return (
    <Box display={'flex'} gap={1} alignItems={'center'} flexWrap={'nowrap'} sx={{ overflowX: 'auto' }}>
      <BooleanFilter
        text={'Geçici Adres'}
        selected={searchParams.get('geciciAdres.equals') === 'true'}
        handleClick={() => {
          const newParams = new URLSearchParams(searchParams)
          if (newParams.get('geciciAdres.equals') === 'true') {
            newParams.delete('geciciAdres.equals')
          } else {
            newParams.set('geciciAdres.equals', 'true')
          }
          setSearchParams(newParams)
        }}
      />
      <BooleanFilter
        text={'Toplama Gözü'}
        selected={searchParams.get('toplamaGozu.equals') === 'true'}
        handleClick={() => {
          const newParams = new URLSearchParams(searchParams)
          if (newParams.get('toplamaGozu.equals') === 'true') {
            newParams.delete('toplamaGozu.equals')
          } else {
            newParams.set('toplamaGozu.equals', 'true')
          }
          setSearchParams(newParams)
        }}
      />
      <BooleanFilter
        text={'Kontrol Adres'}
        selected={searchParams.get('kontrolAdres.equals') === 'true'}
        handleClick={() => {
          const newParams = new URLSearchParams(searchParams)
          if (newParams.get('kontrolAdres.equals') === 'true') {
            newParams.delete('kontrolAdres.equals')
          } else {
            newParams.set('kontrolAdres.equals', 'true')
          }
          setSearchParams(newParams)
        }}
      />
    </Box>
  )
}

export default AddressFilterContainer
