import { styled, Box, Skeleton, useTheme, FormControl, InputLabel, Select, MenuItem, Typography, Divider } from '@mui/material'
import { getEmptyAddressList } from '../../services/AdressService'
import { useEffect, useState } from 'react'
import useAuthHeader from '../../hooks/useAuthHeader'
import useDepoCode from '../../hooks/useDepoCode'
import { useContainer } from 'unstated-next'
import { DepoContainer } from '../../store/DepoContainer'
import { getTransferDepoCode } from '../../utils/Utils'
import { notifyError } from '../../layout/Layout'
import { DataStore } from '../../store/DataStore'
import { getAddressHalls } from '../../services/AddressComponentService'
import CountUp from 'react-countup'

const StyledBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 550,
  backgroundColor: theme.palette.secondary.light,
  display: 'flex',
  alignItems: 'center',
  borderRadius: theme.radius.card,
  flexDirection: 'column',
  justifyContent: 'space-between',
  paddingBottom: theme.spacing(5),
}))

const CustomBox = ({ children, loading, ...props }) => {
  return (
    <StyledBox {...props}>
      {loading ? (
        <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} gap={5} alignContent={'center'} p={1}>
          <Box display={'flex'} justifyContent={'center'}>
            <Skeleton variant="text" width={50} height={20} />
          </Box>
          {Array(3)
            .fill()
            .map((_, index) => (
              <Box key={index}>
                <Box display={'flex'} justifyContent={'center'} flexDirection={'column'} gap={2} alignItems={'center'}>
                  <Skeleton variant="text" width={100} height={20} />
                  <Skeleton variant="rounded" width={100} height={50} />
                </Box>
                <Divider flexItem />
              </Box>
            ))}
        </Box>
      ) : (
        children
      )}
    </StyledBox>
  )
}

const RayonStorageRateContainer = () => {
  const [loading, setLoading] = useState(true)
  const [hall, setHall] = useState([])
  const [data, setData] = useState([])
  const [selectedHall, setSelectedHall] = useState({})

  const headers = useAuthHeader()
  const depoCode = useDepoCode()
  const { allDepoList } = useContainer(DepoContainer)
  const theme = useTheme()
  const { account } = useContainer(DataStore)

  const transferDepoCode = getTransferDepoCode(depoCode, allDepoList)

  const isValid = selectedHall && Object.keys(selectedHall).length > 0 && hall.length > 0

  const fetchEmptyAddressList = async (transferDepoCode) => {
    try {
      setLoading(true)
      let query = `rayon=${selectedHall.code}`
      const res = await getEmptyAddressList(headers, transferDepoCode, query)
      res && setData(res)
    } catch (e) {
      notifyError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchWarehouseRayon = async () => {
    try {
      setLoading(true)
      const res = await getAddressHalls(headers, account?.companyCode, transferDepoCode)
      if (res) {
        setHall(res)
        setSelectedHall(res[0])
      }
    } catch (e) {
      notifyError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (transferDepoCode) {
      fetchWarehouseRayon()
    }
  }, [transferDepoCode])

  useEffect(() => {
    if (transferDepoCode && selectedHall && Object.keys(selectedHall).length > 0) {
      fetchEmptyAddressList(transferDepoCode)
    }
  }, [selectedHall, transferDepoCode])

  return (
    <CustomBox loading={loading}>
      <FormControl variant="standard" sx={{ width: 'inherit', mt: 1 }}>
        {isValid && (
          <Select
            labelId="hall-select-standard-label"
            id="hall-select-standard"
            value={selectedHall?.code}
            onChange={(e) => {
              const selected = hall.find((h) => h.code === e.target.value)
              setSelectedHall(selected)
            }}
            label="Koridor"
            MenuProps={{
              PaperProps: {
                sx: {
                  maxHeight: 200,
                },
              },
            }}
          >
            {hall.map((h) => (
              <MenuItem key={h.id} value={h.code}>
                {h.code}
              </MenuItem>
            ))}
          </Select>
        )}
      </FormControl>
      <Box>
        <Typography variant="h6" align="center" gutterBottom>
          Toplam Adres Sayısı
        </Typography>
        <Typography variant="h3" align="center">
          {data.totalAddressCount}
        </Typography>
      </Box>
      <Divider flexItem />
      <CountUp start={0} end={data.filledRatio} suffix="%" delay={0} duration={2} redraw={true}>
        {({ countUpRef }) => (
          <Box>
            <Typography variant="h6" align="center" gutterBottom>
              Koridor Doluluk Oranı
            </Typography>
            <Typography variant="h3" fontWeight={theme.typography.fontWeightBold} ref={countUpRef} />
          </Box>
        )}
      </CountUp>
      <Divider flexItem />
      <Box>
        <Typography variant="h6" align="center" gutterBottom>
          Boş Adres Sayısı
        </Typography>
        <Typography variant="h3" align="center">
          {data.emptyAddressCount}
        </Typography>
      </Box>
    </CustomBox>
  )
}

export default RayonStorageRateContainer
